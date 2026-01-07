'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { 
  MdEdit, 
  MdDelete,
  MdOutlineTimeline,
  MdAdd,
  MdCheck,
  MdClose,
  MdPerson,
  MdPendingActions,
  MdVerified
} from 'react-icons/md'
import { useRouter } from 'next/navigation'

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  tags?: string;
}

interface PendingAdmin {
  profile_id: number;
  id: string;
  full_name: string;
  email: string;
  status: string;
  is_approved: boolean;
  created_at: string;
  reason?: string;
}

export default function AdminDashboard() {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([])
  const [pendingAdmins, setPendingAdmins] = useState<PendingAdmin[]>([])
  const [activeTab, setActiveTab] = useState<'timeline' | 'pending'>('timeline')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [currentItem, setCurrentItem] = useState<TimelineItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<string>('')
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()
  
  const checkAuthStatus = useCallback(async (client: SupabaseClient) => {
    try {
      const { data: { session }, error } = await client.auth.getSession()
      if (error || !session) {
        router.push('/admin/auth/login')
        return
      }
      
      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        
      if (!profile || profile.role !== 'admin' || !profile.is_approved || profile.status !== 'active') {
        await client.auth.signOut()
        router.push('/admin/auth/login')
        return
      }
      
      setCurrentUser(profile)
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/admin/auth/login')
    }
  }, [router])
  
  const loadTimelineData = useCallback(async (client: SupabaseClient) => {
    try {
      setLoading(true)
      const { data, error } = await client
        .from('timeline')
        .select('*')
        .order('date', { ascending: false })
        
      if (error) throw error
      setTimelineData(data || [])
    } catch (error) {
      console.error('Error loading timeline:', error)
      alert('Failed to load timeline data')
    } finally {
      setLoading(false)
    }
  }, [])
  
  const loadPendingAdmins = useCallback(async (client: SupabaseClient) => {
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .eq('is_approved', false)
        .eq('status', 'pending_verification')
        .order('created_at', { ascending: true })
        
      if (error) throw error
      setPendingAdmins(data || [])
    } catch (error) {
      console.error('Error loading pending admins:', error)
    }
  }, [])
  
  useEffect(() => {
    const initSupabase = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase configuration missing')
        return
      }
      
      const client = createClient(supabaseUrl, supabaseKey)
      setSupabase(client)
      await checkAuthStatus(client)
      await loadTimelineData(client)
      await loadPendingAdmins(client)
    }
    
    initSupabase()
  }, [checkAuthStatus, loadTimelineData, loadPendingAdmins])
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!supabase) return
    
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const description = formData.get('description') as string
    const tags = formData.get('tags') as string
    const id = formData.get('id') as string
    
    if (!title || !date || !description) {
      alert('Harap isi semua field yang wajib')
      return
    }
    
    try {
      let error
      if (id) {
        const { error: updateError } = await supabase
          .from('timeline')
          .update({ title, date, description, tags })
          .eq('id', id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('timeline')
          .insert([{ title, date, description, tags }])
        error = insertError
      }
      
      if (error) throw error
      
      alert(`Item timeline berhasil ${id ? 'diperbarui' : 'ditambahkan'}`)
      setIsModalOpen(false)
      loadTimelineData(supabase)
    } catch (error) {
      console.error('Error saving timeline:', error)
      alert('Gagal menyimpan item timeline')
    }
  }
  
  const handleDelete = async (id: string) => {
    if (!supabase) return
    if (!confirm('Apakah Anda yakin ingin menghapus item timeline ini?')) return
    
    try {
      const { error } = await supabase
        .from('timeline')
        .delete()
        .eq('id', id)
        
      if (error) throw error
      
      alert('Item timeline berhasil dihapus')
      loadTimelineData(supabase)
    } catch (error) {
      console.error('Error deleting timeline:', error)
      alert('Gagal menghapus item timeline')
    }
  }
  
  const handleApproveAdmin = async (profileId: number, adminId: string) => {
    if (!supabase || !currentUser) return
    
    if (!confirm('Apakah Anda yakin ingin menyetujui admin ini?')) return
    
    setApproving(adminId)
    
    try {
      // Update profile to approved
      const { error } = await supabase
        .from('profiles')
        .update({
          is_approved: true,
          status: 'active',
          approved_by: currentUser.id,
          approved_at: new Date().toISOString()
        })
        .eq('profile_id', profileId)
        .eq('id', adminId)
      
      if (error) throw error
      
      // Reload pending admins
      await loadPendingAdmins(supabase)
      alert('Admin berhasil disetujui')
    } catch (error) {
      console.error('Error approving admin:', error)
      alert('Gagal menyetujui admin')
    } finally {
      setApproving('')
    }
  }
  
  const handleRejectAdmin = async (profileId: number, adminId: string) => {
    if (!supabase) return
    
    if (!confirm('Apakah Anda yakin ingin menolak admin ini?')) return
    
    setApproving(adminId)
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString()
        })
        .eq('profile_id', profileId)
        .eq('id', adminId)
      
      if (error) throw error
      
      await loadPendingAdmins(supabase)
      alert('Admin berhasil ditolak')
    } catch (error) {
      console.error('Error rejecting admin:', error)
      alert('Gagal menolak admin')
    } finally {
      setApproving('')
    }
  }
  
  const openModal = (mode: 'add' | 'edit', item: TimelineItem | null = null) => {
    setModalMode(mode)
    setCurrentItem(item)
    setIsModalOpen(true)
  }
  
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      router.push('/admin/auth/login')
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">
              {currentUser?.full_name ? `Halo, ${currentUser.full_name}` : 'Loading...'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded flex items-center gap-2 transition duration-300"
          >
            <span>Logout</span>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 font-medium transition duration-300 ${
              activeTab === 'timeline' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Timeline Management
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium transition duration-300 relative ${
              activeTab === 'pending' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending Admins
            {pendingAdmins.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingAdmins.length}
              </span>
            )}
          </button>
        </div>
        
        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => openModal('add')}
                className="bg-primary hover:bg-primary-dark px-4 py-2 rounded flex items-center gap-2 transition duration-300"
              >
                <MdAdd className="w-5 h-5" />
                <span>Add Timeline Item</span>
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-400">Loading timeline...</p>
              </div>
            ) : timelineData.length === 0 ? (
              <div className="text-center py-8">
                <MdOutlineTimeline className="text-4xl text-gray-500 mx-auto mb-4" />
                <p className="mt-2 text-gray-400">No timeline items found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {timelineData.map((item) => (
                  <div key={item.id} className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                        <p className="mt-2">{item.description}</p>
                        {item.tags && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.tags.split(',').map((tag: string, index: number) => (
                              <span key={index} className="bg-blue-600 text-xs px-2 py-1 rounded">
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal('edit', item)}
                          className="text-blue-400 hover:text-blue-300 p-1 transition duration-300"
                          title="Edit"
                        >
                          <MdEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-400 hover:text-red-300 p-1 transition duration-300"
                          title="Delete"
                        >
                          <MdDelete className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Pending Admins Tab */}
        {activeTab === 'pending' && (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <MdPendingActions className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Admin Menunggu Persetujuan</h2>
              </div>
              <p className="text-gray-400">Verifikasi dan setujui permintaan admin baru</p>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-400">Loading pending admins...</p>
              </div>
            ) : pendingAdmins.length === 0 ? (
              <div className="text-center py-8">
                <MdVerified className="text-4xl text-green-500 mx-auto mb-4" />
                <p className="mt-2 text-gray-400">Tidak ada admin yang menunggu persetujuan.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingAdmins.map((admin) => (
                  <div key={admin.id} className="bg-gray-700 p-6 rounded-lg hover:bg-gray-650 transition duration-300">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-primary/20 p-2 rounded-full">
                            <MdPerson className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{admin.full_name}</h3>
                            <p className="text-gray-400 text-sm">{admin.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Alasan Bergabung:</p>
                            <p className="text-gray-300 bg-gray-800 p-3 rounded">{admin.reason || 'Tidak ada alasan yang diberikan'}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Status:</span>
                              <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                                {admin.status}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Daftar:</span>
                              <span className="ml-2 text-gray-300">
                                {new Date(admin.created_at).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleApproveAdmin(admin.profile_id, admin.id)}
                          disabled={approving === admin.id}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition duration-300 disabled:opacity-50"
                        >
                          {approving === admin.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <MdCheck className="w-5 h-5" />
                              <span>Setujui</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectAdmin(admin.profile_id, admin.id)}
                          disabled={approving === admin.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition duration-300 disabled:opacity-50"
                        >
                          <MdClose className="w-5 h-5" />
                          <span>Tolak</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Modal untuk Timeline */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {modalMode === 'add' ? 'Add Timeline Item' : 'Edit Timeline Item'}
              </h2>
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="id" defaultValue={currentItem?.id || ''} />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={currentItem?.title || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Date *</label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={currentItem?.date || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Description *</label>
                    <textarea
                      name="description"
                      defaultValue={currentItem?.description || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 h-32 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      defaultValue={currentItem?.tags || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-dark rounded transition duration-300"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}