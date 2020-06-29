const mysql = require('../../helpers/mysql')

const vuelos = async (aerolineaId) => {
  const compras = await mysql.query('SELECT vuelo_id, SUM(npas_business) AS compras_business, SUM(npas_optima) AS compras_optima, ' +
    'SUM(npas_economy) AS compras_economy FROM compras GROUP BY vuelo_id')

  const vuelos = await mysql.query('SELECT * FROM vuelos WHERE aerolinea_id = ?', aerolineaId)

  for (const compra of compras) {
    for (const vuelo in vuelos) {
      if (compra.vuelo_id === vuelos[vuelo].vuelo_id) {
        vuelos[vuelo].compras_business = compra.compras_business
        vuelos[vuelo].compras_optima = compra.compras_optima
        vuelos[vuelo].compras_economy = compra.compras_economy
      }
    }
  }
  return vuelos
}

module.exports = vuelos
