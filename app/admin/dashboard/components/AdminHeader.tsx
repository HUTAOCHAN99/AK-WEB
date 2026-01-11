// app/admin/dashboard/components/AdminHeader.tsx
'use client'

import { MdMenu, MdClose } from 'react-icons/md'

interface AdminHeaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentUser: any;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export default function AdminHeader({ 
  currentUser, 
  onLogout, 
  onToggleSidebar,
  sidebarOpen = true 
}: AdminHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Button - untuk semua device */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-800 transition duration-300 lg:hidden"
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <MdClose className="w-6 h-6" />
          ) : (
            <MdMenu className="w-6 h-6" />
          )}
        </button>
        
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">
            {currentUser?.full_name ? `Welcome, ${currentUser.full_name}` : 'Loading...'}
            {currentUser?.role && (
              <span className="ml-2 px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                {currentUser.role}
              </span>
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium truncate max-w-[200px]">
            {currentUser?.email}
          </p>
          <p className="text-xs text-gray-400">
            Last login: {new Date().toLocaleDateString('id-ID')}
          </p>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded flex items-center gap-2 transition duration-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}