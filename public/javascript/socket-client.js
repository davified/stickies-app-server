/* globals io */
let URL = window.location.href
let socket = io.connect(URL)
var roomName

// 1. socket.io event #1 - connection
socket.on('connectionSuccess', function (data) {
  let confirmationMessage = `Connection success. Welcome user number ${data.totalUsers}`
  console.log(confirmationMessage)
})

// 2. socket.io event #2 - creating rooms
document.getElementById('createRoom').addEventListener('click', function () {
  roomName = document.getElementById('createRoomName').value
  document.getElementById('createRoomName').value = ''

  socket.emit('createRoom', {roomName: roomName})
})

socket.on('connectToRoom', function (data) {
  document.getElementById('roomName').textContent = data
})

// 3. socket.io event #3 - joining a room
document.getElementById('joinRoom').addEventListener('click', function () {
  roomName = document.getElementById('joinRoomName').value
  document.getElementById('joinRoomName').value = ''

  socket.emit('joinRoom', {roomName: roomName})
})

socket.on('loadMessageHistory', function (data) {
  let messages = data.history || []
  messages.forEach(function (element) {
    let node = document.createElement('LI')
    let textnode = document.createTextNode(element)
    node.appendChild(textnode)
    document.getElementById('messages').appendChild(node)
  })
})

// 4. socket.io event #4 - sending messages in the room
document.getElementById('sendMessage').addEventListener('click', function () {
  let message = document.getElementById('message').value
  document.getElementById('message').value = ''

  socket.emit('sendMessage', {room: roomName, message: message})
})

socket.on('broadcastMessageToRoom', function (data) {
  let node = document.createElement('LI')
  let textnode = document.createTextNode(data)
  node.appendChild(textnode)
  document.getElementById('messages').appendChild(node)
})

// 5. socket.io event #5 - loading messages and display state for ppl joining the room midway
