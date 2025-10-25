import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function SetPasswordForm({ email, password, setPassword, setStep }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSetPassword = async () => {
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/signup/set-password/', { email, password });
      toast.success('Password set successfully. You can now login.');
      setStep(1);
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to set password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Set Password</h2>
      <input
        type="password"
        placeholder="Set Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        disabled={loading}
      />
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <button
        onClick={handleSetPassword}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Setting...' : 'Set Password'}
      </button>
    </div>
  );
}