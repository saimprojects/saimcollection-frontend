import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products/');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again.');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="text-xl animate-pulse">Loading products...</div>
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
    <div className="max-w-7xl mx-auto p-6 animate-slideIn">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fadeIn max-w-[500px] w-full"
          >
            {product.file && (
              <div className="w-full aspect-square mx-auto overflow-hidden rounded-md mb-4 flex justify-center items-center">
                <img
                  src={product.file}
                  alt={product.title}
                  className="w-full h-full object-contain max-w-full max-h-full"
                  onError={(e) => (e.target.src = '')}
                />
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{product.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-gray-100">${product.price}</span>
              <div className="flex space-x-4">
                <Link
                  to={`/products/${product.slug}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                >
                  Purchase Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}