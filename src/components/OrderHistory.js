import React, { useState, useEffect } from 'react';
import { getOrders, getOrderInvoice } from '../api';
import { useToast } from '../contexts/ToastContext';

const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data);
    } catch (error) {
      showToast({ message: error.response?.data?.message || 'Failed to load orders.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await getOrderInvoice(orderId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-order-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast({ message: 'Invoice downloaded successfully!', type: 'success' });
    } catch (error) {
      showToast({ message: error.response?.data?.message || 'Failed to download invoice.', type: 'error' });
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading orders...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStatusIndex = orderStatuses.indexOf(order.status);
            return (
              <div key={order.id} className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-200 text-blue-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600 mb-4">Total: ${order.total.toFixed(2)}</p>

                {/* Order Tracking Progress Bar */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Order Status:</h4>
                  <div className="flex justify-between items-center relative">
                    {orderStatuses.map((status, index) => (
                      <div key={status} className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white z-10
                          ${index <= currentStatusIndex ? 'bg-blue-600' : 'bg-gray-400'}`}>
                          {index + 1}
                        </div>
                        <span className="text-xs mt-1 text-center">{status}</span>
                      </div>
                    ))}
                    <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 z-0 mx-10">
                      <div className="h-full bg-blue-600 transition-all duration-500"
                           style={{ width: `${(currentStatusIndex / (orderStatuses.length - 1)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 mt-8">
                  <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {order.items.map(item => (
                      <li key={item.productId}>{item.productName} (x{item.quantity}) - ${item.price.toFixed(2)}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleDownloadInvoice(order.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
                >
                  Download Invoice
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}