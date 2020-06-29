const mysql = require('../../helpers/mysql')

const comprar = async (compras, categoria, vueloId, usuarioId) => {
  // Compras debe ser un array y debe tener al menos 1 elemento
  if (!compras) {
    throw new Error('Array compras no encontrado')
  } else if (!compras[0]) {
    throw new Error('El parámetro compras no es un array o está vacío')
  }

  // Creamos un código de compra aleatorio, para poder relacionar el billete comprado con la compra
  const codigoCompra = random(0, 2147483648)
  // Sacamos los datos del vuelo ya que necesitamos usar esta información para la tabla compras
  const datosVuelo = (await mysql.query('SELECT * FROM vuelos WHERE vuelo_id = ?', vueloId))[0]

  // Operaciones con la tabla vuelos y compras
  if (categoria === 'optima') {
    // Resta el billete a la tabla vuelos
    await mysql.query('UPDATE vuelos SET plazas_optima = plazas_optima - ? WHERE vuelo_id = ?', [compras.length, vueloId])
    // Añade la compra del billete a la tabla compras
    await mysql.query('INSERT INTO compras (compra_id, usuario_id, fecha_compra, fecha_vuelo, vuelo_id, npas_optima) ' +
      'VALUES (?, ?, ?, ?, ?, ?)', [codigoCompra, usuarioId, new Date(), new Date(Date.parse(datosVuelo.salida)), vueloId, compras.length])
  } else if (categoria === 'business') {
    // Resta el billete a la tabla vuelos
    await mysql.query('UPDATE vuelos SET plazas_business = plazas_business - ? WHERE vuelo_id = ?', [compras.length, vueloId])
    // Añade la compra del billete a la tabla compras
    await mysql.query('INSERT INTO compras (compra_id, usuario_id, fecha_compra, fecha_vuelo, vuelo_id, npas_business) ' +
      'VALUES (?, ?, ?, ?, ?, ?)', [codigoCompra, usuarioId, new Date(), new Date(Date.parse(datosVuelo.salida)), vueloId, compras.length])
  } else if (categoria === 'economy') {
    // Resta el billete a la tabla vuelos
    await mysql.query('UPDATE vuelos SET plazas_economy = plazas_economy - ? WHERE vuelo_id = ?', [compras.length, vueloId])
    // Añade la compra del billete a la tabla compras
    await mysql.query('INSERT INTO compras (compra_id, usuario_id, fecha_compra, fecha_vuelo, vuelo_id, npas_economy) ' +
      'VALUES (?, ?, ?, ?, ?, ?)', [codigoCompra, usuarioId, new Date(), new Date(Date.parse(datosVuelo.salida)), vueloId, compras.length])
  } else {
    throw new Error('Campo categoria no reconocido.')
  }

  // Creamos un array donde irán los códigos de reserva de los billetes
  const codigosReserva = []

  // Iteramos por el array compras recibido. Esta información se insertará en la tabla pasajeros
  for (const compra of compras) {
    if (!compra.nombre) {
      throw new Error('Falta por enviar el campo nombre')
    } else if (!compra.apellidos) {
      throw new Error('Falta por enviar el campo apellidos')
    }

    // Generamos un código de reserva aleatiorio y lo metemos en el array que será devuelto al cliente.
    const codigoReserva = random(0, 2147483648)
    codigosReserva.push({
      nombreYapellidos: compra.apellidos + ', ' + compra.nombre,
      codigoReserva: codigoReserva
    })
    // Añade los datos del billete en la tabla pasajeros
    await mysql.query('INSERT INTO pasajeros (compra_id, cod_reserva, nombre, apellidos) VALUES (?, ?, ?, ?)', [codigoCompra, codigoReserva, compra.nombre, compra.apellidos])
  }
  // Devolvemos el código de compra y de reserva, por si se quiere cancelar el billete
  return {
    codigoCompra: codigoCompra,
    codigosReserva: codigosReserva
  }
}

const random = (lower, upper) => {
  return Math.floor(Math.random() * upper) + lower
}

module.exports = comprar
