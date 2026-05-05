import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Package, Clock, Check, X, TrendingUp, Sparkles, LayoutDashboard } from 'lucide-react';
import { formatDistanceToNow, isAfter } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion } from 'framer-motion';

function SellerDashboard({ user }) {
    const [offers, setOffers] = useState([]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const [offersRes, listingsRes] = await Promise.all([
                api.get(`/offers?seller_id=${user.id}`),
                api.get('/listings')
            ]);
            setOffers(offersRes.data);
            // Fix type comparison for seller_id
            setListings(listingsRes.data.filter(l => String(l.seller_id) === String(user.id)));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOfferAction = async (id, status) => {
        try {
            await api.patch(`/offers/${id}`, { status });
            fetchDashboardData();
        } catch (err) {
            console.error(err);
        }
    };

    const getRemainingTime = (expiresAt) => {
        const expiry = new Date(expiresAt);
        if (!isAfter(expiry, new Date())) return 'Süresi Doldu';
        return formatDistanceToNow(expiry, { locale: tr, addSuffix: true });
    };

    if (loading) return <div className="text-center py-24 text-slate-300 font-black uppercase tracking-widest">Yükleniyor...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
        >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h1 className="text-6xl font-black font-display italic tracking-tightest leading-none mb-4 uppercase text-slate-900">
                        YÖNETİM <br /><span className="text-primary-600">KONTROL</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Hesap: {user.name} | Toptancı Yetkisi</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
                    <div className="glass p-6 md:p-8 rounded-[40px] flex items-center gap-6 flex-1 min-w-[240px] bg-white shadow-xl border-slate-100">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Toplam Satış</p>
                            <p className="text-2xl md:text-3xl font-black italic text-slate-900">{listings.filter(l => l.status === 'sold').length} <span className="text-sm font-normal not-italic text-slate-400 ml-1">ÜRÜN</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Dynamic Offers Board */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-slate-800">
                            <Clock className="text-primary-500" />
                            Aktif Teklif Akışı
                        </h2>
                    </div>
                    <div className="grid gap-6">
                        {offers.length === 0 && (
                            <div className="bg-slate-50 h-48 rounded-[40px] flex items-center justify-center border-2 border-dashed border-slate-200">
                                <p className="text-slate-300 italic font-bold">Bekleyen teklifiniz bulunmamaktadır.</p>
                            </div>
                        )}
                        {offers.map((offer, idx) => (
                            <motion.div
                                key={offer.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white border border-slate-100 rounded-[40px] p-8 flex items-center justify-between group hover:border-primary-500/30 transition-all shadow-sm hover:shadow-xl"
                            >
                                <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="relative shrink-0">
                                            <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-[30px] flex flex-col items-center justify-center border border-slate-100 relative z-10 shadow-inner">
                                                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Tutar</p>
                                                <p className="text-lg md:text-xl font-black italic text-slate-900">{offer.amount.toLocaleString()}₺</p>
                                            </div>
                                            <div className="absolute -inset-2 bg-primary-600/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black font-display text-xl md:text-2xl uppercase italic tracking-tighter text-slate-800 mb-2 line-clamp-1">{offer.listing_title}</h3>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                                    <Sparkles size={12} className="text-primary-400" /> {offer.buyer_name}
                                                </div>
                                                <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-primary-500 uppercase tracking-widest">
                                                    <Clock size={12} /> {getRemainingTime(offer.expires_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-50 pt-6 md:pt-0">
                                        {offer.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleOfferAction(offer.id, 'accepted')}
                                                    className="flex-1 md:flex-none bg-primary-600 text-white font-black text-[10px] uppercase tracking-widest px-6 md:px-8 py-3 md:py-4 rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-95 whitespace-nowrap"
                                                >
                                                    Kabul Et
                                                </button>
                                                <button
                                                    onClick={() => handleOfferAction(offer.id, 'rejected')}
                                                    className="flex-1 md:flex-none bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50/50 hover:border-red-100 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 whitespace-nowrap"
                                                >
                                                    Reddet
                                                </button>
                                            </>
                                        ) : (
                                            <div className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center min-w-[140px] ${offer.status === 'accepted' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                                }`}>
                                                {offer.status === 'accepted' ? '✅ Onaylandı' : '❌ Reddedildi'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Global Inventory List */}
                <div className="lg:col-span-4 space-y-10">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-slate-800">
                        <LayoutDashboard className="text-primary-500" />
                        Envanter
                    </h2>
                    <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm">
                        <div className="m-2 p-6 divide-y divide-slate-50">
                            {listings.map(l => (
                                <div key={l.id} className="py-6 first:pt-0 last:pb-0 flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <p className="font-black uppercase italic tracking-tight group-hover:text-primary-500 transition-colors line-clamp-1 text-slate-700">{l.title}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{l.category_name}</span>
                                        </div>
                                    </div>
                                    <div className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest ${l.status === 'active' ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400'
                                        }`}>
                                        {l.status === 'active' ? 'Aktif' : 'Satıldı'}
                                    </div>
                                </div>
                            ))}
                            {listings.length === 0 && <p className="text-center py-12 text-slate-300 italic font-bold">Envanter boş.</p>}
                        </div>
                        <Link to="/create-listing" className="block p-5 bg-slate-50 text-center text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all border-t border-slate-100 text-slate-500">
                            YENİ ÜRÜN EKLE +
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default SellerDashboard;
