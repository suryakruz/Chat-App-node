const express = require('express')
const http = require('http')
const path = require('path')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages.js')
const {addUser, removeUser, getUser, getUsersBycode} = require('./utils/user.js')

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join("__dirname", "../public")

app.use(express.static(publicDirectoryPath))

io.on('connect', (socket) => {
    
    socket.on('join', ({username, code}, callback) => {
        const { user, error } = addUser({ id : socket.id, username, code})
        if(error)
        {
           return callback(error)
        } 
        socket.join(user.code)
        socket.emit('message', generateMessage("Welcome", 'Admin'))
        socket.broadcast.to(user.code).emit('message', generateMessage(`${user.username} has joined`, 'Admin'))
        io.to(user.code).emit('sidebarData',
            {
                code :user.code, 
                users : getUsersBycode(user.code)
            })
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if(filter.isProfane(message))
        {
            return callback(generateMessage('Bad Words not allowed'))
        }
        const {user} = getUser(socket.id)
        io.to(user.code).emit('message', generateMessage(message, user.username))
        callback()
    })

    socket.on('sendLocation', (position, callback)=>{
        const {user} = getUser(socket.id)
        io.to(user.code).emit('locationMessage', generateMessage("https://google.com/maps?q="+position.latitude + "," + position.longitude, user.username))
        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user)
        {
          io.to(user.code).emit('message', generateMessage(`${user.username} has Left`))
          io.to(user.code).emit('sidebarData',
          {
              code :user.code, 
              users : getUsersBycode(user.code)
          })
        }
        
    })
})

server.listen(port, ()=>{
    console.log('Server is up on port '+ port)
})