/* globals io */
// let socket = io.connect('http://localhost:3000/')
var socket = io()
var channelName

// 1. socket.io event #1 - connection
socket.on('connectionSuccess', function (data) {
  console.log(data)
})

// 2. socket.io event #2 - creating rooms
document.getElementById('createChannel').addEventListener('click', function () {
  channelName = document.getElementById('channelName').value
  document.getElementById('channelName').value = ''

  socket.emit('createRoom', {channelName: channelName})
})

socket.on('connectToRoom', function (data) {
  document.getElementById('roomName').textContent = data
})

// 3. socket.io event #3 - sending messages in the room
document.getElementById('sendMessage').addEventListener('click', function () {
  var message = document.getElementById('message').value
  document.getElementById('message').value = ''

  socket.emit('sendMessage', {room: channelName, message: message})
})

socket.on('broadcastMessageToRoom', function (data) {
  var node = document.createElement('LI')
  var textnode = document.createTextNode(data)
  node.appendChild(textnode)
  document.getElementById('messages').appendChild(node)
})

// 4. socket.io event #4 - loading messages and display state for ppl joining the room midway
