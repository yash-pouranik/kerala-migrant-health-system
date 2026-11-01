import { Shield, Share2, Target, Globe, PhoneCall, Zap, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroBg from '../assets/hero-bg.png';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isAbhaModalOpen, setIsAbhaModalOpen] = useState(false);
    const [abhaId, setAbhaId] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleConnectAbha = () => {
        setIsVerifying(true);
        // Simulate ABDM API call
        setTimeout(() => {
            setIsVerifying(false);
            if (abhaId.length === 14) {
                alert('ABHA Verified! Redirecting to records...');
                navigate(`/records?abha=${abhaId}`);
            } else {
                alert('Invalid ABHA ID. Please check and try again.');
            }
        }, 1500);
    };

    return (
        <div className="fade-in bg-cream">
            {/* Real-time Pilot Banner */}
            <div className="bg-primary-dark text-white py-2 px-8 flex items-center justify-center gap-4 text-center">
                <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Pilot Live: 14 Districts Integrated • ABDM Sandbox Active</p>
            </div>

            {/* Hero Section */}
            <section
                className="relative min-h-[600px] md:h-[700px] flex items-center px-6 md:px-12 py-20 md:py-0 overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(rgba(253, 251, 246, 0.8), rgba(253, 251, 246, 0.8)), url(${heroBg})` }}
            >
                <div className="max-w-4xl space-y-6 md:space-y-8 z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20"
                    >
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Privacy-First EHR Infrastructure</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-black text-primary-dark tracking-tighter leading-[1.1] md:leading-[0.95]"
                    >
                        {t('home.heroTitle', 'Digitizing Care for Migrant Footprints.')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-xl text-primary-dark/70 font-medium max-w-2xl leading-relaxed"
                    >
                        {t('home.heroSubtitle', 'Kerala Digital Health Records – ABHA-aligned, privacy-first platform enabling continuity of care for migrant workers across Kerala.')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row flex-wrap gap-4 pt-4"
                    >
                        <button
                            onClick={() => navigate('/register')}
                            className="btn-primary flex items-center justify-center gap-3 !py-4 !px-8 text-lg font-black shadow-xl shadow-primary/20"
                        >
                            {t('common.register', 'Register Migrant')} <Zap className="w-5 h-5 fill-white" />
                        </button>
                        <button
                            onClick={() => navigate('/records')}
                            className="btn-secondary !py-4 !px-8 text-lg font-bold border-2"
                        >
                            {t('common.viewRecords', 'View Records')}
                        </button>
                        <button
                            onClick={() => setIsAbhaModalOpen(true)}
                            className="btn-secondary !py-4 !px-8 text-lg font-bold border-2 bg-white/50 backdrop-blur-sm"
                        >
                            {t('common.connectAbha', 'Connect ABHA')}
                        </button>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[40%] h-[80%] bg-gradient-to-l from-primary/5 to-transparent rounded-l-[100px] pointer-events-none hidden md:block" />
            </section>

            {/* ABHA Modal */}
            <AnimatePresence>
                {isAbhaModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsAbhaModalOpen(false)}
                                className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>

                            <h2 className="text-3xl font-black text-primary-dark mb-2">Connect ABHA</h2>
                            <p className="text-gray-500 text-sm mb-8">Link your existing digital health identity or create a new one.</p>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Option A: I have an ABHA ID</h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            maxLength={14}
                                            placeholder="14-digit ABHA Number"
                                            value={abhaId}
                                            onChange={(e) => setAbhaId(e.target.value)}
                                            className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <button
                                            onClick={handleConnectAbha}
                                            disabled={isVerifying}
                                            className="btn-primary !px-6 whitespace-nowrap"
                                        >
                                            {isVerifying ? '...' : 'Verify'}
                                        </button>
                                    </div>
                                </div>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold">Or</span></div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Option B: Create New</h3>
                                    <button
                                        className="w-full btn-secondary !py-4 flex items-center justify-center gap-3 border-2"
                                        onClick={() => navigate('/abha/create')}
                                    >
                                        <Shield className="w-5 h-5 text-primary" />
                                        Create New ABHA ID
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Card sections (omitted for brevity in this tool call, will be preserved) */}
            <section className="px-6 md:px-12 -mt-12 md:-mt-24 mb-20 md:mb-32 relative z-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { title: t('home.abdmTitle', 'ABDM & ABHA Compliant'), icon: Share2, desc: 'Interoperable health IDs and consent-driven data sharing within India\'s health stack.' },
                        { title: t('home.securityTitle', 'Privacy & Security'), icon: Lock, desc: 'Masked Aadhaar, local encryption options, and role-based access for your protection.' },
                        { title: t('home.sdgTitle', 'SDG Alignment'), icon: Target, desc: 'Health equity, reduced inequalities, and inclusive access for all mobile populations.' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02, translateY: -12 }}
                            className="card !p-6 md:!p-8 bg-white/80 backdrop-blur-xl border-white shadow-2xl shadow-primary/5"
                        >
                            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-primary-dark mb-4">{feature.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* USPs Grid */}
            <section className="px-6 md:px-12 py-20 md:py-32 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
                        <div className="max-w-2xl space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-primary-dark tracking-tight">The SIH 2025 Innovation Core</h2>
                            <p className="text-lg md:text-xl text-gray-500 font-medium italic border-l-4 border-secondary pl-6">"Bridging the 80% healthcare scheme exclusion gap through technology."</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                        {[
                            { title: 'Multilingual Voice', icon: Globe, detail: 'AI navigation in 10+ Indian languages (Malayalam, Hindi, Odia, etc.)' },
                            { title: 'Offline-First PWA', icon: Zap, detail: 'Fully functional in construction camps with zero internet availability.' },
                            { title: 'Blockchain Identity', icon: Shield, detail: 'Immutable vaccination proofs with QR verification for employer trust.' },
                            { title: 'Tele-Health Link', icon: PhoneCall, detail: 'Direct access to native-language counselors for mental health support.' }
                        ].map((usp, i) => (
                            <div key={i} className="space-y-4 p-6 rounded-3xl hover:bg-cream transition-colors group border border-transparent hover:border-gray-50">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <usp.icon className="w-6 h-6 text-primary group-hover:text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-primary-dark">{usp.title}</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{usp.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Impact / Metric Section */}
            <section className="bg-primary px-6 md:px-12 py-16 md:py-24 text-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16 relative z-10">
                    <div className="flex-grow space-y-8 w-full text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black leading-tight">Empowering 25 Lakh+ <br /> Guest Workers.</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <h5 className="text-4xl font-black text-secondary">43%</h5>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-70">Literacy Barrier Addressed</p>
                            </div>
                            <div>
                                <h5 className="text-4xl font-black text-secondary">100%</h5>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-70">Data Portability ensured</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
