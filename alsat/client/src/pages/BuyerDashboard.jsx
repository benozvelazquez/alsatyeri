import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Clock, Tag, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { formatDistanceToNow, isAfter } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion } from 'framer-motion';

function BuyerDashboard({ user }) {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchOffers();
    }, [user]);

    const fetchOffers = async () => {
        try {
            const { data } = await api.get(`/offers?buyer_id=${user.id}`);
            setOffers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRemainingTime = (expiresAt) => {
        const expiry = new Date(expiresAt);
        if (!isAfter(expiry, new Date())) return 'Süre Doldu';
        return formatDistanceToNow(expiry, { locale: tr, addSuffix: true });
    };

    if (loading) return <div className="text-center py-24 text-slate-300 font-black uppercase tracking-widest">Yükleniyor...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
        >
            <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black font-display italic tracking-tightest leading-none uppercase text-slate-900">
                    TİCARİ <br /><span className="text-primary-600">AJANDAM</span>
                </h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs md:text-sm">Aktif ve Geçmiş Tüm Teklifleriniz</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {offers.length === 0 && (
                    <div className="col-span-full bg-slate-50 h-64 rounded-[50px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 space-y-6">
                        <Zap size={48} className="text-slate-200" />
                        <p className="text-slate-300 italic font-bold uppercase tracking-widest text-xs md:text-sm text-center px-6">Henüz bir teklif girişiminiz bulunmuyor.</p>
                    </div>
                )}

                {offers.map((offer, idx) => (
                    <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white border border-slate-100 rounded-[40px] p-6 md:p-8 flex flex-col justify-between group hover:border-primary-400 transition-all relative overflow-hidden shadow-sm hover:shadow-xl min-h-[300px]"
                    >
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ürün</p>
                                    <h3 className="font-black font-display text-xl md:text-2xl uppercase italic tracking-tighter line-clamp-2 text-slate-800">
                                        {offer.listing_title}
                                    </h3>
                                </div>
                                <div className={`px-4 py-2 rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-sm shrink-0 ${offer.status === 'pending' ? 'bg-primary-50 text-primary-600' :
                                        offer.status === 'accepted' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {offer.status === 'pending' ? 'Beklemede' : offer.status === 'accepted' ? 'Onaylandı' : 'Reddedildi'}
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 p-6 md:p-8 rounded-[30px] shadow-inner group-hover:bg-primary-50 transition-all">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Teklifiniz</p>
                                <p className="text-3xl md:text-4xl font-black italic text-slate-900">{offer.amount.toLocaleString()} ₺</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-6 mt-6 relative z-10">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Clock size={16} />
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter">{getRemainingTime(offer.expires_at)}</span>
                            </div>
                            <div className="text-primary-600 group-hover:translate-x-2 transition-transform">
                                <ArrowRight size={20} />
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute right-[-20px] bottom-[-20px] text-primary-500/5 -rotate-12 transition-transform group-hover:scale-110">
                            <Sparkles size={120} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default BuyerDashboard;
