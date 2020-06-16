const mysql = require('../helpers/mysql')

const cancelar = async (codigoReserva, usuarioId) => {
  // Sacamos el id de compra del pasajero para posteriormente saber a que vuelo corresponde y si está autorizado
  const datosPasajero = (await mysql.query('SELECT compra_id FROM pasajeros WHERE cod_reserva = ?', codigoReserva))[0]
  const datosCompra = (await mysql.query('SELECT * FROM compras WHERE compra_id = ? AND usuario_id = ?', [datosPasajero.compra_id, usuarioId]))[0]
  // Si el usuario que compró el billete no coincide con el que intenta cancelarlo mediante el código de reserva, no dar permiso
  if (!datosCompra) {
    throw new Error('Este código de reserva no te pertenece.')
  }
  // Una vez comprobado que el usuario que quiere cancelar es el mismo usuario que lo compró, podemos borrar la fila de pasajeros
  await mysql.query('DELETE FROM pasajeros WHERE cod_reserva = ?', codigoReserva)
  // A continuación añadimos un billete en el vuelo y categoría que corresponda ya que hay una plaza extra libre
  if (datosCompra.npas_businnes > 0) {
    await mysql.query('UPDATE vuelos SET plazas_businnes = plazas_businnes + 1 WHERE vuelo_id = ?', datosCompra.vuelo_id)
  } else if (datosCompra.npas_optima > 0) {
    await mysql.query('UPDATE vuelos SET plazas_optima = plazas_optima + 1 WHERE vuelo_id = ?', datosCompra.vuelo_id)
  } else if (datosCompra.npas_economy > 0) {
    await mysql.query('UPDATE vuelos SET plazas_economy = plazas_economy + 1 WHERE vuelo_id = ?', datosCompra.vuelo_id)
  }
  return 'Compra cancelada.'
}

module.exports = cancelar
