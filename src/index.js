require('es6-promise').polyfill()
require('isomorphic-fetch')

const API = require('./api')
const config = require('../config.json')

const url = `${config.api_url}?access_token=${config.access_token}`

API.fetchHearts(url)
