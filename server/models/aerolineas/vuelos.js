const mysql = require('../../helpers/mysql')

const vuelos = async (aerolineaId) => {
  return mysql.query('SELECT * FROM vuelos WHERE aerolinea_id = ?', aerolineaId)
}

module.exports = vuelos
