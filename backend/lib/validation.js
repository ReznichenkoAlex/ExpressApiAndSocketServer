const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret'


const checkFields = (
  firstName,
  middleName,
  surName,
  oldPassword,
  newPassword
) => {
  let response

  if (firstName === '') {
    response = {
      status: 400,
      message: 'Не указано имя',
    }
  }
  if (middleName === '') {
    response = {
      status: 400,
      message: 'Не указано отчество',
    }
  }
  if (surName === '') {
    response = {
      status: 400,
      message: 'Не указана фамилия',
    }
  }
  if (oldPassword === '') {
    response = {
      status: 400,
      message: 'укажите старый пароль',
    }
  }
  if (newPassword === '') {
    response = {
      status: 400,
      message: 'укажите новый пароль',
    }
  }

  return response
}

module.exports.Validation = async (req, res, next) => {
  const { firstName, middleName, surName, oldPassword, newPassword } = req.body
  const validations = checkFields(
    firstName,
    middleName,
    surName,
    oldPassword,
    newPassword
  )
  if (validations) {
    return res.status(400).json(validations)
  }
  const { payload } = jwt.verify(req.get('authorization'), JWT_SECRET)

  const {password} = await User.findOne( {id: payload._id})

  bcrypt.compare(oldPassword, password, async function (err, same) {
    if (err) {
      throw err
    }
    if (!same) {
      return res.status(400).json({ message: 'старый пароль не подходит'})
    }
    if (same){
      bcrypt.compare(newPassword, password, (err, same) => {
        if (err) {
          throw err
        }
        if (!same) {
          return next()
        }
        if (same) {
          return res.status(400).json( {message: 'новый пароль не должен совпадать со старым'})
        }
      })
    }

  })
  
}

module.exports.avatarValidation = (originalname, size) => {
  let response
  if (originalname === '' || size === 0) {
    response = {
      status: 400,
      message: 'Не удалось загрузить картинку',
    }
  }
  return response
}

module.exports.registrationValidation = (username, surName, firstName, middleName, password) => {
  let response

  if (username === '') {
    response = {
      status:400,
      message: 'укажите имя пользователя'
    }
  }
  if (surName === '') {
    response = {
      status:400,
      message: 'укажите фамилию'
    }
  }
  if (firstName === '') {
    response = {
      status:400,
      message: 'укажите имя'
    }
  }
  if (middleName === '') {
    response = {
      status:400,
      message: 'укажите отчество'
    }
  }
  if (password === '') {
    response = {
      status:400,
      message: 'укажите пароль'
    }
  }
  return response
}