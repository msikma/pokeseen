#!/usr/bin/env node
import { checkData } from '../'
import 'babel-polyfill'

const runScript = () => {
  checkData()
}

runScript()
