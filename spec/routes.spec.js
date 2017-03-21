let expect = require('chai').expect
let assert = require('assert')
let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let server = require('../server.js')
chai.use(chaiHttp)

describe('GET /', function () {
  it('should return hello web sockets', function (done) {
    chai.request(server)
			.get('/')
			.end((err, res) => {
		  res.should.have.status(200)
		  res.body.should.equal('hello web sockets')
		  done()
})
  })
})
