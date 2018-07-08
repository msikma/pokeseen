#!/usr/bin/env node
import { cacheSeenData } from '../'
import 'babel-polyfill'

const runScript = async () => {
  await cacheSeenData()
  // Don't know why I have to exit explicitly here.
  process.exit(0)
}

runScript()
