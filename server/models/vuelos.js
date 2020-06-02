const mysql = require('../helpers/mysql')

const vuelos = async (queryData) => {
  let vuelos
  if (!queryData.pasajeros) {
    throw new Error('Falta el campo pasajeros')
  }
  // Si es ida y vuelta, necesitamos saber el origen, destino, salida y llegada
  if (queryData.idaYvuelta) {
    if (!queryData.origen || !queryData.destino || !queryData.salida || !queryData.llegada) {
      throw new Error('Falta algún campo. Estos son los datos recibidos: ' + JSON.stringify(queryData))
    } else {
      vuelos = await mysql.query('SELECT * FROM vuelos WHERE origen = ? AND destino = ? AND salida >= ? AND salida < ? AND llegada => ? AND llegada < ?')
    }
  // Si es solo ida, es suficiente con saber el origen y la salida
  } else {
    if (!queryData.origen || !queryData.salida) {
      throw new Error('Falta algún campo. Estos son los datos recibidos: ' + JSON.stringify(queryData))
    } else {
      vuelos = await mysql.query('SELECT * FROM vuelos WHERE origen = ? AND salida >= ? AND salida < ?')
    }
  }

  // Eliminar los resultados con menor número de plazas requerido
  const vuelosFiltrados = []
  for (const vuelo in vuelos) {
    if (vuelo.plazas_business > queryData.pasajeros) {
      vuelosFiltrados.push(vuelo)
    }
    if (vuelo.plazas_business > queryData.pasajeros) {
      vuelosFiltrados.push(vuelo)
    }
    if (vuelo.plazas_business > queryData.pasajeros) {
      vuelosFiltrados.push(vuelo)
    }
  }

  return vuelosFiltrados
}

module.exports = vuelos
