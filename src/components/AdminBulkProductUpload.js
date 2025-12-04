import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';

const AdminBulkProductUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      showToast({ message: 'Please select a CSV file.', type: 'warning' });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      showToast({ message: 'Please drop a CSV file.', type: 'warning' });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const parseCsv = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        console.warn(`Skipping malformed row: ${lines[i]}`);
        continue;
      }
      const product = {};
      headers.forEach((header, index) => {
        let value = values[index];
        // Basic type conversion for common fields
        if (header === 'price' || header === 'stock') {
          value = Number(value);
          if (isNaN(value)) value = 0; // Default to 0 if not a number
        }
        product[header] = value;
      });
      products.push(product);
    }
    return products;
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast({ message: 'Please select a CSV file to upload.', type: 'warning' });
      return;
    }

    setUploading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      const productsData = parseCsv(text);

      if (productsData.length === 0) {
        showToast({ message: 'CSV file is empty or malformed.', type: 'error' });
        setUploading(false);
        return;
      }

      try {
        // Assuming a backend endpoint for bulk product upload
        const res = await axios.post('/api/products/bulk-upload', { products: productsData }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token
          },
        });
        showToast({ message: `${res.data.count} products uploaded successfully!`, type: 'success' });
        setSelectedFile(null);
        if (onUploadSuccess) {
          onUploadSuccess(); // Notify parent to refresh product list
        }
      } catch (error) {
        showToast({ message: error.response?.data?.message || 'Bulk upload failed.', type: 'error' });
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      showToast({ message: 'Failed to read CSV file.', type: 'error' });
      setUploading(false);
    };

    reader.readAsText(selectedFile);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Bulk Upload Products (CSV)</h3>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('csv-upload-input').click()}
      >
        {selectedFile ? (
          <p className="text-gray-700">Selected file: <span className="font-semibold">{selectedFile.name}</span></p>
        ) : (
          <p className="text-gray-500 mb-2">Drag 'n' drop your CSV file here, or click to select one</p>
        )}
        <input
          type="file"
          id="csv-upload-input"
          className="hidden"
          accept=".csv"
          onChange={handleFileChange}
        />
        {!selectedFile && (
          <label htmlFor="csv-upload-input" className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600">
            Select CSV
          </label>
        )}
      </div>
      {selectedFile && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Products'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBulkProductUpload;