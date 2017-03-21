const express = require('express')
const bodyParser = require('body-parser')
const router = require('./router')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()
const PORT = process.env.PORT || 3000

dotenv.load()

// Mounting middleware
app.use(require('morgan')('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
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
  res.sendfile(__dirname + '/index.html')
})

// 1. socket.io event #1 - connection
io.on('connection', function (socket) {
  console.log(`New user connected. Total connections: ${numberOfConnections}`)
  numberOfConnections++
  socket.emit('connectionSuccess', { message: `Connection success. Welcome user number ${numberOfConnections}` })

  // 2. socket.io event #2 - creating rooms
  socket.on('createRoom', function (data) {
    roomName = data.channelName
    socket.join('room-' + roomName)

    // Send this event to everyone in the room.
    io.sockets.in('room-' + roomName).emit('connectToRoom', 'You are in room-' + roomName)
    console.log(io.nsps['/'].adapter.rooms)
  })

  // 3. socket.io event #3 - sending messages in the room

  // 4. socket.io event #4 - loading messages and display state for ppl joining the room midway
})

server.listen(PORT, function () {
  console.log(`listening on port ${PORT}`)
})

module.exports = app
