'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePage = exports.checkData = exports.cacheSeenData = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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
var cacheSeenData = exports.cacheSeenData = function cacheSeenData() {
  return new _promise2.default(function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolve, reject) {
      var existingSeenData, seenList, gotNewData, episodeData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, episode, data, newSeenData;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Retrieve cached data to check if we can skip any episode.
              existingSeenData = (0, _data.getSeenData)();
              seenList = [];
              gotNewData = false;
              episodeData = void 0;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 7;
              _iterator = (0, _getIterator3.default)(_data.episodeList);

            case 9:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 43;
                break;
              }

              episode = _step.value;

              episodeData = existingSeenData[episode];

              // If cached data exists and has aired (thus is finalized), use that.

              if (!(episodeData && episodeData.hasAired && episodeData.broadcastDates.ja)) {
                _context.next = 15;
                break;
              }

              seenList.push(episodeData);
              return _context.abrupt('continue', 40);

            case 15:
              _context.prev = 15;
              _context.next = 18;
              return (0, _request.wait)(1000);

            case 18:
              if (episodeData && (!episodeData.hasAired || !episodeData.broadcastDates.ja)) {
                console.log('Episode ' + episode + ' hasn\'t aired yet or has no broadcast date. Checking to see if we can update.');
              }
              _context.next = 21;
              return (0, _scrape.getPokemonFromEpisode)(episode);

            case 21:
              data = _context.sent;

              seenList.push(data);
              gotNewData = true;
              console.log('Retrieved information from episode ' + episode + '.');

              if (!(data.hasAired === false)) {
                _context.next = 28;
                break;
              }

              console.log('Stopping: episode ' + episode + ' has not been aired yet.');
              return _context.abrupt('break', 43);

            case 28:
              _context.next = 40;
              break;

            case 30:
              _context.prev = 30;
              _context.t0 = _context['catch'](15);

              if (!(_context.t0.statusCode === 404)) {
                _context.next = 35;
                break;
              }

              console.log('Stopping: episode ' + episode + ' is 404.');
              return _context.abrupt('break', 43);

            case 35:
              if (!_context.t0.statusCode) {
                _context.next = 38;
                break;
              }

              console.log('Error: received unexpected status code ' + _context.t0.statusCode + (_context.t0.options ? ' (URL: ' + _context.t0.options.url + ')' : '') + '.');
              return _context.abrupt('break', 43);

            case 38:
              console.log(_context.t0.stack);
              return _context.abrupt('break', 43);

            case 40:
              _iteratorNormalCompletion = true;
              _context.next = 9;
              break;

            case 43:
              _context.next = 49;
              break;

            case 45:
              _context.prev = 45;
              _context.t1 = _context['catch'](7);
              _didIteratorError = true;
              _iteratorError = _context.t1;

            case 49:
              _context.prev = 49;
              _context.prev = 50;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 52:
              _context.prev = 52;

              if (!_didIteratorError) {
                _context.next = 55;
                break;
              }

              throw _iteratorError;

            case 55:
              return _context.finish(52);

            case 56:
              return _context.finish(49);

            case 57:
              newSeenData = seenList.reduce(function (episodes, ep) {
                return (0, _extends4.default)({}, episodes, (0, _defineProperty3.default)({}, ep.episode, ep));
              }, {});
              _context.next = 60;
              return (0, _data.saveSeenData)(newSeenData, gotNewData);

            case 60:
              return _context.abrupt('return', resolve(newSeenData));

            case 61:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[7, 45, 49, 57], [15, 30], [50,, 52, 56]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

/**
 * Checks the data for correctness.
 * More of a testing script. Only used during development.
 */
/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

var checkData = exports.checkData = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var seenData;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return cacheSeenData();

          case 2:
            seenData = _context2.sent;

            (0, _keys2.default)(seenData).forEach(function (epNr) {
              var ep = seenData[epNr];

              console.log(ep.seen.length);
            });

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function checkData() {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Generates an HTML page with the results from cacheSeenData().
 */
var generatePage = exports.generatePage = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var seenData, _sortPokemonByAppeara, appearancesRanking, appearanceDataSpecials, lastSeenRanking, airedEpisodesList, specialEpisodesList;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return cacheSeenData();

          case 2:
            seenData = _context3.sent;
            _sortPokemonByAppeara = (0, _process.sortPokemonByAppearances)(seenData), appearancesRanking = _sortPokemonByAppeara.appearancesRanking, appearanceDataSpecials = _sortPokemonByAppeara.appearanceDataSpecials, lastSeenRanking = _sortPokemonByAppeara.lastSeenRanking, airedEpisodesList = _sortPokemonByAppeara.airedEpisodesList, specialEpisodesList = _sortPokemonByAppeara.specialEpisodesList;
            _context3.next = 6;
            return (0, _template.createSeenPage)(appearancesRanking, appearanceDataSpecials, lastSeenRanking, airedEpisodesList, specialEpisodesList);

          case 6:
            process.exit(0);

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function generatePage() {
    return _ref3.apply(this, arguments);
  };
}();