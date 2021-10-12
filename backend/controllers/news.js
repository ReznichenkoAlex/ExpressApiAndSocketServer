const News = require('../models/News')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret'

module.exports = {
    getNews: async (req, res) => {
        const allNews = await News.find({}).select("-_id -__v")
        res.json(allNews)
    },

    createNews: async (req, res) => {
        const { text, title } = req.body
        const {payload} = jwt.verify(req.headers.authorization, JWT_SECRET)
        const user = await User.findOne({ id: payload._id}).select('-password -_id -__v -permission')
        const id = uuidv4()
        const data = { id, text, title, user}
        await News.create(data)
        const allNews = await News.find({}).select("-_id -__v")
        res.json(allNews)
    },

    updateNews: async (req, res) => {
        const { text, title } = req.body
        const id = req.params.id
        await News.findOneAndUpdate( {id: id}, { text, title })
        const allNews = await News.find({}).select("-_id -__v")
        res.json(allNews)
    },

    deleteNews: async (req, res) => {
        const id = req.params.id
        await News.findOneAndRemove( {id: id}).select('-password -_id -__v')
        const allNews = await News.find({}).select("-_id -__v")
        res.json(allNews)
    }
}