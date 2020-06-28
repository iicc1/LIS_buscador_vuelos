const middleware = require('./middleware')
const auth = require('../models/auth')
const clientes = {
  comprar: require('../models/clientes/comprar'),
  compras: require('../models/clientes/compras'),
  cancelar: require('../models/clientes/cancelar'),
  vuelos: require('../models/clientes/vuelos')
}
const aerolineas = {
  vuelos: require('../models/aerolineas/vuelos'),
  crearVuelo: require('../models/aerolineas/crearVuelo')
}

const router = app => {
  // Ruta para comprobar si la API está funcionando
  app.get('/test', async (request, response) => {
    const reply = {}
    reply.success = true
    response.send(reply)
  })

  // Rutas de autenticación
  app.post('/registro', async (request, response) => {
    const reply = {}
    try {
      reply.success = true
      reply.result = await auth.register(request.body.email, request.body.password, request.body.aerolinea)
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
      reply.result = await auth.login(request.body.email, request.body.password, request.body.aerolinea)
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

  // Rutas de clientes
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
      reply.result = await clientes.vuelos(queryData)
    } catch (error) {
      reply.success = false
      reply.message = error.message
    }
    response.send(reply)
  })

  app.post('/comprar', middleware.checkToken, async (request, response) => {
    const reply = {}
    try {
      reply.success = true
      reply.result = await clientes.comprar(request.body.pasajero, request.body.categoria, request.body.vueloId, request.userId)
    } catch (error) {
      console.log(error)
      reply.success = false
      reply.message = error.message
    }
    response.send(reply)
  })

  app.get('/compras', middleware.checkToken, async (request, response) => {
    const reply = {}
    try {
      reply.success = true
      reply.result = await clientes.compras(request.userId)
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
      reply.result = await clientes.cancelar(request.params.codigoReserva, request.userId)
    } catch (error) {
      console.log(error)
      reply.success = false
      reply.message = error.message
    }
    response.send(reply)
  })

  // Rutas de aerolíneas
  app.get('/aerolineas/vuelos', middleware.checkToken, async (request, response) => {
    const reply = {}
    try {
      reply.success = true
      reply.result = await aerolineas.vuelos(request.userId)
    } catch (error) {
      reply.success = false
      reply.message = error.message
    }
    response.send(reply)
  })

  app.post('/aerolineas/crear', middleware.checkToken, async (request, response) => {
    const reply = {}
    try {
      reply.success = true
      reply.result = await aerolineas.crearVuelo(request.body, request.userId)
    } catch (error) {
      reply.success = false
      reply.message = error.message
    }
    response.send(reply)
  })
}

module.exports = router
