import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/useUser'
import { AuthenticationMode } from './authenticationMode'
import './Authentication.css'

export default function Authentication({ authenticationMode }) {
  const { signUp, signIn } = useUser()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const isSignIn = authenticationMode === AuthenticationMode.SignIn

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isSignIn) {
        await signIn(email, password)
        navigate('/')
      } else {
        await signUp(email, password)
        navigate('/signin')
      }
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message)
    }
  }

  return (
    <div className="auth-screen">
      <h1>{isSignIn ? 'Kirjaudu sisään' : 'Luo tunnus'}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Sähköposti</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Salasana</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isSignIn && (
          <p className="hint">
            Vähintään 8 merkkiä, yksi iso kirjain ja yksi numero.
          </p>
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit">{isSignIn ? 'Kirjaudu' : 'Rekisteröidy'}</button>
      </form>
      <Link to={isSignIn ? '/signup' : '/signin'}>
        {isSignIn ? 'Ei tunnusta? Rekisteröidy' : 'Onko sinulla jo tunnus? Kirjaudu'}
      </Link>
    </div>
  )
}
