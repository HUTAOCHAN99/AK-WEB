/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'
import AdminHeader from './components/AdminHeader'
import Sidebar from './components/Sidebar'
import DashboardTab from './components/DashboardTab'
import TimelineTab from './components/TimelineTab'
import ActivitiesTab from './components/ActivitiesTab'
import PendingAdminsTab from './components/PendingAdminsTab'
import AdminManagementTab from './components/AdminManagementTab'
import SettingsTab from './components/SettingsTab'
import TimelineModal from './components/TimelineModal'
import ActivityModal from './components/ActivityModal'
import { Activity, TimelineItem, PendingAdmin, AdminUser } from './types'

export default function AdminDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // States untuk data
  const [activities, setActivities] = useState<Activity[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(false)
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([])
  const [timelineLoading, setTimelineLoading] = useState(false)
  const [pendingAdmins, setPendingAdmins] = useState<PendingAdmin[]>([])
  const [pendingLoading, setPendingLoading] = useState(false)
  const [approvingId, setApprovingId] = useState<string>('')
  
  // State untuk admin management
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [adminLoading, setAdminLoading] = useState(false)
  
  // Modal states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'timeline' | 'activities' | 'pending' | 'admin-management' | 'settings'>('dashboard')
  const [timelineModalOpen, setTimelineModalOpen] = useState(false)
  const [activityModalOpen, setActivityModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [currentTimelineItem, setCurrentTimelineItem] = useState<TimelineItem | null>(null)
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)
  
  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          console.log('No session found, redirecting to login')
          router.push('/auth/login')
          return
        }
        
        console.log('User session found:', session.user.id)
        
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profileError) {
          console.error('Profile error:', profileError)
          toast.error('Failed to load profile')
          router.push('/auth/login')
          return
        }
        
        if (!profile || !profile.is_approved) {
          toast.error('Account not approved')
          router.push('/auth/login')
          return
        }
        
        console.log('Profile loaded:', profile)
        setCurrentUser(profile)
        
        // Load all data
        await loadAllData()
        
      } catch (error) {
        console.error('Auth error:', error)
        toast.error('Authentication error')
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  // Load semua data sekaligus
  const loadAllData = async () => {
    try {
      setActivitiesLoading(true)
      setTimelineLoading(true)
      setPendingLoading(true)
      setAdminLoading(true)
      
      // Load activities
      const { data: activitiesData } = await supabase
        .from('activities')
        .select('*')
        .order('order_index', { ascending: true })
      
      console.log('Activities loaded:', activitiesData?.length || 0)
      setActivities(activitiesData || [])
      
      // Load timeline
      const { data: timelineData } = await supabase
        .from('timeline')
        .select('*')
        .order('date', { ascending: false })
      
      console.log('Timeline loaded:', timelineData?.length || 0)
      setTimelineData(timelineData || [])
      
      // Load pending admins
      const { data: pendingData } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'pending_verification')
        .order('created_at', { ascending: true })
      
      console.log('Pending admins loaded:', pendingData?.length || 0)
      setPendingAdmins(pendingData || [])
      
      // Load all admins
      const { data: adminData } = await supabase
        .from('profiles')
        .select('*')
        .in('status', ['active', 'inactive', 'suspended', 'approved', 'pending_verification'])
        .order('created_at', { ascending: false })
      
      console.log('All admins loaded:', adminData?.length || 0)
      setAdminUsers(adminData || [])
      
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setActivitiesLoading(false)
      setTimelineLoading(false)
      setPendingLoading(false)
      setAdminLoading(false)
    }
  }

  // Load activities
  const loadActivities = async () => {
    try {
      setActivitiesLoading(true)
      console.log('📥 Loading activities...')
      
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ Error loading activities:', error)
        toast.error('Failed to load activities')
        return
      }
      
      console.log(`✅ Activities loaded: ${data?.length || 0} items`)
      setActivities(data || [])
    } catch (error) {
      console.error('❌ Error loading activities:', error)
      toast.error('Failed to load activities')
    } finally {
      setActivitiesLoading(false)
    }
  }

  // Load timeline
  const loadTimeline = async () => {
    try {
      setTimelineLoading(true)
      console.log('Loading timeline...')
      
      const { data, error } = await supabase
        .from('timeline')
        .select('*')
        .order('date', { ascending: false })
      
      if (error) {
        console.error('Error loading timeline:', error)
        toast.error('Failed to load timeline')
        return
      }
      
      console.log('Timeline loaded:', data?.length || 0)
      setTimelineData(data || [])
    } catch (error) {
      console.error('Error loading timeline:', error)
      toast.error('Failed to load timeline')
    } finally {
      setTimelineLoading(false)
    }
  }

  // Load pending admins
  const loadPendingAdmins = async () => {
    try {
      setPendingLoading(true)
      console.log('Loading pending admins...')
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'pending_verification')
        .order('created_at', { ascending: true })
      
      if (error) {
        console.error('Error loading pending admins:', error)
        toast.error('Failed to load pending admins')
        return
      }
      
      console.log('Pending admins loaded:', data?.length || 0)
      setPendingAdmins(data || [])
    } catch (error) {
      console.error('Error loading pending admins:', error)
      toast.error('Failed to load pending admins')
    } finally {
      setPendingLoading(false)
    }
  }

  // Load all admins
  const loadAllAdmins = async () => {
    try {
      setAdminLoading(true)
      console.log('Loading all admins...')
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('status', ['active', 'inactive', 'suspended', 'approved', 'pending_verification', 'rejected'])
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error loading admins:', error)
        toast.error('Failed to load admins')
        return
      }
      
      console.log('All admins loaded:', data?.length || 0)
      setAdminUsers(data || [])
    } catch (error) {
      console.error('Error loading admins:', error)
      toast.error('Failed to load admins')
    } finally {
      setAdminLoading(false)
    }
  }

  // Upload image ke Supabase Storage
  const uploadToSupabaseStorage = async (file: File): Promise<string> => {
    console.log('🔍 Starting image upload...')
    
    try {
      // Generate filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(7)
      const fileName = `activity-${timestamp}-${randomStr}.${fileExt}`
      
      console.log('📄 File details:', {
        originalName: file.name,
        newName: fileName,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        extension: fileExt
      })
      
      // Upload ke storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('activities')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        })
      
      if (uploadError) {
        console.error('❌ Upload failed:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }
      
      console.log('✅ Upload successful:', uploadData)
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('activities')
        .getPublicUrl(uploadData?.path || fileName)
      
      console.log('🔗 Public URL:', publicUrl)
      return publicUrl
      
    } catch (error: any) {
      console.error('💥 Upload error:', error)
      throw error
    }
  }

  // Helper function untuk save ke database
  const saveActivityToDatabase = async (formData: FormData, imageUrl: string) => {
    // Validasi bahwa imageUrl adalah URL
    if (imageUrl && imageUrl.startsWith('data:')) {
      throw new Error('Image must be uploaded to storage, not saved as base64 data')
    }
    
    const activityData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string || null,
      status: formData.get('status') as 'active' | 'inactive',
      order_index: parseInt(formData.get('order_index') as string) || 0,
      image_url: imageUrl || null,
      image_storage_path: imageUrl ? imageUrl.split('/').pop() : null,
      icon_type: 'image'
    }
    
    console.log('💾 Saving to database:', {
      ...activityData,
      image_url_preview: activityData.image_url?.substring(0, 100) + '...'
    })
    
    let result
    const now = new Date().toISOString()
    
    if (modalMode === 'add') {
      result = await supabase
        .from('activities')
        .insert([{
          ...activityData,
          created_by: currentUser?.id,
          created_at: now,
          updated_at: now
        }])
        .select()
        .single()
    } else {
      const id = formData.get('id') as string
      result = await supabase
        .from('activities')
        .update({
          ...activityData,
          updated_by: currentUser?.id,
          updated_at: now
        })
        .eq('id', id)
        .select()
        .single()
    }
    
    if (result.error) {
      console.error('❌ Database error:', result.error)
      throw result.error
    }
    
    console.log('✅ Database success:', result.data)
    return result.data
  }

  // Handle activity form submission
  const handleActivitySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      setUploading(true)
      console.log('📝 === ACTIVITY FORM SUBMISSION START ===')
      
      const formData = new FormData(e.currentTarget)
      
      // Get image file
      const imageFile = formData.get('image_file') as File
      
      // VALIDATION: Must have image for new activity
      if (modalMode === 'add' && (!imageFile || imageFile.size === 0)) {
        toast.error('⚠️ Please upload an image for new activity')
        setUploading(false)
        return
      }
      
      let imageUrl = currentActivity?.image_url || ''
      
      // Only upload new image if file exists
      if (imageFile && imageFile.size > 0) {
        console.log('📤 Starting image upload...')
        
        try {
          // Upload to Supabase Storage
          imageUrl = await uploadToSupabaseStorage(imageFile)
          console.log('✅ Image uploaded successfully:', imageUrl)
          
          // Add timestamp for cache busting
          if (imageUrl && !imageUrl.includes('?')) {
            imageUrl = `${imageUrl}?t=${Date.now()}`
            console.log('🕐 Added cache busting timestamp')
          }
          
        } catch (uploadError: any) {
          console.error('❌ IMAGE UPLOAD FAILED:', uploadError)
          toast.error(`❌ Failed to upload image: ${uploadError.message}`)
          setUploading(false)
          return
        }
      } else if (modalMode === 'edit' && currentActivity?.image_url) {
        // Keep existing image for edit mode
        imageUrl = currentActivity.image_url
        console.log('🔄 Using existing image URL:', imageUrl)
      }
      
      // Validasi final URL format
      if (imageUrl && imageUrl.startsWith('data:')) {
        console.error('❌ INVALID: Image is base64 format, not URL')
        toast.error('❌ Invalid image format. Please upload image to storage.')
        setUploading(false)
        return
      }
      
      // Simpan ke database
      await saveActivityToDatabase(formData, imageUrl)
      
      toast.success(
        modalMode === 'add' 
          ? '✅ Activity added successfully!' 
          : '✅ Activity updated successfully!'
      )
      
      // Refresh activities
      await loadActivities()
      
      // Close modal
      setActivityModalOpen(false)
      setCurrentActivity(null)
      
      console.log('✅ === ACTIVITY FORM SUBMISSION END ===')
      
    } catch (error: any) {
      console.error('💥 Submission error:', error)
      toast.error(`❌ Error: ${error.message || 'Something went wrong'}`)
    } finally {
      setUploading(false)
    }
  }

  // Handle timeline form submission
  const handleTimelineSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      setUploading(true)
      const formData = new FormData(e.currentTarget)
      
      const timelineData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        tags: formData.get('tags') as string || null,
      }
      
      let result
      if (modalMode === 'add') {
        result = await supabase
          .from('timeline')
          .insert([timelineData])
          .select()
          .single()
      } else {
        const id = formData.get('id') as string
        result = await supabase
          .from('timeline')
          .update(timelineData)
          .eq('id', id)
          .select()
          .single()
      }
      
      if (result.error) throw result.error
      
      toast.success(
        modalMode === 'add' 
          ? 'Timeline item added!' 
          : 'Timeline item updated!'
      )
      
      await loadTimeline()
      setTimelineModalOpen(false)
      setCurrentTimelineItem(null)
      
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(`Error: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  // Handle delete activity
  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return
    
    try {
      console.log('🗑️ Deleting activity:', id)
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast.success('✅ Activity deleted successfully!')
      await loadActivities()
    } catch (error: any) {
      console.error('Error deleting activity:', error)
      toast.error(`❌ Error: ${error.message}`)
    }
  }

  // Handle delete timeline item
  const handleDeleteTimeline = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timeline item?')) return
    
    try {
      const { error } = await supabase
        .from('timeline')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast.success('Timeline item deleted!')
      await loadTimeline()
    } catch (error: any) {
      console.error('Error deleting timeline:', error)
      toast.error(`Error: ${error.message}`)
    }
  }

  // Handle approve admin
  const handleApproveAdmin = async (profileId: number, adminId: string) => {
    try {
      setApprovingId(adminId)
      
      console.log('✅ Approving admin:', { profileId, adminId })
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          status: 'approved',
          is_approved: true,
          approved_by: currentUser?.id,
          approved_at: new Date().toISOString()
        })
        .eq('profile_id', profileId)
        .select()
      
      if (error) {
        console.error('❌ Error approving admin:', error)
        throw error
      }
      
      console.log('✅ Admin approved:', data)
      toast.success('Admin approved successfully!')
      
      await loadPendingAdmins()
      await loadAllAdmins() // Refresh admin list
    } catch (error: any) {
      console.error('Error approving admin:', error)
      toast.error(`Error: ${error.message}`)
    } finally {
      setApprovingId('')
    }
  }

  // Handle reject admin
  const handleRejectAdmin = async (profileId: number, adminId: string) => {
    if (!confirm('Are you sure you want to reject this admin?')) return
    
    try {
      setApprovingId(adminId)
      
      const { error } = await supabase
        .from('profiles')
        .update({
          status: 'rejected',
          is_approved: false,
          rejected_at: new Date().toISOString()
        })
        .eq('profile_id', profileId)
      
      if (error) throw error
      
      toast.success('Admin rejected!')
      await loadPendingAdmins()
    } catch (error: any) {
      console.error('Error rejecting admin:', error)
      toast.error(`Error: ${error.message}`)
    } finally {
      setApprovingId('')
    }
  }

  // Handle update admin - DIPERBAIKI
  const handleUpdateAdmin = async (profileId: number, updates: Partial<AdminUser>) => {
    console.log('=== START handleUpdateAdmin ===')
    console.log('Input:', { 
      profileId, 
      updates,
      typeProfileId: typeof profileId,
      isValid: !isNaN(profileId) && profileId > 0
    })
    console.log('Current user ID:', currentUser?.id)
    
    try {
      // VALIDASI: Pastikan profileId valid
      if (!profileId || isNaN(profileId)) {
        console.error('❌ Invalid profileId:', profileId)
        toast.error('Invalid admin ID')
        return
      }
      
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      }
      
      console.log('📝 Update data to send:', updateData)
      
      // Jika mengubah status atau role, update field terkait
      if (updates.status) {
        console.log('🔄 Updating status to:', updates.status)
        if (updates.status === 'active') {
          updateData.is_approved = true
        } else if (updates.status === 'suspended') {
          updateData.is_approved = false
        }
      }
      
      if (updates.role && updates.role !== 'user') {
        console.log('🔄 Updating role to:', updates.role)
        updateData.is_approved = true
        if (!updates.status) {
          updateData.status = 'active'
        }
      }
      
      // Validasi: admin tidak bisa mengubah role sendiri menjadi non-admin
      if (updates.role === 'user') {
        const adminToUpdate = adminUsers.find(a => a.profile_id === profileId)
        console.log('👤 Admin to update:', adminToUpdate)
        if (adminToUpdate?.id === currentUser?.id) {
          toast.error('You cannot change your own role to user')
          return
        }
      }
      
      // Debug: Tampilkan data yang akan diupdate
      console.log('🚀 Executing Supabase update:', {
        table: 'profiles',
        where: { profile_id: profileId },
        data: updateData
      })
      
      // Lakukan update dengan .select() untuk debugging
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('profile_id', profileId)
        .select()  // Tambahkan .select() untuk melihat hasil
      
      if (error) {
        console.error('❌ Supabase error:', error)
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }
      
      console.log('✅ Update successful:', data)
      toast.success('Admin updated successfully!')
      
      // Refresh data
      await loadAllAdmins()
      
      console.log('=== END handleUpdateAdmin (SUCCESS) ===')
      
    } catch (error: any) {
      console.error('💥 FULL ERROR DETAILS ===')
      console.error('Error object:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      console.error('Profile ID:', profileId)
      console.error('Updates:', updates)
      console.error('=== END ERROR ===')
      
      toast.error(`Error: ${error.message || 'Unknown error occurred'}`)
    }
  }

  // Handle delete adminD
  const handleDeleteAdmin = async (profileId: number, userId: string) => {
    console.log('🗑️ Deleting/suspending admin:', { profileId, userId })
    
    // Validasi: admin tidak bisa menghapus diri sendiri
    if (userId === currentUser?.id) {
      toast.error('You cannot delete your own account')
      return
    }
    
    if (!confirm('Are you sure you want to suspend this admin? This action cannot be undone.')) return
    
    try {
      // Soft delete - change status to suspended
      const { data, error } = await supabase
        .from('profiles')
        .update({
          status: 'suspended',
          is_approved: false,
          suspended_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('profile_id', profileId)
        .select()
      
      if (error) {
        console.error('❌ Error suspending admin:', error)
        throw error
      }
      
      console.log('✅ Admin suspended:', data)
      toast.success('Admin account suspended!')
      
      // Refresh data
      await loadAllAdmins()
      
    } catch (error: any) {
      console.error('Error deleting admin:', error)
      toast.error(`Error: ${error.message}`)
    }
  }

  // Open activity modal
  const openActivityModal = (mode: 'add' | 'edit', activity?: Activity) => {
    console.log('📱 Opening activity modal:', { mode, activity })
    setModalMode(mode)
    setCurrentActivity(activity || null)
    setActivityModalOpen(true)
  }

  // Open timeline modal
  const openTimelineModal = (mode: 'add' | 'edit', item?: TimelineItem) => {
    setModalMode(mode)
    setCurrentTimelineItem(item || null)
    setTimelineModalOpen(true)
  }

  // Load data when tab changes
  useEffect(() => {
    if (!currentUser) return
    
    if (activeTab === 'timeline' && timelineData.length === 0) {
      loadTimeline()
    } else if (activeTab === 'pending' && pendingAdmins.length === 0) {
      loadPendingAdmins()
    } else if (activeTab === 'activities' && activities.length === 0) {
      loadActivities()
    } else if (activeTab === 'admin-management' && adminUsers.length === 0) {
      loadAllAdmins()
    }
  }, [activeTab, currentUser])

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  // Handle save settings
  const handleSaveSettings = async (settings: any) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Settings saved:', settings)
        resolve()
      }, 1000)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        pendingCount={pendingAdmins.length}
        onTabChange={setActiveTab}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          <AdminHeader 
            currentUser={currentUser}
            onLogout={handleLogout}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
          
          <div className="mt-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <DashboardTab 
                activities={activities}
                timelineData={timelineData}
                pendingAdmins={pendingAdmins}
                adminUsers={adminUsers}
                onOpenActivityModal={() => {
                  setActiveTab('activities')
                  setTimeout(() => openActivityModal('add'), 100)
                }}
                onOpenTimelineModal={() => {
                  setActiveTab('timeline')
                  setTimeout(() => openTimelineModal('add'), 100)
                }}
                onOpenPendingModal={() => setActiveTab('pending')}
                onOpenAdminManagementModal={() => setActiveTab('admin-management')}
              />
            )}
            
            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <ActivitiesTab 
                activities={activities}
                loading={activitiesLoading}
                onOpenModal={openActivityModal}
                onDelete={handleDeleteActivity}
              />
            )}
            
            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <TimelineTab 
                timelineData={timelineData}
                loading={timelineLoading}
                onOpenModal={openTimelineModal}
                onDelete={handleDeleteTimeline}
              />
            )}
            
            {/* Pending Admins Tab */}
            {activeTab === 'pending' && (
              <PendingAdminsTab 
                pendingAdmins={pendingAdmins}
                loading={pendingLoading}
                approving={approvingId}
                onApprove={handleApproveAdmin}
                onReject={handleRejectAdmin}
              />
            )}
            
            {/* Admin Management Tab */}
            {activeTab === 'admin-management' && (
              <AdminManagementTab 
                adminUsers={adminUsers}
                loading={adminLoading}
                onUpdateAdmin={handleUpdateAdmin}
                onDeleteAdmin={handleDeleteAdmin}
                onRefresh={loadAllAdmins}
              />
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <SettingsTab 
                currentUser={currentUser}
                onSaveSettings={handleSaveSettings}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <TimelineModal 
        isOpen={timelineModalOpen}
        mode={modalMode}
        currentItem={currentTimelineItem}
        onClose={() => {
          setTimelineModalOpen(false)
          setCurrentTimelineItem(null)
        }}
        onSubmit={handleTimelineSubmit}
      />
      
      <ActivityModal 
        isOpen={activityModalOpen}
        mode={modalMode}
        currentActivity={currentActivity}
        uploading={uploading}
        onClose={() => {
          setActivityModalOpen(false)
          setCurrentActivity(null)
        }}
        onSubmit={handleActivitySubmit}
      />
    </div>
  )
}