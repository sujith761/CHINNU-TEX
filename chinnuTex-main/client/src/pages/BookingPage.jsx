import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function BookingPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItem = location.state;

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

  useEffect(() => {
    if (selectedItem) {
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
  }, [selectedItem]);

  const total = bookingData.costPerMeter * bookingData.quantity;

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    if (bookingId) {
      try {
        await api.patch(`/bookings/${bookingId}`, { status: 'cancelled' });
      } catch (err) {
        console.error('Failed to cancel booking:', err);
      }
    }

    sessionStorage.removeItem('pendingPayment');
    showMessage('Booking cancelled. Redirecting...', 'error');
    setTimeout(() => navigate('/'), 1500);
  };

  const handleResumePayment = async () => {
    const pendingPayment = sessionStorage.getItem('pendingPayment');
    if (!pendingPayment) {
      showMessage('No pending payment found', 'error');
      return;
    }

    try {
      setIsProcessing(true);
      const payment = JSON.parse(pendingPayment);
      const { paymentId, bookingId: resumeBookingId, orderId, amount } = payment;

      if (!window.Razorpay) {
        showMessage('Payment gateway not loaded. Please refresh.', 'error');
        return;
      }

      const key = process.env.VITE_RAZORPAY_KEY_ID || (await api.get('/payments/config')).data.key;

      const options = {
        key,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'CHINNU TEX',
        description: 'Sizing & Weaving Booking',
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId,
              bookingId: resumeBookingId
            });
            showMessage('Payment successful! Redirecting...', 'success');
            sessionStorage.removeItem('pendingPayment');
            setBookingId(null);
            setTimeout(() => navigate('/my-orders'), 2000);
          } catch (verifyErr) {
            showMessage('Payment verification failed', 'error');
          }
        },
        prefill: { name: user.name || '', email: user.email || '' },
        theme: { color: '#6366f1' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showMessage('Failed to resume payment', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const hasPendingPayment = !!sessionStorage.getItem('pendingPayment');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showMessage('Please sign in to book.', 'error');
      return;
    }

    if (!bookingData.processType || !bookingData.fabricType) {
      showMessage('Please select a product or service', 'error');
      return;
    }

    if (total <= 0) {
      showMessage('Please select valid cost and quantity', 'error');
      return;
    }

    try {
      setIsProcessing(true);
      showMessage('Checking stock availability...', 'info');

      // Real-time stock check
      const stockEndpoint = bookingData.processType === 'sizing'
        ? `/pricing/sizing/${bookingData.fabricType}`
        : `/pricing/weaving/${bookingData.fabricType}`;

      const stockRes = await api.get(stockEndpoint);
      const currentStock = stockRes.data.stockQuantity;

      if (currentStock < bookingData.quantity) {
        showMessage(`Only ${currentStock} ${bookingData.unit} available. Please adjust your quantity.`, 'error');
        setIsProcessing(false);
        return;
      }

      if (!window.Razorpay) {
        showMessage('Payment gateway not loaded. Please refresh.', 'error');
        setIsProcessing(false);
        return;
      }

      showMessage('Creating your booking...', 'info');

      const booking = await api.post('/bookings', {
        processType: bookingData.processType,
        fabricType: bookingData.fabricType,
        serviceType: bookingData.serviceType,
        costPerMeter: bookingData.costPerMeter,
        quantityMeters: bookingData.quantity,
        duration: bookingData.duration,
        notes: bookingData.notes,
        totalAmount: total,
        contactName: bookingData.contactName,
        contactPhone: bookingData.contactPhone,
        contactEmail: bookingData.contactEmail,
        deliveryAddress: bookingData.deliveryAddress
      });

      setBookingId(booking.data._id);
      showMessage('Booking created! Opening payment...', 'success');

      const orderRes = await api.post('/payments/order', { amount: total });
      const { orderId, key, amount, currency, paymentId } = orderRes.data;

      sessionStorage.setItem('pendingPayment', JSON.stringify({
        paymentId,
        bookingId: booking.data._id,
        orderId,
        amount: total,
        timestamp: new Date().toISOString()
      }));

      const options = {
        key,
        amount,
        currency,
        name: 'CHINNU TEX',
        description: 'Sizing & Weaving Booking',
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId,
              bookingId: booking.data._id
            });
            showMessage('Payment successful! Redirecting...', 'success');
            setBookingId(null);
            sessionStorage.removeItem('pendingPayment');
            setTimeout(() => navigate('/my-orders'), 2000);
          } catch (verifyErr) {
            showMessage('Payment verification failed', 'error');
          }
        },
        modal: {
          ondismiss: function () {
            showMessage('Payment cancelled. Click Resume to continue.', 'error');
            setIsProcessing(false);
          }
        },
        prefill: { name: user.name || '', email: user.email || '' },
        theme: { color: '#6366f1' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to process order';
      showMessage(errorMsg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white/80 text-sm font-medium">Secure Checkout</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Booking</span>
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              Review your selection and proceed to secure payment via Razorpay
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-20">
        <div className="max-w-5xl mx-auto">

          {/* Progress Steps */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-100">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">1</div>
                <div className="hidden sm:block">
                  <div className="font-bold text-slate-800">Review</div>
                  <div className="text-xs text-slate-500">Order details</div>
                </div>
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-indigo-500 to-indigo-200 mx-4 rounded-full"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 font-bold">2</div>
                <div className="hidden sm:block">
                  <div className="font-bold text-slate-400">Payment</div>
                  <div className="text-xs text-slate-400">Secure checkout</div>
                </div>
              </div>
              <div className="flex-1 h-1 bg-slate-200 mx-4 rounded-full"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 font-bold">3</div>
                <div className="hidden sm:block">
                  <div className="font-bold text-slate-400">Confirm</div>
                  <div className="text-xs text-slate-400">Order placed</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Order Summary Card */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                {/* Selected Item Header */}
                {selectedItem && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-slate-100">
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        {selectedItem.category === 'sizing' ? (
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        ) : (
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase">
                            {selectedItem.type}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase">
                            {selectedItem.category}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">{selectedItem.item}</h2>
                        <p className="text-slate-500 mt-1">Premium quality {selectedItem.category} processing</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact & Delivery Details */}
                <div className="p-8 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Contact & Delivery
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Name</label>
                      <input
                        type="text"
                        value={bookingData.contactName}
                        onChange={(e) => setBookingData({ ...bookingData, contactName: e.target.value })}
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={bookingData.contactPhone}
                        onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="+91..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                      <input
                        type="email"
                        value={bookingData.contactEmail}
                        onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Delivery Address</label>
                      <input
                        type="text"
                        value={bookingData.deliveryAddress}
                        onChange={(e) => setBookingData({ ...bookingData, deliveryAddress: e.target.value })}
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="Address"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-8 space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    Order Details
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                      <span className="text-slate-600">Process Type</span>
                      <span className="font-semibold text-slate-800 capitalize">{bookingData.processType || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                      <span className="text-slate-600">Unit Price</span>
                      <span className="font-semibold text-slate-800">₹{bookingData.costPerMeter}/{bookingData.unit}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                      <span className="text-slate-600">Quantity</span>
                      <span className="font-semibold text-slate-800">{bookingData.quantity} {bookingData.unit}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Total Amount</div>
                        <div className="text-3xl font-bold text-indigo-600">₹{total.toFixed(2)}</div>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 sticky top-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Secure Payment
                </h3>

                {/* Payment Methods */}
                <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">Visa</div>
                  <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                  <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">RuPay</div>
                  <div className="w-10 h-6 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">UPI</div>
                </div>

                {/* Message */}
                {message && (
                  <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${messageType === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    messageType === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                    {messageType === 'success' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                    {messageType === 'error' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                    {messageType === 'info' && <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                    <span className="text-sm font-medium">{message}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        Pay ₹{total.toFixed(2)}
                      </>
                    )}
                  </button>

                  {hasPendingPayment && (
                    <button
                      onClick={handleResumePayment}
                      disabled={isProcessing}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      Resume Payment
                    </button>
                  )}

                  <button
                    onClick={() => navigate(-1)}
                    className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all"
                  >
                    Go Back
                  </button>
                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <span>Secured by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div >
      </div >
    </div >
  );
}
