import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingBag, User, PlusCircle, LogOut, Menu, X, LayoutDashboard, Heart, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import CreateListing from './pages/CreateListing';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      // Migration: Flatten nested user object if it exists
      return parsed.user ? parsed.user : parsed;
    } catch (e) {
      return null;
    }
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const toggleRole = () => {
    if (!user) return;
    const currentRole = user.role;
    const newRole = currentRole === 'seller' ? 'buyer' : 'seller';
    const newUser = { ...user, role: newRole };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const NavLinks = () => (
    <>
      <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors">Ana Sayfa</Link>
      {user ? (
        <>
          {user.role === 'seller' && (
            <Link to="/seller-dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors">Satıcı Paneli</Link>
          )}
          {user.role === 'buyer' && (
            <Link to="/buyer-dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors">Tekliflerim</Link>
          )}
        </>
      ) : null}
    </>
  );

  return (
    <Router>
      <div className="min-h-screen grain bg-mesh font-sans selection:bg-primary-500/30">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
          <div className="max-w-7xl mx-auto glass rounded-full px-6 h-16 flex items-center justify-between shadow-lg shadow-slate-200/50 relative z-20">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <span className="text-xl font-black font-display tracking-tightest text-slate-900 uppercase italic">ALSAT YERİ</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <NavLinks />
              {user ? (
                <>
                  <div className="w-px h-4 bg-slate-200" />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 pl-1.5 pr-4 py-1.5 rounded-full shadow-sm group hover:border-primary-200 transition-colors">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-md">
                        {user.name && user.name[0] ? user.name[0] : '?'}
                      </div>
                      <div className="flex flex-col -space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 leading-none">{user.role === 'seller' ? 'Toptancı' : 'Alıcı'}</span>
                        <span className="text-xs font-black uppercase tracking-tight text-slate-700">{user.name || 'Kullanıcı'}</span>
                      </div>
                    </div>
                    {user.role === 'seller' && (
                      <Link to="/create-listing" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-primary-500/20 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                        <PlusCircle size={18} /> İLAN VER
                      </Link>
                    )}
                    <button
                      onClick={toggleRole}
                      className="text-[8px] font-black underline text-slate-300 hover:text-primary-600 uppercase tracking-widest"
                    >
                      Rol Değiştir
                    </button>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-xs font-black text-slate-600 hover:text-primary-600 transition-colors tracking-widest uppercase">GİRİŞ</Link>
                  <Link to="/register" className="bg-slate-950 text-white px-8 py-2.5 rounded-full text-xs font-black hover:bg-primary-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10 uppercase tracking-widest">KAYIT OL</Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden text-slate-900 p-2 hover:bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-24 left-6 right-6 glass p-8 rounded-[40px] shadow-2xl md:hidden z-10 flex flex-col gap-6"
              >
                <div className="flex flex-col gap-4">
                  <NavLinks />
                </div>
                {user ? (
                  <div className="pt-6 border-t border-slate-100 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-lg">
                        {user.name && user.name[0] ? user.name[0] : '?'}
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-slate-900">{user.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role === 'seller' ? 'Toptancı' : 'Alıcı'}</p>
                      </div>
                    </div>
                    {user.role === 'seller' && (
                      <Link to="/create-listing" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 w-full bg-primary-600 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
                        <PlusCircle size={20} /> İLAN OLUŞTUR
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full bg-red-50 text-red-500 p-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                      <LogOut size={20} /> ÇIKIŞ YAP
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 pt-6 border-t border-slate-100">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 bg-slate-50">GİRİŞ YAP</Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-950 text-white shadow-xl">KAYIT OL</Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Content */}
        <main className="pt-28 pb-20 max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/listing/:id" element={<ListingDetail user={user} />} />
              <Route path="/seller-dashboard" element={<SellerDashboard user={user} />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard user={user} />} />
              <Route path="/create-listing" element={<CreateListing user={user} />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="py-12 border-t border-slate-100 text-center">
          <div className="flex justify-center gap-8 mb-6 opacity-30">
            <ShoppingBag size={20} />
            <LayoutDashboard size={20} />
            <Heart size={20} />
            <Settings size={20} />
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">© 2026 AlSat Yeri • Tasarlandığı Gibi.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
