import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext(null)

// Fonction pour décoder et récupérer l'utilisateur du token
function getUserFromToken() {
  const token = localStorage.getItem('token')
  if (!token) return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { 
      id: payload.userId, 
      email: payload.email,
      role: payload.role 
    }
  } catch (error) {
    console.error('Invalid token:', error)
    localStorage.removeItem('token')
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUserFromToken)

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('token', data.token)
      const payload = JSON.parse(atob(data.token.split('.')[1]))
      const userData = { 
        id: payload.userId, 
        email: payload.email,
        role: payload.role 
      }
      setUser(userData)
      return { success: true, user: userData }
    } else {
      return { success: false, message: data.message || 'Login failed' }
    }
  }

  const register = async (email, password, role = 'player') => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('token', data.token)
      const payload = JSON.parse(atob(data.token.split('.')[1]))
      const userData = { 
        id: payload.userId, 
        email: payload.email,
        role: payload.role 
      }
      setUser(userData)
      return { success: true, user: userData }
    } else {
      return { success: false, message: data.message || 'Registration failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
