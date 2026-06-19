import { Account } from "../../types/account";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface DeleteAccountModalProps {
  isOpen: boolean;
  account: Account | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  account,
  onConfirm,
  onCancel,
}: DeleteAccountModalProps) {
  if (!account) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} className="max-w-md m-4">
      <div className="relative w-full max-w-md p-6 bg-white rounded-3xl dark:bg-gray-900">
        <div className="mb-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full dark:bg-red-900/20">
            <svg
              className="w-6 h-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-center text-gray-800 dark:text-white/90">
            Delete Account
          </h3>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this account? This action cannot be
            undone.
          </p>
        </div>

        <div className="p-4 mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 overflow-hidden text-white rounded-full bg-brand-500">
              <span className="text-sm font-medium">
                {account.firstName.charAt(0)}
                {account.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {account.firstName} {account.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {account.email}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-500 hover:bg-red-600"
            onClick={onConfirm}
            size="sm"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </Modal>
  );
}
