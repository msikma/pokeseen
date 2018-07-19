/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

import { episodeList, getSeenData, saveSeenData } from './data'
import { sortPokemonByAppearances } from './process'
import { createSeenPage } from './template'
import { getPokemonFromEpisode } from './scrape'
import { wait } from './util/request'

/**
 * Retrieves data regarding every Pokémon's appearances throughout the history
 * of the TV show. If the data already exists, we'll use cached data,
 * else we'll scrape the episode's Bulbapedia page to extract the information.
 */
export const cacheSeenData = () => new Promise(async (resolve, reject) => {
  // Retrieve cached data to check if we can skip any episode.
  const existingSeenData = getSeenData()
  const seenList = []

  let gotNewData = false
  let episodeData
  for (let episode of episodeList) {
    episodeData = existingSeenData[episode]

    // If cached data exists and has aired (thus is finalized), use that.
    if (episodeData && (episodeData.hasAired && episodeData.broadcastDates.ja)) {
      seenList.push(episodeData)
      continue
    }

    // If not, or if the episode was unaired, fetch its data.
    try {
      await wait(1000)
      if (episodeData && (!episodeData.hasAired || !episodeData.broadcastDates.ja)) {
        console.log(`Episode ${episode} hasn't aired yet or has no broadcast date. Checking to see if we can update.`)
      }
      const data = await getPokemonFromEpisode(episode)
      seenList.push(data)
      gotNewData = true
      console.log(`Retrieved information from episode ${episode}.`)
      if (data.hasAired === false) {
        console.log(`Stopping: episode ${episode} has not been aired yet.`)
        break
      }
    }
    catch (err) {
      if (err.statusCode === 404) {
        console.log(`Stopping: episode ${episode} is 404.`)
        break
      }
      if (err.statusCode) {
        console.log(`Error: received unexpected status code ${err.statusCode}${err.options ? ` (URL: ${err.options.url})` : ''}.`)
        break
      }
      console.log(err.stack)
      break
    }
  }

  const newSeenData = seenList.reduce((episodes, ep) => ({ ...episodes, [ep.episode]: ep }), {})
  await saveSeenData(newSeenData, gotNewData)
  return resolve(newSeenData)
})

/**
 * Checks the data for correctness.
 * More of a testing script. Only used during development.
 */
export const checkData = async () => {
  const seenData = await cacheSeenData()
  Object.keys(seenData).forEach(epNr => {
    const ep = seenData[epNr]

    console.log(ep.seen.length)
  })
}

/**
 * Generates an HTML page with the results from cacheSeenData().
 */
export const generatePage = async () => {
  const seenData = await cacheSeenData()
  const {
    appearancesRanking,
    appearanceDataSpecials,
    lastSeenRanking,
    airedEpisodesList,
    specialEpisodesList
  } = sortPokemonByAppearances(seenData)
  await createSeenPage(appearancesRanking, appearanceDataSpecials, lastSeenRanking, airedEpisodesList, specialEpisodesList)
  process.exit(0)
}
