import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
    document.body.appendChild(script);
  });
}

export default function BookingPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItem = location.state;
  const selectedItems = location.state?.items;

  const [bookingData, setBookingData] = useState({
    processType: '',
    fabricType: '',
    serviceType: '',
    quantity: 100,
    duration: '24 hours',
    costPerMeter: 0,
    unit: 'kg',
    notes: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    deliveryAddress: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [bookingId, setBookingId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (selectedItems && selectedItems.length > 0) {
      // Handle multiple items
      const category = location.state?.category || 'sizing';
      const processType = category === 'sizing' ? 'sizing' : 'weaving';
      const itemsSummary = selectedItems.map(i => `${i.quantity} ${i.unit} of ${i.item}`).join(', ');
      const totalPrice = selectedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);

      setBookingData(prev => ({
        ...prev,
        processType,
        fabricType: 'multiple',
        serviceType: 'multiple',
        costPerMeter: totalPrice,
        quantity: selectedItems.reduce((sum, i) => sum + i.quantity, 0),
        unit: selectedItems[0]?.unit || 'kg',
        notes: `Multiple items selected:\n${itemsSummary}`,
        contactName: user?.name || '',
        contactPhone: user?.phone || '',
        contactEmail: user?.email || '',
        deliveryAddress: user?.address || ''
      }));
    } else if (selectedItem) {
      // Handle single item (backward compatibility)
      const category = selectedItem.category || 'sizing';
      const processType = category === 'sizing' ? 'sizing' : 'weaving';
      const unit = selectedItem.unit || (category === 'sizing' ? 'kg' : 'metre');
      const quantity = selectedItem.quantity || 1;

      setBookingData(prev => ({
        ...prev,
        processType,
        fabricType: selectedItem.itemSlug || '',
        serviceType: selectedItem.itemSlug || '',
        costPerMeter: selectedItem.price || 0,
        quantity: quantity,
        unit: unit,
        notes: `Selected ${selectedItem.type === 'product' ? 'Product' : 'Service'}: ${selectedItem.item}`,
        contactName: user?.name || '',
        contactPhone: user?.phone || '',
        contactEmail: user?.email || '',
        deliveryAddress: user?.address || ''
      }));
    }
  }, [selectedItem, selectedItems, user]);

  const total = selectedItems && selectedItems.length > 0 
    ? selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : bookingData.costPerMeter * bookingData.quantity;

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    if (bookingId) {
      try { await api.patch(`/bookings/${bookingId}`, { status: 'cancelled' }); } catch (err) { console.error('Failed to cancel booking:', err); }
    }
    sessionStorage.removeItem('pendingPayment');
    showMessage('Booking cancelled. Redirecting...', 'error');
    setTimeout(() => navigate('/'), 1500);
  };

  const handleResumePayment = async () => {
    const pendingPayment = sessionStorage.getItem('pendingPayment');
    if (!pendingPayment) { showMessage('No pending payment found', 'error'); return; }
    try {
      setIsProcessing(true);
      const payment = JSON.parse(pendingPayment);
      const { paymentId, bookingId: resumeBookingId, orderId, amount } = payment;
      try { await loadRazorpay(); } catch { showMessage('Payment gateway failed to load. Please refresh.', 'error'); return; }
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID || (await api.get('/payments/config')).data.key;
      const options = {
        key, amount: Math.round(amount * 100), currency: 'INR', name: 'CHINNU TEX', description: 'Sizing & Weaving Booking', ...(orderId ? { order_id: orderId } : {}),
        handler: async function (response) {
          try {
            await api.post('/payments/verify', { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, paymentId, bookingId: resumeBookingId });
            showMessage('Payment successful! Redirecting...', 'success'); sessionStorage.removeItem('pendingPayment'); setBookingId(null); setTimeout(() => navigate('/my-orders'), 2000);
          } catch (verifyErr) { showMessage('Payment verification failed', 'error'); }
        },
        prefill: { name: user.name || '', email: user.email || '' }, theme: { color: '#2563eb' }
      };
      const rzp = new window.Razorpay(options); rzp.open();
    } catch (err) { showMessage('Failed to resume payment', 'error'); } finally { setIsProcessing(false); }
  };

  const hasPendingPayment = !!sessionStorage.getItem('pendingPayment');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { showMessage('Please sign in to book.', 'error'); return; }
    if (!bookingData.processType || !bookingData.fabricType) { showMessage('Please select a product or service', 'error'); return; }
    if (total <= 0) { showMessage('Please select valid cost and quantity', 'error'); return; }

    try {
      setIsProcessing(true);
      showMessage('Checking stock availability...', 'info');

      try {
        const stockEndpoint = bookingData.processType === 'sizing' ? `/pricing/sizing/${bookingData.fabricType}` : `/pricing/weaving/${bookingData.fabricType}`;
        const stockRes = await api.get(stockEndpoint);
        const currentStock = stockRes.data?.stockQuantity;
        if (currentStock != null && currentStock < bookingData.quantity) {
          showMessage(`Only ${currentStock} ${bookingData.unit} available. Please adjust your quantity.`, 'error'); setIsProcessing(false); return;
        }
      } catch (stockErr) { console.warn('Stock pre-check skipped:', stockErr.message); }

      showMessage('Creating your booking...', 'info');
      const bookingPayload = {
        processType: bookingData.processType, fabricType: bookingData.fabricType, serviceType: bookingData.serviceType,
        costPerMeter: bookingData.costPerMeter, quantityMeters: bookingData.quantity, duration: bookingData.duration,
        notes: bookingData.notes, totalAmount: total, contactName: bookingData.contactName, contactPhone: bookingData.contactPhone,
        contactEmail: bookingData.contactEmail, deliveryAddress: bookingData.deliveryAddress, paymentMethod
      };
      const booking = await api.post('/bookings', bookingPayload);
      setBookingId(booking.data._id);

      if (paymentMethod === 'cod') {
        await api.post('/payments/cod', { bookingId: booking.data._id, amount: total });
        setStep(3);
        showMessage('Booking confirmed! Pay on delivery. Redirecting...', 'success');
        setBookingId(null);
        setTimeout(() => navigate('/my-orders'), 2000);
      } else {
        try { await loadRazorpay(); } catch { showMessage('Payment gateway failed to load. Please refresh.', 'error'); setIsProcessing(false); return; }
        showMessage('Booking created! Opening payment...', 'success');
        const orderRes = await api.post('/payments/order', { amount: total, bookingId: booking.data._id });
        const { orderId, key, amount, currency, paymentId } = orderRes.data;
        sessionStorage.setItem('pendingPayment', JSON.stringify({ paymentId, bookingId: booking.data._id, orderId, amount: total, timestamp: new Date().toISOString() }));
        const options = {
          key, amount, currency, name: 'CHINNU TEX', description: 'Sizing & Weaving Booking', ...(orderId ? { order_id: orderId } : {}),
          handler: async function (response) {
            try {
              await api.post('/payments/verify', { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, paymentId, bookingId: booking.data._id });
              setStep(3); showMessage('Payment successful! Redirecting...', 'success'); setBookingId(null); sessionStorage.removeItem('pendingPayment'); setTimeout(() => navigate('/my-orders'), 2000);
            } catch (verifyErr) { showMessage('Payment verification failed', 'error'); }
          },
          modal: { ondismiss: function () { showMessage('Payment cancelled. Click Resume to continue.', 'error'); setIsProcessing(false); } },
          prefill: { name: user.name || '', email: user.email || '' }, theme: { color: '#2563eb' }
        };
        const rzp = new window.Razorpay(options); rzp.open();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to process order';
      showMessage(errorMsg, 'error');
    } finally { setIsProcessing(false); }
  };

  const goToPayment = () => {
    if (!bookingData.contactName || !bookingData.contactPhone) {
      showMessage('Please fill in contact name and phone number', 'error');
      return;
    }
    setStep(2);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pt-28 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-[60px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-4 animate-fade-in-up">
            <button onClick={() => navigate(-1)} className="hover:text-white transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <span className="text-white font-medium">Checkout</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-1 animate-fade-in-up delay-100">Secure Checkout</h1>
          <p className="text-indigo-200 text-sm animate-fade-in-up delay-200">Complete your order in a few simple steps</p>
        </div>
      </div>

      {/* Animated Progress Steps */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-center max-w-lg mx-auto">
            {[{ n: 1, label: 'Review', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }, { n: 2, label: 'Payment', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' }, { n: 3, label: 'Done', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }].map((s, i) => (
              <div key={s.n} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    step > s.n
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-100'
                      : step === s.n
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-110'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}>
                    {step > s.n ? (
                      <svg className="w-5 h-5 animate-scale-in" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} /></svg>
                    )}
                  </div>
                  <span className={`text-sm font-semibold hidden sm:block transition-colors duration-300 ${
                    step >= s.n ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                  }`}>{s.label}</span>
                </div>
                {i < 2 && (
                  <div className="flex-1 mx-4 h-1 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-smooth progress-bar-animated"
                      style={{ width: step > s.n ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="container mx-auto px-4 mt-4">
          <div className={'rounded-xl p-3.5 flex items-center gap-3 text-sm font-medium animate-slide-up border ' +
            (messageType === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
             messageType === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' :
             'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800')}>
            {messageType === 'success' && <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
            {messageType === 'error' && <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            {messageType === 'info' && <div className="w-4 h-4 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>}
            {message}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">

          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Order Item Card */}
            {selectedItems && selectedItems.length > 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-up">
                <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                    Order Summary ({selectedItems.length} items)
                  </h2>
                  <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-lg uppercase tracking-wider">{location.state?.category}</span>
                </div>
                <div className="p-5 space-y-4">
                  {selectedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.item}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">₹{item.price} per {item.unit}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{item.quantity} {item.unit}</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Subtotal</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : selectedItem && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-up">
                <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                    Order Summary
                  </h2>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider">{selectedItem.type}</span>
                    <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-lg uppercase tracking-wider">{selectedItem.category}</span>
                  </div>
                </div>
                <div className="p-5 flex items-center gap-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-indigo-500/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selectedItem.item}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">₹{bookingData.costPerMeter} per {bookingData.unit}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Qty: {bookingData.quantity} {bookingData.unit}</div>
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">₹{total.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact & Delivery (Step 1) */}
            {step === 1 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 animate-fade-in-up delay-100">
                <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Contact & Delivery Details
                  </h2>
                </div>
                <div className="p-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Contact Name *</label>
                      <input type="text" value={bookingData.contactName} onChange={(e) => setBookingData({ ...bookingData, contactName: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm dark:text-white" placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Phone Number *</label>
                      <input type="tel" value={bookingData.contactPhone} onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm dark:text-white" placeholder="+91 ..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Email</label>
                      <input type="email" value={bookingData.contactEmail} onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm dark:text-white" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Delivery Address</label>
                      <input type="text" value={bookingData.deliveryAddress} onChange={(e) => setBookingData({ ...bookingData, deliveryAddress: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm dark:text-white" placeholder="Full address" />
                    </div>
                  </div>
                  <button onClick={goToPayment}
                    className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-[0.98]">
                    CONTINUE TO PAYMENT
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method (Step 2) */}
            {step === 2 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 animate-fade-in-up">
                <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Payment Method
                  </h2>
                  <button onClick={() => setStep(1)} className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline">Edit Details</button>
                </div>
                <div className="p-5 space-y-4">
                  {/* Online Payment */}
                  <label onClick={() => setPaymentMethod('online')}
                    className={'flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ' +
                      (paymentMethod === 'online' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600')}>
                    <div className={'w-5 h-5 rounded-full border-2 flex items-center justify-center ' + (paymentMethod === 'online' ? 'border-indigo-500' : 'border-slate-300 dark:border-slate-600')}>
                      {paymentMethod === 'online' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">Pay Online</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Cards, UPI, Net Banking via Razorpay</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-9 h-6 bg-indigo-600 rounded-md text-white text-[9px] font-bold flex items-center justify-center shadow-sm">VISA</div>
                      <div className="w-9 h-6 bg-green-600 rounded-md text-white text-[9px] font-bold flex items-center justify-center shadow-sm">UPI</div>
                    </div>
                  </label>

                  {/* COD */}
                  <label onClick={() => setPaymentMethod('cod')}
                    className={'flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ' +
                      (paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600')}>
                    <div className={'w-5 h-5 rounded-full border-2 flex items-center justify-center ' + (paymentMethod === 'cod' ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-600')}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">Cash on Delivery</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Pay when you receive your order</div>
                    </div>
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </label>

                  {/* Delivery Summary */}
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1"><span className="font-semibold text-slate-700 dark:text-slate-300">Deliver to:</span> {bookingData.contactName}</div>
                    {bookingData.deliveryAddress && <div className="text-xs text-slate-500 dark:text-slate-500">{bookingData.deliveryAddress}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Price Summary & Action */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 sticky top-24 overflow-hidden animate-fade-in-down delay-200">
              <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest">Price Details</h3>
              </div>
              <div className="p-5 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Price ({bookingData.quantity} {bookingData.unit})</span>
                  <span className="text-slate-900 dark:text-white font-medium">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Delivery</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{total >= 5000 ? 'FREE' : '₹200'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Platform Fee</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-4 flex justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-base">Total Amount</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">₹{(total + (total >= 5000 ? 0 : 200)).toLocaleString()}</span>
                </div>
                {total >= 5000 && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold p-3 rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-800/50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    You save ₹200 on delivery!
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-slate-200 dark:border-slate-700 space-y-3">
                {step === 2 && (
                  <>
                    {!hasPendingPayment ? (
                      <button onClick={handleSubmit} disabled={isProcessing}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]">
                        {isProcessing ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
                        ) : paymentMethod === 'cod' ? (
                          <>CONFIRM ORDER</>
                        ) : (
                          <>PAY ₹{(total + (total >= 5000 ? 0 : 200)).toLocaleString()}</>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-3 animate-fade-in-up">
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-3.5 rounded-xl">
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1 leading-none">Unfinished Payment Found</p>
                          <p className="text-[11px] text-amber-600 dark:text-amber-500 italic">You have a previous booking attempt that wasn't completed.</p>
                        </div>
                        <button onClick={handleResumePayment} disabled={isProcessing}
                          className="w-full py-4 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-500/20">
                          {isProcessing ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Resuming...</>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                              Resume Payment
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => { if(window.confirm('Clear pending payment and start new booking?')) { sessionStorage.removeItem('pendingPayment'); window.location.reload(); } }}
                          className="w-full py-2 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest"
                        >
                          Cancel & Start New
                        </button>
                      </div>
                    )}
                  </>
                )}

                <button onClick={() => navigate(-1)}
                  className="w-full py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                  Go Back
                </button>
              </div>

              {/* Trust Badges */}
              <div className="px-5 pb-5 flex items-center justify-center gap-5 text-slate-400 dark:text-slate-500 text-[11px] font-medium">
                <div className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Secure SSL
                </div>
                <div className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Fast Tracking
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
