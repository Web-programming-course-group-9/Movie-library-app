import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ApiError from '../helper/ApiError.js'
import * as userModel from '../models/userModel.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

export async function register(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new ApiError('Sähköposti ja salasana vaaditaan', 400))
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return next(new ApiError('Virheellinen sähköpostiosoite', 400))
    }

    if (!PASSWORD_REGEX.test(password)) {
      return next(
        new ApiError(
          'Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältää iso kirjain ja numero',
          400
        )
      )
    }

    const existing = await userModel.findByEmail(normalizedEmail)
    if (existing) {
      return next(new ApiError('Sähköposti on jo käytössä', 409))
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await userModel.createUser(normalizedEmail, passwordHash)
    const token = signToken(user)

    res.status(201).json({ token, user })
  } catch (error) {
    next(error)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new ApiError('Sähköposti ja salasana vaaditaan', 400))
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await userModel.findByEmail(normalizedEmail)

    if (!user) {
      return next(new ApiError('Väärä sähköposti tai salasana', 401))
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatches) {
      return next(new ApiError('Väärä sähköposti tai salasana', 401))
    }

    const token = signToken(user)

    res.json({
      token,
      user: { id: user.id, email: user.email, created_at: user.created_at },
    })
  } catch (error) {
    next(error)
  }
}

export function logout(req, res) {
  res.json({ message: 'Uloskirjautuminen onnistui' })
}
