// app\admin\dashboard\components\AdminManagementTab.tsx
'use client'

import { useState } from 'react'
import { 
  MdPeople, 
  MdAdminPanelSettings, 
  MdSupervisorAccount, 
  MdPersonAdd,
  MdEdit, 
  MdDelete, 
  MdBlock, 
  MdCheckCircle,
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdWarning,
  MdPersonOff,
  MdPerson
} from 'react-icons/md'
import { AdminUser } from '../types'

interface AdminManagementTabProps {
  adminUsers: AdminUser[];
  loading: boolean;
  onUpdateAdmin: (profileId: number, updates: Partial<AdminUser>) => Promise<void>;
  onDeleteAdmin: (profileId: number, userId: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export default function AdminManagementTab({
  adminUsers,
  loading,
  onUpdateAdmin,
  onDeleteAdmin,
  onRefresh
}: AdminManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<AdminUser>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Filter admins
  const filteredAdmins = adminUsers.filter(admin => {
    const matchesSearch = 
      admin.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === 'all' || admin.role === filterRole
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Stats
  const stats = {
    total: adminUsers.length,
    superAdmin: adminUsers.filter(a => a.role === 'super_admin').length,
    admin: adminUsers.filter(a => a.role === 'admin').length,
    active: adminUsers.filter(a => a.status === 'active').length,
    inactive: adminUsers.filter(a => a.status === 'inactive').length,
    suspended: adminUsers.filter(a => a.status === 'suspended').length,
  }

  // Start editing
  const startEdit = (admin: AdminUser) => {
    setEditingId(admin.id)
    setEditForm({
      role: admin.role,
      status: admin.status,
      is_approved: admin.is_approved
    })
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  // Save edit
  const saveEdit = async (profileId: number, userId: string) => {
    if (editForm.role || editForm.status !== undefined) {
      await onUpdateAdmin(profileId, editForm)
      setEditingId(null)
      setEditForm({})
    }
  }

  // Handle delete
  const handleDelete = async (profileId: number, userId: string) => {
    if (confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      await onDeleteAdmin(profileId, userId)
      setShowDeleteConfirm(null)
    }
  }

  // Handle status change
  const handleStatusChange = async (profileId: number, userId: string, newStatus: AdminUser['status']) => {
    if (confirm(`Change admin status to ${newStatus}?`)) {
      await onUpdateAdmin(profileId, { status: newStatus })
    }
  }

  // Handle role change
  const handleRoleChange = async (profileId: number, userId: string, newRole: AdminUser['role']) => {
    if (confirm(`Change admin role to ${newRole}?`)) {
      await onUpdateAdmin(profileId, { role: newRole })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MdAdminPanelSettings className="w-6 h-6" />
            Admin Management
          </h2>
          <p className="text-gray-400">Manage all administrators and their permissions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-300 disabled:opacity-50"
          >
            <MdRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold mb-1">{stats.total}</div>
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <MdPeople className="w-4 h-4" />
            Total Admins
          </div>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-400 mb-1">{stats.superAdmin}</div>
          <div className="text-sm text-blue-400 flex items-center gap-2">
            <MdSupervisorAccount className="w-4 h-4" />
            Super Admin
          </div>
        </div>
        
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-400 mb-1">{stats.admin}</div>
          <div className="text-sm text-green-400 flex items-center gap-2">
            <MdAdminPanelSettings className="w-4 h-4" />
            Admin
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-400 mb-1">{stats.active}</div>
          <div className="text-sm text-green-400 flex items-center gap-2">
            <MdCheckCircle className="w-4 h-4" />
            Active
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.inactive}</div>
          <div className="text-sm text-yellow-400 flex items-center gap-2">
            <MdPersonOff className="w-4 h-4" />
            Inactive
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-red-400 mb-1">{stats.suspended}</div>
          <div className="text-sm text-red-400 flex items-center gap-2">
            <MdBlock className="w-4 h-4" />
            Suspended
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">Search Admins</label>
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or role..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">Filter by Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending_verification">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="text-left p-4 text-gray-400 font-medium">Admin</th>
                <th className="text-left p-4 text-gray-400 font-medium">Role</th>
                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                <th className="text-left p-4 text-gray-400 font-medium">Joined</th>
                <th className="text-left p-4 text-gray-400 font-medium">Last Active</th>
                <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-2 text-gray-400">Loading admins...</p>
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <MdPeople className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No admins found</p>
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-750 transition duration-200">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <MdPerson className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{admin.full_name || 'No Name'}</div>
                          <div className="text-sm text-gray-400">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      {editingId === admin.id ? (
                        <select
                          value={editForm.role || admin.role}
                          onChange={(e) => setEditForm({...editForm, role: e.target.value as AdminUser['role']})}
                          className="px-3 py-1 bg-gray-900 border border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          admin.role === 'super_admin' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : admin.role === 'admin'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {admin.role === 'super_admin' ? 'Super Admin' : 
                           admin.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {editingId === admin.id ? (
                        <select
                          value={editForm.status || admin.status}
                          onChange={(e) => setEditForm({...editForm, status: e.target.value as AdminUser['status']})}
                          className="px-3 py-1 bg-gray-900 border border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                          <option value="pending_verification">Pending</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          admin.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : admin.status === 'inactive'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : admin.status === 'suspended'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {admin.status === 'active' ? 'Active' :
                           admin.status === 'inactive' ? 'Inactive' :
                           admin.status === 'suspended' ? 'Suspended' : 'Pending'}
                        </span>
                      )}
                    </td>
                    
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </td>
                    
                    <td className="p-4 text-gray-400 text-sm">
                      {admin.last_login 
                        ? new Date(admin.last_login).toLocaleDateString() 
                        : 'Never'}
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {editingId === admin.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(admin.profile_id, admin.id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition duration-200"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition duration-200"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(admin)}
                              className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition duration-200"
                              title="Edit"
                            >
                              <MdEdit className="w-4 h-4" />
                            </button>
                            
                            {/* Quick Role Actions */}
                            {admin.role !== 'super_admin' && (
                              <button
                                onClick={() => handleRoleChange(admin.profile_id, admin.id, 'super_admin')}
                                className="p-1.5 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded transition duration-200"
                                title="Make Super Admin"
                              >
                                <MdSupervisorAccount className="w-4 h-4" />
                              </button>
                            )}
                            
                            {/* Quick Status Actions */}
                            {admin.status !== 'suspended' && (
                              <button
                                onClick={() => handleStatusChange(admin.profile_id, admin.id, 'suspended')}
                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition duration-200"
                                title="Suspend"
                              >
                                <MdBlock className="w-4 h-4" />
                              </button>
                            )}
                            
                            {admin.status === 'suspended' && (
                              <button
                                onClick={() => handleStatusChange(admin.profile_id, admin.id, 'active')}
                                className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded transition duration-200"
                                title="Activate"
                              >
                                <MdCheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(admin.profile_id, admin.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition duration-200"
                              title="Delete"
                            >
                              <MdDelete className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Actions (Optional) */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          Showing {filteredAdmins.length} of {adminUsers.length} admins
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // Implement export functionality
              console.log('Export admins')
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition duration-300"
          >
            Export CSV
          </button>
          
          <button
            onClick={() => {
              // Implement print functionality
              window.print()
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition duration-300"
          >
            Print List
          </button>
        </div>
      </div>
    </div>
  )
}