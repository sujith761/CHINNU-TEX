import { db } from '../firebase';
import {
  collection, addDoc, getDocs, query, where, orderBy,
  doc, updateDoc, deleteDoc, getDoc, setDoc, Timestamp
} from 'firebase/firestore';

const now = () => Timestamp.now();
const toDoc = (snap) => ({ _id: snap.id, id: snap.id, ...snap.data() });
const toDocs = (snap) => snap.docs.map(toDoc);

// ─── Admin GET handlers ─────────────────────────────
async function getAdminBookings(params) {
  let q;
  if (params.status) {
    q = query(collection(db, 'bookings'), where('status', '==', params.status), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
  }
  return toDocs(await getDocs(q)).map(b => ({
    ...b,
    user: { _id: b.userId, name: b.userName, email: b.userEmail },
    payment: b.paymentId ? { _id: b.paymentId, status: b.paymentStatus || 'created' } : null
  }));
}

async function getAdminPayments(params) {
  let q;
  if (params.status) {
    q = query(collection(db, 'payments'), where('status', '==', params.status), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
  }
  const payments = toDocs(await getDocs(q));
  // Enrich with booking info where available
  const results = [];
  for (const p of payments) {
    let booking = null;
    if (p.bookingId) {
      const bSnap = await getDoc(doc(db, 'bookings', p.bookingId));
      if (bSnap.exists()) booking = toDoc(bSnap);
    } else {
      const bq = query(collection(db, 'bookings'), where('userId', '==', p.userId));
      const fallbackSnaps = await getDocs(bq);
      const possibleBookings = toDocs(fallbackSnaps);
      booking = possibleBookings.find(b => b.totalAmount === p.amount) || null;
    }
    results.push({
      ...p,
      user: { _id: p.userId, name: p.userName, email: p.userEmail },
      booking
    });
  }
  return results;
}

async function getAdminMessages() {
  const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
  return toDocs(await getDocs(q)).map(m => ({
    ...m,
    user: m.userId ? { _id: m.userId, name: m.name, email: m.userEmail || m.email } : null
  }));
}

async function getAdminUsers(params) {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  let users = toDocs(await getDocs(q)).map(u => ({
    id: u._id,
    name: u.name || '',
    email: u.email || '',
    phone: u.phone || '',
    company: u.company || '',
    role: u.role || 'user',
    createdAt: u.createdAt
  }));
  if (params.q) {
    const search = params.q.toLowerCase();
    users = users.filter(u =>
      (u.name || '').toLowerCase().includes(search) ||
      (u.email || '').toLowerCase().includes(search)
    );
  }
  return users;
}

async function getProducts() {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  return toDocs(await getDocs(q));
}

async function getAllSizingPrices() {
  const q = query(collection(db, 'sizingPrices'), orderBy('pricePerKg'));
  return toDocs(await getDocs(q));
}

async function getAllWeavingPrices() {
  const q = query(collection(db, 'weavingPrices'), orderBy('pricePerMetre'));
  return toDocs(await getDocs(q));
}

// ─── Admin POST/PUT/PATCH/DELETE handlers ────────────
async function createProduct(body) {
  const docData = { ...body, createdAt: now(), updatedAt: now() };
  const ref = await addDoc(collection(db, 'products'), docData);
  return { _id: ref.id, ...docData };
}

async function updateProduct(id, body) {
  const ref = doc(db, 'products', id);
  await updateDoc(ref, { ...body, updatedAt: now() });
  const snap = await getDoc(ref);
  return toDoc(snap);
}

async function deleteProduct(id) {
  await deleteDoc(doc(db, 'products', id));
  return { success: true };
}

async function upsertSizingPrice(body) {
  const slug = body.slug || body.yarnType?.toLowerCase().replace(/\s+/g, '-');
  const ref = doc(db, 'sizingPrices', slug);
  const data = {
    yarnType: body.yarnType,
    slug,
    pricePerKg: Number(body.pricePerKg),
    stockQuantity: Number(body.stockQuantity ?? 0),
    description: body.description || '',
    isActive: body.isActive !== false,
    updatedAt: now()
  };
  const existing = await getDoc(ref);
  if (!existing.exists()) data.createdAt = now();
  await setDoc(ref, data, { merge: true });
  return { _id: slug, ...data };
}

async function upsertWeavingPrice(body) {
  const slug = body.slug || body.fabricType?.toLowerCase().replace(/\s+/g, '-');
  const ref = doc(db, 'weavingPrices', slug);
  const data = {
    fabricType: body.fabricType,
    slug,
    pricePerMetre: Number(body.pricePerMetre),
    stockQuantity: Number(body.stockQuantity ?? 0),
    description: body.description || '',
    isActive: body.isActive !== false,
    updatedAt: now()
  };
  const existing = await getDoc(ref);
  if (!existing.exists()) data.createdAt = now();
  await setDoc(ref, data, { merge: true });
  return { _id: slug, ...data };
}

async function updateBookingStatus(id, body) {
  const ref = doc(db, 'bookings', id);
  await updateDoc(ref, { status: body.status, updatedAt: now() });
  const snap = await getDoc(ref);
  return toDoc(snap);
}

async function replyToMessage(id, body) {
  const ref = doc(db, 'contactMessages', id);
  await updateDoc(ref, { reply: body.reply, replied: true, updatedAt: now() });
  const snap = await getDoc(ref);
  return toDoc(snap);
}

async function updateMessage(id, body) {
  const ref = doc(db, 'contactMessages', id);
  await updateDoc(ref, { ...body, updatedAt: now() });
  const snap = await getDoc(ref);
  return toDoc(snap);
}

async function deleteMessage(id) {
  await deleteDoc(doc(db, 'contactMessages', id));
  return { success: true };
}

async function updateUser(id, body) {
  const ref = doc(db, 'users', id);
  await updateDoc(ref, { ...body, updatedAt: now() });
  const snap = await getDoc(ref);
  return toDoc(snap);
}

async function deleteUser(id) {
  await deleteDoc(doc(db, 'users', id));
  return { success: true };
}

// ─── URL Router ──────────────────────────────────────
function parseQS(qs) {
  if (!qs) return {};
  const p = {};
  qs.split('&').forEach(pair => { const [k, v] = pair.split('='); if (k) p[decodeURIComponent(k)] = decodeURIComponent(v || ''); });
  return p;
}

async function routeGet(url, config) {
  const [path, qs] = url.split('?');
  const params = { ...parseQS(qs), ...config?.params };

  if (path === '/admin/bookings') return getAdminBookings(params);
  if (path === '/admin/payments') return getAdminPayments(params);
  if (path === '/admin/messages') return getAdminMessages();
  if (path === '/admin/users') return getAdminUsers(params);
  if (path === '/products') return getProducts();
  if (path === '/pricing/sizing/all') return getAllSizingPrices();
  if (path === '/pricing/weaving/all') return getAllWeavingPrices();
  // PDF report – return empty blob (not supported without server)
  if (path === '/reports/transactions') return new Blob(['PDF reports require server-side generation'], { type: 'text/plain' });

  throw new Error(`Unhandled GET: ${url}`);
}

async function routePost(url, body) {
  const [path] = url.split('?');
  if (path === '/products') return createProduct(body);
  if (path === '/pricing/admin/sizing') return upsertSizingPrice(body);
  if (path === '/pricing/admin/weaving') return upsertWeavingPrice(body);
  const replyMatch = path.match(/^\/admin\/messages\/(.+)\/reply$/);
  if (replyMatch) return replyToMessage(replyMatch[1], body);
  throw new Error(`Unhandled POST: ${url}`);
}

async function routePut(url, body) {
  const [path] = url.split('?');
  const prodMatch = path.match(/^\/products\/(.+)$/);
  if (prodMatch) return updateProduct(prodMatch[1], body);
  const bookMatch = path.match(/^\/bookings\/(.+)\/status$/);
  if (bookMatch) return updateBookingStatus(bookMatch[1], body);
  throw new Error(`Unhandled PUT: ${url}`);
}

async function routePatch(url, body) {
  const [path] = url.split('?');
  const msgMatch = path.match(/^\/admin\/messages\/(.+)$/);
  if (msgMatch) return updateMessage(msgMatch[1], body);
  const userMatch = path.match(/^\/admin\/users\/(.+)$/);
  if (userMatch) return updateUser(userMatch[1], body);
  throw new Error(`Unhandled PATCH: ${url}`);
}

async function routeDelete(url) {
  const [path] = url.split('?');
  const prodMatch = path.match(/^\/products\/(.+)$/);
  if (prodMatch) return deleteProduct(prodMatch[1]);
  const msgMatch = path.match(/^\/admin\/messages\/(.+)$/);
  if (msgMatch) return deleteMessage(msgMatch[1]);
  const userMatch = path.match(/^\/admin\/users\/(.+)$/);
  if (userMatch) return deleteUser(userMatch[1]);
  throw new Error(`Unhandled DELETE: ${url}`);
}

const api = {
  get: async (url, config) => ({ data: await routeGet(url, config) }),
  post: async (url, body) => ({ data: await routePost(url, body) }),
  put: async (url, body) => ({ data: await routePut(url, body) }),
  patch: async (url, body) => ({ data: await routePatch(url, body) }),
  delete: async (url) => ({ data: await routeDelete(url) })
};

export default api;
