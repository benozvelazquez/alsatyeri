const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'marketplace.db'));

console.log('Resetting database...');

db.prepare('DROP TABLE IF EXISTS offers').run();
db.prepare('DROP TABLE IF EXISTS listings').run();
db.prepare('DROP TABLE IF EXISTS categories').run();
db.prepare('DROP TABLE IF EXISTS users').run();

console.log('Tables dropped. Recreating schema...');

// Run the initialization logic (copy-pasted from db.js but simplified)
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT,
  name TEXT,
  role TEXT DEFAULT 'buyer'
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  approved INTEGER DEFAULT 1,
  required_attributes TEXT
);

CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id INTEGER,
  category_id INTEGER,
  title TEXT,
  description TEXT,
  price REAL,
  is_offer_only INTEGER DEFAULT 1,
  attributes TEXT,
  image_blob BLOB,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(seller_id) REFERENCES users(id),
  FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER,
  buyer_id INTEGER,
  amount REAL,
  status TEXT DEFAULT 'pending',
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(listing_id) REFERENCES listings(id),
  FOREIGN KEY(buyer_id) REFERENCES users(id)
);
`);

const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, approved, required_attributes) VALUES (?, ?, ?)');
insertCategory.run('Otomobil', 1, JSON.stringify(['KM', 'Yıl', 'Yakıt Tipi', 'Vites']));
insertCategory.run('Elektronik (Toptan)', 1, JSON.stringify(['Model No', 'Garanti (Ay)', 'Stok Adedi', 'Durum']));
insertCategory.run('Tekstil & Giyim', 1, JSON.stringify(['Kumaş Türü', 'Beden Serisi', 'Paket İçi Adet', 'Renk']));
insertCategory.run('Gıda & İçecek', 1, JSON.stringify(['Menşei', 'SKT', 'Depolama Koşulu', 'Sertifikalar']));
insertCategory.run('İnşaat Malzemeleri', 1, JSON.stringify(['Marka', 'Boyut/Ölçü', 'Ağırlık', 'Standart']));
insertCategory.run('Akvaryum', 1, JSON.stringify(['Hacim (Litre)', 'Filtre Tipi', 'Cam Kalınlığı']));

console.log('Database reset and seeded successfully.');
db.close();
