import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { ShoppingBag, Lock, Mail, ChevronRight } from 'lucide-react';

function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            const userData = data.user ? data.user : data;
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            navigate('/');
        } catch (err) {
            alert('Giriş başarısız!');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white p-8 md:p-16 rounded-[60px] shadow-2xl border border-slate-100 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 blur-[60px] rounded-full -mr-16 -mt-16" />

                <div className="text-center mb-10 relative z-10">
                    <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary-500/20">
                        <ShoppingBag size={32} />
                    </div>
                    <h2 className="text-4xl font-black font-display italic tracking-tightest leading-none uppercase text-slate-900 mb-2">
                        HESABINA <br />GİRİŞ YAP
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">B2B Pazar Yerine Giriş Yapın</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">E-POSTA ADRESİ</label>
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="email"
                                className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 pl-14 outline-none focus:border-primary-500 transition-all font-bold text-slate-700 shadow-inner"
                                placeholder="ornek@sirket.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">ŞİFRE</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="password"
                                className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 pl-14 outline-none focus:border-primary-500 transition-all font-bold text-slate-700 shadow-inner"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-950 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95"
                    >
                        GİRİŞ YAP
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-10 text-center relative z-10">
                    <p className="text-xs font-bold text-slate-400">
                        Hesabınız yok mu? <Link to="/register" className="text-primary-600 hover:underline">Kaydolun</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;
