const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// --- Auth Routes (Simulated for MVP) ---
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (user && user.password === password) { // Plain text for MVP as requested
        res.json({ id: user.id, name: user.name, role: user.role, email: user.email });
    } else {
        res.status(401).json({ error: 'Geçersiz bilgiler' });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { email, password, name, role } = req.body;
    try {
        const info = db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(email, password, name, role);
        res.json({ id: info.lastInsertRowid, email, name, role });
    } catch (err) {
        console.error('Register error:', err);
        res.status(400).json({ error: 'Kullanıcı zaten mevcut veya geçersiz veri' });
    }
});

// --- Categories ---
app.get('/api/categories', (req, res) => {
    const categories = db.prepare('SELECT * FROM categories WHERE approved = 1').all();
    res.json(categories.map(c => ({ ...c, required_attributes: JSON.parse(c.required_attributes || '[]') })));
});

app.post('/api/categories', (req, res) => {
    const { name, required_attributes } = req.body;
    try {
        const info = db.prepare('INSERT INTO categories (name, approved, required_attributes) VALUES (?, 1, ?)').run(name, JSON.stringify(required_attributes || []));
        res.json({ id: info.lastInsertRowid, name });
    } catch (err) {
        console.error('Category error:', err);
        res.status(400).json({ error: 'Kategori eklenemedi' });
    }
});

// --- Listings ---
app.get('/api/listings', (req, res) => {
    try {
        const listings = db.prepare(`
            SELECT l.*, c.name as category_name, u.name as seller_name 
            FROM listings l
            JOIN categories c ON l.category_id = c.id
            JOIN users u ON l.seller_id = u.id
            WHERE l.status = 'active'
            ORDER BY l.created_at DESC
        `).all();
        res.json(listings.map(l => ({ ...l, attributes: JSON.parse(l.attributes || '{}') })));
    } catch (err) {
        console.error('Listings GET error:', err);
        res.status(500).json({ error: 'İlanlar yüklenemedi' });
    }
});

app.get('/api/listings/:id', (req, res) => {
    try {
        const listing = db.prepare(`
            SELECT l.*, c.name as category_name, u.name as seller_name 
            FROM listings l
            JOIN categories c ON l.category_id = c.id
            JOIN users u ON l.seller_id = u.id
            WHERE l.id = ?
        `).get(req.params.id);
        if (listing) {
            res.json({ ...listing, attributes: JSON.parse(listing.attributes || '{}') });
        } else {
            res.status(404).json({ error: 'İlan bulunamadı' });
        }
    } catch (err) {
        console.error('Listing GET Detail error:', err);
        res.status(500).json({ error: 'İlan detayı yüklenemedi' });
    }
});

app.get('/api/listings/:id/image', (req, res) => {
    const listing = db.prepare('SELECT image_blob FROM listings WHERE id = ?').get(req.params.id);
    if (listing && listing.image_blob) {
        res.set('Content-Type', 'image/jpeg');
        res.send(listing.image_blob);
    } else {
        res.status(404).send('Resim bulunamadı');
    }
});

app.post('/api/listings', upload.single('image'), (req, res) => {
    const { seller_id, category_id, title, description, price, is_offer_only, attributes } = req.body;
    const image_blob = req.file ? req.file.buffer : null;

    if (!seller_id || seller_id === 'undefined') {
        return res.status(400).json({ error: 'Geçersiz satıcı ID' });
    }

    try {
        const info = db.prepare(`
            INSERT INTO listings (seller_id, category_id, title, description, price, is_offer_only, attributes, image_blob)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            parseInt(seller_id),
            parseInt(category_id),
            title,
            description,
            parseFloat(price) || 0,
            is_offer_only === 'true' ? 1 : 0,
            attributes || '{}',
            image_blob
        );

        res.json({ id: info.lastInsertRowid });
    } catch (err) {
        console.error('Listing Create Error:', err);
        res.status(500).json({ error: 'İlan oluşturulamadı' });
    }
});

// --- Offers ---
app.get('/api/offers', (req, res) => {
    const { seller_id, buyer_id } = req.query;
    let query = 'SELECT o.*, l.title as listing_title, u.name as buyer_name FROM offers o JOIN listings l ON o.listing_id = l.id JOIN users u ON o.buyer_id = u.id';
    let params = [];

    if (seller_id) {
        query += ' WHERE l.seller_id = ?';
        params.push(seller_id);
    } else if (buyer_id) {
        query += ' WHERE o.buyer_id = ?';
        params.push(buyer_id);
    }

    const offers = db.prepare(query).all(...params);
    res.json(offers);
});

app.post('/api/offers', (req, res) => {
    const { listing_id, buyer_id, amount, duration_seconds } = req.body;
    const expires_at = new Date(Date.now() + duration_seconds * 1000).toISOString();

    if (!buyer_id || buyer_id === 'undefined') {
        return res.status(400).json({ error: 'Geçersiz alıcı ID, lütfen tekrar giriş yapın.' });
    }

    try {
        db.prepare(`
            INSERT INTO offers (listing_id, buyer_id, amount, expires_at, status)
            VALUES (?, ?, ?, ?, 'pending')
        `).run(listing_id, buyer_id, amount, expires_at);
        res.json({ success: true });
    } catch (err) {
        console.error('Offer Create Error:', err);
        res.status(500).json({ error: 'Teklif iletilemedi' });
    }
});

app.patch('/api/offers/:id', (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE offers SET status = ? WHERE id = ?').run(status, req.params.id);

    if (status === 'accepted') {
        // Mark listing as sold
        const offer = db.prepare('SELECT listing_id FROM offers WHERE id = ?').get(req.params.id);
        db.prepare("UPDATE listings SET status = 'sold' WHERE id = ?").run(offer.listing_id);
    }

    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}).on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});
