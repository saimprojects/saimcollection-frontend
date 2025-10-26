import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

function Navbar() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const isAuthed = !!localStorage.getItem('access');

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 dark:bg-black shadow-lg sticky top-0 z-50 animate-fadeIn">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-gray-300 transition-colors duration-300"
        >
          Saim Collection (Digital Products)
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-200 hover:text-white transition-colors duration-300"
          >
            Home
          </Link>
          {isAuthed ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-200 hover:text-white transition-colors duration-300"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-gray-200 hover:text-white transition-colors duration-300"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="text-gray-200 hover:text-white transition-colors duration-300"
              >
                Login
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 01 8.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;