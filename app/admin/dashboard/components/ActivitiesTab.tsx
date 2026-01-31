// app\admin\dashboard\components\ActivitiesTab.tsx - Hapus debug sections
'use client'

import { MdAdd, MdEdit, MdDelete, MdPhotoLibrary, MdImage, MdCategory } from 'react-icons/md'
import { Activity } from '../types'

interface ActivitiesTabProps {
  activities: Activity[];
  loading: boolean;
  onOpenModal: (mode: 'add' | 'edit', activity?: Activity) => void;
  onDelete: (id: string) => void;
}

export default function ActivitiesTab({
  activities,
  loading,
  onOpenModal,
  onDelete,
}: ActivitiesTabProps) {
  return (
    <>
      <div className="mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Activities Management</h2>
            <p className="text-gray-400">Manage all organization activities and events</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 rounded-lg px-4 py-2">
              <span className="text-gray-400 mr-2">Total:</span>
              <span className="font-semibold">{activities.length} Activities</span>
            </div>
            
            <button
              onClick={() => onOpenModal('add')}
              className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg flex items-center gap-2 transition duration-300"
            >
              <MdAdd className="w-5 h-5" />
              <span>Add New Activity</span>
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-400">Loading activities...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl">
          <MdPhotoLibrary className="text-5xl text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No activities found</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            You havent created any activities yet. Start by adding your first activity to showcase on the website.
          </p>
          <button
            onClick={() => onOpenModal('add')}
            className="bg-primary hover:bg-primary-dark px-6 py-3 rounded-lg flex items-center gap-2 transition duration-300 mx-auto"
          >
            <MdAdd className="w-5 h-5" />
            <span>Create First Activity</span>
          </button>
        </div>
      ) : (
        <>
          {/* Activity Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-750 transition duration-300 overflow-hidden flex flex-col group">
                {/* Image Preview */}
                <div className="relative h-48">
                  {activity.image_url ? (
                    <div className="w-full h-full bg-gray-600">
                      <img 
                        src={activity.image_url} 
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-linear-to-br from-gray-700 to-gray-800 flex flex-col items-center justify-center">
                                <svg class="w-12 h-12 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p class="text-gray-400 text-sm">Image failed to load</p>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-800 flex flex-col items-center justify-center">
                      <MdImage className="text-4xl text-gray-500 mb-3" />
                      <p className="text-gray-400 text-sm">No thumbnail</p>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      activity.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white line-clamp-1" title={activity.title}>
                        {activity.title}
                      </h3>
                    </div>
                    
                    {activity.category && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <MdCategory className="w-4 h-4 shrink-0" />
                        <span className="truncate" title={activity.category}>
                          {activity.category}
                        </span>
                      </div>
                    )}
                    
                    <p className="text-gray-300 text-sm line-clamp-2 mb-4" title={activity.description}>
                      {activity.description}
                    </p>
                  </div>
                  
                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <span>Order: {activity.order_index}</span>
                          {activity.created_at && (
                            <>
                              <span className="text-gray-600">•</span>
                              <span title={new Date(activity.created_at).toLocaleString()}>
                                {new Date(activity.created_at).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-1">
                        <button
                          onClick={() => onOpenModal('edit', activity)}
                          className="text-blue-400 hover:text-blue-300 p-2 transition duration-300 rounded-lg hover:bg-blue-500/10"
                          title="Edit"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(activity.id)}
                          className="text-red-400 hover:text-red-300 p-2 transition duration-300 rounded-lg hover:bg-red-500/10"
                          title="Delete"
                        >
                          <MdDelete className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Stats Summary */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">{activities.length}</div>
                <div className="text-gray-400 text-sm">Total Activities</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {activities.filter(a => a.status === 'active').length}
                </div>
                <div className="text-gray-400 text-sm">Active</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {activities.filter(a => a.status === 'inactive').length}
                </div>
                <div className="text-gray-400 text-sm">Inactive</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {new Set(activities.map(a => a.category).filter(Boolean)).size}
                </div>
                <div className="text-gray-400 text-sm">Categories</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}