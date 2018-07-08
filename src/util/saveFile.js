/**
 * pokeseen - <https://github.com/msikma/pokeseen>
 * Copyright © 2018, Michiel Sikma
 */

import fs from 'fs'

// Wrapper for fs.writeFile() using a Promise.
export const saveFile = (path, content) => new Promise((resolve, reject) => {
  fs.writeFile(path, content, (err) => {
    if (err) return reject(err)
    else return resolve()
  })
})
