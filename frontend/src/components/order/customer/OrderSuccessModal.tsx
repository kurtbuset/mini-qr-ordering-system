import React from "react";
import { Modal } from "../../ui/modal";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md mx-4">
      <div className="p-6 sm:p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg
            className="h-10 w-10 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Order Placed Successfully!
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Your order has been received and is being prepared.
        </p>

        <div className="mb-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
            Order Number
          </p>
          <p className="text-2xl font-bold text-brand-600">{orderNumber}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Continue Shopping
        </button>
      </div>
    </Modal>
  );
};
