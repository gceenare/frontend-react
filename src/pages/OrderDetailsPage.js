import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrders, getOrderInvoice } from '../api';
import { useToast } from '../contexts/ToastContext';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    // In a real app, you'd have a getOrderById API call
    getOrders().then(res => {
      const foundOrder = res.data.find(o => o.id === parseInt(id));
      setOrder(foundOrder);
    }).catch(() => {
      showToast("Failed to load order details.", "error");
    });
  }, [id]);

  const handleDownloadInvoice = async () => {
    try {
      const response = await getOrderInvoice(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-order-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast("Invoice downloaded!", "success");
    } catch (error) {
      showToast("Failed to download invoice.", "error");
    }
  };

  if (!order) return <div className="text-center py-10">Loading order details...</div>;

  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Order #{order.id} Details</h1>

      {/* Order Status Progress Bar */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Order Status: {order.status}</h2>
        <div className="flex justify-between items-center relative">
          {statuses.map((status, index) => (
            <div key={status} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStatusIndex ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                {index + 1}
              </div>
              <p className="text-sm mt-2">{status}</p>
            </div>
          ))}
          <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 -z-10 mx-10">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <p>Total: ${order.total.toFixed(2)}</p>
        <p>Shipping Address: {order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
        {/* Add more order details as needed */}
      </div>

      {/* Order Items */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Items</h2>
        {order.items.map(item => (
          <div key={item.productId} className="flex justify-between items-center border-b py-2">
            <p>{item.productName} x {item.quantity}</p>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Download Invoice */}
      <div className="text-right">
        <button
          onClick={handleDownloadInvoice}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Download Invoice (PDF)
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;