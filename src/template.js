/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server';
import getRepoInfo from 'repoinfojs'
import moment from 'moment'
import { get, xor } from 'lodash'

import { pkgData, epURL, pokedex } from './data'
import { saveFile } from './util/saveFile'

const modulesPath = path.resolve(__dirname, '..', 'node_modules')
const docsPath = path.resolve(__dirname, '..', 'docs')
const staticPath = path.resolve(__dirname, 'static')

const never = 'Never seen'

/**
 * Generates and saves an HTML page containing the appearance data
 * generated by sortPokemonByAppearances().
 */
export const createSeenPage = async (appearancesRanking, lastSeenRanking, airedEpisodesList) => {
  // Generate some data from the repo.
  const repoInfo = await getRepoInfo()
  const data = {
    version: pkgData.version,
    commits: repoInfo.commits,
    hash: repoInfo.hash,
    homepage: pkgData.homepage,
    generationTime: moment().format('YYYY-MM-DD HH:mm:ss ZZ')
  }
  // Render our React component to HTML and save it using the wrapper string.
  const appearancesRankingByID = appearancesRanking
    .map((item, n) => ({ ...item, n }))
    .reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
  const pageMarkup = ReactDOMServer.renderToStaticMarkup(<SeenPage { ...{ appearancesRankingByID, lastSeenRanking, airedEpisodesList, ...data } } />)
  await saveFile(`${docsPath}/index.html`, wrapPage(pageMarkup, data))

  // Copy over some necessary files.
  await copyFile(`${modulesPath}/pokesprite/pokesprite.png`, docsPath)
  await copyFile(`${modulesPath}/pokesprite/overview.min.css`, docsPath)
  await copyFile(`${modulesPath}/pokesprite/pokesprite.min.css`, docsPath)
  await copyFile(`${modulesPath}/pokesprite/pokesprite.min.js`, docsPath)
  await copyFile(`${staticPath}/pokeseen.css`, docsPath)
  await copyFile(`${staticPath}/pokeseen.js`, docsPath)
}

/**
 * Copies a file from a path to a destination directory.
 */
const copyFile = (src, destDir) => new Promise((resolve, reject) => {
  const dest = `${destDir}/${path.basename(src)}`
  fs.copyFile(src, dest, (err) => {
    if (err) return reject(err)
    return resolve()
  })
})

/**
 * Main component.
 *
 * The Pokémon ranking data uses the following format:
 *
 * [ { id: '789',
 *     amount: 9,
 *     lastSeen: { ja: '2018-05-10', us: '2018-04-07' } }, ... ]
 */
const SeenPage = ({ appearancesRankingByID, lastSeenRanking, airedEpisodesList, version, commits, hash, homepage, generationTime }) => (
  <div id="top">
    <div className="description">
      <div className="header">
        <h1>PokéSeen</h1>
        <p>asdf asdf adfs</p>
      </div>
      <div className="docs-container">
        <h2>Icon overview (v{ version }; r{ commits })</h2>
        <p>Generated on <span className="time">{ generationTime }</span> (<span className="amount">3301</span> icons).</p>
      </div>
    </div>
    <table className="table pkspr-overview">
      <tbody>
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Icon</th>
          <th colSpan={ 2 }>Name</th>
          <th><a href="#" className="sort-link" id="appearance_sort">Appearances</a></th>
          <th colSpan={ 2 }><a href="#" className="sort-link active" id="last_seen_sort">Last appearance (Japan)</a></th>
        </tr>
        <script dangerouslySetInnerHTML={{__html: `PokeSeen.decorateSorters('appearance_sort', 'last_seen_sort')` }}></script>
        { lastSeenRanking.map((pokemon, n) => {
          // Construct two rows: one with the sorted data, and one with the episode IDs.
          const { id, amount, lastSeen, episodes } = pokemon

          // Determine the last time this Pokémon was seen, if ever.
          const lastJa = get(lastSeen, 'ja', never)
          const lastUS = get(lastSeen, 'us', never)
          const neverSeenJa = !lastJa || lastJa === never
          const neverSeenUS = !lastUS || lastUS === never

          // And generate the relative time from today.
          const relJaDays = moment().diff(moment(lastJa), 'days')
          const relUSDays = moment().diff(moment(lastUS), 'days')
          const relJa = moment.duration(relJaDays, 'days').humanize()
          const relUS = moment.duration(relUSDays, 'days').humanize()

          // Check if it's faster to see which episodes a Pokémon did *not* appear in.
          const episodesInverse = xor(airedEpisodesList, episodes)

          const pkmnInfo = pokedex[id]

          const cols = 8

          return [
            <tr id={ `item_${id}` } className="main-info" data-id={ id } key={ `main_info_${id}` } data-last-seen-n={ n } data-appearances-n={ appearancesRankingByID[id].n }>
              <td className="minimal">{ n + 1 }</td>
              <td className="minimal">{ id }</td>
              <td className="minimal"><span id={ `icon_${id}` } className={ `pkspr pkmn-${pkmnInfo.slug.eng}` }></span></td>
              <td>{ pkmnInfo.name.eng }</td>
              <td><span title={ pkmnInfo.name.jpn_ro }>{ pkmnInfo.name.jpn }</span></td>
              <td>{ amount }</td>
              <td className={ neverSeenJa ? 'never' : '' } { ...(neverSeenJa ? { colSpan: 2 } : {}) }>{ neverSeenJa ? never : lastJa }</td>
              { !neverSeenJa ? <td>{ relJa } ago</td> : null }
            </tr>,
            <tr id={ `episodes_${id}` } className="episode-info" data-id={ id } key={ `ep_info_${id}` }>
              { episodesInverse.length === 0
                ? <td colSpan={ cols }>Appears in: every episode to date.</td>
                : episodes.length === 0
                  ? <td colSpan={ cols }>No appearances in the TV series.</td>
                  : episodesInverse.length > episodes.length
                    ? <td colSpan={ cols }>Appears in: { episodes.map(ep => (<span key={ ep }><a target="_blank" href={ epURL(ep) }>{ ep }</a> </span>)) }</td>
                    : <td colSpan={ cols }>Appears in every episode <em>except</em>: { episodesInverse.map(ep => (<span key={ ep }><a target="_blank" href={ epURL(ep) }>{ ep }</a> </span>)) }</td> }
            </tr>,
            <script key={ `js_${id}` } dangerouslySetInnerHTML={{__html: `PkSpr.decorate('icon_${id}')\nPokeSeen.decorate('${id}')` }}></script>
          ]
        })}
      </tbody>
    </table>
  </div>
)

/**
 * Base HTML wrapper for the template page.
 */
const wrapPage = (str, { version, commits, hash, homepage, generationTime }) => (
  `<!doctype html>
<html lang="en">
<!--

PokéSeen v${version} (r${commits}, [${hash}]) <${homepage}>
Generated on ${generationTime}.

-->
<head>
  <meta charset="utf-8" />
  <title>PokéSeen - Pokémon appearance statistics</title>
  <link type="text/css" href="pokesprite.min.css" rel="stylesheet" media="screen" />
  <link type="text/css" href="overview.min.css" rel="stylesheet" media="screen" />
  <link type="text/css" href="pokeseen.css" rel="stylesheet" media="screen" />
  <script charset="utf-8" src="pokesprite.min.js" ></script>
  <script charset="utf-8" src="pokeseen.js" ></script>
</head>
<body>
${str}
</body>
</html>`
)
