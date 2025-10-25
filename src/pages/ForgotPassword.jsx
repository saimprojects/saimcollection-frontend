import React, { useEffect, useState } from 'react';
import RequestResetForm from '../components/RequestResetForm';
import ConfirmResetForm from '../components/ConfirmResetForm';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get('email');
    const t = params.get('token');
    if (e) setEmail(e);
    if (t) setToken(t);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 animate-slideIn">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl animate-fadeIn">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Forgot Password</h1>
        <div className="space-y-6">
          <RequestResetForm email={email} setEmail={setEmail} />
          {token && <ConfirmResetForm email={email} token={token} setToken={setToken} />}
        </div>
      </div>
    </div>
  );
}