'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.epURL = exports.episodeList = exports.pokedex = exports.engList = exports.engToID = exports.saveSeenData = exports.getSeenData = exports.pkgData = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sprintfJs = require('sprintf-js');

var _saveFile = require('../util/saveFile');

var _pokedex = require('../../data/pokedex.json');

var _pokedex2 = _interopRequireDefault(_pokedex);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

exports.pkgData = _package2.default;

// Used to determine the exact episode names, which change prefix per season.

var seasons = [[274, 'EP'], // Original series and Johto
[192, 'AG'], // Advanced Generation
[191, 'DP'], // Diamond and Pearl
[142, 'BW'], // Best Wishes
[140, 'XY'], // XY
[85, 'SM', true] // Sun and Moon (ongoing)
];

// Location where we'll store cache data.
var cacheFile = _path2.default.resolve(__dirname, '..', '..', 'cache', 'seendata.json');

// Returns cached data. We'll try to import the 'cache/seendata.json' file,
// and if it doesn't exist we'll return an empty object instead.
var getSeenData = exports.getSeenData = function getSeenData() {
  try {
    return require(cacheFile);
  } catch (err) {
    return {};
  }
};

// Writes back data to the cache file. Returns a Promise.
var saveSeenData = exports.saveSeenData = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data, logMessage) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _saveFile.saveFile)(cacheFile, (0, _stringify2.default)(data, null, 2));

          case 2:
            if (logMessage) {
              console.log('Saved new data (' + (0, _keys2.default)(data).length + ' episodes) to: ' + cacheFile);
            }

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function saveSeenData(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Key/value store of Pokémon names to Pokédex ID. E.g. { Magnemite: '081', ... }
var engToID = exports.engToID = (0, _keys2.default)(_pokedex2.default).reduce(function (obj, n) {
  return (0, _extends4.default)({}, obj, (0, _defineProperty3.default)({}, _pokedex2.default[n].name.eng, n));
}, {});
var engList = exports.engList = (0, _keys2.default)(engToID);
exports.pokedex = _pokedex2.default;

// Complete list of episodes, e.g. ['EP001', 'EP002', ... 'AG123', ...] etc.

var episodeList = exports.episodeList = seasons.reduce(function (list, season) {
  // If a series is ongoing, we'll check an infinite number of episodes
  // until we find that they don't exist anymore (404 on Bulbapedia).
  // This allows us to not have to update the number of episodes for ongoing series.
  // (As a result, there will be a ridiculous number of episodes for whichever
  // series is going on right now...)
  var episodeCount = season[2] ? 999 : season[0];
  var episodes = new Array(episodeCount).fill().map(function (_, n) {
    return '' + season[1] + (0, _sprintfJs.sprintf)('%03d', n + 1);
  });
  return [].concat((0, _toConsumableArray3.default)(list), (0, _toConsumableArray3.default)(episodes));
}, []);

// Returns a Bulbapedia episode page URL.
var epURL = exports.epURL = function epURL(episode) {
  return 'https://bulbapedia.bulbagarden.net/wiki/' + episode;
};