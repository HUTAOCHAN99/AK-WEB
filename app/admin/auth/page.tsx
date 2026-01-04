'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      setError('Supabase configuration missing')
      setLoading(false)
      return
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_approved, status')
        .eq('id', data.user.id)
        .single()
        
      if (!profile || profile.role !== 'admin' || !profile.is_approved || profile.status !== 'active') {
        await supabase.auth.signOut()
        throw new Error('Access denied. Admin privileges required.')
      }
      
      window.location.href = '/admin/dashboard'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="auth-container">
      <div className="login-card p-8 mx-4">
        <div className="text-center mb-8">
          <Image
            src="/assets/alkhawarizmi.png"
            alt="Logo"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400">KKMI Al-Khawarizmi</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="input-field"
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          {error && (
            <div className="text-red-500 text-sm text-center py-2">{error}</div>
          )}
          
          <div className="text-center text-sm text-gray-400 mt-4">
            Need an admin account?{' '}
            <Link href="/admin/register" className="text-blue-400 hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}