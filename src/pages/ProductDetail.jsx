import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}/`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details. Please try again.');
        setLoading(false);
      }
    };

    const fetchSuggestedProducts = async () => {
      try {
        const { data } = await api.get('/products/');
        const filtered = data.filter((p) => p.slug !== slug);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setSuggestedProducts(shuffled.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch suggested products:', err);
      }
    };

    setLoading(true);
    fetchProduct();
    fetchSuggestedProducts();
  }, [slug]);

  const handleBuy = async () => {
    try {
      // ✅ Corrected payload: backend expects `product_id`
      await api.post('/orders/create/', { product_id: product.id });
      toast.success('Order created and pending approval.');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create order. Make sure you are logged in.');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="text-xl animate-pulse">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="text-xl text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="animate-slideIn">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Product Details</h1>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl animate-fadeIn">
        {product.file && (
          <img
            src={product.file}
            alt={product.title}
            className="w-[500px] h-[500px] object-cover rounded-md mb-4 mx-auto"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/500')}
          />
        )}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{product.title}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{product.description}</p>
        <div className="flex items-center justify-between mb-6">
          <span className="font-semibold text-gray-900 dark:text-gray-100">${product.price}</span>
          <div className="flex space-x-4">
            <button
              onClick={handleBuy}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105"
            >
              Buy
            </button>
            {product.file && (
              <a
                href={product.file}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105"
              >
                View File
              </a>
            )}
          </div>
        </div>
      </div>

      {suggestedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Suggested Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedProducts.map((suggested) => (
              <div
                key={suggested.id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fadeIn"
              >
                {suggested.file && (
                  <img
                    src={suggested.file}
                    alt={suggested.title}
                    className="w-[500px] h-[500px] object-cover rounded-md mb-4"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/500')}
                  />
                )}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{suggested.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">{suggested.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">${suggested.price}</span>
                  <Link
                    to={`/products/${suggested.slug}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
