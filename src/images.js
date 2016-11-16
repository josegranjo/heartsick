const fs = require('fs')

const folder = generateFolderName()

const buildPath = (name) => `${folder}/${name}.jpg`

const save = (response, name) => {
  const file = fs.createWriteStream(buildPath(name));
  response.pipe(file)
}

const isCreated = (name) => {
  try {
    fs.accessSync(buildPath(name), fs.F_OK)
    return true
  } catch (e) {
    return false
  }
}

function generateFolderName () {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  return `${year}-${month}-${day}`
}

module.exports = {
  save,
  isCreated
}
