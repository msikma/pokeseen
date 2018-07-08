/**
 * buyee-js - Buyee Client Library <https://github.com/msikma/buyee-js>
 * Copyright © 2018, Michiel Sikma
 */

import request from 'request-promise'

// Headers similar to what a regular browser would send.
const browserHeaders = {
  'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8,nl;q=0.7,de;q=0.6,es;q=0.5,it;q=0.4,pt;q=0.3',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive'
}

// Default settings for requests.
const requestDefaults = {
  gzip: true
}

/**
 * Wraps request-promise's request() function with some headers to make it seem like
 * a regular browser.
 */
export const requestURL = (url, headers = {}, ...props) => (
  request({ url, headers: { ...browserHeaders, ...headers }, ...requestDefaults, ...props })
)

/**
 * Promisified version of setInterval() for use with await.
 * Use like: await wait(1000) to halt execution 1 second.
 */
export const wait = (ms) => (
  new Promise((resolve) => setInterval(() => resolve(), ms))
)
