'use client'

import { MdAdd, MdEdit, MdDelete, MdOutlineTimeline } from 'react-icons/md'
import { TimelineItem } from '../types'

interface TimelineTabProps {
  timelineData: TimelineItem[];
  loading: boolean;
  onOpenModal: (mode: 'add' | 'edit', item?: TimelineItem) => void;
  onDelete: (id: string) => void;
}

export default function TimelineTab({
  timelineData,
  loading,
  onOpenModal,
  onDelete
}: TimelineTabProps) {
  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => onOpenModal('add')}
          className="bg-primary hover:bg-primary-dark px-4 py-2 rounded flex items-center gap-2 transition duration-300"
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
            <div key={item.id} className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition duration-300">
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
                    onClick={() => onOpenModal('edit', item)}
                    className="text-blue-400 hover:text-blue-300 p-1 transition duration-300"
                    title="Edit"
                  >
                    <MdEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-400 hover:text-red-300 p-1 transition duration-300"
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
    </>
  );
}