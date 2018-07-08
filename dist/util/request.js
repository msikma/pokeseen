'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wait = exports.requestURL = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Headers similar to what a regular browser would send.
var browserHeaders = {
  'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8,nl;q=0.7,de;q=0.6,es;q=0.5,it;q=0.4,pt;q=0.3',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive'

  // Default settings for requests.
}; /**
    * buyee-js - Buyee Client Library <https://github.com/msikma/buyee-js>
    * Copyright © 2018, Michiel Sikma
    */

var requestDefaults = {
  gzip: true

  /**
   * Wraps request-promise's request() function with some headers to make it seem like
   * a regular browser.
   */
};var requestURL = exports.requestURL = function requestURL(url) {
  for (var _len = arguments.length, props = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    props[_key - 2] = arguments[_key];
  }

  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (0, _requestPromise2.default)((0, _extends3.default)({ url: url, headers: (0, _extends3.default)({}, browserHeaders, headers) }, requestDefaults, props));
};

/**
 * Promisified version of setInterval() for use with await.
 * Use like: await wait(1000) to halt execution 1 second.
 */
var wait = exports.wait = function wait(ms) {
  return new _promise2.default(function (resolve) {
    return setInterval(function () {
      return resolve();
    }, ms);
  });
};