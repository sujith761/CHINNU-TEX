// Firestore seed script for inventory data
// Run with: node scripts/seed-inventory.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdQk0U8AyccBbqP7L-R2Urxs7T8KDUHmM",
  authDomain: "chinnu-tex-admin.web.app",
  projectId: "chinnu-textiles",
  storageBucket: "chinnu-textiles.firebasestorage.app",
  messagingSenderId: "772001051450",
  appId: "1:772001051450:web:06ffff72a56433274e9603",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const now = Timestamp.now();

const sizingData = [
  { yarnType: 'Cotton', slug: 'cotton', pricePerKg: 450, stockQuantity: 500 },
  { yarnType: 'Polyester', slug: 'polyester', pricePerKg: 520, stockQuantity: 300 },
  { yarnType: 'Viscose', slug: 'viscose', pricePerKg: 480, stockQuantity: 200 },
  { yarnType: 'PC Blend', slug: 'pc-blend', pricePerKg: 510, stockQuantity: 150 },
  { yarnType: 'PV Blend', slug: 'pv-blend', pricePerKg: 490, stockQuantity: 180 },
  { yarnType: 'Nylon', slug: 'nylon', pricePerKg: 550, stockQuantity: 100 },
  { yarnType: 'Acrylic', slug: 'acrylic', pricePerKg: 470, stockQuantity: 250 },
];

const weavingData = [
  { fabricType: 'Cotton', slug: 'cotton', pricePerMetre: 280, stockQuantity: 500 },
  { fabricType: 'Rayon', slug: 'rayon', pricePerMetre: 320, stockQuantity: 300 },
  { fabricType: 'Polyester', slug: 'polyester', pricePerMetre: 250, stockQuantity: 200 },
  { fabricType: 'Silk', slug: 'silk', pricePerMetre: 450, stockQuantity: 150 },
  { fabricType: 'Woollen', slug: 'woollen', pricePerMetre: 380, stockQuantity: 180 },
  { fabricType: 'Linen', slug: 'linen', pricePerMetre: 400, stockQuantity: 100 },
  { fabricType: 'Nylon', slug: 'nylon', pricePerMetre: 240, stockQuantity: 250 },
  { fabricType: 'Acrylic', slug: 'acrylic', pricePerMetre: 220, stockQuantity: 350 },
];

async function seed() {
  console.log('Seeding sizing prices...');
  for (const item of sizingData) {
    await setDoc(doc(db, 'sizingPrices', item.slug), {
      ...item,
      isActive: true,
      description: `${item.yarnType} yarn sizing service`,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  ✓ ${item.yarnType}`);
  }

  console.log('\nSeeding weaving prices...');
  for (const item of weavingData) {
    await setDoc(doc(db, 'weavingPrices', item.slug), {
      ...item,
      isActive: true,
      description: `${item.fabricType} fabric weaving service`,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  ✓ ${item.fabricType}`);
  }

  console.log('\n✅ Seed complete! Refresh the admin Inventory page.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
