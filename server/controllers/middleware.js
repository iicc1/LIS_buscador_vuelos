const jwt = require('jwt-simple')

const checkToken = (request, response, next) => {
  // Extrae el token de los headers de la petición
  const token = request.headers['auth-token']
  if (!token) {
    return response.json({
      success: false,
      message: 'No se ha encontrado el header de autenticación Auth-Token.'
    })
  }

  // Comprueba que el token tiene un valor válido y desencripta los parámetros que contiene
  let payload
  try {
    payload = jwt.decode(token, process.env.TOKEN_KEY)
  } catch (error) {
    return response.json({
      success: false,
      message: 'Token incorrecto'
    })
  }

  console.log(payload)

  // Comprueba que el token no haya expirado
  if (new Date().getTime() > payload.expiresAt) {
    return response.json({
      success: false,
      message: 'El token ha expirado.'
    })
  }
  // Incluye en la request, la variable que está dentro del token, ya desencriptada
  request.userId = payload.userId
  next()
}

module.exports = {
  checkToken: checkToken
}
