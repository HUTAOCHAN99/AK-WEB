// app/admin/dashboard/components/DashboardTab.tsx
'use client'

import { 
  MdEventNote, 
  MdTimeline, 
  MdPeopleAlt, 
  MdBarChart,
  MdArrowUpward,
  MdArrowDownward,
  MdRefresh,
  MdAdd,
  MdCalendarToday,
  MdCheckCircle,
  MdWarning,
  MdAdminPanelSettings,
  MdSupervisorAccount
} from 'react-icons/md'
import { Activity, TimelineItem, PendingAdmin, AdminUser } from '../types'

interface DashboardTabProps {
  activities: Activity[];
  timelineData: TimelineItem[];
  pendingAdmins: PendingAdmin[];
  adminUsers: AdminUser[];
  onOpenActivityModal: () => void;
  onOpenTimelineModal: () => void;
  onOpenPendingModal: () => void;
  onOpenAdminManagementModal: () => void;
}

export default function DashboardTab({
  activities,
  timelineData,
  pendingAdmins,
  adminUsers,
  onOpenActivityModal,
  onOpenTimelineModal,
  onOpenPendingModal,
  onOpenAdminManagementModal
}: DashboardTabProps) {
  const stats = [
    {
      title: 'Total Activities',
      value: activities.length,
      icon: <MdEventNote className="w-6 h-6" />,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up',
      onClick: onOpenActivityModal
    },
    {
      title: 'Active Activities',
      value: activities.filter(a => a.status === 'active').length,
      icon: <MdBarChart className="w-6 h-6" />,
      color: 'bg-green-500',
      change: '+5%',
      trend: 'up',
      onClick: onOpenActivityModal
    },
    {
      title: 'Timeline Events',
      value: timelineData.length,
      icon: <MdTimeline className="w-6 h-6" />,
      color: 'bg-purple-500',
      change: '+3',
      trend: 'up',
      onClick: onOpenTimelineModal
    },
    {
      title: 'Pending Admins',
      value: pendingAdmins.length,
      icon: <MdPeopleAlt className="w-6 h-6" />,
      color: pendingAdmins.length > 0 ? 'bg-red-500' : 'bg-yellow-500',
      change: pendingAdmins.length > 0 ? 'Needs attention' : 'All clear',
      trend: pendingAdmins.length > 0 ? 'down' : 'up',
      onClick: onOpenPendingModal
    },
    {
      title: 'Active Admins',
      value: adminUsers.filter(a => a.status === 'active').length,
      icon: <MdAdminPanelSettings className="w-6 h-6" />,
      color: 'bg-indigo-500',
      change: '+2',
      trend: 'up',
      onClick: onOpenAdminManagementModal
    },
    {
      title: 'Super Admins',
      value: adminUsers.filter(a => a.role === 'super_admin').length,
      icon: <MdSupervisorAccount className="w-6 h-6" />,
      color: 'bg-pink-500',
      change: '+0',
      trend: 'up',
      onClick: onOpenAdminManagementModal
    }
  ]

  const recentActivities = activities
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 5)

  const upcomingEvents = timelineData
    .filter(item => new Date(item.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  const recentAdmins = adminUsers
    .filter(a => a.status === 'active')
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h1>
            <p className="text-gray-300">
              Manage your organizations activities, timeline events, and admin approvals from one place.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-300"
          >
            <MdRefresh className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <button
            key={index}
            onClick={stat.onClick}
            className="bg-gray-800 hover:bg-gray-750 rounded-xl p-5 transition duration-300 text-left group hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend === 'up' ? <MdArrowUpward /> : <MdArrowDownward />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.title}</div>
            <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-500 group-hover:text-gray-400 transition">
              Click to manage →
            </div>
          </button>
        ))}
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MdEventNote className="w-5 h-5" />
              Recent Activities
            </h3>
            <button 
              onClick={onOpenActivityModal}
              className="text-primary hover:text-primary-light text-sm font-medium flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-gray-750 rounded-lg transition group">
                <div className="flex-shrink-0">
                  {activity.image_url ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700">
                      <img 
                        src={activity.image_url} 
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
                      <MdEventNote className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {activity.category} • {new Date(activity.created_at || '').toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  activity.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
            
            {recentActivities.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MdEventNote className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p>No activities yet.</p>
                <button
                  onClick={onOpenActivityModal}
                  className="mt-3 text-primary hover:text-primary-light text-sm font-medium"
                >
                  Create your first activity
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <MdAdd className="w-5 h-5" />
            Quick Actions
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={onOpenActivityModal}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg flex items-center justify-between transition duration-300 group"
            >
              <div className="flex items-center gap-3">
                <MdEventNote className="w-5 h-5" />
                <span>Add New Activity</span>
              </div>
              <span className="group-hover:translate-x-1 transition-transform">+</span>
            </button>
            
            <button
              onClick={onOpenTimelineModal}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-between transition duration-300 group"
            >
              <div className="flex items-center gap-3">
                <MdTimeline className="w-5 h-5" />
                <span>Add Timeline Event</span>
              </div>
              <span className="group-hover:translate-x-1 transition-transform">+</span>
            </button>
            
            {pendingAdmins.length > 0 && (
              <button
                onClick={onOpenPendingModal}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 px-4 rounded-lg flex items-center justify-between transition duration-300 border border-red-500/30 group"
              >
                <div className="flex items-center gap-3">
                  <MdWarning className="w-5 h-5" />
                  <span>Review Pending Admins</span>
                </div>
                <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {pendingAdmins.length}
                </span>
              </button>
            )}
            
            {adminUsers.length > 0 && (
              <button
                onClick={onOpenAdminManagementModal}
                className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 py-3 px-4 rounded-lg flex items-center justify-between transition duration-300 border border-indigo-500/30 group"
              >
                <div className="flex items-center gap-3">
                  <MdAdminPanelSettings className="w-5 h-5" />
                  <span>Manage Admins</span>
                </div>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            )}
          </div>
        </div>

        {/* Recent Admins & Upcoming Events */}
        <div className="space-y-6">
          {/* Recent Admins */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MdPeopleAlt className="w-5 h-5" />
              Recent Admins
            </h3>
            
            <div className="space-y-4">
              {recentAdmins.map((admin) => (
                <div key={admin.id} className="p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                      <MdPeopleAlt className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{admin.full_name || 'No Name'}</p>
                      <p className="text-xs text-gray-400 truncate">{admin.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      admin.role === 'super_admin' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {admin.role === 'super_admin' ? 'Super' : 'Admin'}
                    </span>
                  </div>
                </div>
              ))}
              
              {recentAdmins.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <MdPeopleAlt className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm">No active admins</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MdCalendarToday className="w-5 h-5" />
              Upcoming Events
            </h3>
            
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <MdCheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
                  </div>
                  {event.tags && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {event.tags.split(',').slice(0, 2).map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {upcomingEvents.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <MdCalendarToday className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm">No upcoming events</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-400">Database</span>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <p className="text-xs text-gray-400">Connected and running</p>
          </div>
          
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-400">Storage</span>
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <p className="text-xs text-gray-400">All files accessible</p>
          </div>
          
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-400">API</span>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            </div>
            <p className="text-xs text-gray-400">Response time: 120ms</p>
          </div>
          
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-indigo-400">Users</span>
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            </div>
            <p className="text-xs text-gray-400">{adminUsers.length} active users</p>
          </div>
        </div>
      </div>
    </div>
  )
}