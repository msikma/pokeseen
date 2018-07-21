/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

import { get } from 'lodash'
import { pokedex } from './data'

/**
 * Pushes data about the Pokémon from an episode to the appearance object.
 */
const pushSeenToData = (targetData, ep, epNr, special = false) => {
  if (special) {
    ep.seen.forEach(pkmn => targetData[pkmn[0]].amountIncSpecials += 1)
    return
  }
  ep.seen.forEach(pkmn => targetData[pkmn[0]].episodes.push(epNr))
  ep.seen.forEach(pkmn => targetData[pkmn[0]].amount += 1)
  ep.seen.forEach(pkmn => targetData[pkmn[0]].amountIncSpecials += 1)
  setLatestDate(ep, targetData)
}

/**
 * Checks if the latest date needs to be updated, and set it to the new value if needed.
 */
const setLatestDate = (ep, targetData) => {
  ep.seen.forEach(pkmn => {
    const curr = targetData[pkmn[0]].lastSeen
    const ja = !curr || !curr.ja || curr.ja < ep.broadcastDates.ja ? ep.broadcastDates.ja : curr.ja
    const us = !curr || !curr.us || curr.us < ep.broadcastDates.us ? ep.broadcastDates.us : curr.us
    targetData[pkmn[0]].lastSeen = { ja, us }
  })
}

/**
 * Returns an object containing every Pokémon and how often it appeared in the show,
 * when its last appearance was an how many days it has been since it was seen.
 */
export const sortPokemonByAppearances = seenData => {
  const appearanceData = {}
  const appearanceDataSpecials = {}
  const airedEpisodesList = []
  const specialEpisodesList = []

  // Set all Pokémon's values to zero initially.
  Object.keys(pokedex).forEach(id => appearanceData[id] = { id, amount: 0, amountIncSpecials: 0, lastSeen: null, episodes: [] })
  Object.keys(pokedex).forEach(id => appearanceDataSpecials[id] = { id, amount: 0, amountIncSpecials: 0, lastSeen: null, episodes: [] })

  // Add up all appearances and last seen dates in the episodes.
  Object.keys(seenData).forEach(epNr => {
    const ep = seenData[epNr]
    if (!ep.hasAired) return
    const series = ep.episode.slice(0, 2).toLowerCase()
    if (series === 'ss') {
      specialEpisodesList.push(epNr)
      pushSeenToData(appearanceDataSpecials, ep, epNr)
      pushSeenToData(appearanceData, ep, epNr, true)
    }
    else {
      airedEpisodesList.push(epNr)
      pushSeenToData(appearanceData, ep, epNr)
    }
  })

  // Add a global 'most recent' to the data, which can be either from a special or from a regular episode.
  const appearanceDataGlobal = Object.keys(appearanceData).reduce((acc, pkmn) => {
    const lastSeenRegular = get(appearanceData[pkmn], 'lastSeen.ja', '')
    const lastSeenSpecial = get(appearanceDataSpecials[pkmn], 'lastSeen.ja', '')
    const mostRecent = lastSeenRegular === '' && lastSeenSpecial === ''
      ? ''
      : lastSeenRegular === ''
        ? lastSeenSpecial
        : lastSeenRegular >= lastSeenSpecial
          ? lastSeenRegular
          : lastSeenSpecial

    return { ...acc, [pkmn]: { ...appearanceData[pkmn], mostRecent } }
  }, {})

  // Make two rankings: one based primarily on appearances, and one on last seen date.
  const appearancesRanking = Object.values(appearanceDataGlobal)
    .sort(compareProps('amountIncSpecials', 'mostRecent', 'id'))
    .reverse()

  const lastSeenRanking = Object.values(appearanceDataGlobal)
    .sort(compareProps('mostRecent', 'amountIncSpecials', 'id'))
    .reverse()

  return { appearancesRanking, appearanceDataSpecials, lastSeenRanking, airedEpisodesList, specialEpisodesList }
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
