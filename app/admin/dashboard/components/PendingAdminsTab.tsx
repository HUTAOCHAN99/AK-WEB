'use client'

import { MdPendingActions, MdPerson, MdCheck, MdClose, MdVerified } from 'react-icons/md'
import { PendingAdmin } from '../types'

interface PendingAdminsTabProps {
  pendingAdmins: PendingAdmin[];
  loading: boolean;
  approving: string;
  onApprove: (profileId: number, adminId: string) => void;
  onReject: (profileId: number, adminId: string) => void;
}

export default function PendingAdminsTab({
  pendingAdmins,
  loading,
  approving,
  onApprove,
  onReject
}: PendingAdminsTabProps) {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-gray-300 mb-2">
          <MdPendingActions className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Admin Menunggu Persetujuan</h2>
        </div>
        <p className="text-gray-400">Verifikasi dan setujui permintaan admin baru</p>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-400">Loading pending admins...</p>
        </div>
      ) : pendingAdmins.length === 0 ? (
        <div className="text-center py-8">
          <p className="mt-2 text-gray-400">Tidak ada admin yang menunggu persetujuan.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingAdmins.map((admin) => (
            <div key={admin.id} className="bg-gray-700 p-6 rounded-lg hover:bg-gray-650 transition duration-300">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <MdPerson className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{admin.full_name}</h3>
                      <p className="text-gray-400 text-sm">{admin.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Alasan Bergabung:</p>
                      <p className="text-gray-300 bg-gray-800 p-3 rounded">{admin.reason || 'Tidak ada alasan yang diberikan'}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                          {admin.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Daftar:</span>
                        <span className="ml-2 text-gray-300">
                          {new Date(admin.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onApprove(admin.profile_id, admin.id)}
                    disabled={approving === admin.id}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition duration-300 disabled:opacity-50"
                  >
                    {approving === admin.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <MdCheck className="w-5 h-5" />
                        <span>Setujui</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onReject(admin.profile_id, admin.id)}
                    disabled={approving === admin.id}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition duration-300 disabled:opacity-50"
                  >
                    <MdClose className="w-5 h-5" />
                    <span>Tolak</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}