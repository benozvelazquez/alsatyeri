import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Upload, ChevronRight, ChevronLeft, Package, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function CreateListing({ user }) {
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        category_id: '',
        title: '',
        description: '',
        price: '',
        is_offer_only: false,
        attributes: {},
        image: null
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAttributeChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            attributes: { ...prev.attributes, [key]: value }
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async () => {
        if (!user || !user.id) {
            alert('Oturum hatası, lütfen çıkış yapıp tekrar girin.');
            return;
        }

        const data = new FormData();
        data.append('seller_id', user.id);
        data.append('category_id', formData.category_id);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price || 0);
        data.append('is_offer_only', formData.is_offer_only);

        // Filter out any attributes that are not in the selected category just in case
        const currentAttributes = {};
        selectedCat?.required_attributes.forEach(attr => {
            currentAttributes[attr] = formData.attributes[attr] || '';
        });
        data.append('attributes', JSON.stringify(currentAttributes));

        if (formData.image) data.append('image', formData.image);

        try {
            await api.post('/listings', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('İlan başarıyla oluşturuldu!');
            navigate('/');
        } catch (err) {
            alert('İlan oluşturulurken bir hata oluştu.');
            console.error(err);
        }
    };

    const selectedCat = categories.find(c => c.id === parseInt(formData.category_id));

    if (loading) return <div className="text-center py-24 text-slate-300 font-black uppercase tracking-widest">Yükleniyor...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-4">
                <h1 className="text-5xl font-black font-display italic uppercase tracking-tightest leading-none text-slate-950">
                    YENİ <span className="text-primary-600">ENVANTER</span> <br /> EKLE.
                </h1>
                <div className="flex gap-4 w-full md:w-64">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex-1 space-y-2">
                            <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary-600 shadow-lg shadow-primary-500/20' : 'bg-slate-200'}`} />
                            <p className={`text-[8px] font-black uppercase tracking-widest text-center ${step === s ? 'text-primary-600' : 'text-slate-300'}`}>Adım 0{s}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[60px] p-12 md:p-16 shadow-2xl relative overflow-hidden border border-slate-100">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-50 blur-[100px] rounded-full" />

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <h2 className="text-2xl font-black italic flex items-center gap-4 uppercase tracking-tighter text-slate-800">
                                <span className="w-10 h-10 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 text-sm border border-primary-100">01</span>
                                TEMEL ÜRÜN TANIMI
                            </h2>
                            <div className="grid gap-8">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between ml-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Market Kategorisi</label>
                                        <button
                                            onClick={() => {
                                                const name = prompt('Yeni kategori adı (örn: Mobilya):');
                                                if (name) {
                                                    const attrs = prompt('Zorunlu özellikler (virgülle ayırın, örn: Malzeme, Boyut):');
                                                    api.post('/categories', {
                                                        name,
                                                        required_attributes: attrs ? attrs.split(',').map(s => s.trim()) : []
                                                    }).then(() => {
                                                        alert('Kategori eklendi!');
                                                        fetchCategories();
                                                    }).catch(err => {
                                                        alert('Kategori eklenirken hata oluştu.');
                                                    });
                                                }
                                            }}
                                            className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
                                        >
                                            + Yeni Kategori
                                        </button>
                                    </div>
                                    <select
                                        name="category_id"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 outline-none focus:border-primary-500 appearance-none font-black uppercase tracking-tighter transition-all cursor-pointer hover:bg-slate-100"
                                        value={formData.category_id}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Kategori Seçiniz...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">İlan Başlığı</label>
                                    <input
                                        type="text" name="title"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 outline-none focus:border-primary-500 font-black text-2xl italic tracking-tighter text-slate-900"
                                        placeholder="Premium Ürün Adı..."
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Ürün Açıklaması</label>
                                    <textarea
                                        name="description" rows="5"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-[40px] p-8 outline-none focus:border-primary-500 font-medium text-slate-600 leading-relaxed shadow-inner"
                                        placeholder="Alıcıları etkileyecek teknik açıklama..."
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                            </div>
                            <button
                                disabled={!formData.category_id || !formData.title}
                                onClick={() => setStep(2)}
                                className="w-full bg-slate-950 text-white py-6 rounded-3xl font-black text-lg uppercase tracking-tighter hover:bg-primary-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                İLERLE
                                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <h2 className="text-2xl font-black italic flex items-center gap-4 uppercase tracking-tighter text-slate-800">
                                <span className="w-10 h-10 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 text-sm border border-primary-100">02</span>
                                TEKNİK ÖZELLİKLER
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {selectedCat?.required_attributes.map(attr => (
                                    <div key={attr} className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{attr}</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 outline-none focus:border-primary-500 font-black italic shadow-inner"
                                            placeholder="Değer giriniz..."
                                            value={formData.attributes[attr] || ''}
                                            onChange={(e) => handleAttributeChange(attr, e.target.value)}
                                        />
                                    </div>
                                ))}
                                {selectedCat?.required_attributes.length === 0 && <p className="col-span-full text-slate-400 italic font-medium">Bu kategori için ek özellik standardı bulunmuyor.</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-6 pt-6">
                                <button onClick={() => setStep(1)} className="bg-slate-50 border border-slate-100 py-6 rounded-3xl font-black text-slate-400 uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2 shadow-sm"><ChevronLeft size={18} /> Geri</button>
                                <button onClick={() => setStep(3)} className="bg-slate-950 text-white py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl flex items-center justify-center gap-2">İlerle <ChevronRight size={18} /></button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <h2 className="text-2xl font-black italic flex items-center gap-4 uppercase tracking-tighter text-slate-800">
                                <span className="w-10 h-10 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 text-sm border border-primary-100">03</span>
                                FİYATLANDIRMA
                            </h2>
                            <div className="space-y-10">
                                <div
                                    onClick={() => setFormData(p => ({ ...p, is_offer_only: !p.is_offer_only }))}
                                    className={`group cursor-pointer transition-all border-2 border-dashed rounded-[40px] p-8 flex items-center justify-between ${formData.is_offer_only ? 'border-primary-500 bg-primary-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                                >
                                    <div className="space-y-1">
                                        <p className="font-black italic text-xl uppercase tracking-tighter text-slate-800">Sadece Teklif Usulü</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fiyat gizlenir, alıcı doğrudan teklif verir.</p>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full border-4 transition-all ${formData.is_offer_only ? 'bg-primary-600 border-white' : 'border-slate-200 bg-white'}`} />
                                </div>

                                {!formData.is_offer_only && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-3 overflow-hidden">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">İstenen Fiyat (₺)</label>
                                        <input
                                            type="number" name="price"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-8 outline-none focus:border-primary-500 font-black text-6xl italic tracking-tightest shadow-inner text-slate-900"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                        />
                                    </motion.div>
                                )}

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Ürün Görseli</label>
                                    <div className="relative group overflow-hidden bg-slate-50 aspect-video rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center hover:border-primary-400/50 transition-all cursor-pointer shadow-inner">
                                        {formData.image ? (
                                            <img src={URL.createObjectURL(formData.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="text-center space-y-4">
                                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:bg-primary-50 transition-all">
                                                    <ImageIcon size={32} className="text-slate-300" />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-primary-600 transition-colors uppercase">YÜKLEMEK İÇİN TIKLAYIN</p>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 pt-6">
                                <button onClick={() => setStep(2)} className="bg-slate-50 border border-slate-100 py-6 rounded-3xl font-black text-slate-400 uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2"><ChevronLeft size={18} /> Geri</button>
                                <button onClick={handleSubmit} className="bg-primary-600 py-6 rounded-3xl font-black text-xl italic uppercase tracking-tighter hover:bg-primary-700 text-white transition-all shadow-[0_20px_40px_-10px_rgba(14,165,233,0.4)] active:scale-95 flex items-center justify-center gap-3 uppercase">
                                    LANSMANI YAP <Sparkles size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default CreateListing;
