'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPokemonFromEpisode = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _data = require('./data');

var _request = require('./util/request');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Hide deprecation warning.
_moment2.default.suppressDeprecationWarnings = true;

/**
 * Fetches an episode's Bulbapedia page and examines the content to find
 * which Pokémon appear in it.
 */
/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

var getPokemonFromEpisode = exports.getPokemonFromEpisode = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(episode) {
    var url, html;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = (0, _data.epURL)(episode);
            _context.next = 3;
            return (0, _request.requestURL)(url);

          case 3:
            html = _context.sent;
            return _context.abrupt('return', (0, _extends4.default)({
              episode: episode,
              url: url
            }, getEpisodeMetaData(html), {
              seen: getSeenForEpisode(html)
            }));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getPokemonFromEpisode(_x) {
    return _ref.apply(this, arguments);
  };
}();

// Returns the air date for an episode.
var getEpisodeMetaData = function getEpisodeMetaData(html) {
  var $ = _cheerio2.default.load(html);

  // Check whether this episode is unaired or not.
  var categories = $('#mw-normal-catlinks ul li a').get().map(function (cat) {
    return $(cat).text().trim();
  });
  var hasAired = categories.indexOf('Unaired episodes') === -1;

  // Retrieve the broadcast dates.
  var broadcastData = $('#mw-content-text td').get().reduce(function (acc, td) {
    // Collect all <td> elements containing a <div> title and a <table>.
    var $td = $(td);
    var $div = $td.find('> div');
    var $table = $td.find('> table');

    if ($div.length === 0 || $table.length === 0) return acc;

    if ($div.text().trim() === 'First broadcast') {
      // Found the first broadcast data. Now unpack its <table>.
      var data = $('tr', $table).get().reduce(function (bcd, n) {
        var countryString = $('th', n).text().trim().toLowerCase();
        var country = countryString === 'japan' ? 'ja' : countryString === 'united states' ? 'us'
        // Ignore all other countries.
        : null;

        if (!country) return bcd;

        // In some cases, we've got multiple dates. In this case, pick the latter.
        // Multiple dates are interspersed with <span> tags that explain why there are multiple dates.
        var hasExplainSpan = $('span.explain', n);

        var time = void 0;
        var $td = $('td', n);
        if (hasExplainSpan.length) {
          $td.find('span').replaceWith('\n');
          $td.find('br').replaceWith('\n');
          var dates = $td.text().trim().split('\n').filter(function (s) {
            return s.trim() !== '';
          });
          time = dates[dates.length - 1];
        } else {
          time = $td.text().trim();
        }
        var timeFormatted = _moment2.default.utc(time).format('YYYY-MM-DD');
        var today = (0, _moment2.default)().format('YYYY-MM-DD');
        var isValidDate = timeFormatted !== 'Invalid date';
        var isAired = time !== 'Unaired';
        var useTime = Boolean(time && isValidDate && isAired && today >= timeFormatted);
        return (0, _extends4.default)({}, bcd, (0, _defineProperty3.default)({}, country, useTime ? timeFormatted : null));
      }, {});
      return (0, _extends4.default)({}, acc, { data: data });
    }

    return acc;
  }, {});

  // Retrieve the episode name.
  var nameData = $('#mw-content-text td').get().reduce(function (acc, td) {
    // Collect all <td> elements containing a <div> title and a <table>.
    var $td = $(td);
    var $jaSpan = $td.find('span[lang="ja"]');
    var $i = $td.find('i');

    if ($jaSpan.length === 0 || $i.length === 0) return acc;

    var jpnTitle = $jaSpan.text().trim();
    var engTitle = $i.text().trim();
    return (0, _extends4.default)({}, acc, { episodeName: { 'jpn': jpnTitle, 'eng': engTitle } });
  }, {});

  return (0, _extends4.default)({ broadcastDates: broadcastData.data }, nameData, { hasAired: hasAired });
};

// Returns all Pokémon seen in an episode by the episode's Bulbapedia HTML content.
var getSeenForEpisode = function getSeenForEpisode(html) {
  var $ = _cheerio2.default.load(html);

  var $content = $('#mw-content-text');
  var $items = $('> *', $content);
  var allElements = getContentElements($, $items);

  // SS019, SS020 and SS021 have a slightly different structure for the Pokémon data.
  // These are all Pokémon Mystery Dungeon episodes. Check for the tag.
  var cats = $('#mw-normal-catlinks a').get().map(function (a) {
    return $(a).text().trim();
  });
  var isMysteryDungeonEpisode = cats.indexOf('Pokémon Mystery Dungeon') > -1;

  // Now collect the <h3>Pokémon</h3> and all <ul> tags until the next header tag.
  // There's probably a nicer way to do this, but it works.
  var pokemonData = allElements.reduce(function (acc, item) {
    // State 0: searching for the right <h3>.
    if (acc.state === 0 && item[0] === 'h3' && item[1].toLowerCase() === 'pokémon') {
      return { state: 1, items: [] };
    }
    // State 1: collecting <ul> tags.
    else if (acc.state === 1 && item[0] === 'ul') {
        return { state: 2, items: [].concat((0, _toConsumableArray3.default)(acc.items), [item[1]]) };
      }
      // State 2: waiting for the next header tag to finish.
      else if (acc.state === 2 && item[0].startsWith('h')) {
          return { state: 3, items: acc.items };
        }
    return acc;
  }, { state: 0 });

  // List of Pokémon we will filter for Pokémon appearances.
  var pokemonAppearances = (0, _lodash.get)(pokemonData, 'items', []);

  // If this is a Mystery Dungeon episode, collect its Pokémon information.
  if (isMysteryDungeonEpisode) {
    var pokemonMysteryDungeonData = allElements.reduce(function (acc, item) {
      // State 0: searching for the right <h3>.
      if (acc.state === 0 && item[0] === 'h2' && item[1].toLowerCase() === 'characters') {
        return { state: 1, items: [] };
      }
      // State 1: collecting <ul> tags.
      else if (acc.state === 1 && item[0] === 'ul') {
          return { state: 2, items: [].concat((0, _toConsumableArray3.default)(acc.items), [item[1]]) };
        }
        // State 2: waiting for the next header tag to finish.
        else if (acc.state === 2 && item[0].startsWith('h')) {
            return { state: 3, items: acc.items };
          }
      return acc;
    }, { state: 0 });

    pokemonAppearances = [].concat((0, _toConsumableArray3.default)(pokemonAppearances), (0, _toConsumableArray3.default)((0, _lodash.get)(pokemonMysteryDungeonData, 'items', [])));
  }

  // Extract Pokémon names from all text nodes we saved.
  var pokemonSeenData = getSeenForText(pokemonAppearances.join('\n'));
  return pokemonSeenData;
};

// Returns all Pokémon (by ID and name) seen in a piece of text.
var getSeenForText = function getSeenForText(text) {
  return _data.engList.reduce(function (acc, name) {
    if (text.indexOf(name) > -1) return [].concat((0, _toConsumableArray3.default)(acc), [[_data.engToID[name], name]]);
    return acc;
  }, []);
};

// Returns all elements inside of the main content, saving the element name, content, and a Cheerio object.
var getContentElements = function getContentElements($, $items) {
  return $items.get().map(function (n) {
    return [$(n).prop('name'), $(n).text().trim(), $(n)];
  }).filter(function (n) {
    return n[1] !== '';
  });
};