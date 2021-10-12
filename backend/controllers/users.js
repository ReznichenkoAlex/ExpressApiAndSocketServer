const User = require('../models/User')

module.exports = {
    getUsers: async (req, res) => {
        const users = await User.find({}).select('-password -_id -__v')
        res.json(users)
    },

    updateUserPermission: async (req, res) => {
        const id = req.params.id
        const permission = req.body
         const updatedUser = await User.findOneAndUpdate( {id: id}, permission, {new: true}).select('-password -_id -__v')
        res.json(updatedUser)
    },

    deleteUser: async (req, res) => {
        const id = req.params.id
        const deletedUser = await User.findOneAndRemove({id: id}).select('-password -_id -__v')
        res.json(deletedUser)
    }
}