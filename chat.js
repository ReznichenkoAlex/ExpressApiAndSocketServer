const User = require('./backend/models/User')
const Messages = require('./backend/models/Messages')

const users = {}
function connection (socket) {

    socket.on('users:connect', async (data) => {
      const user = await User.findOne( {username: data.username})
      if(!user.permission.chat.R) {
        return 
      }
      const newUser = {
        username: data.username,
        socketId: socket.id,
        userId: data.userId,
        activeRoom: null
      }
      users[socket.id] = newUser
      const usersArray = Object.values(users)
      socket.emit('users:list', usersArray.slice(0, - 1))
      socket.broadcast.emit('users:add', newUser)
    })
  
    socket.on('message:add', async (data) => {
      const user = await User.findOne( {id: data.senderId})
      if(!user.permission.chat.U) {
        return 
      }
      await Messages.create({text: data.text, senderId: data.senderId, recipientId: data.recipientId })
      socket.emit('message:add', data)
      if(users[data.roomId].activeRoom === users[socket.id].socketId) {
        socket.to(data.roomId).emit('message:add', data)
      }
    })
  
    socket.on('message:history', async (data) => {
      // let currentHistory = []
      users[socket.id].activeRoom = Object.values(users).find(item => item.userId === data.recipientId).socketId
      const currentHistory = await Messages.find({$or:[{ senderId: data.senderId, recipientId: data.recipientId}, { senderId: data.recipientId, recipientId: data.userId}]})
      // (item => ((item.senderId === data.userId && item.recipientId === data.recipientId) || (item.senderId === data.recipientId && item.recipientId === data.userId)))
      socket.emit('message:history', currentHistory)
    })
  
    socket.on('disconnect', () => {
      socket.broadcast.emit('users:leave', socket.id)
      delete users[socket.id]
    })
  }

  module.exports = connection