'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (authError) throw authError
      
      if (!data.user) {
        throw new Error('Login failed - no user data')
      }
      
      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_approved, status, full_name, email')
        .eq('id', data.user.id)
        .single()
        
      if (profileError) {
        console.error('Profile error:', profileError)
        await supabase.auth.signOut()
        throw new Error('Profile not found. Please contact admin.')
      }
      
      // Debug logging
      console.log('Login attempt - Profile data:', {
        id: data.user.id,
        email: data.user.email,
        profile: profile,
        hasProfile: !!profile,
        isAdmin: profile?.role === 'admin',
        isApproved: profile?.is_approved,
        status: profile?.status
      })
      
      if (!profile) {
        await supabase.auth.signOut()
        throw new Error('Profile not found. Please register first.')
      }
      
      if (profile.role !== 'admin') {
        await supabase.auth.signOut()
        throw new Error('Access denied. Admin privileges required.')
      }
      
      if (!profile.is_approved) {
        await supabase.auth.signOut()
        throw new Error('Account not yet approved. Please wait for admin verification.')
      }
      
      if (profile.status !== 'active') {
        await supabase.auth.signOut()
        throw new Error(`Account is ${profile.status}. Please contact admin for assistance.`)
      }
      
      // Login successful - redirect to dashboard
      router.push('/admin/dashboard')
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Login error:', error)
      
      // User-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        setError('Email atau password salah')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Email belum dikonfirmasi. Silakan cek email Anda.')
      } else if (error.message.includes('not yet approved')) {
        setError('Akun belum disetujui oleh Admin Ketua. Silakan tunggu verifikasi.')
      } else if (error.message.includes('Profile not found')) {
        setError('Akun tidak ditemukan. Silakan registrasi terlebih dahulu.')
      } else if (error.message.includes('Admin privileges required')) {
        setError('Hanya admin yang dapat mengakses halaman ini.')
      } else {
        setError(error.message || 'Login gagal. Silakan coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/assets/alkhawarizmi.webp"
                alt="Logo"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-400">KKMI Al-Khawarizmi</p>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-400"
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-400"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Logging in...
                </span>
              ) : 'Login'}
            </button>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-medium">{error}</span>
                    {error.includes('belum disetujui') && (
                      <p className="text-xs text-red-300 mt-1">
                        Silakan tunggu verifikasi dari Admin Ketua. Cek email untuk pemberitahuan.
                      </p>
                    )}
                    {error.includes('tidak ditemukan') && (
                      <p className="text-xs text-red-300 mt-1">
                        Registrasi terlebih dahulu di halaman registrasi.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center pt-4 border-t border-gray-700">
              <p className="text-gray-400 mb-2">
                Belum punya akun?{' '}
                <Link href="/admin/auth/register" className="text-primary hover:text-primary-light font-medium transition duration-300">
                  Daftar disini
                </Link>
              </p>
              <p className="text-gray-400 text-sm">
                <Link href="/" className="hover:text-gray-300 transition duration-300">
                  ← Kembali ke Beranda
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}