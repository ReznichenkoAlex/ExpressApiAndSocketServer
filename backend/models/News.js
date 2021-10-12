const mongoose = require('mongoose')
const { Schema } = mongoose

const newsSchema = new Schema({
  id: {
    type: String,
    required: true,
    index: { unique: true },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  user: {
    firstName: String,
    id: String,
    image: String,
    middleName: String,
    surName: String,
    username: String,
  },
})

module.exports = mongoose.model('News', newsSchema)
