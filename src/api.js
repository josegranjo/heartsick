const https = require('https')
const Images = require('./images')

var count = 100

const fetchHearts = (url) => {
  console.info(`=> Fetching references ${101 - count}:`, url)
  return fetch(url)
    .then((response) => response.json())
    .then(processRefs)
    .catch((error) => console.error('!! Failed to fetch references', error))
}

const processRefs = (json) => {
  for (var heart of json.data.map(extractRef)) {
    if (!fetchImage(heart)) {
      console.log('=> Ups! File already exists')
      console.log('=> Exiting...')
      return false
    }
  }

  if (json.pagination.next_url && count--) {
    fetchHearts(json.pagination.next_url)
  }
}

function fetchImage (like, k) {
  const url = getHDUrl(like.url)
  console.info(`=> Fetching image: ${url}`)
  const created = like.created
  const year = created.getFullYear()
  const month = created.getMonth() + 1
  const day = created.getDate()
  const id = like.link.match(/https:\/\/www\.instagram\.com\/p\/(.*)\//)[1]
  const name = `${year}-${month}-${day}-${id}`

  if (Images.isCreated(name)) {
    return false
  }

  https.get(like.url, (res) => Images.save(res, name))
  return true
}

function extractRef (post) {
  return {
    created: new Date(post.created_time * 1000),
    user: post.user.username,
    url: post.images.standard_resolution.url,
    link: post.link
  }
}

const getHDUrl = (str) => {
  const match = str.match(/(.*)\/(s640x640|s480x480|s320x320)(.*)/)
  if (match) {
    return match[1] + match[3]
  } else {
    console.info(`[INFO] Could not find low quality folder in:${str}`)
    return str
  }
}

module.exports = {
  fetchHearts
}
