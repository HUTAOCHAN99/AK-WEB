'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    reason: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }
    
    if (!formData.reason.trim()) {
      setError('Harap isi alasan ingin menjadi admin')
      return
    }
    
    setLoading(true)
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      setError('Konfigurasi Supabase tidak ditemukan')
      setLoading(false)
      return
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: 'admin'
          }
        }
      })
      
      if (authError) throw authError
      
      if (!authData.user) {
        throw new Error('Registrasi gagal')
      }
      
      console.log('User created:', authData.user.id)
      
      // Tunggu sebentar untuk memastikan trigger berjalan
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Cek apakah profile sudah ada
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', authData.user.id)
        .maybeSingle()
      
      console.log('Existing profile check:', { existingProfile, checkError })
      
      if (checkError && !checkError.message.includes('PGRST116')) {
        // Error selain "no rows returned"
        console.error('Profile check error:', checkError)
      }
      
      // Buat profile data
      const profileData = {
        id: authData.user.id,
        full_name: formData.full_name,
        email: formData.email,
        role: 'admin',
        is_approved: false,
        status: 'pending_verification',
        reason: formData.reason,
        // Hanya tambahkan created_at jika profile baru
        ...(!existingProfile && { created_at: new Date().toISOString() })
      }
      
      // Gunakan upsert untuk menghindari duplicate key error
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'id', // Update jika id sudah ada
          ignoreDuplicates: false
        })
      
      if (profileError) {
        console.error('Profile upsert error:', profileError)
        
        // Jika masih error karena duplicate, coba update saja
        if (profileError.message.includes('duplicate')) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              full_name: formData.full_name,
              role: 'admin',
              is_approved: false,
              status: 'pending_verification',
              reason: formData.reason
            })
            .eq('id', authData.user.id)
          
          if (updateError) {
            console.error('Profile update error:', updateError)
            throw updateError
          }
        } else {
          throw profileError
        }
      }
      
      // Verifikasi bahwa profile berhasil dibuat/diupdate
      const { data: verifiedProfile } = await supabase
        .from('profiles')
        .select('id, full_name, status, is_approved')
        .eq('id', authData.user.id)
        .single()
      
      console.log('Profile verified:', verifiedProfile)
      
      setSuccess('Registrasi berhasil! Akun Anda menunggu persetujuan dari Admin Ketua.')
      
      // Clear form
      setFormData({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        reason: ''
      })
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Registration error:', error)
      
      if (error.message.includes('duplicate key')) {
        setError('Email sudah terdaftar. Silakan gunakan email lain atau login.')
      } else if (error.message.includes('already registered')) {
        setError('Email sudah terdaftar. Silakan login.')
      } else if (error.message.includes('User already registered')) {
        setError('Email sudah terdaftar. Silakan login.')
      } else if (error.message.includes('profiles_email_key')) {
        setError('Email sudah terdaftar. Silakan gunakan email lain.')
      } else if (error.message.includes('updated_at')) {
        setError('Terjadi kesalahan sistem. Silakan coba lagi nanti.')
      } else {
        setError(error.message || 'Registrasi gagal. Silakan coba lagi.')
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
                src="/assets/alkhawarizmi.png"
                alt="Logo"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Registrasi Admin</h1>
            <p className="text-gray-400">KKMI Al-Khawarizmi UPNYK</p>
          </div>
          
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{success}</span>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-sm text-green-300">Silakan tunggu verifikasi dari Admin Ketua.</p>
                <button
                  onClick={() => router.push('/admin/auth/login')}
                  className="text-sm bg-green-600 hover:bg-green-700 px-3 py-2 rounded transition duration-300 whitespace-nowrap"
                >
                  Ke Halaman Login
                </button>
              </div>
            </div>
          )}
          
          {/* Register Form - Hide form jika sudah sukses */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-400"
                  placeholder="Masukkan nama lengkap"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-400"
                  placeholder="email@example.com"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-400"
                  placeholder="Minimal 6 karakter"
                  disabled={loading}
                />
                <p className="text-xs text-gray-400 mt-1">Password minimal 6 karakter</p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Konfirmasi Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-400"
                  placeholder="Ulangi password"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
                  Alasan Ingin Menjadi Admin *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-400 resize-none"
                  placeholder="Jelaskan alasan Anda ingin menjadi admin KKMI Al-Khawarizmi..."
                  disabled={loading}
                />
                <p className="text-xs text-gray-400 mt-1">Alasan akan ditinjau oleh Admin Ketua</p>
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
                    Mendaftarkan...
                  </span>
                ) : 'Daftar sebagai Admin'}
              </button>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                  {error.includes('sudah terdaftar') && (
                    <div className="mt-2">
                      <Link 
                        href="/admin/auth/login" 
                        className="text-sm text-primary hover:text-primary-light font-medium"
                      >
                        ↪ Klik di sini untuk login
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
          
          {/* Navigation Links */}
          <div className="text-center pt-6 border-t border-gray-700 mt-6">
            {!success ? (
              <>
                <p className="text-gray-400 mb-2">
                  Sudah punya akun?{' '}
                  <Link href="/admin/auth/login" className="text-primary hover:text-primary-light font-medium transition duration-300">
                    Login disini
                  </Link>
                </p>
                <p className="text-gray-400 text-sm">
                  <Link href="/" className="hover:text-gray-300 transition duration-300">
                    ← Kembali ke Beranda
                  </Link>
                </p>
              </>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-400">
                  <Link href="/admin/auth/login" className="text-primary hover:text-primary-light font-medium transition duration-300">
                    ↪ Login dengan akun lain
                  </Link>
                </p>
                <p className="text-gray-400 text-sm">
                  <Link href="/" className="hover:text-gray-300 transition duration-300">
                    ← Kembali ke Beranda
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Registration Information */}
        {!success && (
          <div className="mt-6 text-center">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">📋 Informasi Registrasi</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li className="flex items-start">
                  <svg className="w-3 h-3 mr-2 text-primary mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Akun akan diverifikasi oleh Admin Ketua</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-3 h-3 mr-2 text-primary mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Anda bisa login setelah akun disetujui</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-3 h-3 mr-2 text-primary mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Proses verifikasi maksimal 2x24 jam</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}