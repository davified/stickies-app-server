// let app = require('./server')
// let server = require('http').Server(app)
// let io = require('socket.io')(server)
// let numberOfConnections = 0
//
// // router.get('/', function (req, res) {
// //   res.json('hello web sockets')
// // })
//
// io.on('connection', function (socket) {
//   numberOfConnections++
//   socket.emit('connectionSuccess', { message: `Welcome user ${numberOfConnections}` })
//   // socket.on('my other event', function (data) {
//   //   console.log(data)
//   // })
// })
//
// var roomno = 1
// io.on('connection', function (socket) {
//   // Increase roomno 2 clients are present in a room.
//   if (io.nsps['/'].adapter.rooms['room-' + roomno] && io.nsps['/'].adapter.rooms['room-' + roomno].length > 1) {
//     roomno++
//   }
//   socket.join('room-' + roomno)
//
//   // Send this event to everyone in the room.
//   io.sockets.in('room-' + roomno).emit('connectToRoom', 'You are in room no. ' + roomno)
// })
//
// module.exports = io
