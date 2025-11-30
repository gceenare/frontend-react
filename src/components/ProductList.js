import React, { useEffect, useState } from 'react';
import { fetchJSON } from '../api';
import './ProductList.css';

function Price({ cents }) {
// if backend sends price in decimal like 9.99, use that directly
    if (cents == null) return null;
    const val = typeof cents === 'number' ? cents : parseFloat(cents);
    return <strong>${val.toFixed(2)}</strong>;
}

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchJSON('/products')
            .then(data => { if (mounted) setProducts(Array.isArray(data) ? data : data.content || []); })
            .catch(err => { if (mounted) setError(err.message || String(err)); })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);

    if (loading) return <div className="product-list loading">Loading products...</div>;
    if (error) return <div className="product-list error">Error: {error}</div>;

    return (
        <section className="product-list">
            {products.length === 0 && <div className="empty">No products available.</div>}
            <div className="grid">
                {products.map(p => (
                    <article key={p.id || p.productId} className="card">
                        <div className="thumb">{p.image ? <img src={p.image} alt={p.name} /> : <div className="placeholder">No image</div>}</div>
                        <div className="meta">
                            <h3>{p.name || p.title}</h3>
                            <p className="desc">{p.description || p.shortDescription || '—'}</p>
                            <div className="row">
                                <Price cents={p.price || p.unitPrice || p.cost} />
                                <button className="btn">Add to cart</button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}