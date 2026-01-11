'use client'

import { TimelineItem } from '../types'

interface TimelineModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  currentItem: TimelineItem | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function TimelineModal({
  isOpen,
  mode,
  currentItem,
  onClose,
  onSubmit
}: TimelineModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {mode === 'add' ? 'Add Timeline Item' : 'Edit Timeline Item'}
        </h2>
        <form onSubmit={onSubmit}>
          <input type="hidden" name="id" defaultValue={currentItem?.id || ''} />
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Title *</label>
              <input
                type="text"
                name="title"
                defaultValue={currentItem?.title || ''}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Date *</label>
              <input
                type="date"
                name="date"
                defaultValue={currentItem?.date || ''}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Description *</label>
              <textarea
                name="description"
                defaultValue={currentItem?.description || ''}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 h-32 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                defaultValue={currentItem?.tags || ''}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary-dark rounded transition duration-300"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}