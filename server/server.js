require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./controllers/routes')

app.use(bodyParser.json({
  limit: '50mb'
}))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}))

routes(app)

app.listen(process.env.NODE_SERVER_PORT, () => {
  console.log('Ready to accept requests at port: ' + process.env.NODE_SERVER_PORT)
})
