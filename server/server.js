const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '/.env') })
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const routes = require('./controllers/routes')

app.use(bodyParser.json({
  limit: '50mb'
}))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}))
app.use(cors())

routes(app)

app.listen(process.env.NODE_SERVER_PORT, () => {
  console.log('Ready to accept requests at port: ' + process.env.NODE_SERVER_PORT)
})
