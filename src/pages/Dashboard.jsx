import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ------------------------
  // Fetch orders & products
  // ------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get('/orders/'),
          api.get('/products/'),
        ]);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response?.data || err);
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ------------------------
  // Create Order
  // ------------------------
  const handleCreateOrder = async (productId) => {
    try {
      const { data } = await api.post('/orders/create/', { product_id: productId });
      toast.success('Order created successfully!');
      setOrders(prev => [data, ...prev]);
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error('Failed to create order.');
    }
  };

  // ------------------------
  // Download / Open Link
  // ------------------------
  const handleDownload = async (linkId) => {
    try {
      const response = await api.get(`/orders/download/${linkId}/`, {
        responseType: 'blob',
      });
      if (response.status !== 200) throw new Error('Download failed');
      toast.success('Download started.');
      window.location.href = `${api.defaults.baseURL}/orders/download/${linkId}/`;
    } catch (err) {
      console.error(err);
      toast.error('Failed to download file.');
    }
  };

  // ------------------------
  // Logout
  // ------------------------
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'rejected':
        return 'text-red-600 dark:text-red-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'approved':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl animate-pulse">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          Dashboard
        </motion.h1>
        <motion.button
          onClick={handleLogout}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Logout
        </motion.button>
      </div>

      {/* ----------------- */}
      {/* Orders Section */}
      {/* ----------------- */}
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      <AnimatePresence>
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center mb-3"
          >
            <div>
              <div className="font-semibold">{order.product_title}</div>
              <div className={`text-sm ${getStatusColor(order.status)}`}>
                Status: {order.status}
              </div>
            </div>

            {order.status.toLowerCase() === 'approved' ? (
              order.download_link ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleDownload(order.download_link.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                >
                  Download ({order.download_link.remaining_downloads} left)
                </motion.button>
              ) : order.external_link ? (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href={order.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-green-600 text-white rounded-lg"
                >
                  Open Link
                </motion.a>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">
                  You Will Recieve an Email with this Product within 24 Hours
                </span>
              )
            ) : (
              <span className="text-gray-600 dark:text-gray-400">
                You Will Recieve an Email with this Product within 24 Hours
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
