"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import Image from "next/image"
import "./auth.css"

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (!email.endsWith("@gmu.edu")) {
      setMessage("You must use your Mason email address.")
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else {
      setMessage("Login successful! Redirecting...")
      // Use window.location for full page reload to ensure clean state
      window.location.href = "/listing"
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Image
          src="/gmu-logo.jpg"
          alt="GMU Logo"
          width={40}
          height={40}
          className="logo"
        />
        <h2 className="brand">GMUBookSwap</h2>
      </header>

      <div className="auth-container">
        <h1 className="title">GMUBookSwap Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="GMU Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p className="message">{message}</p>
        <p>
          Don’t have an account? <Link href="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  )
}
