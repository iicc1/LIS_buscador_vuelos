const mysql = require('../helpers/mysql')
const bcrypt = require('bcrypt')
const jwt = require('jwt-simple')

const register = async (email, password, aerolinea) => {
  // En el registro insertamos el email y el hash de la contraseña
  const hash = bcrypt.hashSync(password, 10)
  if (aerolinea) {
    await mysql.query('INSERT INTO aerolineas (nombre, hash) VALUES (?, ?)', [email, hash])
  } else {
    await mysql.query('INSERT INTO users (email, hash) VALUES (?, ?)', [email, hash])
  }
}

const login = async (email, password, aerolinea) => {
  if (!email || !password) {
    throw new Error('No se ha introducido usuario y/o contraseña.')
  }
  // Extraemos los datos del usuario a partir del correo
  let searchResult
  if (aerolinea) {
    searchResult = (await mysql.query('SELECT hash, aerolinea_id FROM aerolineas WHERE nombre = ? LIMIT 1', email))[0]
  } else {
    searchResult = (await mysql.query('SELECT hash, user_id FROM users WHERE email = ? LIMIT 1', email))[0]
  }
  const userId = searchResult.user_id || searchResult.aerolinea_id
  const savedHash = searchResult.hash
  if (!savedHash) {
    throw new Error('El correo introducido no está registrado.')
  }
  // Comprobamos que la contraseña del login, coincide con el hash guardado en la db
  if (bcrypt.compareSync(password, savedHash)) {
    // Si coincide el hash con la contraseña, generamos y enviamos un token de autenticación
    return {
      token: await createToken(userId)
    }
  } else {
    throw new Error('La contraseña no coincide.')
  }
}

// Creación de un token JWT a partir del userId
const createToken = async (userId) => {
  const now = new Date()
  const payload = {
    userId: userId,
    createdAt: now,
    expiresAt: now.setDate(now.getDate() + 7) // Autenticado durante una semana
  }
  return jwt.encode(payload, process.env.TOKEN_KEY)
}

module.exports = {
  register, login
}
