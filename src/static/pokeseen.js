/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

const PokeSeen = {
  decorate: function(id) {
    const itemRow = document.getElementById('item_' + id)
    const episodesRow = document.getElementById('episodes_' + id)

    itemRow.addEventListener('click', function(ev) {
      console.log(ev)
      console.log(episodesRow.classList)
      episodesRow.classList.toggle('displayed')
    }, false)
  },
  decorateSorters: function(appearancesSorterID, lastSeenSorterID) {
    const appSorter = document.getElementById(appearancesSorterID)
    const lsSorter = document.getElementById(lastSeenSorterID)

    const callback = function(prop) {
      return function(ev) {
        if (prop === 'data-appearances-n') {
          appSorter.classList.add('active')
          lsSorter.classList.remove('active')
        }
        if (prop === 'data-last-seen-n') {
          appSorter.classList.remove('active')
          lsSorter.classList.add('active')
        }
        console.log(prop)
        ev.preventDefault()
      }
    }

    appSorter.addEventListener('click', callback('data-appearances-n'), false)
    lsSorter.addEventListener('click', callback('data-last-seen-n'), false)
  }
}
