/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

import cheerio from 'cheerio'
import moment from 'moment'

import { engToID, engList, epURL } from './data'
import { requestURL } from './util/request'

// Hide deprecation warning.
moment.suppressDeprecationWarnings = true

/**
 * Fetches an episode's Bulbapedia page and examines the content to find
 * which Pokémon appear in it.
 */
export const getPokemonFromEpisode = async episode => {
  const url = epURL(episode)
  const html = await requestURL(url)
  return {
    episode,
    url,
    ...getEpisodeMetaData(html),
    seen: getSeenForEpisode(html)
  }
}

// Returns the air date for an episode.
const getEpisodeMetaData = (html) => {
  const $ = cheerio.load(html)

  // Check whether this episode is unaired or not.
  const categories = $('#mw-normal-catlinks ul li a').get().map(cat => $(cat).text().trim())
  const hasAired = categories.indexOf('Unaired episodes') === -1

  // Retrieve the broadcast dates.
  const broadcastData = $('#mw-content-text td').get().reduce((acc, td) => {
    // Collect all <td> elements containing a <div> title and a <table>.
    const $td = $(td)
    const $div = $td.find('> div')
    const $table = $td.find('> table')

    if ($div.length === 0 || $table.length === 0) return acc

    if ($div.text().trim() === 'First broadcast') {
      // Found the first broadcast data. Now unpack its <table>.
      const data = $('tr', $table).get().reduce((bcd, n) => {
        const countryString = $('th', n).text().trim().toLowerCase()
        const country = countryString === 'japan'
          ? 'ja'
          : countryString === 'united states'
            ? 'us'
            // Ignore all other countries.
            : null

        if (!country) return bcd

        // In some cases, we've got multiple dates. In this case, pick the latter.
        // Multiple dates are interspersed with <span> tags that explain why there are multiple dates.
        const hasExplainSpan = $('span.explain', n)

        let time
        const $td = $('td', n)
        if (hasExplainSpan) {
          time = 'asdf'
          $td.find('span').replaceWith('\n')
          $td.find('br').replaceWith('\n')
          const dates = $td.text().trim().split('\n').filter(s => s.trim() !== '')
          time = dates[dates.length - 1]
        }
        else {
          time = $td.text().trim()
        }
        const timeFormatted = moment.utc(time).format('YYYY-MM-DD')
        const today = moment().format('YYYY-MM-DD')
        const isValidDate = timeFormatted !== 'Invalid date'
        const isAired = time !== 'Unaired'
        const useTime = time && isValidDate && isAired && today > timeFormatted
        return { ...bcd, [country]: useTime ? timeFormatted : null }
      }, {})
      return { ...acc, data }
    }

    return acc
  }, {})

  // Retrieve the episode name.
  const nameData = $('#mw-content-text td').get().reduce((acc, td) => {
    // Collect all <td> elements containing a <div> title and a <table>.
    const $td = $(td)
    const $jaSpan = $td.find('span[lang="ja"]')
    const $i = $td.find('i')

    if ($jaSpan.length === 0 || $i.length === 0) return acc

    const jpnTitle = $jaSpan.text().trim()
    const engTitle = $i.text().trim()
    return { ...acc, episodeName: { 'jpn': jpnTitle, 'eng': engTitle } }
  }, {})

  return { broadcastDates: broadcastData.data, ...nameData, hasAired }
}

// Returns all Pokémon seen in an episode by the episode's Bulbapedia HTML content.
const getSeenForEpisode = (html) => {
  const $ = cheerio.load(html)

  const $content = $('#mw-content-text')
  const $items = $('> *', $content)
  const allElements = getContentElements($, $items)

  // Now collect the <h3>Pokémon</h3> and all <ul> tags until the next header tag.
  // There's probably a nicer way to do this, but it works.
  const pokemonData = allElements.reduce((acc, item) => {
    // State 0: searching for the right <h3>.
    if (acc.state === 0 && item[0] === 'h3' && item[1].toLowerCase() === 'pokémon') {
      return { state: 1, items: [] }
    }
    // State 1: collecting <ul> tags.
    else if (acc.state === 1 && item[0] === 'ul') {
      return { state: 2, items: [ ...acc.items, item[1]] }
    }
    // State 2: waiting for the next header tag to finish.
    else if (acc.state === 2 && item[0].startsWith('h')) {
      return { state: 3, items: acc.items }
    }
    return acc
  }, { state: 0 })

  // Extract Pokémon names from all text nodes we saved.
  const pokemonSeenData = getSeenForText(pokemonData.items.join('\n'))
  return pokemonSeenData
}

// Returns all Pokémon (by ID and name) seen in a piece of text.
const getSeenForText = text => (
  engList.reduce((acc, name) => {
    if (text.indexOf(name) > -1) return [...acc, [engToID[name], name]]
    return acc
  }, [])
)

// Returns all elements inside of the main content, saving the element name, content, and a Cheerio object.
const getContentElements = ($, $items) => (
  $items.get().map(n => [$(n).prop('name'), $(n).text().trim(), $(n)]).filter(n => n[1] !== '')
)
