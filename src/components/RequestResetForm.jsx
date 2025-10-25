import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function RequestResetForm({ email, setEmail }) {
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    setLoading(true);
    try {
      await api.post('/auth/password/reset/', { email });
      toast.success('If the email exists, a reset link has been sent.');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to send reset link. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Request Reset Link</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        disabled={loading}
      />
      <button
        onClick={handleRequestReset}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Request Reset Link'}
      </button>
    </div>
  );
}