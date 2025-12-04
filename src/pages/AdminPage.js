import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getProducts, getOrders } from '../api';
import { useToast } from '../contexts/ToastContext';
import AdminProductImageUpload from '../components/AdminProductImageUpload';
import AdminBulkProductUpload from '../components/AdminBulkProductUpload'; // Import the new component

// Mock data for charts (replace with actual API data)
const salesData = [
  { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 }, { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 }, { name: 'May', sales: 6000 }, { name: 'Jun', sales: 5500 },
];

const topProductsData = [
  { name: 'Laptop Pro', sales: 120 }, { name: 'Gaming PC', sales: 90 }, { name: '4K Monitor', sales: 75 },
  { name: 'Wireless Mouse', sales: 150 }, { name: 'Mechanical Keyboard', sales: 110 },
];

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className="text-3xl text-blue-500 mr-4">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productIdToUploadImageFor, setProductIdToUploadImageFor] = useState('');
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([getProducts(), getOrders()]);
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (error) {
      showToast({ message: error.response?.data?.message || 'Failed to load admin data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [showToast]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const stockAlerts = products.filter(p => p.stock < 10).length;

  const handleImageUploadSuccess = (newImageUrl) => {
    showToast({ message: 'Product image updated!', type: 'success' });
    // Optionally refresh products or update the specific product's image URL in state
    setProductIdToUploadImageFor('');
    fetchData(); // Refresh product list to show updated image
  };

  const handleBulkUploadSuccess = () => {
    showToast({ message: 'Products bulk uploaded successfully!', type: 'success' });
    fetchData(); // Refresh product list
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-10">Loading admin data...</div>;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Orders" value={totalOrders} icon="📦" />
              <StatCard title="Total Products" value={totalProducts} icon="💻" />
              <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon="💰" />
              <StatCard title="Low Stock Alerts" value={stockAlerts} icon="⚠️" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Sales Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Top Selling Products</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProductsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'products':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Products</h2>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4">Product List</h3>
              <input type="text" placeholder="Search products..." className="w-full p-2 border rounded-lg mb-4" />
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Stock</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{p.id}</td>
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">{p.category}</td>
                      <td className="p-2">${p.price.toFixed(2)}</td>
                      <td className="p-2">{p.stock}</td>
                      <td className="p-2">
                        <button className="text-blue-600 hover:underline mr-2">Edit</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Image Upload for Products */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4">Upload Product Image</h3>
              <div className="mb-4">
                <label htmlFor="productIdForImage" className="block text-gray-700 text-sm font-bold mb-2">
                  Product ID for Image Upload:
                </label>
                <input
                  type="text"
                  id="productIdForImage"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={productIdToUploadImageFor}
                  onChange={(e) => setProductIdToUploadImageFor(e.target.value)}
                  placeholder="Enter Product ID"
                />
              </div>
              {productIdToUploadImageFor && (
                <AdminProductImageUpload
                  productId={productIdToUploadImageFor}
                  onUploadSuccess={handleImageUploadSuccess}
                />
              )}
            </div>

            {/* Bulk Upload Products (CSV) */}
            <AdminBulkProductUpload onUploadSuccess={handleBulkUploadSuccess} />
          </div>
        );
      case 'orders':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <input type="text" placeholder="Search orders..." className="w-full p-2 border rounded-lg mb-4" />
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Order ID</th>
                    <th className="p-2">Customer</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">#{o.id}</td>
                      <td className="p-2">{o.customerName || 'N/A'}</td>
                      <td className="p-2">${o.total.toFixed(2)}</td>
                      <td className="p-2">{o.status}</td>
                      <td className="p-2">
                        <button className="text-blue-600 hover:underline mr-2">View</button>
                        <button className="text-green-600 hover:underline">Update Status</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Admin</h1>
        <nav>
          <a href="#" onClick={() => setActiveTab('dashboard')} className={`block py-2 px-4 rounded ${activeTab === 'dashboard' ? 'bg-blue-600' : ''}`}>Dashboard</a>
          <a href="#" onClick={() => setActiveTab('products')} className={`block py-2 px-4 rounded ${activeTab === 'products' ? 'bg-blue-600' : ''}`}>Products</a>
          <a href="#" onClick={() => setActiveTab('orders')} className={`block py-2 px-4 rounded ${activeTab === 'orders' ? 'bg-blue-600' : ''}`}>Orders</a>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPage;