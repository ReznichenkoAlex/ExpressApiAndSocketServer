const express = require('express')
const router = express.Router()

const controllers = require('../controllers/news')
const checkPermission = require('../lib/checkPermission')

router.get('/', checkPermission, controllers.getNews)

router.post('/', checkPermission, controllers.createNews)

router.patch('/:id', checkPermission, controllers.updateNews)

router.delete('/:id', checkPermission, controllers.deleteNews)

module.exports = router