const comprar = require('../models/comprar')
const vuelos = require('../models/vuelos')

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

  app.get('/comprar', async (request, response) => {
    const reply = {}
    reply.success = true
    response.send(reply)
  })

  app.post('/login', async (request, response) => {
    const reply = {}
    reply.success = true
    response.send(reply)
  })

  app.post('/registro', async (request, response) => {
    const reply = {}
    reply.success = true
    response.send(reply)
  })
}

module.exports = router
