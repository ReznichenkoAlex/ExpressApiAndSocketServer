const express = require('express')
const path = require('path')
const fs = require('fs')
const apiRout = require('./backend/routes')
const mongoose = require('mongoose')
const logger = require('morgan')
const passport = require('passport')
const LocalStratage = require('passport-local')
const passportJWT = require('passport-jwt')
const http = require('http')

const User = require('./backend/models/User')
const chat = require('./chat')

const PORT = process.env.PORT || 3000
const uri = 'mongodb://localhost:27017/test'
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret'
const upload = path.join(__dirname, 'public', 'upload')

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
})

const connection = mongoose.connection

connection.once('open', function () {
  console.log('>MongDB connected successfully.')
})

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const app = express()

const server = http.createServer(app)
const io = require('socket.io')(server, { allowEIO3: true })



io.on('connection', chat)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'build')))
app.use(passport.initialize())

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user))
})

passport.use(
  new LocalStratage(
    {
      usernameField: 'username',
    },
    async (username, password, done) => {
      await User.findOne({ username: username }).then((user) => {
        if (!user) {
          done(null, false, { message: 'Неправильный логин или пароль' })
        }
        user.comparePasswords(password, (err, match) => {
          if (err) {
            throw err
          }
          if (match) {
            done(null, user)
          } else {
            done(null, false, { message: 'Неправильный логин или пароль' })
          }
        })
      })
    }
  )
)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromHeader('authorization'),
      secretOrKey: JWT_SECRET,
    },
    (jwtPayload, done) => {
      User.findOne({ id: jwtPayload.payload._id }, (err, user) =>
        done(err, user)
      )
    }
  )
)

app.use('/api', apiRout)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'))
})

server.listen(PORT, () => {
  if (
    !fs.access(upload, fs.constants.R_OK || fs.constants.W_OK, (err) => {
      if (err) {
        fs.mkdir(upload, (err) => {
          if (err) {
            return null
          }
        })
      }
    })
  )
    console.log(`>Server is listening port ${PORT}`)
})
