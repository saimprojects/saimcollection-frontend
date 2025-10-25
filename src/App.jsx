import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from './components/ThemeContext';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-slideIn">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        <Toaster
          position="top-right"
          toastOptions={{
            className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            success: { style: { background: '#10B981', color: '#fff' } },
            error: { style: { background: '#EF4444', color: '#fff' } },
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
