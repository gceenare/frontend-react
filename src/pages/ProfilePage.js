import React, { useState, useEffect } from 'react';
import { getProfile } from '../api';
import ProfileForm from '../components/ProfileForm';
import AddressBook from '../components/AddressBook';
import OrderHistory from '../components/OrderHistory';
import { useToast } from '../contexts/ToastContext';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'addresses', 'orders'
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (error) {
        showToast({ message: error.response?.data?.message || 'Failed to load profile.', type: 'error' });
      }
    };
    fetchProfile();
  }, [showToast]);

  if (!user) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">User Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="md:w-1/4 bg-white p-6 rounded-lg shadow-md">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'addresses' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Address Book
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Order History
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="md:w-3/4 bg-white p-8 rounded-lg shadow-md">
          {activeTab === 'profile' && <ProfileForm user={user} setUser={setUser} />}
          {activeTab === 'addresses' && <AddressBook />}
          {activeTab === 'orders' && <OrderHistory />}
        </main>
      </div>
    </div>
  );
}