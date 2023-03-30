const jwt = require('jwt-simple')
const config = require('../Config/config')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.token.split(' ')[1]
    const decode = jwt.decode(token, config.jwtSecret)
    const userId = decode.id
    req.auth = {
      userId: userId,
    }
    next()
    console.log(req.auth)
  } catch (err) {
    res.status(401).json({ message: 'Token invalide', error: err })
  }
}
