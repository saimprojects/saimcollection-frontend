import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

// Payment popup component
function PaymentPopup({ productId, onClose }) {
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!transactionId) return toast.error('Please enter Transaction ID.');
    setLoading(true);
    try {
      await api.post('/orders/submit-payment/', {
        product_id: productId,
        transaction_id: transactionId
      });
      toast.success('Payment submitted successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[400px] shadow-lg relative">
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
            <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Main ProductDetail component
export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}/`);
        setProduct(data);
        setLoading(false);
      } catch {
        setError('Failed to fetch product details.');
        setLoading(false);
      }
    };

    const fetchSuggested = async () => {
      try {
        const { data } = await api.get('/products/');
        setSuggestedProducts(
          data.filter(p => p.slug !== slug).sort(() => 0.5 - Math.random()).slice(0, 3)
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
    fetchSuggested();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{product.title}</h1>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        {product.file && (
          <img
            src={product.file}
            alt={product.title}
            className="w-[500px] h-[500px] object-cover rounded-md mb-4"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/500')}
          />
        )}
        <p className="mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold">${product.price}</span>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowPayment(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Buy
            </button>
            {product.file && (
              <a
                href={product.file}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                View File
              </a>
            )}
          </div>
        </div>
      </div>

      {suggestedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Suggested Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedProducts.map(s => (
              <div key={s.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                {s.file && <img src={s.file} alt={s.title} className="w-[500px] h-[500px] object-cover rounded-md mb-4" />}
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <span>${s.price}</span>
                <Link to={`/products/${s.slug}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-2 inline-block">View</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPayment && <PaymentPopup productId={product.id} onClose={() => setShowPayment(false)} />}
    </div>
  );
}
