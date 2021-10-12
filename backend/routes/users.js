const express = require('express')
const router  = express.Router()
const controllers = require('../controllers/users')
const checkPermission = require('../lib/checkPermission')

router.get('/', checkPermission, controllers.getUsers)

router.patch('/:id/permission', checkPermission, controllers.updateUserPermission)

router.delete('/:id', checkPermission, controllers.deleteUser)

module.exports = router