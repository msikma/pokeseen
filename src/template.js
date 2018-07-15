/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import getRepoInfo from 'repoinfojs'
import moment from 'moment'
import { get, xor } from 'lodash'
import classnames from 'classnames'

import { pkgData, epURL, pokedex } from './data'
import { saveFile } from './util/saveFile'

const modulesPath = path.resolve(__dirname, '..', 'node_modules')
const docsPath = path.resolve(__dirname, '..', 'docs')
const staticPath = path.resolve(__dirname, '..', 'static')

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
        <p>Generated on <span className="time">{ generationTime }</span></p>
      </div>
    </div>
    <table className="table pkspr-overview" id="data_table">
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
          // The relative time is later humanized dynamically.
          const lastJa = get(lastSeen, 'ja', never)
          const lastJaInt = moment().diff(moment(lastJa), 'ms')
          // const lastUS = get(lastSeen, 'us', never)
          // const lastUSInt = moment().diff(moment(lastUS), 'ms')
          const neverSeenJa = !lastJa || lastJa === never
          // const neverSeenUS = !lastUS || lastUS === never

          // Check if it's faster to see which episodes a Pokémon did *not* appear in.
          const episodesInverse = xor(airedEpisodesList, episodes)

          const pkmnInfo = pokedex[id]

          const cols = 8
          const isLast = n === lastSeenRanking.length - 1

          // If listing fewer than this amount of episodes, switch to a different layout.
          const fewEpisodes = 12

          // Sort order. All * 2, since we've actually got two rows per item.
          const orderLastSeen = n * 2
          const orderAppearances = appearancesRankingByID[id].n * 2

          return [
            <tr
              key={ `main_info_${id}` }
              id={ `item_${id}` }
              className={ classnames('main-info', { 'last': isLast }) }
              data-id={ id }
              data-last-seen-n={ orderLastSeen }
              data-appearances-n={ orderAppearances }
            >
              <td className="minimal">{ n + 1 }</td>
              <td className="minimal">{ id }</td>
              <td className="minimal"><span id={ `icon_${id}` } className={ `pkspr pkmn-${pkmnInfo.slug.eng}` }></span></td>
              <td>{ pkmnInfo.name.eng }</td>
              <td><span title={ pkmnInfo.name.jpn_ro }>{ pkmnInfo.name.jpn }</span></td>
              <td>{ amount }</td>
              <td className={ neverSeenJa ? 'never' : '' } { ...(neverSeenJa ? { colSpan: 2 } : {}) }>{ neverSeenJa ? never : lastJa }</td>
              { !neverSeenJa ? <td className="time-ago" data-time-ago-ms={ isNaN(lastJaInt) ? -1 : lastJaInt }></td> : null }
            </tr>,
            <tr
              id={ `episodes_${id}` }
              className={ classnames('episode-info', { last: isLast }) }
              data-id={ id }
              data-last-seen-n={ orderLastSeen + 1 }
              data-appearances-n={ orderAppearances + 1 }
              key={ `ep_info_${id}` }
            >
              { episodesInverse.length === 0
                ? <td colSpan={ cols } className="ep-cols-container">Appears in every episode to date.</td>
                : episodes.length === 0
                  ? <td colSpan={ cols } className="ep-cols-container">No appearances in the TV series.</td>
                  : episodesInverse.length > episodes.length
                    ? <td colSpan={ cols } className="ep-cols-container"><div className={ classnames('ep-cols', { short: episodes.length < fewEpisodes }) }><div className="ep-header">Appears in:</div><ul className="ep-content">{ episodes.map(ep => (<li key={ ep }><a target="_blank" href={ epURL(ep) }>{ ep }</a></li>)) }</ul></div></td>
                    : <td colSpan={ cols } className="ep-cols-container"><div className={ classnames('ep-cols', { short: episodesInverse.length < fewEpisodes }) }><div className="ep-header">Appears in every episode <em>except</em>:</div><ul className="ep-content">{ episodesInverse.map(ep => (<li key={ ep }><a target="_blank" href={ epURL(ep) }>{ ep }</a></li>)) }</ul></div></td> }
            </tr>,
            <script key={ `js_${id}` } dangerouslySetInnerHTML={{__html: `PkSpr.decorate('icon_${id}')\nPokeSeen.decorate('${id}')` }}></script>
          ]
        })}
      </tbody>
    </table>
    <div className="description">
      <div className="docs-container closing">
        <p>Pokémon is © 1995-{ (new Date().getFullYear()) } Nintendo/Creatures Inc./GAME FREAK Inc.</p>
        <p>The source code for this page is available on <a href="https://github.com/msikma/pokeseen">Github</a>. Statistics were determined from <a href="https://bulbapedia.bulbagarden.net/">Bulbapedia</a> data.</p>
      </div>
    </div>
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
