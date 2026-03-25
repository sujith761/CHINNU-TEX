import { useEffect, useState } from 'react';
import api from '../services/api';

export default function InventoryPage() {
    const [sizingInventory, setSizingInventory] = useState([]);
    const [weavingInventory, setWeavingInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const defaultSizing = [
        { yarnType: 'Cotton', slug: 'cotton', pricePerKg: 450, stockQuantity: 500 },
        { yarnType: 'Polyester', slug: 'polyester', pricePerKg: 520, stockQuantity: 300 },
        { yarnType: 'Viscose', slug: 'viscose', pricePerKg: 480, stockQuantity: 200 },
        { yarnType: 'PC Blend', slug: 'pc-blend', pricePerKg: 510, stockQuantity: 150 },
        { yarnType: 'PV Blend', slug: 'pv-blend', pricePerKg: 490, stockQuantity: 180 },
        { yarnType: 'Nylon', slug: 'nylon', pricePerKg: 550, stockQuantity: 100 },
        { yarnType: 'Acrylic', slug: 'acrylic', pricePerKg: 470, stockQuantity: 250 },
    ];

    const defaultWeaving = [
        { fabricType: 'Cotton', slug: 'cotton', pricePerMetre: 280, stockQuantity: 500 },
        { fabricType: 'Rayon', slug: 'rayon', pricePerMetre: 320, stockQuantity: 300 },
        { fabricType: 'Polyester', slug: 'polyester', pricePerMetre: 250, stockQuantity: 200 },
        { fabricType: 'Silk', slug: 'silk', pricePerMetre: 450, stockQuantity: 150 },
        { fabricType: 'Woollen', slug: 'woollen', pricePerMetre: 380, stockQuantity: 180 },
        { fabricType: 'Linen', slug: 'linen', pricePerMetre: 400, stockQuantity: 100 },
        { fabricType: 'Nylon', slug: 'nylon', pricePerMetre: 240, stockQuantity: 250 },
        { fabricType: 'Acrylic', slug: 'acrylic', pricePerMetre: 220, stockQuantity: 350 },
    ];

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            setLoading(true);
            const sizingRes = await api.get('/pricing/sizing/all');
            const weavingRes = await api.get('/pricing/weaving/all');

            // Auto-seed if both collections are empty
            if ((!sizingRes.data || sizingRes.data.length === 0) && (!weavingRes.data || weavingRes.data.length === 0)) {
                setMessage('No inventory data found. Seeding default data...');
                for (const item of defaultSizing) {
                    await api.post('/pricing/admin/sizing', item);
                }
                for (const item of defaultWeaving) {
                    await api.post('/pricing/admin/weaving', item);
                }
                // Reload after seeding
                const s2 = await api.get('/pricing/sizing/all');
                const w2 = await api.get('/pricing/weaving/all');
                setSizingInventory(s2.data);
                setWeavingInventory(w2.data);
                setMessage('Default inventory loaded successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setSizingInventory(sizingRes.data);
                setWeavingInventory(weavingRes.data);
            }
        } catch (err) {
            console.error('Failed to load inventory', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStock = async (type, slug, newStock, yarnOrFabricType, price) => {
        try {
            const endpoint = type === 'sizing' ? '/pricing/admin/sizing' : '/pricing/admin/weaving';
            const payload = type === 'sizing'
                ? { yarnType: yarnOrFabricType, slug, pricePerKg: price, stockQuantity: newStock }
                : { fabricType: yarnOrFabricType, slug, pricePerMetre: price, stockQuantity: newStock };

            await api.post(endpoint, payload);
            setMessage(`Updated stock for ${yarnOrFabricType}`);
            loadInventory();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Failed to update stock', err);
            setMessage('Update failed');
        }
    };

    if (loading) return <div className="p-8 text-white/40">Loading inventory...</div>;

    return (
        <div className="min-h-screen p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/25 font-semibold">Stock Management</p>
                    <h1 className="text-4xl font-extrabold gradient-text">Inventory Management</h1>
                    <p className="text-white/40">Manage stock levels for Sizing (Yarn) and Weaving (Fabric) types.</p>
                </header>

                {message && (
                    <div className="glass-card px-4 py-3 text-neon-emerald border-neon-emerald/20 animate-fade-in">
                        {message}
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Sizing Inventory */}
                    <div className="glass-card overflow-hidden">
                        <div className="bg-gradient-to-r from-neon-violet to-neon-blue p-6">
                            <h2 className="text-xl font-bold text-white">Sizing (Yarn) Stock</h2>
                            <p className="text-white/60 text-sm">Manage quantities available for sizing processes</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b border-white/[0.06]">
                                    <tr>
                                        <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Yarn Type</th>
                                        <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Price (₹/kg)</th>
                                        <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Current Stock</th>
                                        <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {sizingInventory.map((item) => (
                                        <tr key={item._id} className="hover:bg-white/[0.03] transition-colors">
                                            <td className="p-4 font-semibold text-white/80">{item.yarnType}</td>
                                            <td className="p-4 text-white/50 font-medium">₹{item.pricePerKg}</td>
                                            <td className="p-4">
                                                <input
                                                    type="number"
                                                    defaultValue={item.stockQuantity}
                                                    onBlur={(e) => handleUpdateStock('sizing', item.slug, Number(e.target.value), item.yarnType, item.pricePerKg)}
                                                    className="glass-input w-24 px-3 py-1.5 text-sm"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${item.stockQuantity > 0 ? 'bg-neon-emerald/10 text-neon-emerald border-neon-emerald/20' : 'bg-neon-rose/10 text-neon-rose border-neon-rose/20'}`}>
                                                    {item.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Weaving Inventory */}
                    <div className="glass-card overflow-hidden">
                        <div className="bg-gradient-to-r from-neon-cyan to-neon-blue p-6">
                            <h2 className="text-xl font-bold text-white">Weaving (Fabric) Stock</h2>
                            <p className="text-white/60 text-sm">Manage quantities available for weaving processes</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b border-white/[0.06]">
                                    <tr>
                                        <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Fabric Type</th>
                                        <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Price (₹/m)</th>
                                        <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Current Stock</th>
                                        <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {weavingInventory.map((item) => (
                                        <tr key={item._id} className="hover:bg-white/[0.03] transition-colors">
                                            <td className="p-4 font-semibold text-white/80">{item.fabricType}</td>
                                            <td className="p-4 text-white/50 font-medium">₹{item.pricePerMetre}</td>
                                            <td className="p-4">
                                                <input
                                                    type="number"
                                                    defaultValue={item.stockQuantity}
                                                    onBlur={(e) => handleUpdateStock('weaving', item.slug, Number(e.target.value), item.fabricType, item.pricePerMetre)}
                                                    className="glass-input w-24 px-3 py-1.5 text-sm"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${item.stockQuantity > 0 ? 'bg-neon-emerald/10 text-neon-emerald border-neon-emerald/20' : 'bg-neon-rose/10 text-neon-rose border-neon-rose/20'}`}>
                                                    {item.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
