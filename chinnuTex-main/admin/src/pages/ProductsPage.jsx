import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', ratePerMeter: 0, processType: 'sizing', stockQuantity: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post('/products', form);
      }
      setForm({ name: '', description: '', ratePerMeter: 0, processType: 'sizing', stockQuantity: 0 });
      loadProducts();
    } catch (err) {
      console.error('Failed to save product', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        loadProducts();
      } catch (err) {
        console.error('Failed to delete product', err);
      }
    }
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditingId(p._id);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/25 font-semibold">Catalog</p>
          <h1 className="text-4xl font-extrabold gradient-text">Product Management</h1>
          <p className="text-white/40">Add, edit, and remove processing products quickly.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.2fr]">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: '', description: '', ratePerMeter: 0, processType: 'sizing', stockQuantity: 0 });
                  }}
                  className="text-sm px-3 py-1 rounded-lg border border-white/[0.1] text-white/60 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-white/50">Name</label>
                <input
                  type="text"
                  placeholder="Product name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="glass-input w-full px-4 py-3"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-white/50">Description</label>
                <textarea
                  placeholder="Short description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="glass-input w-full px-4 py-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-white/50">Paisa per meter</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.ratePerMeter}
                    onChange={(e) => setForm({ ...form, ratePerMeter: Number(e.target.value) })}
                    required
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-white/50">Process Type</label>
                  <select
                    value={form.processType}
                    onChange={(e) => setForm({ ...form, processType: e.target.value })}
                    className="glass-input w-full px-4 py-3"
                  >
                    <option value="sizing">Sizing</option>
                    <option value="weaving">Weaving</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-white/50">Stock Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.stockQuantity}
                  onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })}
                  className="glass-input w-full px-4 py-3"
                />
              </div>
              <button
                type="submit"
                className="btn-glow w-full py-3"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-white/[0.06]">
                  <tr>
                    <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Name</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Type</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Paisa/meter</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Stock</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-t border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                      <td className="p-4 font-semibold text-white/80">{p.name}</td>
                      <td className="p-4 capitalize text-white/40">{p.processType}</td>
                      <td className="p-4 font-semibold text-white">₹{p.ratePerMeter}</td>
                      <td className="p-4 font-semibold text-white">{p.stockQuantity || 0}</td>
                      <td className="p-4 space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="bg-neon-violet/15 text-neon-violet border border-neon-violet/20 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-neon-violet/25 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="bg-neon-rose/15 text-neon-rose border border-neon-rose/20 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-neon-rose/25 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}
