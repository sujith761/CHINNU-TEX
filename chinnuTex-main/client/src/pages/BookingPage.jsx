import { useContext, useEffect, useState, useCallback } from 'react';
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
  const selectedItems = location.state?.items || [];

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
        const orderRes = await api.post('/payments/order', { amount: total });
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
    <div className="min-h-screen bg-[#f1f3f6] font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 pt-28 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
            <button onClick={() => navigate(-1)} className="hover:text-white transition-colors">Back</button>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <span className="text-white font-medium">Checkout</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Secure Checkout</h1>
          <p className="text-blue-200 text-sm">Complete your order in a few simple steps</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center max-w-lg mx-auto">
            {[{ n: 1, label: 'Review' }, { n: 2, label: 'Payment' }, { n: 3, label: 'Confirmation' }].map((s, i) => (
              <div key={s.n} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ' +
                    (step >= s.n ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500')}>
                    {step > s.n ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : s.n}
                  </div>
                  <span className={'text-sm font-medium hidden sm:block ' + (step >= s.n ? 'text-blue-600' : 'text-gray-400')}>{s.label}</span>
                </div>
                {i < 2 && <div className={'flex-1 h-0.5 mx-3 ' + (step > s.n ? 'bg-blue-600' : 'bg-gray-200')}></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="container mx-auto px-4 mt-4">
          <div className={'rounded-lg p-3 flex items-center gap-3 text-sm font-medium ' +
            (messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
             messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
             'bg-blue-50 text-blue-700 border border-blue-200')}>
            {messageType === 'success' && <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
            {messageType === 'error' && <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            {messageType === 'info' && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>}
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                    Order Summary ({selectedItems.length} items)
                  </h2>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded uppercase">{location.state?.category}</span>
                </div>
                <div className="p-4 space-y-3">
                  {selectedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm">{item.item}</h3>
                        <p className="text-xs text-gray-500">₹{item.price} per {item.unit}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm text-gray-500">{item.quantity} {item.unit}</div>
                        <div className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                    <span className="font-bold text-gray-900">Subtotal</span>
                    <span className="font-bold text-gray-900 text-lg">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : selectedItem && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                    Order Summary
                  </h2>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">{selectedItem.type}</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded uppercase">{selectedItem.category}</span>
                  </div>
                </div>
                <div className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg">{selectedItem.item}</h3>
                    <p className="text-sm text-gray-500">₹{bookingData.costPerMeter} per {bookingData.unit}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Qty: {bookingData.quantity} {bookingData.unit}</div>
                    <div className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact & Delivery (Step 1) */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Contact & Delivery Details
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Contact Name *</label>
                      <input type="text" value={bookingData.contactName} onChange={(e) => setBookingData({ ...bookingData, contactName: e.target.value })}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm" placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number *</label>
                      <input type="tel" value={bookingData.contactPhone} onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm" placeholder="+91 ..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email</label>
                      <input type="email" value={bookingData.contactEmail} onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Delivery Address</label>
                      <input type="text" value={bookingData.deliveryAddress} onChange={(e) => setBookingData({ ...bookingData, deliveryAddress: e.target.value })}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm" placeholder="Full address" />
                    </div>
                  </div>
                  <button onClick={goToPayment}
                    className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    CONTINUE TO PAYMENT
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method (Step 2) */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Payment Method
                  </h2>
                  <button onClick={() => setStep(1)} className="text-blue-600 text-sm font-medium hover:underline">Edit Details</button>
                </div>
                <div className="p-4 space-y-3">
                  {/* Online Payment */}
                  <label onClick={() => setPaymentMethod('online')}
                    className={'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ' +
                      (paymentMethod === 'online' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300')}>
                    <div className={'w-5 h-5 rounded-full border-2 flex items-center justify-center ' + (paymentMethod === 'online' ? 'border-blue-500' : 'border-gray-300')}>
                      {paymentMethod === 'online' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-sm">Pay Online</div>
                      <div className="text-xs text-gray-500">Cards, UPI, Net Banking via Razorpay</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">VISA</div>
                      <div className="w-8 h-5 bg-green-600 rounded text-white text-[8px] font-bold flex items-center justify-center">UPI</div>
                    </div>
                  </label>

                  {/* COD */}
                  <label onClick={() => setPaymentMethod('cod')}
                    className={'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ' +
                      (paymentMethod === 'cod' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 hover:border-gray-300')}>
                    <div className={'w-5 h-5 rounded-full border-2 flex items-center justify-center ' + (paymentMethod === 'cod' ? 'border-green-500' : 'border-gray-300')}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-sm">Cash on Delivery</div>
                      <div className="text-xs text-gray-500">Pay when you receive your order</div>
                    </div>
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </label>

                  {/* Delivery Summary */}
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 mt-2">
                    <div className="flex items-center gap-2 mb-1"><span className="font-medium text-gray-700">Deliver to:</span> {bookingData.contactName}</div>
                    {bookingData.deliveryAddress && <div className="text-xs text-gray-500">{bookingData.deliveryAddress}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Price Summary & Action */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-16">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm uppercase">Price Details</h3>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price ({bookingData.quantity} {bookingData.unit})</span>
                  <span className="text-gray-900">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600 font-medium">{total >= 5000 ? 'FREE' : '₹200'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900 text-base">Total Amount</span>
                  <span className="font-bold text-gray-900 text-base">₹{(total + (total >= 5000 ? 0 : 200)).toLocaleString()}</span>
                </div>
                {total >= 5000 && (
                  <div className="bg-green-50 text-green-700 text-xs font-medium p-2 rounded flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    You save ₹200 on delivery!
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 space-y-2">
                {step === 2 && (
                  <button onClick={handleSubmit} disabled={isProcessing}
                    className="w-full py-3 bg-orange-500 text-white rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isProcessing ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                    ) : paymentMethod === 'cod' ? (
                      <>CONFIRM ORDER</>
                    ) : (
                      <>PAY ₹{(total + (total >= 5000 ? 0 : 200)).toLocaleString()}</>
                    )}
                  </button>
                )}

                {hasPendingPayment && (
                  <button onClick={handleResumePayment} disabled={isProcessing}
                    className="w-full py-3 bg-amber-500 text-white rounded-lg font-bold text-sm hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Resume Payment
                  </button>
                )}

                <button onClick={() => navigate(-1)}
                  className="w-full py-3 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
                  Go Back
                </button>
              </div>

              {/* Trust Badges */}
              <div className="px-4 pb-4 flex items-center justify-center gap-4 text-gray-400 text-xs">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Safe & Secure
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Fast Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
