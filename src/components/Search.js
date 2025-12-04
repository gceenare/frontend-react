import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchProducts } from '../api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const debounceTimer = setTimeout(() => {
      searchProducts(query).then(res => {
        setResults(res.data);
        setIsOpen(true);
      });
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
        className="w-64 p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white text-black rounded-lg shadow-lg z-20">
          <ul>
            {results.map(product => (
              <li key={product.id} className="border-b last:border-b-0">
                <Link
                  to={`/product/${product.id}`}
                  className="flex items-center p-2 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover mr-4" />
                  <span>{product.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;