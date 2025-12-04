import React, { useState, useEffect } from 'react';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../api';
import { useToast } from '../contexts/ToastContext';

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null); // null for add, object for edit
  const [formState, setFormState] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await getAddresses();
      setAddresses(res.data);
    } catch (error) {
      showToast({ message: error.response?.data?.message || 'Failed to load addresses.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formState);
        showToast({ message: 'Address updated successfully!', type: 'success' });
      } else {
        await addAddress(formState);
        showToast({ message: 'Address added successfully!', type: 'success' });
      }
      setFormState({ street: '', city: '', state: '', zipCode: '', country: '' });
      setEditingAddress(null);
      fetchAddresses(); // Refresh list
    } catch (error) {
      showToast({ message: error.response?.data?.message || 'Failed to save address.', type: 'error' });
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id);
        showToast({ message: 'Address deleted successfully!', type: 'success' });
        fetchAddresses(); // Refresh list
      } catch (error) {
        showToast({ message: error.response?.data?.message || 'Failed to delete address.', type: 'error' });
      }
    }
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setFormState({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    });
  };

  if (loading) {
    return <div className="text-center py-10">Loading addresses...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Address Book</h2>

      {/* Address List */}
      <div className="space-y-4 mb-8">
        {addresses.length === 0 ? (
          <p className="text-gray-600">No addresses saved yet.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <p className="font-semibold">{address.street}, {address.city}</p>
                <p>{address.state}, {address.zipCode}, {address.country}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(address)}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Address Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
        <form onSubmit={handleAddOrUpdateAddress} className="space-y-4">
          <div>
            <label htmlFor="street" className="block text-gray-700 text-sm font-bold mb-2">Street</label>
            <input
              type="text"
              id="street"
              name="street"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formState.street}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City</label>
              <input
                type="text"
                id="city"
                name="city"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formState.city}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">State/Province</label>
              <input
                type="text"
                id="state"
                name="state"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formState.state}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="zipCode" className="block text-gray-700 text-sm font-bold mb-2">Zip Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formState.zipCode}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formState.country}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {editingAddress ? 'Update Address' : 'Add Address'}
            </button>
            {editingAddress && (
              <button
                type="button"
                onClick={() => {
                  setEditingAddress(null);
                  setFormState({ street: '', city: '', state: '', zipCode: '', country: '' });
                }}
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}