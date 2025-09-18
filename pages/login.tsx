import { useState } from 'react'
import { useRouter } from 'next/router'

/**
 * Login page. Stores a token in localStorage to simulate authentication.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, call an API to authenticate.
    localStorage.setItem('cashpe-token', btoa(email))
    router.push('/')
  }
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full glass rounded-md h-10 px-3"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full glass rounded-md h-10 px-3"
            required
          />
        </div>
        <button
          type="submit"
          className="h-10 px-4 rounded-md bg-emerald-500 text-black font-medium w-full"
        >
          Sign in
        </button>
        <p className="text-sm text-neutral-300 text-center">
          New user?{' '}
          <a href="/signup" className="text-emerald-400 hover:underline">
            Create an account
          </a>
        </p>
      </form>
    </div>
  )
}