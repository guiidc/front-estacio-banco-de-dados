'use client'

import {createContext, ReactNode, useContext, useState} from "react";
import api from "@/app/services/api";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";

interface User {
  email: string
  name: string
}

interface AuthContextValue {
  authenticate: (email: string, password: string) => void
  loadUserFromToken: () => boolean
  user: User | null
  logout: () => void
}

const authContext = createContext<AuthContextValue>({} as AuthContextValue);

interface Props {
  children: ReactNode
}

export default function AuthProvider({children}: Props) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [fetchingUser, setFetchingUser] = useState<boolean>(false)

  const saveAccessToken = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken)
  }

  const getAccessToken = () => {
    return localStorage.getItem('accessToken')
  }

  const removeAccessToken = () => {
    localStorage.removeItem('accessToken')
  }

  const extractClaimsFromToken = (token: string) => {
    return jwtDecode<User>(token)
  }

  const authenticate = async (email: string, password: string) => {
    try {
      setFetchingUser(true)
      const response = await api.post('/users/authenticate', {email, password})
      const accessToken = response.headers['x-access-token']
      const tokenClaims = extractClaimsFromToken(accessToken)
      setUser(tokenClaims)
      saveAccessToken(accessToken)
    } catch (err) {
      removeAccessToken()
      if (err.isAxiosError && err?.response?.data?.message) {
        throw new Error(err.response.data.message)
      }
      throw new Error('Algo deu errado ao tentar autenticar. Tente novamente em alguns instantes.')
    } finally {
      setFetchingUser(false)
    }
  }

  const loadUserFromToken = () => {
    setFetchingUser(true)
    try {
      const accessToken = getAccessToken()
      if (!accessToken) {
        setFetchingUser(false)
        return false
      }
      const tokenClaims = extractClaimsFromToken(accessToken)
      setUser(tokenClaims)
      setFetchingUser(false)
      return true
    } catch (err) {
      removeAccessToken()
      setFetchingUser(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    removeAccessToken()
    router.push('/login')
  }

  const contextValue: AuthContextValue = {
    authenticate,
    user,
    loadUserFromToken,
    logout,
  }
  return (
      <authContext.Provider value={contextValue}>
        {fetchingUser ? <span>Carregando...</span> : children}
      </authContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(authContext);
}