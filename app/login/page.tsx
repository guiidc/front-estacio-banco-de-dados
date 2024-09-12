'use client'

import styles from './styles.module.scss';
import InputComponent from "@/app/components/Shared/InputComponent";
import ButtonComponent from "@/app/components/Shared/ButtonComponent";
import Link from "next/link";
import Alert from "@/app/components/Shared/Alert";
import {useRouter} from "next/navigation";
import {ChangeEvent, FormEvent, useState} from "react";
import {useAuth} from "@/app/hooks/useAuth";
import validator from 'validator';

interface LoginData {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()

  const [loginData, setLoginData] = useState<LoginData>({email: '', password: ''})
  const [formError, setFormError] = useState<string>('')

  const {authenticate} = useAuth()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setLoginData({...loginData, [name]: value})
  }

  const validateFields = () => {
    if (!validator.isEmail(loginData.email)) {
      setFormError('Email inválido')
      return false
    }

    if (loginData.password.length === 0) {
      setFormError('O campo senha é obrigatório')
      return false
    }

    setFormError('')
    return true
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateFields()) return

    try {
      await authenticate(loginData.email, loginData.password)
      router.push('/')
    } catch (err) {
      console.log("ERRO AQUI", err.message)
      setFormError(err.message)
    }
  }

  return (
      <main className={styles.main}>
        <ul className={styles.circles}>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div className={styles.loginContainer}>
          <div className={styles.titleContainer}>
            <h1>VLL Serigrafia</h1>
          </div>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <h4>Login</h4>
            <InputComponent type="text" placeholder="Usuário" name="email" onChange={handleChange}
                            value={loginData.email}/>
            <InputComponent type="password" placeholder="Senha" name="password" onChange={handleChange}
                            value={loginData.password}/>
            {formError && <Alert message={formError}/>}
            <Link href={"/login"}>Esqueci minha senha</Link>
            <ButtonComponent>Entrar</ButtonComponent>
          </form>
        </div>
      </main>
  )
}