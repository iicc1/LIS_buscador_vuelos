const mysql = require('../helpers/mysql')

const compras = async (usuarioId) => {
  const compras = await mysql.query('SELECT * FROM pasajeros INNER JOIN compras ON pasajeros.compra_id = compras.compra_id INNER JOIN vuelos ON compras.vuelo_id = vuelos.vuelo_id WHERE pasajeros.usuario_id = ?', usuarioId)
  return compras
}

module.exports = compras
