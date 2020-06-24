const middleware = require('./middleware')
const comprar = require('../models/comprar')
const cancelar = require('../models/cancelar')
const vuelos = require('../models/vuelos')
const auth = require('../models/auth')

const router = app => {
  app.get('/', async (request, response) => {
    const reply = {}
    reply.success = true
    response.send(reply)
  })

  // La información de cada vuelo deberá contener el número de plazas disponibles en cada clase.
  app.get('/vuelos', async (request, response) => {
    const queryData = {
      idaYvuelta: request.query.idaYvuelta,
      pasajeros: request.query.pasajeros,
      origen: request.query.origen,
      destino: request.query.destino,
      salida: request.query.salida,
      llegada: request.query.llegada
    }
    const reply = {}
    try {
      reply.success = true
      reply.result = await vuelos(queryData)
    } catch (error) {
      console.log(error.message)
      reply.success = false
      reply.message = error.message
    }
    response.send(reply)
  })

  app.post('/comprar', middleware.checkToken, async (request, response) => {
    const reply = {}
    try {
      reply.success = true
      reply.result = await comprar(request.body.pasajero, request.body.categoria, request.body.vueloId, request.userId)
    } catch (error) {
      console.log(error)
      reply.success = false
      reply.message = error.message
    }
    response.send(reply)
  })

  app.get('/cancelar/:codigoReserva', middleware.checkToken, async (request, response) => {
    const reply = {}
    try {
      reply.success = true
      reply.result = await cancelar(request.params.codigoReserva, request.userId)
    } catch (error) {
      console.log(error)
      reply.success = false
      reply.message = error.message
    }
    response.send(reply)
  })

  app.post('/registro', async (request, response) => {
    const reply = {}
    try {
      reply.success = true
      reply.result = await auth.register(request.body.email, request.body.password)
    } catch (error) {
      reply.success = false
      reply.message = error.message
    }
    response.send(reply)
  })

  app.post('/login', async (request, response) => {
    const reply = {}
    try {
      reply.success = true
      reply.result = await auth.login(request.body.email, request.body.password)
    } catch (error) {
      reply.success = false
      reply.message = error.message
    }
    response.send(reply)
  })

  // Ruta con middleware para probar la autenticación del token
  app.get('/testToken', middleware.checkToken, async (request, response) => {
    console.log(request.userId)
    response.send('El userId es: ' + request.userId)
  })
}

module.exports = router
