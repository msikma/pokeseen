/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

import fs from 'fs'
import path from 'path'
import { sprintf } from 'sprintf-js'

import { saveFile } from '../util/saveFile'
import pokedex from '../../data/pokedex.json'
import pkgData from '../../package.json'

export { pkgData }

// Used to determine the exact episode names, which change prefix per season.
const seasons = [
  [274, 'EP'], // Original series and Johto
  [192, 'AG'], // Advanced Generation
  [191, 'DP'], // Diamond and Pearl
  [142, 'BW'], // Best Wishes
  [140, 'XY'], // XY
  [85, 'SM']   // Sun and Moon (ongoing)
]

// Location where we'll store cache data.
const cacheFile = path.resolve(__dirname, '..', '..', 'cache', 'seendata.json')

// Returns cached data. We'll try to import the 'cache/seendata.json' file,
// and if it doesn't exist we'll return an empty object instead.
export const getSeenData = () => {
  try {
    return require(cacheFile)
  }
  catch (err) {
    return {}
  }
}

// Writes back data to the cache file. Returns a Promise.
export const saveSeenData = async (data, logMessage) => {
  await saveFile(cacheFile, JSON.stringify(data, null, 2))
  if (logMessage) {
    console.log(`Saved new data (${Object.keys(data).length} episodes) to: ${cacheFile}`)
  }
}

// Key/value store of Pokémon names to Pokédex ID. E.g. { Magnemite: '081', ... }
export const engToID = Object.keys(pokedex).reduce((obj, n) => ({ ...obj, [pokedex[n].name.eng]: n }), {})
export const engList = Object.keys(engToID)
export { pokedex }

// Complete list of episodes, e.g. ['EP001', 'EP002', ... 'AG123', ...] etc.
export const episodeList = seasons.reduce((list, season) => {
  const episodes = new Array(season[0]).fill().map((_, n) => `${season[1]}${sprintf('%03d', n + 1)}`)
  return [...list, ...episodes]
}, [])

// Returns a Bulbapedia episode page URL.
export const epURL = episode => `https://bulbapedia.bulbagarden.net/wiki/${episode}`