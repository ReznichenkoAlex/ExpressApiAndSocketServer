const express = require('express')
const router = express.Router()

const auth = require('./auth')
const users = require('./users')
const news = require('./news')

router.use('/', auth)

router.use('/users', users)

router.use('/news', news)

module.exports = router
