import { useState } from 'react'
import axios from 'axios'
import { UserContext } from './UserContext'

const apiUrl = `${import.meta.env.VITE_API_URL}/api/users`

export default function UserProvider({ children }) {
  const userFromStorage = sessionStorage.getItem('user')
  const [user, setUser] = useState(
    userFromStorage ? JSON.parse(userFromStorage) : null
  )

  const signUp = async (email, password) => {
    await axios.post(`${apiUrl}/signup`, { user: { email, password } })
  }

  const signIn = async (email, password) => {
    const response = await axios.post(`${apiUrl}/signin`, {
      user: { email, password },
    })
    setUser(response.data)
    sessionStorage.setItem('user', JSON.stringify(response.data))
  }

  const logout = async () => {
    try {
      await axios.post(`${apiUrl}/logout`, null, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
    } finally {
      setUser(null)
      sessionStorage.removeItem('user')
    }
  }

  return (
    <UserContext.Provider value={{ user, signUp, signIn, logout }}>
      {children}
    </UserContext.Provider>
  )
}
