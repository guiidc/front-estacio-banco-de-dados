'use client'

import {ReactNode, useEffect, useState} from "react";
import {useAuth} from "@/app/hooks/useAuth";
import {useRouter} from "next/navigation";

interface Props {
  children: ReactNode
}

export default function PrivateRoute({children}: Props) {
  const router = useRouter()
  const {user, loadUserFromToken} = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  const checkUser = () => {
    try {
      setLoading(true)
      const isLogged = loadUserFromToken()

      if (!isLogged) {
        router.push('/login')
        return
      }

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUser()

  }, []);

  if (!loading && user) return children

  return null

}