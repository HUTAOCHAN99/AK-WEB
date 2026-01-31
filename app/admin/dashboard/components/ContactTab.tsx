// app/admin/dashboard/components/ContactTab.tsx - VERSI SEDERHANA
'use client'

import { useState } from 'react'
import { 
  FaUser, 
  FaCalendar,
  FaSearch,
  FaCopy,
  FaTrash,
  FaEnvelope
} from 'react-icons/fa'
import { MdMessage, MdEmail } from 'react-icons/md'
import { ContactMessage } from '../types'

interface ContactTabProps {
  messages: ContactMessage[];
  loading: boolean;
  onMarkAsRead: (id: string) => Promise<void>;
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
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null)

  // Filter messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Status badge color
  const getStatusColor = (status: ContactMessage['status']) => {
    switch (status) {
      case 'unread': return 'bg-yellow-500 text-yellow-900'
      case 'read': return 'bg-blue-500 text-blue-900'
      case 'replied': return 'bg-green-500 text-green-900'
      default: return 'bg-gray-500 text-gray-900'
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Copy email to clipboard
  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      setTimeout(() => setCopiedEmail(null), 2000) // Reset after 2 seconds
      alert('Email copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy email:', error)
      alert('Failed to copy email')
    }
  }

  // Copy message to clipboard
  const copyMessage = async (message: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(message)
      setCopiedMessage(messageId)
      setTimeout(() => setCopiedMessage(null), 2000) // Reset after 2 seconds
      alert('Message copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy message:', error)
      alert('Failed to copy message')
    }
  }

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      await onMarkAsRead(id)
      alert('Message marked as read!')
    } catch (error) {
      console.error('Failed to mark as read:', error)
      alert('Failed to mark as read')
    }
  }

  // Delete message
  const deleteMessage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await onDeleteMessage(id)
        alert('Message deleted!')
      } catch (error) {
        console.error('Failed to delete:', error)
        alert('Failed to delete message')
      }
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
          <p className="text-gray-400">Manage contact messages from users</p>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-300">{stats.unread} Unread</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-gray-300">{stats.total} Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <MdMessage className="text-5xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No messages found</h3>
            <p className="text-gray-500">No contact messages match your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredMessages.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 transition-colors hover:bg-gray-750 ${message.status === 'unread' ? 'bg-gray-750/50' : ''}`}
              >
                {/* Message Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <FaUser className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{message.name}</p>
                      <p className="text-sm text-gray-400">{message.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {message.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                </div>

                {/* Message Content */}
                <div className="mb-4">
                  <p className="text-gray-300 whitespace-pre-line bg-gray-900/30 p-3 rounded-lg">
                    {message.message}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-700">
                  {/* Mark as Read (only for unread messages) */}
                  {message.status === 'unread' && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                      <FaEnvelope className="text-sm" /> Mark as Read
                    </button>
                  )}
                  
                  {/* Copy Email */}
                  <button
                    onClick={() => copyEmail(message.email)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <FaCopy className={`text-sm ${copiedEmail === message.email ? 'text-green-400' : ''}`} />
                    {copiedEmail === message.email ? 'Copied!' : 'Copy Email'}
                  </button>
                  
                  {/* Copy Message */}
                  <button
                    onClick={() => copyMessage(message.message, message.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <FaCopy className={`text-sm ${copiedMessage === message.id ? 'text-green-400' : ''}`} />
                    {copiedMessage === message.id ? 'Copied!' : 'Copy Message'}
                  </button>
                  
                  {/* Delete */}
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <FaTrash className="text-sm" /> Delete
                  </button>
                </div>

                {/* Admin Notes (if any) */}
                {message.notes && (
                  <div className="mt-3 p-3 bg-green-900/20 rounded-lg border border-green-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-green-400">Admin Notes:</span>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-line">{message.notes}</p>
                    {message.replied_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Replied on: {formatDate(message.replied_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {filteredMessages.length > 0 && (
        <div className="text-sm text-gray-400">
          Showing {filteredMessages.length} of {messages.length} messages
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <MdEmail className="text-blue-400 mt-1" />
          <div>
            <h4 className="font-medium text-white mb-2">Quick Actions Guide</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-900/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-white">Mark as Read</span>
                </div>
                <p className="text-xs text-gray-400">Click to mark unread messages as read</p>
              </div>
              
              <div className="p-3 bg-gray-900/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="text-sm font-medium text-white">Copy Email/Message</span>
                </div>
                <p className="text-xs text-gray-400">Copy email or message content to clipboard</p>
              </div>
              
              <div className="p-3 bg-gray-900/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-white">Delete</span>
                </div>
                <p className="text-xs text-gray-400">Permanently delete messages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}