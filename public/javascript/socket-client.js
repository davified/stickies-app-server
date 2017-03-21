// let socket = io.connect('http://localhost:3000/')
var socket = io()

// 1. socket.io event #1 - connection
socket.on('connectionSuccess', function (data) {
  console.log(data)
})

// 2. socket.io event #2 - creating rooms
document.getElementById('createChannel').addEventListener('click', function () {
  var channelName = document.getElementById('channelName').value
  document.getElementById('channelName').value = ''

  socket.emit('createRoom', {channelName: channelName})

  // socket.on('hi', function (data) {
  //   // document.getElementById('socketMessages')
  //   var node = document.createElement('LI')
  //   var textnode = document.createTextNode(`Namespace: ${channelName}. Message: ${data}`)
  //   node.appendChild(textnode)
  //   document.getElementById('socketMessages').appendChild(node)
  // })
})

socket.on('connectToRoom', function (data) {
  document.getElementById('roomName').textContent = data
})


// 3. socket.io event #3 - sending messages in the room
// 4. socket.io event #4 - loading messages and display state for ppl joining the room midway
