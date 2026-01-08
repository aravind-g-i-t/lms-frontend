import React from "react";

interface DeleteMessageModalProps {
  open: boolean;
  canDeleteForEveryone: boolean;
  onClose: () => void;
  onDeleteForMe: () => void;
  onDeleteForEveryone: () => void;
}

export const DeleteMessageModal: React.FC<DeleteMessageModalProps> = ({
  open,
  canDeleteForEveryone,
  onClose,
  onDeleteForMe,
  onDeleteForEveryone,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl transform transition-all">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Delete message(s)
            </h2>
          </div>
          <p className="text-sm text-gray-500 ml-15">
            This action cannot be undone
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={onDeleteForMe}
            className="w-full group relative rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3.5 text-sm font-semibold text-white hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Delete for me
            </span>
          </button>

          {canDeleteForEveryone && (
            <button
              onClick={onDeleteForEveryone}
              className="w-full group relative rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-3.5 text-sm font-semibold text-white hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-600/30 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Delete for everyone
              </span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};