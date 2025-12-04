import React, { useState } from 'react';
import axios from 'axios'; // Using axios directly for file upload
import { useToast } from '../contexts/ToastContext';

const AdminProductImageUpload = ({ productId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast({ message: 'Please select an image to upload.', type: 'warning' });
      return;
    }
    if (!productId) {
      showToast({ message: 'Product ID is required to upload an image.', type: 'error' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Assuming a backend endpoint for image upload
      const res = await axios.post(`/api/products/${productId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token
        },
      });
      showToast({ message: 'Image uploaded successfully!', type: 'success' });
      setSelectedFile(null);
      setPreviewUrl(null);
      if (onUploadSuccess) {
        onUploadSuccess(res.data.imageUrl); // Pass new image URL to parent
      }
    } catch (error) {
      showToast({ message: error.response?.data?.message || 'Image upload failed.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold mb-4">Upload Product Image</h3>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('image-upload-input').click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Image Preview" className="max-h-48 mx-auto mb-4 rounded-lg" />
        ) : (
          <p className="text-gray-500 mb-2">Drag 'n' drop an image here, or click to select one</p>
        )}
        <input
          type="file"
          id="image-upload-input"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        {!previewUrl && (
          <label htmlFor="image-upload-input" className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600">
            Select Image
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
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProductImageUpload;