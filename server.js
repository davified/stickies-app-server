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

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`)
})

module.exports = app
