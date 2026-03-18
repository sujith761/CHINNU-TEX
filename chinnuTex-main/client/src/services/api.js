import { db, auth } from '../firebase';
import {
  collection, addDoc, getDocs, query, where, orderBy,
  doc, updateDoc, deleteDoc, getDoc, setDoc, Timestamp
} from 'firebase/firestore';

// ---------- helpers ----------
const now = () => Timestamp.now();
const toDoc = (snap) => ({ _id: snap.id, id: snap.id, ...snap.data() });
const toDocs = (snap) => snap.docs.map(toDoc);
const uid = () => auth.currentUser?.uid;

// Wait for Firebase Auth to be ready before querying
function waitForAuth() {
  return new Promise((resolve) => {
    if (auth.currentUser) return resolve(auth.currentUser);
    const unsub = auth.onAuthStateChanged((user) => {
      unsub();
      resolve(user);
    });
  });
}

// ---------- Firestore handlers ----------

// BOOKINGS
async function getMyBookings() {
  const user = await waitForAuth();
  if (!user) throw new Error('Not signed in');
  const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
  const snap = await getDocs(q);
  const docs = toDocs(snap).map(b => ({
    ...b,
    payment: b.paymentId ? { _id: b.paymentId, status: b.paymentStatus || 'created' } : null
  }));
  return docs.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() || 0;
    const tb = b.createdAt?.toMillis?.() || 0;
    return tb - ta;
  });
}

async function createBooking(body) {
  const user = auth.currentUser;
  // Stock validation — look up by doc ID, then fall back to slug field query
  const colName = body.processType === 'sizing' ? 'sizingPrices' : 'weavingPrices';
  let matSnap = await getDoc(doc(db, colName, body.fabricType));
  if (!matSnap.exists()) {
    const q = query(collection(db, colName), where('slug', '==', body.fabricType));
    const results = await getDocs(q);
    if (!results.empty) matSnap = results.docs[0];
  }
  if (matSnap.exists()) {
    const mat = matSnap.data();
    if (mat.stockQuantity != null && mat.stockQuantity < body.quantityMeters) {
      const err = new Error(`Insufficient stock. Available: ${mat.stockQuantity}`);
      err.response = { data: { message: err.message } };
      throw err;
    }
    if (mat.stockQuantity != null) {
      await updateDoc(matSnap.ref || doc(db, colName, matSnap.id), { stockQuantity: mat.stockQuantity - body.quantityMeters });
    }
  }
  const docData = {
    userId: user.uid,
    userName: user.displayName || user.email,
    userEmail: user.email,
    processType: body.processType,
    fabricType: body.fabricType,
    costPerMeter: body.costPerMeter,
    quantityMeters: body.quantityMeters,
    duration: body.duration,
    vehicleNumber: body.vehicleNumber || '',
    notes: body.notes || '',
    totalAmount: body.totalAmount,
    contactName: body.contactName,
    contactPhone: body.contactPhone,
    contactEmail: body.contactEmail || '',
    deliveryAddress: body.deliveryAddress,
    paymentMethod: body.paymentMethod || 'online',
    status: 'pending',
    paymentId: null,
    createdAt: now(),
    updatedAt: now()
  };
  const ref = await addDoc(collection(db, 'bookings'), docData);
  return { _id: ref.id, ...docData };
}

async function updateBooking(id, body) {
  const ref = doc(db, 'bookings', id);
  await updateDoc(ref, { ...body, updatedAt: now() });
  const snap = await getDoc(ref);
  return toDoc(snap);
}

// PRICING
async function getAllSizingPrices() {
  const q = query(collection(db, 'sizingPrices'), where('isActive', '==', true), orderBy('pricePerKg'));
  return toDocs(await getDocs(q));
}
async function getSizingBySlug(slug) {
  // Try by document ID first
  const snap = await getDoc(doc(db, 'sizingPrices', slug));
  if (snap.exists()) return toDoc(snap);
  // Fallback: query by slug field
  const q = query(collection(db, 'sizingPrices'), where('slug', '==', slug));
  const results = await getDocs(q);
  if (!results.empty) return toDoc(results.docs[0]);
  const e = new Error('Not found'); e.response = { data: { message: 'Sizing price not found' } }; throw e;
}
async function getAllWeavingPrices() {
  const q = query(collection(db, 'weavingPrices'), where('isActive', '==', true), orderBy('pricePerMetre'));
  return toDocs(await getDocs(q));
}
async function getWeavingBySlug(slug) {
  // Try by document ID first
  const snap = await getDoc(doc(db, 'weavingPrices', slug));
  if (snap.exists()) return toDoc(snap);
  // Fallback: query by slug field
  const q = query(collection(db, 'weavingPrices'), where('slug', '==', slug));
  const results = await getDocs(q);
  if (!results.empty) return toDoc(results.docs[0]);
  const e = new Error('Not found'); e.response = { data: { message: 'Weaving price not found' } }; throw e;
}
async function calculateSizingCost(body) {
  const price = await getSizingBySlug(body.slug);
  const total = price.pricePerKg * body.quantity;
  return { yarnType: price.yarnType, pricePerKg: price.pricePerKg, quantity: body.quantity, totalCost: total };
}
async function calculateWeavingCost(body) {
  const price = await getWeavingBySlug(body.slug);
  const total = price.pricePerMetre * body.quantity;
  return { fabricType: price.fabricType, pricePerMetre: price.pricePerMetre, quantity: body.quantity, totalCost: total };
}

// PRODUCTS
async function getProducts(params) {
  let q;
  if (params.processType) {
    q = query(collection(db, 'products'), where('processType', '==', params.processType), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }
  return toDocs(await getDocs(q));
}

// PAYMENTS
async function createPaymentOrder(body) {
  const user = auth.currentUser;
  const payDoc = {
    userId: user.uid,
    userName: user.displayName || user.email,
    userEmail: user.email,
    amount: Number(body.amount),
    currency: 'INR',
    status: 'created',
    deleted: false,
    createdAt: now(),
    updatedAt: now()
  };
  const ref = await addDoc(collection(db, 'payments'), payDoc);
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
  return { orderId: undefined, key, amount: Math.round(Number(body.amount) * 100), currency: 'INR', paymentId: ref.id };
}

async function createCodPayment(body) {
  const user = auth.currentUser;
  const payDoc = {
    userId: user.uid,
    userName: user.displayName || user.email,
    userEmail: user.email,
    amount: Number(body.amount),
    currency: 'INR',
    method: 'cod',
    status: 'pending',
    deleted: false,
    createdAt: now(),
    updatedAt: now()
  };
  const ref = await addDoc(collection(db, 'payments'), payDoc);
  if (body.bookingId) {
    const bookRef = doc(db, 'bookings', body.bookingId);
    await updateDoc(bookRef, {
      paymentId: ref.id,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'processing',
      updatedAt: now()
    });
  }
  return { _id: ref.id, ...payDoc };
}

async function verifyPayment(body) {
  const { razorpay_payment_id, paymentId, bookingId } = body;
  const payRef = doc(db, 'payments', paymentId);
  await updateDoc(payRef, {
    razorpayPaymentId: razorpay_payment_id || '',
    status: 'success',
    updatedAt: now()
  });
  if (bookingId) {
    const bookRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookRef, { paymentId, paymentStatus: 'success', status: 'processing', updatedAt: now() });
  }
  const snap = await getDoc(payRef);
  return { status: 'success', payment: toDoc(snap) };
}

// CONTACT
async function createContact(body) {
  const user = auth.currentUser;
  const docData = {
    userId: user?.uid || null,
    userEmail: user?.email || body.email,
    name: body.name,
    email: body.email,
    phone: body.phone || '',
    message: body.message,
    replied: false,
    reply: '',
    createdAt: now(),
    updatedAt: now()
  };
  const ref = await addDoc(collection(db, 'contactMessages'), docData);
  return { _id: ref.id, ...docData };
}

async function getMyContactMessages() {
  const userId = uid();
  const email = auth.currentUser?.email;
  // Query by userId
  const q1 = query(collection(db, 'contactMessages'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap1 = await getDocs(q1);
  const byId = toDocs(snap1);
  // Also query by email in case userId wasn't set
  let byEmail = [];
  if (email) {
    const q2 = query(collection(db, 'contactMessages'), where('userEmail', '==', email), orderBy('createdAt', 'desc'));
    const snap2 = await getDocs(q2);
    byEmail = toDocs(snap2);
  }
  const seen = new Set();
  const merged = [];
  for (const m of [...byId, ...byEmail]) {
    if (!seen.has(m._id)) { seen.add(m._id); merged.push(m); }
  }
  return merged;
}

// USER PROFILE
async function updateProfile(body) {
  const userId = uid();
  const ref = doc(db, 'users', userId);
  const payload = {};
  if (body.name !== undefined) payload.name = body.name;
  if (body.phone !== undefined) payload.phone = body.phone;
  if (body.address !== undefined) payload.address = body.address;
  if (body.company !== undefined) payload.company = body.company;
  payload.updatedAt = now();
  await updateDoc(ref, payload);
  const snap = await getDoc(ref);
  return toDoc(snap);
}

// FORGOT PASSWORD (handled via Firebase Auth in AuthContext, but api shim here)
async function forgotPassword(body) {
  const { sendPasswordResetEmail } = await import('firebase/auth');
  await sendPasswordResetEmail(auth, body.email);
  return { message: 'If an account exists, a reset link has been sent.' };
}

// CHATBOT
async function initiateChatbot(body) {
  const greeting = `👋 Welcome to CS TEX Chatbot!\n\nI'm your textile pricing assistant! I can help you with:\n\n✅ Sizing Services (yarn pricing per kg)\n✅ Weaving Services (fabric pricing per metre)\n✅ Instant cost calculations\n✅ Booking assistance\n✅ Delivery & payment info\n\n💡 Use the quick options below or type your query!`;
  const docData = {
    sessionId: body.sessionId,
    userId: uid() || null,
    messages: [{ sender: 'bot', text: greeting, timestamp: new Date() }],
    serviceType: null,
    selectedYarnFabric: null,
    quantity: null,
    totalCost: null,
    bookingCreated: false,
    isResolved: false,
    createdAt: now(),
    updatedAt: now()
  };
  await setDoc(doc(db, 'chatbotConversations', body.sessionId), docData);
  return { sessionId: body.sessionId, greeting };
}

async function chatbotMessage(body) {
  const { sessionId, message } = body;
  const convRef = doc(db, 'chatbotConversations', sessionId);
  const convSnap = await getDoc(convRef);
  if (!convSnap.exists()) { const e = new Error('Conversation not found'); e.response = { data: { error: e.message } }; throw e; }
  const conv = convSnap.data();
  conv.messages.push({ sender: 'user', text: message, timestamp: new Date() });
  const botResponse = await generateBotResponse(message, conv);
  conv.messages.push({ sender: 'bot', text: botResponse, timestamp: new Date() });
  await updateDoc(convRef, { messages: conv.messages, serviceType: conv.serviceType, selectedYarnFabric: conv.selectedYarnFabric, quantity: conv.quantity, totalCost: conv.totalCost, bookingCreated: conv.bookingCreated, updatedAt: now() });
  return { response: botResponse, conversation: { _id: sessionId, ...conv } };
}

// Chatbot AI logic (moved from server)
async function generateBotResponse(userMessage, conversation) {
  const lm = userMessage.toLowerCase();
  if (lm.includes('main menu') || lm.includes('home') || userMessage === 'main menu') {
    return `👋 Welcome to CS TEX Chatbot!\n\nI'm your textile pricing assistant! I can help you with:\n\n✅ Sizing Services (yarn pricing per kg)\n✅ Weaving Services (fabric pricing per metre)\n✅ Instant cost calculations\n✅ Booking assistance\n✅ Delivery & payment info\n\n💡 Use the quick options below or type your query!`;
  }
  if (lm.includes('sizing') || lm.includes('yarn') || lm.includes('per kg') || lm === '1') {
    conversation.serviceType = 'sizing';
    try {
      const prices = await getAllSizingPrices();
      const list = prices.map((p, i) => `${i + 1}. ${p.yarnType} - ₹${p.pricePerKg}/kg`).join('\n');
      return `🧵 **SIZING SERVICES**\n\nHere are our available yarn types:\n\n${list}\n\n💡 **How to order:**\n• Type the yarn number (e.g., "1" for Cotton)\n• Or specify: "10kg cotton yarn"\n\n📝 Example: "I need 25kg polyester yarn"`;
    } catch { return '🧵 Sizing services available. Please try again.'; }
  }
  if (lm.includes('weaving') || lm.includes('fabric') || lm.includes('per metre') || lm === '2') {
    conversation.serviceType = 'weaving';
    try {
      const prices = await getAllWeavingPrices();
      const list = prices.map((p, i) => `${i + 1}. ${p.fabricType} - ₹${p.pricePerMetre}/metre`).join('\n');
      return `🧶 **WEAVING SERVICES**\n\nHere are our available fabrics:\n\n${list}\n\n💡 **How to order:**\n• Type the fabric number (e.g., "3" for Polyester)\n• Or specify: "50 metres silk weaving"\n\n📝 Example: "I need 100 metres cotton fabric"`;
    } catch { return '🧶 Weaving services available. Please try again.'; }
  }
  if (conversation.serviceType === 'sizing' && /(\d+)\s*(kg|kilogram)/.test(lm)) {
    const match = lm.match(/(\d+)\s*(kg|kilogram)/);
    const qty = parseInt(match[1]);
    const yt = extractYarnType(lm);
    if (yt) {
      try {
        const price = await getSizingBySlug(yt);
        const total = price.pricePerKg * qty;
        conversation.selectedYarnFabric = price.yarnType; conversation.quantity = qty; conversation.totalCost = total;
        return `✨ **SIZING QUOTE READY!**\n\n📋 **Service:** Yarn Sizing\n🧵 **Yarn Type:** ${price.yarnType}\n📊 **Quantity:** ${qty} kg\n💰 **Price Per KG:** ₹${price.pricePerKg}\n\n━━━━━━━━━━━━━━━━━━━\n✅ **TOTAL COST: ₹${total}**\n━━━━━━━━━━━━━━━━━━━\n\n📝 **Calculation:**\n₹${price.pricePerKg} × ${qty} kg = ₹${total}\n\n💬 Ready to proceed? Use quick options below!`;
      } catch { /* fall through */ }
    }
  }
  if (conversation.serviceType === 'weaving' && /(\d+)\s*(metre|meter|m\b)/.test(lm)) {
    const match = lm.match(/(\d+)\s*(metre|meter|m\b)/);
    const qty = parseInt(match[1]);
    const ft = extractFabricType(lm);
    if (ft) {
      try {
        const price = await getWeavingBySlug(ft);
        const total = price.pricePerMetre * qty;
        conversation.selectedYarnFabric = price.fabricType; conversation.quantity = qty; conversation.totalCost = total;
        return `✨ **WEAVING QUOTE READY!**\n\n📋 **Service:** Fabric Weaving\n🧶 **Fabric Type:** ${price.fabricType}\n📊 **Quantity:** ${qty} metres\n💰 **Price Per Metre:** ₹${price.pricePerMetre}\n\n━━━━━━━━━━━━━━━━━━━\n✅ **TOTAL COST: ₹${total}**\n━━━━━━━━━━━━━━━━━━━\n\n📝 **Calculation:**\n₹${price.pricePerMetre} × ${qty} metres = ₹${total}\n\n💬 Ready to proceed? Use quick options below!`;
      } catch { /* fall through */ }
    }
  }
  if (lm.includes('book') || lm.includes('booking')) {
    if (conversation.totalCost) {
      conversation.bookingCreated = true;
      return `🎉 **BOOKING INITIATED!**\n\n📋 **Your Order Summary:**\n💰 Total Cost: ₹${conversation.totalCost}\n\nTo complete your booking, provide these details:\n\n1️⃣ Full Name\n2️⃣ Email Address\n3️⃣ Phone Number\n4️⃣ Delivery Timeline\n\n📝 Reply with your details or use the options below!`;
    }
    return `⚠️ **No Quote Found**\n\nPlease first select a service and quantity so I can prepare your quote!\n\nUse the quick options below to get started.`;
  }
  if (lm.includes('pricing') || lm === '3') {
    return `💰 **PRICING OVERVIEW**\n\n🧵 **Sizing Services (per KG):**\n• Cotton: ₹450/kg\n• Polyester: ₹520/kg\n• Viscose: ₹480/kg\n• Nylon: ₹550/kg\n\n🧶 **Weaving Services (per Metre):**\n• Cotton: ₹280/m\n• Silk: ₹450/m\n• Polyester: ₹250/m\n• Rayon: ₹320/m\n\n💡 Want exact pricing? Select a service type below!`;
  }
  if (lm.includes('help') || lm.includes('faq') || lm === '4') {
    return `❓ **FREQUENTLY ASKED QUESTIONS**\n\nChoose a topic:\n\n1️⃣ Delivery Information\n2️⃣ Payment Methods\n3️⃣ Quality Standards\n4️⃣ Returns & Refunds\n\nOr ask your specific question!`;
  }
  const faq = { delivery: '📦 **DELIVERY INFORMATION**\n\n1. Standard Delivery: 5-7 business days\n2. Express Delivery: 2-3 business days (+₹500)\n3. Same-day (Metro areas): +₹1000\n4. Free shipping on orders ₹5000+', payment: '💳 **PAYMENT METHODS**\n\nWe accept:\n1. Credit/Debit Cards\n2. Net Banking\n3. UPI (Google Pay, PhonePe, Paytm)\n4. Bank Transfer\n5. Razorpay Secure Gateway\n\n🔒 All payments are 100% secure!', quality: '✅ **QUALITY ASSURANCE**\n\nOur Standards:\n1. ISO Certified Manufacturing\n2. Strict Quality Control\n3. Testing for Strength, Color & Finish\n4. 15+ Years Professional Expertise', returns: '🔄 **RETURNS & REFUNDS**\n\nOur Policy:\n1. 7-day return for unused products\n2. Full refund if quality issues found\n3. Free return shipping' };
  for (const [key, response] of Object.entries(faq)) { if (lm.includes(key)) return response; }
  return `I'm here to help! 😊\n\nYou can ask about:\n🧵 **Sizing Services** - pricing and yarn types\n🧶 **Weaving Services** - fabric types and pricing\n📦 **Delivery** - shipping timelines\n💳 **Payments** - payment methods\n\nWhat would you like to know?`;
}

function extractYarnType(msg) {
  const map = { cotton: 'cotton', polyester: 'polyester', viscose: 'viscose', rayon: 'viscose', 'pc blend': 'pc-blend', 'pv blend': 'pv-blend', nylon: 'nylon', acrylic: 'acrylic' };
  const l = msg.toLowerCase();
  for (const [k, v] of Object.entries(map)) { if (l.includes(k)) return v; }
  return null;
}
function extractFabricType(msg) {
  const map = { cotton: 'cotton', rayon: 'rayon', polyester: 'polyester', silk: 'silk', woollen: 'woollen', linen: 'linen', nylon: 'nylon', acrylic: 'acrylic' };
  const l = msg.toLowerCase();
  for (const [k, v] of Object.entries(map)) { if (l.includes(k)) return v; }
  return null;
}

// ---------- URL Router (axios-compatible interface) ----------
function parseQS(qs) {
  if (!qs) return {};
  const p = {};
  qs.split('&').forEach(pair => { const [k, v] = pair.split('='); if (k) p[decodeURIComponent(k)] = decodeURIComponent(v || ''); });
  return p;
}

async function routeGet(url, config) {
  const [path, qs] = url.split('?');
  const params = { ...parseQS(qs), ...config?.params };

  if (path === '/bookings/my') return getMyBookings();
  if (path === '/pricing/sizing/all') return getAllSizingPrices();
  if (path === '/pricing/weaving/all') return getAllWeavingPrices();
  if (path === '/payments/config') return { key: import.meta.env.VITE_RAZORPAY_KEY_ID || '' };
  if (path === '/contact/my') return getMyContactMessages();
  if (path === '/products') return getProducts(params);

  // /pricing/sizing/:slug
  const sizingMatch = path.match(/^\/pricing\/sizing\/(.+)$/);
  if (sizingMatch) return getSizingBySlug(sizingMatch[1]);
  // /pricing/weaving/:slug
  const weavingMatch = path.match(/^\/pricing\/weaving\/(.+)$/);
  if (weavingMatch) return getWeavingBySlug(weavingMatch[1]);

  throw new Error(`Unhandled GET: ${url}`);
}

async function routePost(url, body) {
  const [path] = url.split('?');

  if (path === '/auth/forgot-password') return forgotPassword(body);
  if (path === '/bookings') return createBooking(body);
  if (path === '/payments/order') return createPaymentOrder(body);
  if (path === '/payments/verify') return verifyPayment(body);
  if (path === '/payments/cod') return createCodPayment(body);
  if (path === '/contact') return createContact(body);
  if (path === '/pricing/calculate/sizing') return calculateSizingCost(body);
  if (path === '/pricing/calculate/weaving') return calculateWeavingCost(body);
  if (path === '/chatbot/initiate') return initiateChatbot(body);
  if (path === '/chatbot/message') return chatbotMessage(body);

  throw new Error(`Unhandled POST: ${url}`);
}

async function routePut(url, body) {
  const [path] = url.split('?');
  if (path === '/users/profile') return updateProfile(body);
  throw new Error(`Unhandled PUT: ${url}`);
}

async function routePatch(url, body) {
  const [path] = url.split('?');
  const bookingMatch = path.match(/^\/bookings\/(.+)$/);
  if (bookingMatch) return updateBooking(bookingMatch[1], body);
  throw new Error(`Unhandled PATCH: ${url}`);
}

// The api object – drop-in replacement for the old axios instance
const api = {
  get: async (url, config) => ({ data: await routeGet(url, config) }),
  post: async (url, body) => ({ data: await routePost(url, body) }),
  put: async (url, body) => ({ data: await routePut(url, body) }),
  patch: async (url, body) => ({ data: await routePatch(url, body) }),
  delete: async () => ({ data: { success: true } })
};

// Pricing API (same interface as before)
export const pricingApi = {
  getAllSizingPrices: () => api.get('/pricing/sizing/all'),
  getSizingPrice: (slug) => api.get(`/pricing/sizing/${slug}`),
  getAllWeavingPrices: () => api.get('/pricing/weaving/all'),
  getWeavingPrice: (slug) => api.get(`/pricing/weaving/${slug}`),
  calculateSizingCost: (slug, quantity) => api.post('/pricing/calculate/sizing', { slug, quantity }),
  calculateWeavingCost: (slug, quantity) => api.post('/pricing/calculate/weaving', { slug, quantity })
};

// Export chatbot functions for AICompanion
export const chatbotApi = { initiateChatbot, chatbotMessage };

export default api;
