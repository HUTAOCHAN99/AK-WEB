'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { 
  MdEdit, 
  MdDelete,
  MdOutlineTimeline,
  MdAdd 
} from 'react-icons/md'

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  tags?: string;
}

export default function AdminDashboard() {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [currentItem, setCurrentItem] = useState<TimelineItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  
  const checkAuthStatus = useCallback(async (client: SupabaseClient) => {
    try {
      const { data: { session }, error } = await client.auth.getSession()
      if (error || !session) {
        window.location.href = '/admin/auth'
        return
      }
      
      const { data: profile } = await client
        .from('profiles')
        .select('role, is_approved, status')
        .eq('id', session.user.id)
        .single()
        
      if (!profile || profile.role !== 'admin' || !profile.is_approved || profile.status !== 'active') {
        await client.auth.signOut()
        window.location.href = '/admin/auth'
      }
    } catch (error) {
      console.error('Auth error:', error)
      window.location.href = '/admin/auth'
    }
  }, [])
  
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
    }
    
    initSupabase()
  }, [checkAuthStatus, loadTimelineData])
  
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
      alert('Please fill in all required fields')
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
      
      alert(`Timeline item ${id ? 'updated' : 'added'} successfully`)
      setIsModalOpen(false)
      loadTimelineData(supabase)
    } catch (error) {
      console.error('Error saving timeline:', error)
      alert('Failed to save timeline item')
    }
  }
  
  const handleDelete = async (id: string) => {
    if (!supabase) return
    if (!confirm('Are you sure you want to delete this timeline item?')) return
    
    try {
      const { error } = await supabase
        .from('timeline')
        .delete()
        .eq('id', id)
        
      if (error) throw error
      
      alert('Timeline item deleted successfully')
      loadTimelineData(supabase)
    } catch (error) {
      console.error('Error deleting timeline:', error)
      alert('Failed to delete timeline item')
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
      window.location.href = '/admin/auth'
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded flex items-center gap-2"
          >
            <span>Logout</span>
          </button>
        </div>
        
        <div className="mb-6">
          <button
            onClick={() => openModal('add')}
            className="bg-primary hover:bg-primary-dark px-4 py-2 rounded flex items-center gap-2"
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
              <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
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
                      className="text-blue-400 hover:text-blue-300 p-1"
                      title="Edit"
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-300 p-1"
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
        
        {/* Modal */}
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
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Date *</label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={currentItem?.date || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Description *</label>
                    <textarea
                      name="description"
                      defaultValue={currentItem?.description || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 h-32"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      defaultValue={currentItem?.tags || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-dark rounded"
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