/* globals it, describe */
var io = require('socket.io-client')
const expect = require('chai').expect
const should = require('should')

var socketURL = 'http://0.0.0.0:5000'
var options = {
  transports: ['websocket'],
  'force new connection': true
}

describe('connectionSuccess event', function () {
  let client1 = io.connect(socketURL, options)
  let client2 = io.connect(socketURL, options)

  it('should provide a count of the number of connected users', function (done) {
    client2.on('connectionSuccess', function (data) {
      expect(data).to.be.an('object')
      expect(data.totalUsers).to.equal(2)
      client1.disconnect()
      client2.disconnect()
      done()
    })
  })
})

describe('Connecting to different rooms', function () {
  let client1 = io.connect(socketURL, options)
  let room1 = 'test1'
  let client2 = io.connect(socketURL, options)
  let room2 = 'test2'

  it('should allow connection to different rooms', function (done) {
    client1.on('connectionSuccess', function (data) {
      client1.emit('joinRoom', {roomName: room1})
      client1.on('connectToRoom', function (data) {
        data.should.equal('You are in room-test1')
        client1.disconnect()
        done()
      })
    })
  })

  it('should allow connection to different rooms', function (done) {
    client2.on('connectionSuccess', function (data) {
      client2.emit('joinRoom', {roomName: room2})
      client2.on('connectToRoom', function (data) {
        data.should.equal('You are in room-test2')
        client2.disconnect()
        done()
      })
    })
  })
})

describe('Rooms', function () {
  let client1 = io.connect(socketURL, options)
  let room1 = 'test1'
  let message1 = 'hello i am test user 1'

  it('should broadcast messages only within the room', function (done) {
    client1.on('connectionSuccess', function (data) {
      client1.emit('createRoom', {roomName: room1})
      client1.on('connectToRoom', function (data) {
        client1.emit('sendMessage', {roomName: room1, message: message1})
        client1.on('broadcastMessageToRoom', function (data) {
          expect(data).to.equal(message1)
          done()
        })
      })
    })
  })
})

describe('Chat history', function () {
  let client1 = io.connect(socketURL, options)
  let client2 = io.connect(socketURL, options)
  let room1 = 'test1'
  let message = 'hello i am test user 1'

  it('should display room chat history to users that join midway', function (done) {
    client1.on('connectionSuccess', function (data) {
      client1.emit('createRoom', {roomName: room1})
      client1.on('connectToRoom', function (data) {
        client1.emit('sendMessage', {roomName: room1, message: message})

        client2.emit('joinRoom', {roomName: room1})
        client2.on('loadMessageHistory', function (data) {
          expect(data.history[0]).to.equal(message)

          client1.disconnect()
          client1.disconnect()
        })
      })
    })
    done()
  })
})
