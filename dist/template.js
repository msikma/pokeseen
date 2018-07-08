'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSeenPage = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _repoinfojs = require('repoinfojs');

var _repoinfojs2 = _interopRequireDefault(_repoinfojs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _data = require('./data');

var _saveFile = require('./util/saveFile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modulesPath = _path2.default.resolve(__dirname, '..', 'node_modules'); /**
                                                                            * pokeseen - <https://github.com/msikma/pokeseen>
                                                                            * Copyright © 2018, Michiel Sikma
                                                                            */

var docsPath = _path2.default.resolve(__dirname, '..', 'docs');
var staticPath = _path2.default.resolve(__dirname, '..', 'static');

var never = 'Never seen';

/**
 * Generates and saves an HTML page containing the appearance data
 * generated by sortPokemonByAppearances().
 */
var createSeenPage = exports.createSeenPage = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(appearancesRanking, lastSeenRanking, airedEpisodesList) {
    var repoInfo, data, appearancesRankingByID, pageMarkup;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _repoinfojs2.default)();

          case 2:
            repoInfo = _context.sent;
            data = {
              version: _data.pkgData.version,
              commits: repoInfo.commits,
              hash: repoInfo.hash,
              homepage: _data.pkgData.homepage,
              generationTime: (0, _moment2.default)().format('YYYY-MM-DD HH:mm:ss ZZ')
              // Render our React component to HTML and save it using the wrapper string.
            };
            appearancesRankingByID = appearancesRanking.map(function (item, n) {
              return (0, _extends4.default)({}, item, { n: n });
            }).reduce(function (acc, item) {
              return (0, _extends4.default)({}, acc, (0, _defineProperty3.default)({}, item.id, item));
            }, {});
            pageMarkup = _server2.default.renderToStaticMarkup(_react2.default.createElement(SeenPage, (0, _extends4.default)({ appearancesRankingByID: appearancesRankingByID, lastSeenRanking: lastSeenRanking, airedEpisodesList: airedEpisodesList }, data)));
            _context.next = 8;
            return (0, _saveFile.saveFile)(docsPath + '/index.html', wrapPage(pageMarkup, data));

          case 8:
            _context.next = 10;
            return copyFile(modulesPath + '/pokesprite/pokesprite.png', docsPath);

          case 10:
            _context.next = 12;
            return copyFile(modulesPath + '/pokesprite/overview.min.css', docsPath);

          case 12:
            _context.next = 14;
            return copyFile(modulesPath + '/pokesprite/pokesprite.min.css', docsPath);

          case 14:
            _context.next = 16;
            return copyFile(modulesPath + '/pokesprite/pokesprite.min.js', docsPath);

          case 16:
            _context.next = 18;
            return copyFile(staticPath + '/pokeseen.css', docsPath);

          case 18:
            _context.next = 20;
            return copyFile(staticPath + '/pokeseen.js', docsPath);

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createSeenPage(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Copies a file from a path to a destination directory.
 */
var copyFile = function copyFile(src, destDir) {
  return new _promise2.default(function (resolve, reject) {
    var dest = destDir + '/' + _path2.default.basename(src);
    _fs2.default.copyFile(src, dest, function (err) {
      if (err) return reject(err);
      return resolve();
    });
  });
};

/**
 * Main component.
 *
 * The Pokémon ranking data uses the following format:
 *
 * [ { id: '789',
 *     amount: 9,
 *     lastSeen: { ja: '2018-05-10', us: '2018-04-07' } }, ... ]
 */
var SeenPage = function SeenPage(_ref2) {
  var appearancesRankingByID = _ref2.appearancesRankingByID,
      lastSeenRanking = _ref2.lastSeenRanking,
      airedEpisodesList = _ref2.airedEpisodesList,
      version = _ref2.version,
      commits = _ref2.commits,
      hash = _ref2.hash,
      homepage = _ref2.homepage,
      generationTime = _ref2.generationTime;
  return _react2.default.createElement(
    'div',
    { id: 'top' },
    _react2.default.createElement(
      'div',
      { className: 'description' },
      _react2.default.createElement(
        'div',
        { className: 'header' },
        _react2.default.createElement(
          'h1',
          null,
          'Pok\xE9Seen'
        ),
        _react2.default.createElement(
          'p',
          null,
          'asdf asdf adfs'
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'docs-container' },
        _react2.default.createElement(
          'h2',
          null,
          'Icon overview (v',
          version,
          '; r',
          commits,
          ')'
        ),
        _react2.default.createElement(
          'p',
          null,
          'Generated on ',
          _react2.default.createElement(
            'span',
            { className: 'time' },
            generationTime
          ),
          ' (',
          _react2.default.createElement(
            'span',
            { className: 'amount' },
            '3301'
          ),
          ' icons).'
        )
      )
    ),
    _react2.default.createElement(
      'table',
      { className: 'table pkspr-overview' },
      _react2.default.createElement(
        'tbody',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            'th',
            null,
            '#'
          ),
          _react2.default.createElement(
            'th',
            null,
            'ID'
          ),
          _react2.default.createElement(
            'th',
            null,
            'Icon'
          ),
          _react2.default.createElement(
            'th',
            { colSpan: 2 },
            'Name'
          ),
          _react2.default.createElement(
            'th',
            null,
            _react2.default.createElement(
              'a',
              { href: '#', className: 'sort-link', id: 'appearance_sort' },
              'Appearances'
            )
          ),
          _react2.default.createElement(
            'th',
            { colSpan: 2 },
            _react2.default.createElement(
              'a',
              { href: '#', className: 'sort-link active', id: 'last_seen_sort' },
              'Last appearance (Japan)'
            )
          )
        ),
        _react2.default.createElement('script', { dangerouslySetInnerHTML: { __html: 'PokeSeen.decorateSorters(\'appearance_sort\', \'last_seen_sort\')' } }),
        lastSeenRanking.map(function (pokemon, n) {
          // Construct two rows: one with the sorted data, and one with the episode IDs.
          var id = pokemon.id,
              amount = pokemon.amount,
              lastSeen = pokemon.lastSeen,
              episodes = pokemon.episodes;

          // Determine the last time this Pokémon was seen, if ever.

          var lastJa = (0, _lodash.get)(lastSeen, 'ja', never);
          var lastUS = (0, _lodash.get)(lastSeen, 'us', never);
          var neverSeenJa = !lastJa || lastJa === never;
          var neverSeenUS = !lastUS || lastUS === never;

          // And generate the relative time from today.
          var relJaDays = (0, _moment2.default)().diff((0, _moment2.default)(lastJa), 'days');
          var relUSDays = (0, _moment2.default)().diff((0, _moment2.default)(lastUS), 'days');
          var relJa = _moment2.default.duration(relJaDays, 'days').humanize();
          var relUS = _moment2.default.duration(relUSDays, 'days').humanize();

          // Check if it's faster to see which episodes a Pokémon did *not* appear in.
          var episodesInverse = (0, _lodash.xor)(airedEpisodesList, episodes);

          var pkmnInfo = _data.pokedex[id];

          var cols = 8;

          return [_react2.default.createElement(
            'tr',
            { id: 'item_' + id, className: 'main-info', 'data-id': id, key: 'main_info_' + id, 'data-last-seen-n': n, 'data-appearances-n': appearancesRankingByID[id].n },
            _react2.default.createElement(
              'td',
              { className: 'minimal' },
              n + 1
            ),
            _react2.default.createElement(
              'td',
              { className: 'minimal' },
              id
            ),
            _react2.default.createElement(
              'td',
              { className: 'minimal' },
              _react2.default.createElement('span', { id: 'icon_' + id, className: 'pkspr pkmn-' + pkmnInfo.slug.eng })
            ),
            _react2.default.createElement(
              'td',
              null,
              pkmnInfo.name.eng
            ),
            _react2.default.createElement(
              'td',
              null,
              _react2.default.createElement(
                'span',
                { title: pkmnInfo.name.jpn_ro },
                pkmnInfo.name.jpn
              )
            ),
            _react2.default.createElement(
              'td',
              null,
              amount
            ),
            _react2.default.createElement(
              'td',
              (0, _extends4.default)({ className: neverSeenJa ? 'never' : '' }, neverSeenJa ? { colSpan: 2 } : {}),
              neverSeenJa ? never : lastJa
            ),
            !neverSeenJa ? _react2.default.createElement(
              'td',
              null,
              relJa,
              ' ago'
            ) : null
          ), _react2.default.createElement(
            'tr',
            { id: 'episodes_' + id, className: 'episode-info', 'data-id': id, key: 'ep_info_' + id },
            episodesInverse.length === 0 ? _react2.default.createElement(
              'td',
              { colSpan: cols },
              'Appears in: every episode to date.'
            ) : episodes.length === 0 ? _react2.default.createElement(
              'td',
              { colSpan: cols },
              'No appearances in the TV series.'
            ) : episodesInverse.length > episodes.length ? _react2.default.createElement(
              'td',
              { colSpan: cols },
              'Appears in: ',
              episodes.map(function (ep) {
                return _react2.default.createElement(
                  'span',
                  { key: ep },
                  _react2.default.createElement(
                    'a',
                    { target: '_blank', href: (0, _data.epURL)(ep) },
                    ep
                  ),
                  ' '
                );
              })
            ) : _react2.default.createElement(
              'td',
              { colSpan: cols },
              'Appears in every episode ',
              _react2.default.createElement(
                'em',
                null,
                'except'
              ),
              ': ',
              episodesInverse.map(function (ep) {
                return _react2.default.createElement(
                  'span',
                  { key: ep },
                  _react2.default.createElement(
                    'a',
                    { target: '_blank', href: (0, _data.epURL)(ep) },
                    ep
                  ),
                  ' '
                );
              })
            )
          ), _react2.default.createElement('script', { key: 'js_' + id, dangerouslySetInnerHTML: { __html: 'PkSpr.decorate(\'icon_' + id + '\')\nPokeSeen.decorate(\'' + id + '\')' } })];
        })
      )
    )
  );
};

/**
 * Base HTML wrapper for the template page.
 */
var wrapPage = function wrapPage(str, _ref3) {
  var version = _ref3.version,
      commits = _ref3.commits,
      hash = _ref3.hash,
      homepage = _ref3.homepage,
      generationTime = _ref3.generationTime;
  return '<!doctype html>\n<html lang="en">\n<!--\n\nPok\xE9Seen v' + version + ' (r' + commits + ', [' + hash + ']) <' + homepage + '>\nGenerated on ' + generationTime + '.\n\n-->\n<head>\n  <meta charset="utf-8" />\n  <title>Pok\xE9Seen - Pok\xE9mon appearance statistics</title>\n  <link type="text/css" href="pokesprite.min.css" rel="stylesheet" media="screen" />\n  <link type="text/css" href="overview.min.css" rel="stylesheet" media="screen" />\n  <link type="text/css" href="pokeseen.css" rel="stylesheet" media="screen" />\n  <script charset="utf-8" src="pokesprite.min.js" ></script>\n  <script charset="utf-8" src="pokeseen.js" ></script>\n</head>\n<body>\n' + str + '\n</body>\n</html>';
};