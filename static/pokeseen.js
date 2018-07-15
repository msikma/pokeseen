/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

const PokeSeen = {
  decorate: function(id) {
    const itemRow = document.getElementById('item_' + id)
    const episodesRow = document.getElementById('episodes_' + id)

    itemRow.addEventListener('click', function(ev) {
      itemRow.classList.toggle('showing-episodes')
      episodesRow.classList.toggle('displayed')
    }, false)

    // Generate the humanized "time ago" string.
    const relTD = document.querySelector('#item_' + id + ' .time-ago')
    if (relTD) {
      const relMs = Number(relTD.getAttribute('data-time-ago-ms'))
      relTD.innerHTML= humanize(new Date() - relMs)
    }
  },
  decorateSorters: function(appearancesSorterID, lastSeenSorterID) {
    const appSorter = document.getElementById(appearancesSorterID)
    const lsSorter = document.getElementById(lastSeenSorterID)

    const sortTable = function(prop) {
      // Remove <script> tags if we still have any, since we don't need 'em anymore.
      const scripts = document.querySelectorAll('#data_table script')
      for (let n = 0; n < scripts.length; ++n) {
        scripts[n].parentNode.removeChild(scripts[n])
      }

      // Collect all table rows, skipping over the header row.
      const table = document.getElementById('data_table')
      const tbody = table.tBodies[0]
      const trs = Array.prototype.slice.call(tbody.rows, 1)
      const trsSorted = trs.sort(function (a, b) {
        const nA = Number(a.getAttribute(prop))
        const nB = Number(b.getAttribute(prop))
        return nA === nB
          ? 0
          : nA > nB
            ? 1
            : -1
      })
      for (let n = 0; n < trsSorted.length; ++n) {
        tbody.appendChild(trsSorted[n])
      }

      // Rewrite the ID columns.
      const idColumns = document.querySelectorAll('.main-info td.id')
      for (let n = 0; n < idColumns.length; ++n) {
        idColumns[n].innerHTML = n + 1
      }
    }

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
        sortTable(prop)
        ev.preventDefault()
      }
    }

    appSorter.addEventListener('click', callback('data-appearances-n'), false)
    lsSorter.addEventListener('click', callback('data-last-seen-n'), false)
  },
  humanizeGenerationTime: function() {
    const generationSpan = document.querySelector('#generation_time .time')
    const generationSpanPrefix = document.querySelector('#generation_time .time-abs-prefix')
    generationSpan.innerHTML = humanize(new Date(generationSpan.innerHTML))
    generationSpanPrefix.remove()
  }
}

// Various time units in ms.
const timeUnits = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 1000 * 60,
  day: 24 * 60 * 1000 * 60,
  week: 7 * 24 * 60 * 1000 * 60,
  month: 30 * 24 * 60 * 1000 * 60,
  year: 365 * 24 * 60 * 1000 * 60
}

/**
 * Returns a humanized string for how long ago something was.
 * Taken from <https://github.com/digplan/time-ago> (MIT license).
 */
function humanize(nd, s) {
  var o = timeUnits;
  var r = Math.round,
      dir = ' ago',
    pl = function(v, n) {
      return (s === undefined) ? n + ' ' + v + (n > 1 ? 's' : '') + dir : n + v.substring(0, 1)
    },
    ts = Date.now() - new Date(nd).getTime(),
    ii;
  if( ts < 0 )
  {
    ts *= -1;
    dir = ' from now';
  }
  for (var i in o) {
    if (r(ts) < o[i]) return pl(ii || 'm', r(ts / (o[ii] || 1)))
    ii = i;
  }
  return pl(i, r(ts / o[i]));
}
