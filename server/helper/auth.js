import jwt from 'jsonwebtoken'
import ApiError from './ApiError.js'

export default function auth(req, res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError('Kirjautuminen vaaditaan', 401))
  }

  const token = header.slice('Bearer '.length)

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    next(new ApiError('Virheellinen tai vanhentunut token', 401))
  }
}
