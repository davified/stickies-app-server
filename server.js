const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000
var firebase = require('firebase')

var firebaseConfig = {
  apiKey: 'AIzaSyDaABIq5gX7kp-1TyrSfDrjeObDEDFgFvg',
  authDomain: 'stickieapp-478e0.firebaseapp.com',
  databaseURL: 'https://stickieapp-478e0.firebaseio.com',
  storageBucket: 'stickieapp-478e0.appspot.com',
  messagingSenderId: '302909387352'
}
var firebaseApp = firebase.initializeApp(firebaseConfig)

dotenv.load()

// Mounting middleware
app.use(require('morgan')('dev'))
app.use(cors())
app.use(express.static('public/dist'))

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
// var io = require('socket.io').listen(5000)
var numberOfConnections = 0
var history = {}

app.get('*', function (req, res) {
  res.sendfile(path.join(__dirname, '/public/dist/index.html'))
})

app.get('/demo', function (req, res) {
  res.sendfile(path.join(__dirname, '/public/dist/index.html'))
})

// 1. socket.io event #1 - connection
io.on('connection', function (socket) {
  numberOfConnections++
  console.log(`New user connected. Total connections: ${numberOfConnections}`)
  socket.emit('connectionSuccess', { totalUsers: numberOfConnections })

  // 2. socket.io event #2 - creating rooms
  socket.on('createRoom', function (data) {
    console.log('data in createRoom: ' + data)

    firebaseApp.database().ref('board/' + data.payload.uuid).set(data.payload)

    let room = data.roomName
    socket.join(room)

    io.sockets.in(room).emit('connectToRoom', 'You are in room-' + room)
    history[room] = [] // initialising empty array for storing stickies/messages
    // console.log(io.nsps['/'].adapter.rooms)
  })

  // 3. socket.io event #3 - joining a room
  socket.on('joinRoom', function (data) {
    console.log(history)
    let room = data.roomName

    socket.join(room)

    firebaseApp.database().ref('board/' + room).on('value', function (boardData) {
      io.sockets.in(room).emit('sendMessage', {
        type: 'CREATE_BOARD',
        payload: boardData
      })
    })

    io.sockets.in(room).emit('connectToRoom', 'You are in room-' + room)
    socket.emit('loadMessageHistory', {history: history[room]})
  })

  // 4. socket.io event #4 - sending messages in the room
  socket.on('sendMessage', function (data) {
    // let message = data.message
    // let room = data.roomName
    io.to(room).emit('broadcastMessageToRoom', data)
    history[room].push(data)
  })

  // 5. socket.io event #5 - loading messages and display state for ppl joining the room midway
})

server.listen(PORT, function () {
  console.log(`listening on port ${PORT}`)
})

module.exports = app
