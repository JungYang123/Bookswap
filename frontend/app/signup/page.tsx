"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import "../auth.css"     

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [message, setMessage] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (!email.endsWith("@gmu.edu")) {
      setMessage("You must use your Mason email address.")
      return
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.")
      return
    }

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage("Check your GMU email and confirm your account.")
  }

  return (
    <div className="auth-page">

<header className="auth-header">
  <img src="/gmu-logo.jpg" alt="GMU Logo" className="logo" />
  <h2 className="brand">GMUBookSwap</h2>
</header>

      {/* Signup Form */}
      <div className="auth-container">
        <h1 className="title">Create GMUBookSwap Account</h1>

        <form onSubmit={handleSignup}>
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>

        {/* Message + Link to Login */}
        <p className="message">{message}</p>
        <p>
          Already have an account?{" "}
          <Link href="/" className="login-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
