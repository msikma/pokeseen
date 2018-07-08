#!/usr/bin/env node
'use strict';

var _ = require('../');

require('babel-polyfill');

var runScript = function runScript() {
  (0, _.checkData)();
};

runScript();