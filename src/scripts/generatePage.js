#!/usr/bin/env node
import { generatePage } from '../'
import 'babel-polyfill'

const runScript = () => {
  generatePage()
}

runScript()
