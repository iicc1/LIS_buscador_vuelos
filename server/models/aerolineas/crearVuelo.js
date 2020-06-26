const mysql = require('../../helpers/mysql')

const crearVuelo = async (datos, aerolineaId) => {
  if (!datos.vuelo || !datos.origen || !datos.destino || !datos.salida || !datos.llegada || !datos.precio_business ||
      !datos.precio_optima || !datos.precio_economy || !datos.plazas_business || !datos.plazas_optima || !datos.plazas_economy) {
    throw new Error('Faltan campos')
  }

  await mysql.query('INSERT INTO vuelos (aerolinea_id, vuelo, origen, destino, salida, llegada, precio_business, precio_optima, precio_economy,' +
     'plazas_business, plazas_optima, plazas_economy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [aerolineaId, datos.vuelo, datos.origen, datos.destino,
    datos.salida, datos.llegada, datos.precio_business, datos.precio_optima, datos.precio_economy, datos.plazas_business, datos.plazas_optima, datos.plazas_economy])

  return 'Vuelo creado.'
}

module.exports = crearVuelo
