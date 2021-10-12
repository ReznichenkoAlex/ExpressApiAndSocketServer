const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const path = require('path')
const User = require('../models/User')
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret'


const {
    registrationValidation,
    avatarValidation,
  } = require('../lib/validation')

module.exports = {
    registration: async (req, res) => {
        const { username, surName, firstName, middleName, password }= req.body
        const id = uuidv4()
        const errorResponse = registrationValidation(username, surName, firstName, middleName, password)
        if (errorResponse) {
          return res.status(400).json(errorResponse)
        }
        await User.create({username, surName, firstName, id, middleName, password })
      
        const payload = { _id: id }
        const tokens = {
          accessToken: jwt.sign({ user: payload }, JWT_SECRET),
          refreshToken: jwt.sign({ user: payload }, JWT_SECRET),
          accessTokenExpiredAt: Date.now() + 1000 * 60 * 5,
          refreshTokenExpiredAt: Date.now() + 1000 * 60 * 30,
        }
        const body = { firstName, id, middleName, username, surName, ...tokens }
        res.status(201).json(body)
    },

    login: async (req, res, next) => {
        await passport.authenticate('local', { session: false }, (err, user) => {
          if (err) {
            return next(err)
          }
          if (!user) {
            return res.status(403).json({ message: 'Неправильный логин или пароль' })
          }
          req.login(user, async () => {
            const {
              firstName,
              id,
              image,
              middleName,
              permission,
              surName,
              username,
            } = user
            const userObject = {
              firstName,
              id,
              image,
              middleName,
              permission,
              surName,
              username,
            }
      
            const payload = { _id: user.id, permission: user.permission }
            const tokens = {
              accessToken: jwt.sign({ payload }, JWT_SECRET),
              refreshToken: jwt.sign({ payload }, JWT_SECRET),
              accessTokenExpiredAt: Date.now() + 1000 * 60 * 5,
              refreshTokenExpiredAt: Date.now() + 1000 * 60 * 30,
            }
            const body = { ...userObject, ...tokens }
            return res.status(200).json(body)
          })
        })(req, res, next)
    },

    refreshToken: (req, res) => {
        const { payload } = jwt.verify(req.get('authorization'), JWT_SECRET)
        if (!payload) {
          res
            .status(500)
            .json({ message: 'no user', authorization: req.headers.authorization })
        }
        res.set('authorization', jwt.sign({ payload }, JWT_SECRET))
        const tokens = {
          accessToken: jwt.sign({ payload }, JWT_SECRET),
          refreshToken: jwt.sign({ payload }, JWT_SECRET),
          accessTokenExpiredAt: Date.now() + 1000 * 60 * 5,
          refreshTokenExpiredAt: Date.now() + 1000 * 60 * 30,
        }
        res.status(200).json(tokens)
    },

    getProfile: (req, res) => {
        if (!req.user) {
          res.status(500).json({ message: 'что-то пошло не так' })
        }
        const { firstName, id, image, middleName, permission, surName, username } =
          req.user
        const userObject = {
          firstName,
          id,
          image,
          middleName,
          permission,
          surName,
          username,
        }
        res.json(userObject)
    },

    patchProfile: async (req, res) => {
        const { firstName, middleName, surName, newPassword } = req.body
        const { payload } = jwt.verify(req.get('authorization'), JWT_SECRET)
      
        const password = newPassword
        const data = { firstName, middleName, surName, password }
        if (req.body.avatar !== 'null') {
          const { originalname, filename, size } = req.file
          const avatarError = avatarValidation(originalname, size)
          if (avatarError) {
            return res.status(400).json(avatarError)
          }
          data.image = path.join('./public/upload', filename)
        }
      
        const updatedUser = await User.findOneAndUpdate({ id: payload._id }, data, {
          new: true,
        }).select('-password -__v -_id')
        res.json(updatedUser)
    }

}