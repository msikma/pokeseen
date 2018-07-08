/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

import { get } from 'lodash'
import { pokedex } from './data'

/**
 * Returns an object containing every Pokémon and how often it appeared in the show,
 * when its last appearance was an how many days it has been since it was seen.
 */
export const sortPokemonByAppearances = seenData => {
  const appearanceData = {}
  const airedEpisodesList = []

  // Set all Pokémon's values to zero initially.
  Object.keys(pokedex).forEach(id => appearanceData[id] = { id, amount: 0, lastSeen: null, episodes: [] })

  // Add up all appearances and last seen dates in the episodes.
  Object.keys(seenData).forEach(epNr => {
    const ep = seenData[epNr]
    if (!ep.hasAired) return
    airedEpisodesList.push(epNr)
    ep.seen.forEach(pkmn => appearanceData[pkmn[0]].episodes.push(epNr))
    ep.seen.forEach(pkmn => appearanceData[pkmn[0]].amount += 1)
    ep.seen.forEach(pkmn => {
      const curr = appearanceData[pkmn[0]].lastSeen
      appearanceData[pkmn[0]].lastSeen = {
        ja: !curr || !curr.ja || curr.ja < ep.broadcastDates.ja ? ep.broadcastDates.ja : curr.ja,
        us: !curr || !curr.us || curr.us < ep.broadcastDates.us ? ep.broadcastDates.us : curr.us
      }
    })
  })

  // Make two rankings: one based primarily on appearances, and one on last seen date.
  const appearancesRanking = Object.values(appearanceData)
    .sort(compareProps('amount', 'lastSeen.ja', 'id'))
    .reverse()

  const lastSeenRanking = Object.values(appearanceData)
    .sort(compareProps('lastSeen.ja', 'amount', 'id'))
    .reverse()

  return { appearancesRanking, lastSeenRanking, airedEpisodesList }
}

/**
 * Returns a sorting function that runs compare() on several properties.
 */
const compareProps = (...props) => (a, b) => {
  let propVal
  for (let prop of props) {
    propVal = compare(a, b, prop)
    if (propVal !== 0) return propVal
  }
  return 0
}

/**
 * Compares two items by a given member property path.
 */
const compare = (a, b, path) => {
  const aVal = get(a, path, '0')
  const bVal = get(b, path, '0')
  return aVal === bVal
    ? 0
    : aVal < bVal
      ? -1
      : 1
}
