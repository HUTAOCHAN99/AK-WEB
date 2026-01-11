// app/admin/dashboard/components/SettingsTab.tsx
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { 
  MdSave, 
  MdPerson, 
  MdEmail, 
  MdLock, 
  MdNotifications, 
  MdLanguage, 
  MdSecurity,
  MdPalette,
  MdAccessTime,
  MdInfo,
  MdCheckCircle,
  MdWarning
} from 'react-icons/md'

interface SettingsTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentUser: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSaveSettings: (settings: any) => Promise<void>;
}

export default function SettingsTab({ currentUser, onSaveSettings }: SettingsTabProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    // Profile
    fullName: currentUser?.full_name || '',
    email: currentUser?.email || '',
    
    // Notifications
    emailNotifications: true,
    adminApprovalNotifications: true,
    activityUpdateNotifications: true,
    
    // Dashboard
    dashboardRefresh: 30,
    defaultView: 'dashboard',
    showStatistics: true,
    
    // Appearance
    theme: 'dark',
    sidebarCollapsed: false,
    compactMode: false,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 60,
    
    // Advanced
    apiAccess: false,
    debugMode: false,
  })

  // Initialize settings from current user
  useEffect(() => {
    if (currentUser) {
      setSettings(prev => ({
        ...prev,
        fullName: currentUser.full_name || '',
        email: currentUser.email || ''
      }))
    }
  }, [currentUser])

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSaveSettings(settings)
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        fullName: currentUser?.full_name || '',
        email: currentUser?.email || '',
        emailNotifications: true,
        adminApprovalNotifications: true,
        activityUpdateNotifications: true,
        dashboardRefresh: 30,
        defaultView: 'dashboard',
        showStatistics: true,
        theme: 'dark',
        sidebarCollapsed: false,
        compactMode: false,
        twoFactorAuth: false,
        sessionTimeout: 60,
        apiAccess: false,
        debugMode: false,
      })
      toast.success('Settings reset to default')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-gray-400">Manage your account and dashboard preferences</p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <MdPerson className="w-5 h-5" />
            Profile Information
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2 text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={settings.fullName}
                  onChange={(e) => setSettings({...settings, fullName: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-gray-300">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  <div className="absolute right-3 top-3">
                    <MdEmail className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-2 text-gray-300">Account Role</label>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{currentUser?.role || 'Admin'}</span>
                  <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <MdNotifications className="w-5 h-5" />
            Notifications
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive email updates for new activities and approvals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Admin Approval Notifications</p>
                  <p className="text-sm text-gray-400">Get notified when new admin requests are submitted</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.adminApprovalNotifications}
                    onChange={(e) => setSettings({...settings, adminApprovalNotifications: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Activity Update Notifications</p>
                  <p className="text-sm text-gray-400">Receive updates when activities are modified</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.activityUpdateNotifications}
                    onChange={(e) => setSettings({...settings, activityUpdateNotifications: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <label className="block text-sm mb-2 text-gray-300">Dashboard Auto-Refresh</label>
              <select
                value={settings.dashboardRefresh}
                onChange={(e) => setSettings({...settings, dashboardRefresh: parseInt(e.target.value)})}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
                <option value="300">5 minutes</option>
                <option value="0">Never (manual refresh)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">How often the dashboard should refresh data automatically</p>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <MdPalette className="w-5 h-5" />
            Appearance
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-4 text-gray-300">Theme</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'dark', label: 'Dark', color: 'bg-gray-800' },
                  { id: 'light', label: 'Light', color: 'bg-gray-200' },
                  { id: 'auto', label: 'Auto', color: 'bg-gradient-to-r from-gray-800 to-gray-200' }
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSettings({...settings, theme: theme.id})}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      settings.theme === theme.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-10 h-10 rounded-lg mx-auto mb-3 ${theme.color}`}></div>
                      <span className="text-sm font-medium">{theme.label}</span>
                    </div>
                    {settings.theme === theme.id && (
                      <div className="flex justify-center mt-2">
                        <MdCheckCircle className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-gray-400">Use compact spacing for lists and tables</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.compactMode}
                    onChange={(e) => setSettings({...settings, compactMode: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Statistics</p>
                  <p className="text-sm text-gray-400">Display statistics cards on dashboard</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.showStatistics}
                    onChange={(e) => setSettings({...settings, showStatistics: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <MdSecurity className="w-5 h-5" />
            Security
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <label className="block text-sm mb-2 text-gray-300">Session Timeout</label>
              <select
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="0">Never (until logout)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">Automatically log out after period of inactivity</p>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <MdWarning className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-300">Password Security</p>
                  <p className="text-xs text-yellow-400/80 mt-1">
                    Your password was last changed 90 days ago. Consider updating it for better security.
                  </p>
                  <button className="mt-2 text-xs text-yellow-300 hover:text-yellow-200 font-medium">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <MdInfo className="w-5 h-5" />
            Advanced
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">API Access</p>
                <p className="text-sm text-gray-400">Enable API access for external integrations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.apiAccess}
                  onChange={(e) => setSettings({...settings, apiAccess: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Debug Mode</p>
                <p className="text-sm text-gray-400">Show technical details and logs (for developers only)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.debugMode}
                  onChange={(e) => setSettings({...settings, debugMode: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <MdInfo className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-300">Version Information</p>
                  <p className="text-blue-400/80 mt-1">
                    Dashboard Version: 2.1.0 • Last Updated: December 2023
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-700">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition duration-300"
          >
            Reset to Default
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition duration-300"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <MdSave className="w-5 h-5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}