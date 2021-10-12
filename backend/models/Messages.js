const mongoose = require('mongoose')
const { Schema } = mongoose

const MessageSchema = new Schema({
    text: {
        type: String,
        trim: true
    },
    senderId:{ 
        type: String,
        trim: true
    },
    recipientId: {
        type: String,
        trim: true
    }
})

module.exports = mongoose.model('Messages', MessageSchema)