import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowUpRight, Search, Sparkles, Filter, Package, PlusCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

function Home({ user }) {
    const [listings, setListings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [listingsRes, catsRes] = await Promise.all([
                api.get('/listings'),
                api.get('/categories')
            ]);
            setListings(listingsRes.data);
            setCategories(catsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredListings = selectedCategory
        ? listings.filter(l => l.category_id === selectedCategory)
        : listings;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-24"
        >
            {/* Premium Light Hero */}
            <section className="text-center py-20 relative">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-200/30 blur-[100px] -z-10 rounded-full"
                />

                <h1 className="text-5xl md:text-8xl font-extrabold font-display tracking-tightest leading-[0.9] mb-8 text-slate-900">
                    TOPTANDA <br /> <span className="text-primary-600">YENİ</span> DÖNEM.
                </h1>

                <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto mb-12 font-medium leading-relaxed px-4">
                    Toptancılar için özel pazar yeri. Teklif verin, pazarlık yapın ve ticaretinizi en üst seviyeye taşıyın.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 px-6">
                    {user ? (
                        <>
                            <Link to={user.role === 'seller' ? '/seller-dashboard' : '/buyer-dashboard'} className="bg-slate-900 px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-white hover:bg-black transition-all hover:shadow-xl active:scale-95 uppercase tracking-tighter flex items-center justify-center gap-3">
                                KONTROL PANELİNE GİT <ArrowUpRight size={20} />
                            </Link>
                            {user.role === 'seller' && (
                                <Link to="/create-listing" className="bg-primary-600 px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-white hover:bg-primary-700 transition-all hover:shadow-[0_20px_40px_-10px_rgba(14,165,233,0.4)] active:scale-95 uppercase tracking-tighter flex items-center justify-center gap-3 animate-pulse-slow">
                                    YENİ İLAN OLUŞTUR <PlusCircle size={20} />
                                </Link>
                            )}
                        </>
                    ) : (
                        <Link to="/register" className="bg-primary-600 px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-white hover:bg-primary-700 transition-all hover:shadow-[0_20px_40px_-10px_rgba(14,165,233,0.4)] active:scale-95 uppercase tracking-tighter flex items-center justify-center gap-3">
                            PAZARYERİNİ KEŞFET <ChevronRight size={20} />
                        </Link>
                    )}
                    <div className="relative group">
                        <button className="w-full sm:w-auto relative bg-white border border-slate-100 px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-slate-900 transition-all flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-95 uppercase tracking-tighter shadow-sm">
                            <Search size={20} />
                            ÜRÜN ARA
                        </button>
                    </div>
                </div>
            </section>

            {/* Modern Filter & Search */}
            <section className="space-y-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 overflow-x-auto pb-4 w-full md:w-auto scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${!selectedCategory ? 'bg-slate-900 border-slate-800 text-white shadow-lg' : 'bg-white border-slate-100 hover:border-slate-200 text-slate-400'
                                }`}
                        >
                            Tümü
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border whitespace-nowrap ${selectedCategory === cat.id ? 'bg-slate-900 border-slate-800 text-white shadow-lg' : 'bg-white border-slate-100 hover:border-slate-200 text-slate-400'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex-1 md:w-64 bg-white border border-slate-100 rounded-2xl flex items-center px-4 py-3 shadow-sm focus-within:border-primary-400 transition-colors">
                            <Search size={18} className="text-slate-300" />
                            <input type="text" placeholder="Ürün ara..." className="bg-transparent border-none outline-none pl-3 text-sm font-medium w-full text-slate-700" />
                        </div>
                        <button className="bg-white border border-slate-100 p-3 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                            <Filter size={20} className="text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* Listings Grid (Light) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredListings.map((listing, idx) => (
                        <motion.div
                            key={listing.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link
                                to={`/listing/${listing.id}`}
                                className="group flex flex-col bg-white border border-slate-100 rounded-[40px] overflow-hidden hover:border-primary-400/50 transition-all shadow-sm hover:shadow-xl"
                            >
                                <div className="aspect-[1.1] relative overflow-hidden m-4 rounded-[30px] bg-slate-50 shadow-inner">
                                    {listing.image_blob ? (
                                        <img
                                            src={`https://alsatyeri.onrender.com/api/listings/${listing.id}/image`}
                                            alt={listing.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Görsel+Yüklenemedi'; }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200 italic font-black">Görsel Yok</div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm">
                                        {listing.category_name}
                                    </div>
                                    <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="bg-slate-900 text-white p-4 rounded-full shadow-2xl">
                                            <ArrowUpRight size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 pt-2">
                                    <h3 className="text-2xl font-black font-display mb-3 line-clamp-1 text-slate-900 group-hover:text-primary-600 transition-colors">{listing.title}</h3>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">{(listing.seller_name || "?")[0]}</div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{listing.seller_name || "Toptancı"}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fiyatlandırma</p>
                                            <p className="text-2xl font-black italic text-slate-900">
                                                {listing.is_offer_only ? 'TEKLİF AL' : `${Number(listing.price).toLocaleString()} ₺`}
                                            </p>
                                        </div>
                                        <div className="bg-primary-50 text-primary-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                                            Detaylar
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                    {filteredListings.length === 0 && (
                        <div className="col-span-full py-24 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Package size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-widest text-slate-900">Henüz İlan Yok</h3>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Bu kategoride henüz bir ticaret başlamadı.</p>
                        </div>
                    )}
                </div>
            </section>
        </motion.div>
    );
}

export default Home;
