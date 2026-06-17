import { Modal } from "../ui/modal";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-0">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Sign Out
        </h3>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Are you sure you want to sign out? You'll need to sign in again
                to access your account.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 justify-end p-6 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </Modal>
  );
}
