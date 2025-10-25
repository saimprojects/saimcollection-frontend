import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RequestOtpForm from '../components/RequestOtpForm';
import VerifyOtpForm from '../components/VerifyOtpForm';
import SetPasswordForm from '../components/SetPasswordForm';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 animate-slideIn">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl animate-fadeIn">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Signup</h1>
        {step === 1 && <RequestOtpForm email={email} setEmail={setEmail} setStep={setStep} />}
        {step === 2 && <VerifyOtpForm email={email} code={code} setCode={setCode} setStep={setStep} />}
        {step === 3 && <SetPasswordForm email={email} password={password} setPassword={setPassword} setStep={setStep} />}
        <Link
          to="/login"
          className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 mt-4"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}