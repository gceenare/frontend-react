import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useToast } from '../../contexts/ToastContext'; // Import useToast

export default function AdminProducts(){
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name:'', price:0, stock:0, category:'', description:'' });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const { showToast } = useToast(); // Get showToast function

  useEffect(()=> load(), []);
  async function load(){
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products:", error);
      showToast("Failed to load products.", "error");
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile)); // Create a URL for preview
    } else {
      setImagePreview(null);
    }
  };

  async function create(){
    try {
      const res = await api.post('/admin/products', form);
      if (file){
        const fd = new FormData();
        fd.append('file', file);
        await api.post(`/admin/products/${res.data.id}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast("Product created and image uploaded successfully!", "success");
      } else {
        showToast("Product created successfully!", "success");
      }
      setForm({ name:'', price:0, stock:0, category:'', description:'' });
      setFile(null);
      setImagePreview(null); // Clear preview
      await load();
    } catch (error) {
      console.error("Failed to create product:", error);
      showToast(error.response?.data || "Failed to create product.", "error");
    }
  }

  async function remove(id){
    try {
      await api.delete(`/admin/products/${id}`);
      showToast("Product deleted successfully!", "success");
      await load();
    } catch (error) {
      console.error("Failed to delete product:", error);
      showToast(error.response?.data || "Failed to delete product.", "error");
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input placeholder="name" className="border p-2" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="price" type="number" className="border p-2" value={form.price} onChange={e=>setForm({...form, price:parseFloat(e.target.value||0)})} />
        <input placeholder="stock" type="number" className="border p-2" value={form.stock} onChange={e=>setForm({...form, stock:parseInt(e.target.value||0)})} />
        <input placeholder="category" className="border p-2" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
        <textarea placeholder="description" className="border p-2 col-span-2" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <input type="file" onChange={handleFileChange} />
        {imagePreview && (
          <div className="col-span-2">
            <img src={imagePreview} alt="Image Preview" className="w-32 h-32 object-contain border rounded" />
          </div>
        )}
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={create}>Create product</button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Existing</h3>
        <ul>
          {products.map(p => (
            <li key={p.id} className="flex items-center gap-4 mb-2">
              <img src={(p.images && p.images[0]) || '/placeholder.png'} className="w-20 h-20 object-contain" alt="" />
              <div>
                <div className="font-medium">{p.name}</div>
                <div>${p.price} — stock {p.stock}</div>
              </div>
              <button onClick={()=> remove(p.id)} className="ml-auto text-red-600">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}