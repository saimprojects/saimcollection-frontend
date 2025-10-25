import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function VerifyOtpForm({ email, code, setCode, setStep }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateCode = (code) => {
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
  };

  const handleVerifyOtp = async () => {
    if (!validateCode(code)) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/signup/verify-otp/', { email, code });
      toast.success('OTP verified successfully.');
      setStep(3);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to verify OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Verify OTP</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">Enter the 6-digit code sent to your email.</p>
      <input
        type="text"
        placeholder="OTP Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        disabled={loading}
      />
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <button
        onClick={handleVerifyOtp}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
  );
}