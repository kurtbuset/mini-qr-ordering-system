import { useState } from "react";
import { X, CreditCard, Lock, AlertCircle } from "lucide-react";
import { useToastStore } from "../../store/toastStore";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentData: PaymentResult) => void;
  onPaymentFailed: (error: string) => void;
  amount: number;
  paymentMethod: "debit_card" | "credit_card";
}

export interface PaymentResult {
  transactionId: string;
  last4Digits: string;
  cardType: string;
  timestamp: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  onPaymentFailed,
  amount,
  paymentMethod,
}: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const addToast = useToastStore((state) => state.addToast);

  if (!isOpen) return null;

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  // Detect card type
  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "Visa";
    if (/^5[1-5]/.test(cleaned)) return "Mastercard";
    if (/^3[47]/.test(cleaned)) return "Amex";
    if (/^6(?:011|5)/.test(cleaned)) return "Discover";
    return "Card";
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
      setError("");
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace(/\//g, "").length <= 4) {
      setExpiryDate(formatted);
      setError("");
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    if (value.length <= 4) {
      setCvv(value);
      setError("");
    }
  };

  const validateCard = () => {
    const cleanedCardNumber = cardNumber.replace(/\s/g, "");

    if (cleanedCardNumber.length < 13 || cleanedCardNumber.length > 16) {
      setError("Invalid card number");
      return false;
    }

    if (!cardName.trim()) {
      setError("Cardholder name is required");
      return false;
    }

    const expiryParts = expiryDate.split("/");
    if (expiryParts.length !== 2) {
      setError("Invalid expiry date");
      return false;
    }

    const month = parseInt(expiryParts[0]);
    const year = parseInt("20" + expiryParts[1]);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (month < 1 || month > 12) {
      setError("Invalid expiry month");
      return false;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setError("Card has expired");
      return false;
    }

    if (cvv.length < 3 || cvv.length > 4) {
      setError("Invalid CVV");
      return false;
    }

    return true;
  };

  const processPayment = async () => {
    if (!validateCard()) return;

    setIsProcessing(true);
    setError("");

    try {
      // delay 2 seconds to simulate real transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock payment gateway response
      // 90% success rate for testing
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        const cleanedCardNumber = cardNumber.replace(/\s/g, "");
        const paymentResult: PaymentResult = {
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          last4Digits: cleanedCardNumber.slice(-4),
          cardType: getCardType(cleanedCardNumber),
          timestamp: new Date().toISOString(),
        };

        onPaymentSuccess(paymentResult);
      } else {
        // Simulate various payment failures
        const errors = [
          "Insufficient funds",
          "Card declined by issuer",
          "Invalid card details",
          "Transaction limit exceeded",
        ];
        const randomError = errors[Math.floor(Math.random() * errors.length)];

        // Show toast notification for payment failure
        addToast({
          variant: "error",
          title: "Payment Failed",
          message: randomError,
        });

        onPaymentFailed(randomError);
      }
    } catch (err) {
      onPaymentFailed("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processPayment();
  };

  const cardType = getCardType(cardNumber);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-brand-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Payment
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Payment Amount */}
        <div className="mb-6 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 p-4 text-white">
          <p className="text-sm opacity-90">Total Amount</p>
          <p className="text-3xl font-bold">${amount.toFixed(2)}</p>
          <p className="mt-1 text-xs opacity-75 capitalize">
            {paymentMethod.replace("_", " ")}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                disabled={isProcessing}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                {cardType}
              </div>
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => {
                setCardName(e.target.value);
                setError("");
              }}
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
              disabled={isProcessing}
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                CVV
              </label>
              <input
                type="password"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            <Lock className="h-4 w-4 flex-shrink-0" />
            <p>Your payment information is secure and encrypted</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Payment...
              </span>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
