var should = require('should')
var io = require('socket.io-client')

var socketURL = 'http://0.0.0.0:5000'
var options = {
  transports: ['websocket'],
  'force new connection': true
}

var chatUser1 = {'name': 'Tom'}
var chatUser2 = {'name': 'Sally'}
var chatUser3 = {'name': 'Dana'}

describe('Connecting new users', function () {
  it('should provide a count of the number of connected users', function (done) {
    var client1 = io.connect(socketURL, options)
    var client2 = io.connect(socketURL, options)

    client1.on('connectionSuccess', function (data) {
      data.should.be.an.object()
      data.message.should.be.equal('Connection success. Welcome user number 1')
    })

    client2.on('connectionSuccess', function (data) {
      data.should.be.an.object()
      data.message.should.be.equal('Connection success. Welcome user number 2')
    })
    done()
  })
})
