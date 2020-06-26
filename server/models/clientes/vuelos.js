const mysql = require('../../helpers/mysql')

const vuelos = async (queryData) => {
  console.log('Datos entrantes', queryData)

  if (!queryData.pasajeros) {
    throw new Error('Falta el campo pasajeros')
  }
  if (!queryData.idaYvuelta) {
    throw new Error('Falta el campo idaYvuelta')
  }

  // Si es ida y vuelta, necesitamos saber el origen, destino, salida y llegada
  if (queryData.idaYvuelta === true) {
    if (!queryData.origen || !queryData.destino || !queryData.salida || !queryData.llegada) {
      throw new Error('Falta algún campo. Estos son los datos recibidos: ' + JSON.stringify(queryData))
    }
  // Si es solo ida, es suficiente con saber el origen, destino y la salida
  } else {
    if (!queryData.origen || !queryData.destino || !queryData.salida) {
      throw new Error('Falta algún campo. Estos son los datos recibidos: ' + JSON.stringify(queryData))
    }
  }

  // Tanto para ida y vuelta como para solo ida, necesitamos saber las salidas
  let salidas = await mysql.query('SELECT vuelo_id AS vueloId, vuelo, filtro_pasajeros.aerolinea_id, origen, destino, salida, llegada, precio_business, precio_optima, precio_economy, plazas_business, plazas_optima, plazas_economy, aerolineas.codigo AS codigo_aerolinea, aerolineas.nombre AS nombre_aerolinea ' +
  'FROM (SELECT * FROM vuelos WHERE plazas_business >= ? OR plazas_optima >= ? OR plazas_economy >= ?) AS filtro_pasajeros ' +
  'INNER JOIN aerolineas ON aerolineas.aerolinea_id = filtro_pasajeros.aerolinea_id WHERE origen = ? AND destino = ? AND salida LIKE ?',
  [queryData.pasajeros, queryData.pasajeros, queryData.pasajeros, queryData.origen, queryData.destino, queryData.salida + '%'])

  // Las llegadas se calculan como las idas pero cambiando el origen y destino de sitio y cambiando la fecha de salida por llegada
  let llegadas
  if (queryData.idaYvuelta === 'true') {
    llegadas = await mysql.query('SELECT vuelo_id AS vueloId, vuelo, filtro_pasajeros.aerolinea_id, origen, destino, salida, llegada, precio_business, precio_optima, precio_economy, plazas_business, plazas_optima, plazas_economy, aerolineas.codigo AS codigo_aerolinea, aerolineas.nombre AS nombre_aerolinea ' +
    'FROM (SELECT * FROM vuelos WHERE plazas_business >= ? OR plazas_optima >= ? OR plazas_economy >= ?) AS filtro_pasajeros ' +
    'INNER JOIN aerolineas ON aerolineas.aerolinea_id = filtro_pasajeros.aerolinea_id WHERE origen = ? AND destino = ? AND salida LIKE ?',
    [queryData.pasajeros, queryData.pasajeros, queryData.pasajeros, queryData.destino, queryData.origen, queryData.llegada + '%'])
  }

  console.log(salidas.length)

  // Eliminar los resultados con menor número de plazas requerido
  llegadas = filtrarVuelosPorPlazas(llegadas, queryData.pasajeros)
  salidas = filtrarVuelosPorPlazas(salidas, queryData.pasajeros)

  return {
    salidas: salidas,
    llegadas: llegadas
  }
}

const filtrarVuelosPorPlazas = (vuelos, pasajeros) => {
  for (const vuelo in vuelos) {
    if (vuelos[vuelo].plazas_business < pasajeros) {
      delete vuelos[vuelo].plazas_business
      delete vuelos[vuelo].precio_business
    }
    if (vuelos[vuelo].plazas_optima < pasajeros) {
      delete vuelos[vuelo].plazas_optima
      delete vuelos[vuelo].precio_optima
    }
    if (vuelos[vuelo].plazas_economy < pasajeros) {
      delete vuelos[vuelo].plazas_economy
      delete vuelos[vuelo].precio_economy
    }
  }
  return vuelos
}

module.exports = vuelos
