import { useState, useEffect } from "react";
import { Account } from "../../types/account";
import { accountService } from "../../services/accountService";
import { useToastStore } from "../../store/toastStore";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import AccountForm from "../../components/Accounts/AccountForm";
import DeleteAccountModal from "../../components/Accounts/DeleteAccountModal";

export default function AccountsManagement() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const {
    isOpen: isFormOpen,
    openModal: openFormModal,
    closeModal: closeFormModal,
  } = useModal();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const addToast = useToastStore((state) => state.addToast);
  const currentAccount = useAuthStore((state) => state.account);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await accountService.getAll();
      setAccounts(data);
    } catch (error: any) {
      addToast({
        variant: "error",
        title: "Error",
        message: error.message || "Failed to load accounts",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedAccount(null);
    openFormModal();
  };

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    openFormModal();
  };

  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (!accountToDelete) return;

    try {
      await accountService.delete(accountToDelete.id);
      addToast({
        variant: "success",
        title: "Success",
        message: "Account deleted successfully",
      });
      closeDeleteModal();
      setAccountToDelete(null);
      loadAccounts();
    } catch (error: any) {
      addToast({
        variant: "error",
        title: "Error",
        message: error.message || "Failed to delete account",
      });
    }
  };

  const handleFormSuccess = () => {
    closeFormModal();
    setSelectedAccount(null);
    loadAccounts();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 dark:text-gray-400">
          Loading accounts...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Account Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage user accounts and permissions
          </p>
        </div>
        <Button onClick={handleCreateNew} size="sm">
          Add New Account
        </Button>
      </div>

      {/* Accounts Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {accounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No accounts found
                  </td>
                </tr>
              ) : (
                accounts.map((account) => (
                  <tr
                    key={account.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 mr-3 overflow-hidden text-white rounded-full bg-brand-500">
                          <span className="text-sm font-medium">
                            {account.firstName.charAt(0)}
                            {account.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {account.firstName} {account.lastName}
                          </div>
                          {currentAccount?.id === account.id && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              (You)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap dark:text-gray-300">
                      {account.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
                        {account.role}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          account.isActive
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {account.isActive ? "Active" : "Inactive"}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(account)}
                          className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(account)}
                          className="text-red-500 hover:text-red-600 dark:text-red-400"
                          disabled={currentAccount?.id === account.id}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeFormModal}
        className="max-w-[700px] m-4"
      >
        <AccountForm
          account={selectedAccount}
          onSuccess={handleFormSuccess}
          onCancel={closeFormModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteAccountModal
        isOpen={isDeleteOpen}
        account={accountToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}
