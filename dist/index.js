'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePage = exports.checkData = exports.cacheSeenData = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _data = require('./data');

var _process = require('./process');

var _template = require('./template');

var _scrape = require('./scrape');

var _request = require('./util/request');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Retrieves data regarding every Pokémon's appearances throughout the history
 * of the TV show. If the data already exists, we'll use cached data,
 * else we'll scrape the episode's Bulbapedia page to extract the information.
 */
var cacheSeenData = exports.cacheSeenData = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var existingSeenData, gotNewData, seenList, newSeenData;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Retrieve cached data to check if we can skip any episode.
            existingSeenData = (0, _data.getSeenData)();
            gotNewData = false;
            _context2.next = 4;
            return _promise2.default.all(_data.episodeList.map(function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(episode, n) {
                var data;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!existingSeenData[episode]) {
                          _context.next = 2;
                          break;
                        }

                        return _context.abrupt('return', existingSeenData[episode]);

                      case 2:
                        _context.next = 4;
                        return (0, _request.wait)(n * 1000);

                      case 4:
                        _context.next = 6;
                        return (0, _scrape.getPokemonFromEpisode)(episode);

                      case 6:
                        data = _context.sent;

                        gotNewData = true;
                        console.log('Retrieved information from episode ' + episode);
                        return _context.abrupt('return', data);

                      case 10:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x, _x2) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 4:
            seenList = _context2.sent;
            newSeenData = seenList.reduce(function (episodes, ep) {
              return (0, _extends4.default)({}, episodes, (0, _defineProperty3.default)({}, ep.episode, ep));
            }, {});
            _context2.next = 8;
            return (0, _data.saveSeenData)(newSeenData, gotNewData);

          case 8:
            return _context2.abrupt('return', newSeenData);

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function cacheSeenData() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Checks the data for correctness.
 * More of a testing script. Only used during development.
 */
/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

var checkData = exports.checkData = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var seenData;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return cacheSeenData();

          case 2:
            seenData = _context3.sent;

            (0, _keys2.default)(seenData).forEach(function (epNr) {
              var ep = seenData[epNr];

              console.log(ep.seen.length);
            });

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function checkData() {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Generates an HTML page with the results from cacheSeenData().
 */
var generatePage = exports.generatePage = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var seenData, _sortPokemonByAppeara, appearancesRanking, lastSeenRanking, airedEpisodesList;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return cacheSeenData();

          case 2:
            seenData = _context4.sent;
            _sortPokemonByAppeara = (0, _process.sortPokemonByAppearances)(seenData), appearancesRanking = _sortPokemonByAppeara.appearancesRanking, lastSeenRanking = _sortPokemonByAppeara.lastSeenRanking, airedEpisodesList = _sortPokemonByAppeara.airedEpisodesList;
            _context4.next = 6;
            return (0, _template.createSeenPage)(appearancesRanking, lastSeenRanking, airedEpisodesList);

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function generatePage() {
    return _ref4.apply(this, arguments);
  };
}();