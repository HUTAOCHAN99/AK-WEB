// app/admin/dashboard/components/ContactTab.tsx - VERSI DIPERBAIKI
'use client'

import { useState, useEffect } from 'react' // Tambahkan useEffect
import { 
  FaUser, 
  FaCalendar,
  FaSearch,
  FaCopy,
  FaTrash,
  FaEnvelope,
  FaCheck,
  FaTimes
} from 'react-icons/fa'
import { MdMessage, MdEmail } from 'react-icons/md'
import { toast } from 'react-hot-toast'
import { ContactMessage } from '../types'

interface ContactTabProps {
  messages: ContactMessage[];
  loading: boolean;
  onMarkAsRead: (id: string) => Promise<boolean | void>;
  onDeleteMessage: (id: string) => Promise<void>;
}

export default function ContactTab({ 
  messages, 
  loading, 
  onMarkAsRead, 
  onDeleteMessage 
}: ContactTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  const [processingMessage, setProcessingMessage] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false) // Tambahkan state untuk cek client-side

  // Cek apakah kita di client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Filter messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Status badge color
  const getStatusColor = (status: ContactMessage['status']) => {
    switch (status) {
      case 'unread': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
      case 'read': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      case 'replied': return 'bg-green-500/20 text-green-400 border border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Copy email to clipboard - VERSI DIPERBAIKI
  const copyEmail = async (email: string, messageId: string) => {
    try {
      // Cek apakah kita di client-side
      if (!isClient) {
        throw new Error('Not in client-side environment')
      }
      
      // Cek apakah navigator.clipboard tersedia (browser modern)
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        // Gunakan Clipboard API modern
        await navigator.clipboard.writeText(email)
        setCopiedEmail(messageId)
        
        toast.success('Email copied to clipboard!', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: 'white',
          },
        })
        
        setTimeout(() => setCopiedEmail(null), 2000)
        return
      }
      
      // Fallback: menggunakan textarea method
      console.log('Using fallback copy method...')
      
      // Buat textarea sementara
      const textarea = document.createElement('textarea')
      textarea.value = email
      textarea.style.position = 'fixed'
      textarea.style.left = '-999999px'
      textarea.style.top = '-999999px'
      document.body.appendChild(textarea)
      
      // Pilih dan copy teks
      textarea.select()
      textarea.setSelectionRange(0, email.length)
      
      // Coba gunakan execCommand (legacy method)
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      
      if (successful) {
        setCopiedEmail(messageId)
        toast.success('Email copied to clipboard!', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: 'white',
          },
        })
        setTimeout(() => setCopiedEmail(null), 2000)
      } else {
        // Jika masih gagal, tampilkan popup untuk manual copy
        throw new Error('Copy command failed')
      }
      
    } catch (error) {
      console.error('Failed to copy email:', error)
      
      // Tampilkan modal untuk manual copy
      showManualCopyModal(email, messageId)
    }
  }

  // Fungsi untuk menampilkan modal copy manual
  const showManualCopyModal = (email: string, messageId: string) => {
    // Hapus modal sebelumnya jika ada
    const existingModal = document.getElementById('manual-copy-modal')
    if (existingModal) {
      existingModal.remove()
    }
    
    // Buat modal
    const modal = document.createElement('div')
    modal.id = 'manual-copy-modal'
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
    `
    
    modal.innerHTML = `
      <div style="
        background: #1f2937;
        color: white;
        padding: 25px;
        border-radius: 12px;
        border: 1px solid #374151;
        text-align: center;
        min-width: 350px;
        max-width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      ">
        <div style="margin-bottom: 15px; font-size: 18px; font-weight: 600;">
          📋 Manual Copy Required
        </div>
        
        <div style="margin-bottom: 10px; color: #d1d5db;">
          Please select and copy the email address:
        </div>
        
        <div style="
          background: #111827;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          border: 1px solid #374151;
          word-break: break-all;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
          font-size: 14px;
          user-select: all;
          cursor: pointer;
          transition: all 0.2s;
        " onclick="this.select()">
          ${email}
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button 
            onclick="
              navigator.clipboard.writeText('${email}').then(() => {
                document.getElementById('manual-copy-modal').remove();
              }).catch(err => {
                console.log('Clipboard copy failed:', err);
              })
            "
            style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 500;
              transition: background 0.2s;
            "
            onmouseover="this.style.background='#2563eb'"
            onmouseout="this.style.background='#3b82f6'"
          >
            Click to Copy
          </button>
          
          <button 
            onclick="document.getElementById('manual-copy-modal').remove()"
            style="
              background: #6b7280;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 500;
              transition: background 0.2s;
            "
            onmouseover="this.style.background='#4b5563'"
            onmouseout="this.style.background='#6b7280'"
          >
            Close
          </button>
        </div>
        
        <div style="margin-top: 15px; color: #9ca3af; font-size: 12px;">
          💡 Tip: Click the email text above to select it, then use Ctrl+C (or Cmd+C) to copy
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Tambahkan event listener untuk menutup modal dengan ESC
    const closeModal = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        modal.remove()
        document.removeEventListener('keydown', closeModal)
      }
    }
    
    document.addEventListener('keydown', closeModal)
    
    // Tambahkan event listener untuk klik di luar modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove()
        document.removeEventListener('keydown', closeModal)
      }
    })
  }

  // Mark as read dengan toast feedback yang lebih baik
  const markAsRead = async (id: string) => {
    if (processingMessage) return
    
    setProcessingMessage(id)
    
    try {
      console.log('📧 Marking message as read:', id)
      
      const success = await onMarkAsRead(id)
      
      if (success === false) {
        throw new Error('Mark as read failed')
      }
      
      toast.success('Message marked as read!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
        },
        icon: <FaCheck className="text-white" />,
      })
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Failed to mark as read:', error)
      
      const errorMessage = error?.message || error?.toString() || 'Unknown error'
      
      toast.error(`Failed: ${errorMessage}`, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
        },
        icon: <FaTimes className="text-white" />,
      })
      
    } finally {
      setProcessingMessage(null)
    }
  }

  // Delete message dengan konfirmasi dan feedback
  const deleteMessage = async (id: string) => {
    if (processingMessage) return
    
    const messageToDelete = messages.find(m => m.id === id)
    
    // Konfirmasi yang lebih detail
    const confirmMessage = `Delete message from "${messageToDelete?.name}"?\nThis action cannot be undone.`
    
    if (!window.confirm(confirmMessage)) {
      return
    }
    
    setProcessingMessage(`delete-${id}`)
    
    try {
      await onDeleteMessage(id)
      
      toast.success('Message deleted successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
        },
        icon: <FaCheck className="text-white" />,
      })
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Failed to delete message:', error)
      
      const errorMessage = error?.message || error?.toString() || 'Unknown error'
      
      toast.error(`Delete failed: ${errorMessage}`, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
        },
        icon: <FaTimes className="text-white" />,
      })
      
    } finally {
      setProcessingMessage(null)
    }
  }

  // Stats
  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header dengan stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
          <p className="text-gray-400">Manage contact messages from users</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {/* Stats Cards */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-300 font-medium">{stats.unread} Unread</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-300 font-medium">{stats.replied} Replied</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-300 font-medium">{stats.total} Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-800/50 rounded-xl">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-w-[160px]"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-16">
            <MdMessage className="text-5xl text-gray-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {messages.length === 0 ? 'No messages yet' : 'No messages found'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try changing your search or filter settings'
                : 'You will see contact messages here when users send them'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {filteredMessages.map((message) => {
              const isProcessing = processingMessage === message.id || processingMessage === `delete-${message.id}`
              const isUnread = message.status === 'unread'
              
              return (
                <div 
                  key={message.id} 
                  className={`p-5 transition-all duration-200 ${isUnread ? 'bg-gray-750/50' : 'hover:bg-gray-750/30'} ${
                    isProcessing ? 'opacity-60' : ''
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <FaUser className="text-primary text-lg" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white text-lg truncate">
                            {message.name}
                          </h4>
                          {isUnread && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              NEW
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-400 text-sm truncate">
                          {message.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                        {message.status.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FaCalendar className="text-xs" />
                        <span>{formatDate(message.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="mb-5">
                    <p className="text-gray-300 whitespace-pre-line bg-gray-900/30 p-4 rounded-lg border border-gray-700/50 text-sm leading-relaxed">
                      {message.message}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700/50">
                    {/* Mark as Read (only for unread messages) */}
                    {message.status === 'unread' && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        disabled={isProcessing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isProcessing && processingMessage === message.id
                            ? 'bg-blue-600/50 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                      >
                        {isProcessing && processingMessage === message.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaEnvelope className="text-sm" /> 
                            Mark as Read
                          </>
                        )}
                      </button>
                    )}
                    
                    {/* Copy Email */}
                    <button
                      onClick={() => copyEmail(message.email, message.id)}
                      disabled={isProcessing}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isProcessing
                          ? 'bg-gray-600/50 cursor-not-allowed'
                          : 'bg-gray-600 hover:bg-gray-700'
                      } text-white`}
                    >
                      <FaCopy className={`text-sm ${copiedEmail === message.id ? 'text-green-400' : ''}`} />
                      {copiedEmail === message.id ? 'Copied!' : 'Copy Email'}
                    </button>
                    
                    {/* Delete */}
                    <button
                      onClick={() => deleteMessage(message.id)}
                      disabled={isProcessing}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isProcessing && processingMessage === `delete-${message.id}`
                          ? 'bg-red-600/50 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      } text-white`}
                    >
                      {isProcessing && processingMessage === `delete-${message.id}` ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <FaTrash className="text-sm" /> 
                          Delete
                        </>
                      )}
                    </button>
                  </div>

                  {/* Admin Notes (if any) */}
                  {message.notes && (
                    <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-800/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-green-400">📝 Admin Notes:</span>
                        {message.replied_by && (
                          <span className="text-xs text-gray-400">
                            • Replied by: {message.replied_by}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 whitespace-pre-line">{message.notes}</p>
                      {message.replied_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Replied on: {new Date(message.replied_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {filteredMessages.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="text-gray-400">
            Showing <span className="font-medium text-white">{filteredMessages.length}</span> of{' '}
            <span className="font-medium text-white">{messages.length}</span> messages
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-gray-400">Unread ({stats.unread})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-400">Read ({stats.read})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-400">Replied ({stats.replied})</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Guide */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <div className="flex items-start gap-3">
          <MdEmail className="text-blue-400 mt-1 text-xl" />
          <div className="flex-1">
            <h4 className="font-medium text-white mb-3 text-lg">Quick Actions Guide</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-white">Mark as Read</span>
                </div>
                <p className="text-xs text-gray-400">
                  Click to mark unread messages as read. This helps track which messages need attention.
                </p>
              </div>
              
              <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm font-medium text-white">Copy Email</span>
                </div>
                <p className="text-xs text-gray-400">
                  Copy email address to clipboard for easy response via your email client.
                </p>
              </div>
              
              <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-700/30 hover:border-red-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-white">Delete Message</span>
                </div>
                <p className="text-xs text-gray-400">
                  Permanently delete messages. This action cannot be undone.
                </p>
              </div>
            </div>
            
            {/* Tips */}
            <div className="mt-4 p-3 bg-gray-900/20 rounded-lg">
              <p className="text-xs text-gray-400">
                💡 <strong>Tip:</strong> Use the filter dropdown to quickly find unread messages that need attention.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}