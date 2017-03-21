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

// wiring up the router
app.use('/', router)

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

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html')
})

io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
})

server.listen(PORT, function () {
  console.log(`listening on port ${PORT}`)
})

module.exports = app
