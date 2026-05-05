const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    approved BOOLEAN DEFAULT 0,
    required_attributes TEXT, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price REAL,
    is_offer_only BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'active', -- 'active', 'sold'
    attributes TEXT, -- JSON string
    image_blob BLOB,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    duration_seconds INTEGER NOT NULL,
    expires_at DATETIME NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id)
  );
`);

// Seed initial categories if empty
const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, approved, required_attributes) VALUES (?, ?, ?)');
insertCategory.run('Otomobil', 1, JSON.stringify(['KM', 'Yıl', 'Yakıt Tipi', 'Vites']));
insertCategory.run('Elektronik (Toptan)', 1, JSON.stringify(['Model No', 'Garanti (Ay)', 'Stok Adedi', 'Durum']));
insertCategory.run('Tekstil & Giyim', 1, JSON.stringify(['Kumaş Türü', 'Beden Serisi', 'Paket İçi Adet', 'Renk']));
insertCategory.run('Gıda & İçecek', 1, JSON.stringify(['Menşei', 'SKT', 'Depolama Koşulu', 'Sertifikalar']));
insertCategory.run('İnşaat Malzemeleri', 1, JSON.stringify(['Marka', 'Boyut/Ölçü', 'Ağırlık', 'Standart']));
insertCategory.run('Akvaryum', 1, JSON.stringify(['Hacim (Litre)', 'Filtre Tipi', 'Cam Kalınlığı']));
insertCategory.run('Elektronik', 1, JSON.stringify(['Garanti Süresi', 'Kondisyon']));

module.exports = db;
