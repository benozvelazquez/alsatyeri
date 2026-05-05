import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { ShoppingBag, Lock, Mail, User, Shield, ChevronRight } from 'lucide-react';

function Register({ setUser }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'buyer'
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', formData);
            // Handle both flattened and nested response just in case
            const userData = data.user ? data.user : data;
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            navigate('/');
        } catch (err) {
            alert('Kayıt başarısız!');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl bg-white p-8 md:p-16 rounded-[60px] shadow-2xl border border-slate-100 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-50 blur-[80px] rounded-full -mr-24 -mt-24" />

                <div className="text-center mb-12 relative z-10">
                    <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary-500/20">
                        <ShoppingBag size={32} />
                    </div>
                    <h1 className="text-4xl font-black font-display tracking-tightest uppercase italic text-slate-900">AİLEYE KATILIN</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">B2B Ticaretin Zirvesinde Yerinizi Alın</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">AD SOYAD / ŞİRKET</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 pl-14 outline-none focus:border-primary-500 transition-all font-bold text-slate-700 shadow-inner"
                                    placeholder="Ahmet Yılmaz"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">E-POSTA</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 pl-14 outline-none focus:border-primary-500 transition-all font-bold text-slate-700 shadow-inner"
                                    placeholder="ornek@mail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">GÜVENLİ ŞİFRE</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="password"
                                className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 pl-14 outline-none focus:border-primary-500 transition-all font-bold text-slate-700 shadow-inner"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 text-center block">HESAP TÜRÜ</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'buyer' })}
                                className={`p-6 rounded-[30px] border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'buyer' ? 'border-primary-600 bg-primary-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                            >
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${formData.role === 'buyer' ? 'bg-primary-600 text-white' : 'bg-white text-slate-300 shadow-sm'}`}>
                                    <ShoppingBag size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">ALICI</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'seller' })}
                                className={`p-6 rounded-[30px] border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'seller' ? 'border-primary-600 bg-primary-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                            >
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${formData.role === 'seller' ? 'bg-primary-600 text-white' : 'bg-white text-slate-300 shadow-sm'}`}>
                                    <Shield size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">SATICI</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-950 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95"
                    >
                        HESABI OLUŞTUR
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-10 text-center relative z-10">
                    <p className="text-xs font-bold text-slate-400">
                        Zaten üye misiniz? <Link to="/login" className="text-primary-600 hover:underline">Giriş Yapın</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default Register;
