import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function TrackingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Polling for live updates
    useEffect(() => {
        let active = true;
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/bookings/my`); // Fetch all and find one, or better endpoint?
                // Ideally we should have Get One endpoint. Let's use the existing list one and filter for now to be safe, 
                // or check if there is a getById.
                // Checking routes file might be good, but filtering client side is faster for now given the context.
                if (active) {
                    const found = res.data.find(o => o._id === id);
                    if (found) {
                        setOrder(found);
                    } else {
                        setError('Order not found');
                    }
                    setLoading(false);
                }
            } catch (err) {
                if (active) {
                    setError('Failed to track order');
                    setLoading(false);
                }
            }
        };

        fetchOrder();
        const interval = setInterval(fetchOrder, 30000); // Poll every 30s
        return () => {
            active = false;
            clearInterval(interval);
        };
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
    );

    if (error || !order) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Tracking Failed</h2>
                <p className="text-slate-500 mb-6">{error || 'Order not found'}</p>
                <button onClick={() => navigate('/my-orders')} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">Back to Orders</button>
            </div>
        </div>
    );

    // Status Logic
    const steps = [
        { id: 'pending', label: 'Order Placed', desc: 'We have received your order', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 'processing', label: 'Processing', desc: `${order.processType === 'sizing' ? 'Sizing' : 'Weaving'} in progress`, icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
        { id: 'quality_check', label: 'Quality Check', desc: 'Final inspection', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }, // Visual step only 
        { id: 'completed', label: 'Completed', desc: 'Ready for delivery/pickup', icon: 'M5 13l4 4L19 7' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === order.status) === -1
        ? (order.status === 'cancelled' ? -1 : 1) // Default to processing if unknown
        : steps.findIndex(s => s.id === order.status);

    // If processing, show Quality Check as pending step visually
    // If completed, show all steps as done

    const getStepStatus = (index) => {
        if (order.status === 'cancelled') return 'error';
        if (order.status === 'completed') return 'completed';
        if (order.status === 'processing') return index <= 1 ? 'current' : 'pending';
        if (order.status === 'pending') return index === 0 ? 'current' : 'pending';
        return 'pending';
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-slate-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/my-orders')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Track Order</h1>
                            <p className="text-sm text-slate-500">ID: {order._id}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Main Tracking Panel */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 relative overflow-hidden">
                            {/* Background pattern */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 -mr-16 -mt-16"></div>

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${order.processType === 'sizing' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        {order.processType === 'sizing' ? (
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                        ) : (
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">{order.fabricType}</h2>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <span className="capitalize">{order.processType}</span>
                                            <span>•</span>
                                            <span>{order.quantityMeters} meters</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {order.status === 'cancelled' ? (
                                        <span className="px-4 py-2 bg-rose-100 text-rose-700 rounded-full font-bold text-sm">Cancelled</span>
                                    ) : (
                                        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm animate-pulse">Live</span>
                                    )}
                                </div>
                            </div>

                            {/* Tracking Timeline */}
                            <div className="relative pl-8 border-l-2 border-slate-100 space-y-12 my-12">
                                {steps.map((step, idx) => {
                                    // Determine visual state
                                    let state = 'pending';
                                    if (order.status === 'completed') state = 'completed';
                                    else if (order.status === 'cancelled' && idx === 0) state = 'completed'; // Show first step as done even if cancelled
                                    else if (order.status === 'cancelled') state = 'pending';
                                    else if (order.status === 'processing') state = idx <= 1 ? (idx === 1 ? 'current' : 'completed') : 'pending';
                                    else if (order.status === 'pending') state = idx === 0 ? 'current' : 'pending';

                                    // For Quality Check (idx 2): if Processing, show as pending. If Completed, show as completed.

                                    if (idx === 2 && order.status === 'processing') state = 'pending'; // QC comes after processing


                                    // Simply matching steps to status for this simple model
                                    const isActive = (stat) => {
                                        if (stat === 'completed') return true;
                                        if (stat === 'quality_check') return order.status === 'completed'; // QC done only when completed
                                        if (stat === 'processing') return order.status === 'processing' || order.status === 'completed';
                                        if (stat === 'pending') return true; // Always true
                                        return false;
                                    };

                                    const isCurrent = (stat) => {
                                        if (order.status === stat) return true;
                                        if (stat === 'quality_check') return false; // Implicit
                                        return false;
                                    };

                                    const isDone = isActive(step.id) && !isCurrent(step.id);
                                    const isNow = isCurrent(step.id);

                                    return (
                                        <div key={idx} className="relative">
                                            <div className={`absolute -left-[41px] w-5 h-5 rounded-full border-4 ${isDone ? 'bg-indigo-600 border-indigo-100' : isNow ? 'bg-indigo-600 border-indigo-100 animate-ring' : 'bg-slate-200 border-white'}`}></div>
                                            <div className={`${isDone || isNow ? 'opacity-100' : 'opacity-40 grayscale'} transition-all duration-500`}>
                                                <h3 className={`text-lg font-bold ${isNow ? 'text-indigo-600' : 'text-slate-800'}`}>{step.label}</h3>
                                                <p className="text-slate-500 text-sm mt-1">{step.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-indigo-50 rounded-2xl p-6 mt-8 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Estimated Completion</p>
                                    <p className="text-lg font-bold text-indigo-900">{order.duration}</p>
                                </div>
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4">Payment Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b border-slate-50">
                                    <span className="text-slate-500">Amount Paid</span>
                                    <span className="font-bold text-slate-800">₹{order.totalAmount}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-50">
                                    <span className="text-slate-500">Method</span>
                                    <span className="font-bold text-slate-800">Online (Razorpay)</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-50">
                                    <span className="text-slate-500">Status</span>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">Success</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl p-6 text-white text-center">
                            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                            <p className="text-white/60 text-sm mb-6">Have questions about your order status?</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">Call Support</button>
                                <button className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">Chat Now</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
