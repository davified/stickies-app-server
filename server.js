const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000
let history = {}

dotenv.load()

// Mounting middleware
app.use(require('morgan')('dev'))
app.use(cors())
app.use(express.static('public'))

// error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: err
  })
})

// SOCKET IO
var server = require('http').Server(app)
var io = require('socket.io')(server)
var numberOfConnections = 0

app.get('/', function (req, res) {
  res.sendfile(path.join(__dirname, '/index.html'))
})

// 1. socket.io event #1 - connection
io.on('connection', function (socket) {
  console.log(`New user connected. Total connections: ${numberOfConnections}`)
  numberOfConnections++
  socket.emit('connectionSuccess', { totalUsers: numberOfConnections })

  // 2. socket.io event #2 - creating rooms
  socket.on('createRoom', function (data) {
    let room = data.roomName
    socket.join(room)

    io.sockets.in(room).emit('connectToRoom', 'You are in room-' + room)
    history[room] = [] // initialising empty array for storing stickies/messages
    // console.log(io.nsps['/'].adapter.rooms)
  })

  // 3. socket.io event #3 - joining a room
  socket.on('joinRoom', function (data) {
    let room = data.roomName
    socket.join(room)

    io.sockets.in(room).emit('connectToRoom', 'You are in room-' + room)
    socket.emit('loadMessageHistory', {history: history[room]})
  })

  // 4. socket.io event #4 - sending messages in the room
  socket.on('sendMessage', function (data) {
    let message = data.message
    let room = data.room
    io.to(room).emit('broadcastMessageToRoom', message)
    history[room].push(message)
  })

  // 5. socket.io event #5 - loading messages and display state for ppl joining the room midway
})

server.listen(PORT, function () {
  console.log(`listening on port ${PORT}`)
})

module.exports = app
