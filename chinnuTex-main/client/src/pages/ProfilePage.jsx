import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ProfilePage() {
    const { user, updateUser } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        address: '',
        company: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({
        totalOrders: 0,
        activeOrders: 0,
        completedOrders: 0,
        totalSpent: 0
    });

    useEffect(() => {
        if (user) {
            setEditForm({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || '',
                company: user.company || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const res = await api.put('/users/profile', editForm);
            updateUser(res.data);
            setIsEditing(false);
            // Optional: Show success message
        } catch (err) {
            console.error('Failed to update profile', err);
            // Optional: Show error message
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Determine greeting based on time of day
        const hour = new Date().getHours();
        let greeting = 'Good Morning';
        if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
        else if (hour >= 17) greeting = 'Good Evening';
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/bookings/my');
                const orders = res.data || [];

                const total = orders.length;
                const active = orders.filter(o => ['pending', 'processing'].includes(o.status)).length;
                const completed = orders.filter(o => o.status === 'completed').length;
                const spent = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

                setStats({
                    totalOrders: total,
                    activeOrders: active,
                    completedOrders: completed,
                    totalSpent: spent
                });
            } catch (err) {
                if (err?.code === 'failed-precondition' || err?.message?.includes('requires an index')) {
                    console.warn('Firestore index required for bookings query. Create it in the Firebase console.');
                } else {
                    console.error('Failed to fetch order stats', err);
                }
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen pt-32 flex justify-center items-center bg-slate-50">
                <p className="text-slate-500">Loading profile...</p>
            </div>
        );
    }

    // Generate initials
    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : 'U';

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 pt-28 pb-12">

            {/* 1. Header Section with Gradient Background */}
            <div className="relative mb-8 pb-12">
                <div className="absolute top-0 left-0 w-full h-64 bg-slate-900 overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 opacity-90"></div>
                    <div className="absolute -top-10 -right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 pt-16">
                    <div className="flex flex-col md:flex-row items-end gap-6 md:gap-8">
                        {/* Profile Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white p-1 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                                    {initials}
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-slate-50 rounded-full" title="Active"></div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 mb-2 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-indigo-200 text-sm font-medium">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    {user.email}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Joined {new Date().getFullYear()}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full backdrop-blur-sm border border-emerald-500/30">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Verified Client
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-4 md:mb-2">
                            <Link to="/my-orders" className="px-5 py-2.5 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                My Orders
                            </Link>
                            {/* Future Feature: Edit Profile */}
                            {/* <button className="px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-colors backdrop-blur-sm">
                Edit Profile
              </button> */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Stats & Contact Info */}
                    <div className="space-y-8">

                        {/* Stats Cards */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                Overview
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center">
                                    <div className="text-3xl font-black text-indigo-600 mb-1">{stats.totalOrders}</div>
                                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Total</div>
                                </div>
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                                    <div className="text-3xl font-black text-emerald-600 mb-1">{stats.completedOrders}</div>
                                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Completed</div>
                                </div>
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
                                    <div className="text-3xl font-black text-amber-600 mb-1">{stats.activeOrders}</div>
                                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">Active</div>
                                </div>
                                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-center">
                                    <div className="text-lg font-black text-rose-600 mb-1 mt-1">₹{stats.totalSpent.toLocaleString()}</div>
                                    <div className="text-xs font-bold text-rose-400 uppercase tracking-wide">Ords. Value</div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Details Card */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    Personal Details
                                </h3>
                                <button
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    disabled={isLoading}
                                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${isEditing
                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                            : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                                        }`}
                                >
                                    {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit')}
                                </button>
                                {isEditing && (
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1 ml-2"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Full Name</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full text-slate-700 font-medium border-b border-indigo-200 focus:border-indigo-500 outline-none bg-transparent py-1"
                                        />
                                    ) : (
                                        <p className="text-slate-700 font-medium">{user.name}</p>
                                    )}
                                </div>
                                <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Email Address</p>
                                    <p className="text-slate-700 font-medium">{user.email}</p>
                                </div>
                                <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Phone Number</p>
                                        {!isEditing && user.phone && (
                                            <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-bold">
                                                Receives Updates
                                            </span>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full text-slate-700 font-medium border-b border-indigo-200 focus:border-indigo-500 outline-none bg-transparent py-1"
                                            placeholder="+91..."
                                        />
                                    ) : (
                                        <p className="text-slate-700 font-medium">{user.phone || 'Not provided'}</p>
                                    )}
                                </div>
                                <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Address</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.address}
                                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                            className="w-full text-slate-700 font-medium border-b border-indigo-200 focus:border-indigo-500 outline-none bg-transparent py-1"
                                            placeholder="City, State"
                                        />
                                    ) : (
                                        <p className="text-slate-700 font-medium">{user.address || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Account Settings & Recent Activity placeholder */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Account Settings / Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link to="/my-orders" className="group p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-300 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-700 group-hover:text-indigo-700">Track Orders</h4>
                                        <p className="text-sm text-slate-500">View live status of your bookings</p>
                                    </div>
                                </Link>

                                <Link to="/contact" className="group p-4 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50/50 transition-all duration-300 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-700 group-hover:text-rose-700">Customer Support</h4>
                                        <p className="text-sm text-slate-500">Get help with your orders</p>
                                    </div>
                                </Link>

                                <div className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-300 flex items-center gap-4 cursor-pointer">
                                    <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-700 group-hover:text-emerald-700">Security & Privacy</h4>
                                        <p className="text-sm text-slate-500">Update password and settings</p>
                                    </div>
                                </div>

                                <div className="group p-4 rounded-xl border border-slate-200 hover:border-amber-200 hover:bg-amber-50/50 transition-all duration-300 flex items-center gap-4 cursor-pointer">
                                    <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-700 group-hover:text-amber-700">Payment Methods</h4>
                                        <p className="text-sm text-slate-500">Manage saved cards and UPI</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Notification Preferences (Static/Placeholder for visuals) */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-800">Email Notifications</p>
                                        <p className="text-sm text-slate-500">Receive order updates via email</p>
                                    </div>
                                    <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                                        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-800">SMS Alerts</p>
                                        <p className="text-sm text-slate-500">Receive updates on your mobile</p>
                                    </div>
                                    <div className="w-11 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
