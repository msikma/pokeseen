'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortPokemonByAppearances = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _lodash = require('lodash');

var _data = require('./data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Pushes data about the Pokémon from an episode to the appearance object.
 */
/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

var pushSeenToData = function pushSeenToData(targetData, ep, epNr) {
  var special = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (special) {
    ep.seen.forEach(function (pkmn) {
      return targetData[pkmn[0]].amountIncSpecials += 1;
    });
    return;
  }
  ep.seen.forEach(function (pkmn) {
    return targetData[pkmn[0]].episodes.push(epNr);
  });
  ep.seen.forEach(function (pkmn) {
    return targetData[pkmn[0]].amount += 1;
  });
  ep.seen.forEach(function (pkmn) {
    return targetData[pkmn[0]].amountIncSpecials += 1;
  });
  ep.seen.forEach(function (pkmn) {
    var curr = targetData[pkmn[0]].lastSeen;
    targetData[pkmn[0]].lastSeen = {
      ja: !curr || !curr.ja || curr.ja < ep.broadcastDates.ja ? ep.broadcastDates.ja : curr.ja,
      us: !curr || !curr.us || curr.us < ep.broadcastDates.us ? ep.broadcastDates.us : curr.us
    };
  });
};

/**
 * Returns an object containing every Pokémon and how often it appeared in the show,
 * when its last appearance was an how many days it has been since it was seen.
 */
var sortPokemonByAppearances = exports.sortPokemonByAppearances = function sortPokemonByAppearances(seenData) {
  var appearanceData = {};
  var appearanceDataSpecials = {};
  var airedEpisodesList = [];
  var specialEpisodesList = [];

  // Set all Pokémon's values to zero initially.
  (0, _keys2.default)(_data.pokedex).forEach(function (id) {
    return appearanceData[id] = { id: id, amount: 0, amountIncSpecials: 0, lastSeen: null, episodes: [] };
  });
  (0, _keys2.default)(_data.pokedex).forEach(function (id) {
    return appearanceDataSpecials[id] = { id: id, amount: 0, amountIncSpecials: 0, lastSeen: null, episodes: [] };
  });

  // Add up all appearances and last seen dates in the episodes.
  (0, _keys2.default)(seenData).forEach(function (epNr) {
    var ep = seenData[epNr];
    if (!ep.hasAired) return;
    var series = ep.episode.slice(0, 2).toLowerCase();
    if (series === 'ss') {
      specialEpisodesList.push(epNr);
      pushSeenToData(appearanceDataSpecials, ep, epNr);
      pushSeenToData(appearanceData, ep, epNr, true);
    } else {
      airedEpisodesList.push(epNr);
      pushSeenToData(appearanceData, ep, epNr);
    }
  });

  // Make two rankings: one based primarily on appearances, and one on last seen date.
  var appearancesRanking = (0, _values2.default)(appearanceData).sort(compareProps('amountIncSpecials', 'lastSeen.ja', 'id')).reverse();

  var lastSeenRanking = (0, _values2.default)(appearanceData).sort(compareProps('lastSeen.ja', 'amount', 'id')).reverse();

  return { appearancesRanking: appearancesRanking, appearanceDataSpecials: appearanceDataSpecials, lastSeenRanking: lastSeenRanking, airedEpisodesList: airedEpisodesList, specialEpisodesList: specialEpisodesList };
};

/**
 * Returns a sorting function that runs compare() on several properties.
 */
var compareProps = function compareProps() {
  for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
    props[_key] = arguments[_key];
  }

  return function (a, b) {
    var propVal = void 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(props), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var prop = _step.value;

        propVal = compare(a, b, prop);
        if (propVal !== 0) return propVal;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return 0;
  };
};

/**
 * Compares two items by a given member property path.
 */
var compare = function compare(a, b, path) {
  var aVal = (0, _lodash.get)(a, path, '0');
  var bVal = (0, _lodash.get)(b, path, '0');
  return aVal === bVal ? 0 : aVal < bVal ? -1 : 1;
};