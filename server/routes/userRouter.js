import { Router } from 'express'
import { signUp, signIn, logout } from '../controllers/userController.js'
import auth from '../helper/auth.js'

const router = Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/logout', auth, logout)

export default router
