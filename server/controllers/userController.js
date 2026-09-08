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

export async function signUp(req, res, next) {
  try {
    const email = req.body.user?.email?.trim().toLowerCase()
    const password = req.body.user?.password

    if (!email || !password) {
      return next(new ApiError('Sähköposti ja salasana vaaditaan', 400))
    }

    if (!EMAIL_REGEX.test(email)) {
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

    const existing = await userModel.findByEmail(email)
    if (existing) {
      return next(new ApiError('Sähköposti on jo käytössä', 409))
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await userModel.createUser(email, passwordHash)

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export async function signIn(req, res, next) {
  try {
    const email = req.body.user?.email?.trim().toLowerCase()
    const password = req.body.user?.password

    if (!email || !password) {
      return next(new ApiError('Sähköposti ja salasana vaaditaan', 400))
    }

    const user = await userModel.findByEmail(email)
    if (!user) {
      return next(new ApiError('Väärä sähköposti tai salasana', 401))
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatches) {
      return next(new ApiError('Väärä sähköposti tai salasana', 401))
    }

    const token = signToken(user)

    res.json({ id: user.id, email: user.email, token })
  } catch (error) {
    next(error)
  }
}

export function logout(req, res) {
  res.json({ message: 'Uloskirjautuminen onnistui' })
}
