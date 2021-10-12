const express = require('express')
const multer = require('multer')
const path = require('path')
const shortid = require('shortid')
const passport = require('passport')
const router = express.Router()
const controllers = require('../controllers/auth')
const { Validation } = require('../lib/validation')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(), '/public/upload'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + file.originalname)
    },
})

const upload = multer({ storage: storage })

router.post('/registration', controllers.registration)
  
router.post('/login', controllers.login)

router.post('/refresh-token', passport.authenticate('jwt', { session: false }), controllers.refreshToken)

router.get('/profile', passport.authenticate('jwt', { session: false }), controllers.getProfile)

router.patch('/profile', passport.authenticate('jwt', { session: false }), upload.single('avatar'), Validation, controllers.patchProfile)
  

module.exports = router