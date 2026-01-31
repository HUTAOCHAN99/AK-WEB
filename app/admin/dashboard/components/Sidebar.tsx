// app/admin/dashboard/components/Sidebar.tsx - UPDATED VERSION WITH CONTACT
'use client'

import { 
  MdTimeline, 
  MdEventNote, 
  MdPeopleAlt, 
  MdDashboard, 
  MdSettings,
  MdAdminPanelSettings,
  MdClose,
  MdContactMail // ADDED
} from 'react-icons/md'

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role?: string;
}

type TabType = 'dashboard' | 'timeline' | 'activities' | 'pending' | 'admin-management' | 'settings' | 'contact'; // UPDATED

interface SidebarProps {
  currentUser: UserProfile | null;
  activeTab: TabType;
  pendingCount: number;
  unreadContactCount?: number; // ADDED
  onTabChange: (tab: TabType) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Sidebar({ 
  currentUser,
  activeTab, 
  pendingCount,
  unreadContactCount = 0, // ADDED
  onTabChange, 
  sidebarOpen,
  onToggleSidebar 
}: SidebarProps) {
  const menuItems: Array<{
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <MdDashboard className="w-5 h-5" /> },
    { id: 'activities', label: 'Activities', icon: <MdEventNote className="w-5 h-5" /> },
    { id: 'timeline', label: 'Timeline', icon: <MdTimeline className="w-5 h-5" /> },
    { 
      id: 'pending', 
      label: 'Pending Admins', 
      icon: <MdPeopleAlt className="w-5 h-5" />,
      badge: pendingCount 
    },
    { 
      id: 'admin-management', 
      label: 'Admin Management', 
      icon: <MdAdminPanelSettings className="w-5 h-5" /> 
    },
    { // ADDED CONTACT ITEM
      id: 'contact', 
      label: 'Contact Messages', 
      icon: <MdContactMail className="w-5 h-5" />,
      badge: unreadContactCount > 0 ? unreadContactCount : undefined
    }
  ]

  return (
    <>
      {/* Mobile Overlay - hanya muncul di mobile saat sidebar terbuka */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:relative
        fixed
        top-0 left-0
        w-64 lg:w-auto
        h-screen
        bg-gray-800
        z-50 lg:z-auto
        transition-transform duration-300 ease-in-out
        flex flex-col
        shadow-xl lg:shadow-none
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {currentUser?.full_name?.charAt(0) || 'A'}
              </div>
              <div>
                <h2 className="font-semibold">Admin Menu</h2>
                <p className="text-xs text-gray-400 truncate max-w-35">
                  {currentUser?.email || 'admin@email.com'}
                </p>
              </div>
            </div>
            {/* TOMBOL CLOSE - HANYA DI MOBILE */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded hover:bg-gray-700"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id)
                // Close sidebar on mobile after selecting menu
                if (window.innerWidth < 1024) {
                  onToggleSidebar()
                }
              }}
              className={`
                w-full 
                flex 
                items-center 
                gap-3 
                p-3 
                rounded-lg 
                transition-all 
                duration-200 
                hover:bg-gray-700
                ${activeTab === item.id 
                  ? 'bg-primary text-white' 
                  : 'text-gray-300 hover:text-white'
                }
              `}
            >
              <div className="shrink-0">
                {item.icon}
              </div>
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {/* HANYA TAMPILKAN SATU BADGE DI SINI */}
              {item.badge && item.badge > 0 && (
                <span className={`
                  text-xs px-2 py-1 rounded-full min-w-5 h-5 flex items-center justify-center
                  ${item.id === 'pending' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-yellow-900'}
                `}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-sm">
                {currentUser?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {currentUser?.full_name || 'Admin'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                Role: {currentUser?.role || 'Admin'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}