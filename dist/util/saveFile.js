'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveFile = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Wrapper for fs.writeFile() using a Promise.
var saveFile = exports.saveFile = function saveFile(path, content) {
  return new _promise2.default(function (resolve, reject) {
    _fs2.default.writeFile(path, content, function (err) {
      if (err) return reject(err);else return resolve();
    });
  });
}; /**
    * pokeseen - <https://github.com/msikma/pokeseen>
    * Copyright © 2018, Michiel Sikma
    */