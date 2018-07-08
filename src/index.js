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
export const cacheSeenData = async () => {
  // Retrieve cached data to check if we can skip any episode.
  const existingSeenData = getSeenData()

  let gotNewData = false
  const seenList = await Promise.all(episodeList.map(async (episode, n) => {
    // If cached data exists, return that.
    if (existingSeenData[episode]) return existingSeenData[episode]

    // If not, retrieve the data now (rate limited).
    await wait(n * 1000)
    const data = await getPokemonFromEpisode(episode)
    gotNewData = true
    console.log(`Retrieved information from episode ${episode}`)
    return data
  }))

  const newSeenData = seenList.reduce((episodes, ep) => ({ ...episodes, [ep.episode]: ep }), {})
  await saveSeenData(newSeenData, gotNewData)

  return newSeenData
}

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
  const { appearancesRanking, lastSeenRanking, airedEpisodesList } = sortPokemonByAppearances(seenData)
  await createSeenPage(appearancesRanking, lastSeenRanking, airedEpisodesList)
}
