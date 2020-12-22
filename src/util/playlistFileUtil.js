const fs = require('fs')

const validFileTypes = /^[\s\S]+.(json|plo)$/

exports.getPlaylistsFromPath = function (path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) reject(err)
      else {
        resolve(files.filter(file => validFileTypes.test(file)))
      }
    })
  })
}

// TODO: change error handling for the handle callback
exports.deletePlaylists = function (playlists, path) {
  playlists.forEach(playlist => {
    // TODO: make this non blocking?
    fs.unlinkSync(`${path}/${playlist}`, err => {
      if (err) console.log('there was a problem deleting an installed playlists', err)
      else console.log(`successfully deleted "${playlist}"`)
    })
  })
}

exports.copyPlaylists = function (playlists, from, to) {
  playlists.forEach(playlist => {
    // TODO: make this non blocking?
    fs.copyFileSync(`${from}/${playlist}`, `${to}/${playlist}`, err => {
      if (err) console.log(`there was a problem copying "${playlist}" from "${from}" to "${to}"`, err)
      else console.log(`successfully copied "${playlist}"`)
    })
  })
}
