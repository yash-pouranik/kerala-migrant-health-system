import { Link, useLocation } from 'react-router-dom';
import { LogOut, Bell, Globe, ChevronDown, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';
import { useRealtime } from '../context/RealtimeContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { alerts } = useRealtime();
    const { t, i18n } = useTranslation();
    const [showLangs, setShowLangs] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'ml', name: 'മലയാളം' },
        { code: 'hi', name: 'हिंदी' },
        { code: 'bn', name: 'বাংলা' },
        { code: 'or', name: 'ଓଡ଼ିଆ' },
    ];

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    const navLinks = [
        { name: t('common.home', 'Home'), path: '/' },
        { name: t('common.register', 'Register'), path: '/register' },
        { name: t('common.viewRecords', 'Records'), path: '/records' },
    ];

    if (user?.role === 'SUPER_ADMIN' || user?.role === 'DISTRICT_ADMIN') {
        navLinks.push({ name: 'Dashboard', path: '/dashboard' });
    }

    return (
        <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md px-4 md:px-8 py-3 md:py-4 flex items-center justify-between border-b border-gray-100 font-sans">
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-3">
                    <Logo layout="horizontal" />
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={cn(
                            "text-xs font-bold uppercase tracking-widest transition-all duration-300 py-1.5 px-3 rounded-lg",
                            location.pathname === link.path
                                ? "text-primary bg-primary/5 shadow-sm"
                                : "text-gray-500 hover:text-primary hover:bg-gray-50"
                        )}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-primary-dark hover:bg-gray-100 rounded-lg"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Desktop Language & Alerts */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLangs(!showLangs)}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all"
                        >
                            <Globe className="w-4 h-4 text-primary" />
                            <span className="uppercase">{currentLang.code}</span>
                            <ChevronDown className={cn("w-3 h-3 transition-transform", showLangs && "rotate-180")} />
                        </button>

                        {showLangs && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            i18n.changeLanguage(lang.code);
                                            setShowLangs(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-xs font-bold hover:bg-primary/5 hover:text-primary transition-colors",
                                            i18n.language === lang.code ? "text-primary bg-primary/5" : "text-gray-600"
                                        )}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Alerts Notification */}
                    {user && (
                        <div className="relative group cursor-pointer">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                                <Bell className="w-5 h-5 text-gray-500" />
                                {alerts.length > 0 && (
                                    <span className="absolute top-2 right-2 w-4 h-4 bg-secondary text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-cream">
                                        {alerts.length}
                                    </span>
                                )}
                            </div>

                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                                <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time Alerts</p>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {alerts.length === 0 ? (
                                        <p className="p-4 text-xs text-center text-gray-400">No new alerts</p>
                                    ) : (
                                        alerts.map((alert, i) => (
                                            <div key={i} className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <p className="text-xs font-medium text-primary-dark">{alert.message}</p>
                                                <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Just Now</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {user ? (
                        <div className="flex items-center gap-4">
                            {user.profilePicture && (
                                <img
                                    src={user.profilePicture}
                                    alt={user.name}
                                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
                                />
                            )}
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-primary/5 hover:text-primary transition-all duration-300 uppercase tracking-widest"
                            >
                                {t('common.logout', 'Logout')}
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="btn-primary !px-6 !py-2.5 text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                        >
                            Staff Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl overflow-hidden md:hidden"
                    >
                        <div className="p-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        "block w-full text-center py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                                        location.pathname === link.path
                                            ? "text-white bg-primary shadow-lg shadow-primary/20"
                                            : "text-gray-500 bg-gray-50 hover:bg-gray-100"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <hr className="border-gray-50" />

                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Language</span>
                                <div className="flex gap-2">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => i18n.changeLanguage(lang.code)}
                                            className={cn(
                                                "w-8 h-8 rounded-lg text-xs font-bold uppercase flex items-center justify-center transition-all",
                                                i18n.language === lang.code ? "bg-primary text-white shadow-md" : "bg-white text-gray-400"
                                            )}
                                        >
                                            {lang.code}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {user ? (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                                        <img src={user.profilePicture || ""} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-primary-dark">{user.name}</p>
                                            <p className="text-xs text-gray-500 font-medium">{user.role.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="w-full btn-secondary !py-4 flex items-center justify-center gap-2 border-2 uppercase font-black text-xs"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="btn-primary block w-full !py-4 text-center text-xs font-bold uppercase tracking-widest"
                                >
                                    Staff Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
