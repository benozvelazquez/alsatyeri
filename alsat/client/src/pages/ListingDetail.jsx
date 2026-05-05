import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Clock, Tag, CreditCard, ChevronRight, User, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

function ListingDetail({ user }) {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [amount, setAmount] = useState('');
    const [durationValue, setDurationValue] = useState('');
    const [durationUnit, setDurationUnit] = useState('hours');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchListing();
    }, [id]);

    const fetchListing = async () => {
        try {
            const { data } = await api.get(`/listings/${id}`);
            setListing(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOffer = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');

        let seconds = parseInt(durationValue);
        if (durationUnit === 'days') seconds *= 86400;
        if (durationUnit === 'hours') seconds *= 3600;
        if (durationUnit === 'months') seconds *= 2592000;

        try {
            await api.post('/offers', {
                listing_id: id,
                buyer_id: user.id,
                amount: parseFloat(amount),
                duration_seconds: seconds
            });
            alert('Teklifiniz iletildi!');
            navigate('/buyer-dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="text-center py-24 text-slate-300 font-black animate-pulse uppercase tracking-[0.3em]">Veri Yükleniyor...</div>;
    if (!listing) return <div className="text-center py-24 text-red-500 font-black italic">Hata: İlan Bulunamadı</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
        >
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Geri Dön</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Visuals Column */}
                <div className="space-y-10">
                    <motion.div
                        layoutId={`image-${id}`}
                        className="aspect-[4/5] bg-white rounded-[50px] overflow-hidden border border-slate-100 shadow-2xl relative group"
                    >
                        {listing.image_blob ? (
                            <img
                                src={`https://alsatyeri.onrender.com/api/listings/${listing.id}/image`}
                                alt={listing.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x1000?text=Görsel+Yüklenemedi'; }}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-100 italic">
                                <Tag size={64} className="mb-4" />
                                Görsel Yok
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
                        <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10">
                            <div className="bg-white/90 backdrop-blur-md inline-flex px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-4 text-slate-900 shadow-sm">
                                {listing.category_name}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black font-display leading-[0.9] text-slate-900 italic uppercase tracking-tighter">
                                {listing.title}
                            </h1>
                        </div>
                    </motion.div>

                    <div className="bg-white rounded-[40px] p-10 space-y-8 shadow-sm border border-slate-100">
                        <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-widest text-primary-600">
                            <ShieldCheck size={24} />
                            EKSPERTİZ & DETAYLAR
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            {Object.entries(listing.attributes).map(([key, val]) => (
                                <div key={key} className="bg-slate-50 border border-slate-100 p-4 md:p-6 rounded-3xl group hover:border-primary-400 transition-colors shadow-inner">
                                    <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 md:mb-2">{key}</p>
                                    <p className="font-black text-base md:text-lg text-slate-800">{val}</p>
                                </div>
                            ))}
                        </div>
                        <div className="pt-8 border-t border-slate-50">
                            <p className="text-slate-600 leading-relaxed font-medium">
                                {listing.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Transaction Column (Light) */}
                <div className="space-y-10">
                    <div className="bg-white rounded-[50px] p-12 space-y-10 sticky top-32 border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-900 border border-slate-200">{listing.seller_name[0]}</div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Toptancı: {listing.seller_name}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Piyasa Değeri</p>
                            <div className="text-5xl md:text-7xl font-black italic tracking-tightest text-slate-950">
                                {listing.is_offer_only ? 'TEKLİF AL' : `${listing.price.toLocaleString()} ₺`}
                            </div>
                        </div>

                        <form onSubmit={handleOffer} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sizin Teklifiniz</label>
                                <div className="relative group">
                                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={24} />
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 pl-16 outline-none focus:border-primary-500 transition-all font-black text-4xl placeholder:text-slate-200 italic shadow-inner"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Geçerlilik Periyodu</label>
                                <div className="flex gap-4">
                                    <input
                                        type="number"
                                        className="flex-1 bg-slate-50 border border-slate-100 rounded-3xl p-6 outline-none focus:border-primary-500 transition-all font-black text-2xl italic shadow-inner"
                                        placeholder="Süre"
                                        value={durationValue}
                                        onChange={(e) => setDurationValue(e.target.value)}
                                        required
                                    />
                                    <select
                                        className="bg-slate-50 border border-slate-100 rounded-3xl p-6 outline-none focus:border-primary-500 transition-all font-black text-xs uppercase tracking-widest appearance-none px-10 cursor-pointer shadow-sm hover:bg-slate-100"
                                        value={durationUnit}
                                        onChange={(e) => setDurationUnit(e.target.value)}
                                    >
                                        <option value="hours">SAAT</option>
                                        <option value="days">GÜN</option>
                                        <option value="months">AY</option>
                                    </select>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-slate-950 py-6 rounded-3xl font-black text-xl uppercase tracking-tighter shadow-2xl text-white flex items-center justify-center gap-4 hover:bg-primary-600 transition-all group"
                            >
                                TEKLİFİ GÖNDER
                                <Zap size={24} className="group-hover:text-yellow-400 transition-colors" />
                            </motion.button>
                        </form>

                        <div className="pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
                            <div className="flex items-center gap-2 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                                <ShieldCheck size={16} />
                                <span className="text-[10px] font-bold">GÜVENLİ TİCARET ONAYLI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default ListingDetail;
