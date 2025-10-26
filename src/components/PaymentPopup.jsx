import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function PaymentPopup({ orderId, onClose }) {
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!transactionId) return toast.error("Please enter Transaction ID.");
    setLoading(true);
    try {
      await api.post(`/orders/${orderId}/submit-payment/`, { transaction_id: transactionId });
      toast.success("Payment submitted successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Blur background */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[400px] relative shadow-lg">
          <h2 className="text-xl font-bold mb-4">Manual Payment</h2>
          <div className="mb-4 text-gray-900 dark:text-gray-100">
            <p><strong>Bank Account:</strong> NayaPay</p>
            <p><strong>Account Holder:</strong> Hafiz Abdul Majeed</p>
            <p><strong>Account Number:</strong> 03066816105</p>
            <p><strong>IBAN:</strong> PK11 NAYA 1234 5030 66816105</p>
          </div>
          <input
            type="text"
            placeholder="Enter Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-gray-100"
          />
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
