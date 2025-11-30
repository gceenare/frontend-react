import React, { useEffect, useState } from 'react';
import api from '../../api';

export default function AdminOrders(){
  const [orders, setOrders] = useState([]);
  useEffect(()=>{ api.get('/admin/orders').then(r=>setOrders(r.data)); }, []);

  return (
    <div style={{padding:20}}>
      <h2>Orders (Admin)</h2>
      <ul>
        {orders.map(o => (
          <li key={o.id}>Order #{o.id} — total ${o.total} — items: {o.items.length}</li>
        ))}
      </ul>
    </div>
  );
}