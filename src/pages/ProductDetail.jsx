import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { motion } from 'framer-motion';

function PaymentPopup({ productId, onClose }) {
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!transactionId) return toast.error('Please enter Transaction ID.');
    setLoading(true);
    try {
      await api.post('/orders/create/', { product_id: productId, transaction_id: transactionId });
      toast.success('Payment submitted!');
      onClose();
    } catch {
      toast.error('Failed to submit payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      ></motion.div>

      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[400px] shadow-lg relative">
          <h2 className="text-xl font-bold mb-4">Manual Payment</h2>
          <div className="mb-4 text-gray-900 dark:text-gray-100 space-y-1">
            <p><strong>Bank:</strong> NayaPay</p>
            <p><strong>Holder:</strong> Hafiz Abdul Majeed</p>
            <p><strong>Acc No:</strong> 03066816105</p>
            <p><strong>IBAN:</strong> PK11 NAYA 1234 5030 66816105</p>
          </div>
          <input
            type="text"
            placeholder="Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-gray-100"
          />
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}/`);
        setProduct(data);
      } catch {
        setError('Failed to fetch product.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggested = async () => {
      try {
        const { data } = await api.get('/products/');
        setSuggested(data.filter(p => p.slug !== slug).sort(() => 0.5 - Math.random()).slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
    fetchSuggested();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  const Card = ({ item }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 transition-all duration-300"
    >
      {item.file && <img src={item.file} alt={item.title} className="w-full h-64 object-cover rounded mb-3" />}
      <h3 className="font-semibold mb-1">{item.title}</h3>
      {item.price && <p className="text-gray-700 dark:text-gray-300 mb-2">${item.price}</p>}
      <Link to={`/products/${item.slug}`} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">View</Link>
    </motion.div>
  );

  return (
    <motion.div className="space-y-6 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.h1 className="text-3xl font-bold" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{product.title}</motion.h1>

      <motion.div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col md:flex-row gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {product.file && (
          <motion.img
            src={product.file}
            alt={product.title}
            className="w-full md:w-96 h-96 object-cover rounded"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onError={(e) => (e.target.src = 'https://via.placeholder.com/500')}
          />
        )}
        <div className="flex-1 flex flex-col justify-between">
          <p className="mb-4">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">${product.price}</span>
            <div className="flex gap-2">
              <button onClick={() => setShowPayment(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Buy</button>
              {product.file && (
                <a href={product.file} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">View File</a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {suggested.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Suggested Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggested.map(s => <Card key={s.id} item={s} />)}
          </div>
        </div>
      )}

      {showPayment && <PaymentPopup productId={product.id} onClose={() => setShowPayment(false)} />}
    </motion.div>
  );
}
