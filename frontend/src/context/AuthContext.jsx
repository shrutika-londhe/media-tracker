import React, { createContext, useContext, useState, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('mt_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    persistSession(data)
    return data
  }, [])

  const register = useCallback(async (displayName, email, password) => {
    const { data } = await api.post('/auth/register', { displayName, email, password })
    persistSession(data)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('mt_token')
    localStorage.removeItem('mt_user')
    setUser(null)
  }, [])

  function persistSession(data) {
    const sessionUser = { id: data.userId, displayName: data.displayName, email: data.email }
    localStorage.setItem('mt_token', data.token)
    localStorage.setItem('mt_user', JSON.stringify(sessionUser))
    setUser(sessionUser)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
