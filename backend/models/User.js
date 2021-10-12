const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10

const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  permission: {
    chat: {
      C: { type: Boolean, default: true },
      R: { type: Boolean, default: true },
      U: { type: Boolean, default: true },
      D: { type: Boolean, default: true },
    },
    news: {
      C: { type: Boolean, default: true },
      R: { type: Boolean, default: true },
      U: { type: Boolean, default: true },
      D: { type: Boolean, default: true },
    },
    settings: {
      C: { type: Boolean, default: true },
      R: { type: Boolean, default: true },
      U: { type: Boolean, default: true },
      D: { type: Boolean, default: true },
    },
  },
  surName: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  id: {
    type: String,
    required: true,
    index: { unique: true },
  },
  image: String
})

UserSchema.pre('save', function (next) {
  const user = this

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err)
      }

      user.password = hash
      next()
    })
  })
})

UserSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.password) return next()
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
  this._update.password = await bcrypt.hash(this._update.password, salt)
})

UserSchema.methods.comparePasswords = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, same) {
    if (err) {
      return cb(err)
    }

    cb(null, same)
  })
}

module.exports = mongoose.model('User', UserSchema)
