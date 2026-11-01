import { useState, useEffect } from 'react';
import {
    Search, MapPin, ExternalLink,
    Download, Filter, BarChart2, LayoutGrid, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import PatientProfileModal from '../components/PatientProfileModal';
import Dashboard from './Dashboard';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Records = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [locationFilter, setLocationFilter] = useState('All Districts');
    const [showDashboard, setShowDashboard] = useState(true);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/patients`, {
                params: {
                    search: searchTerm,
                    location: locationFilter !== 'All Districts' ? locationFilter : undefined,
                    page,
                    limit: 12
                }
            });
            if (res.data.success) {
                setPatients(res.data.data.patients);
                setTotalPages(res.data.data.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch patients', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPatients();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, locationFilter, page]);

    return (
        <div className="p-4 md:p-12 space-y-12 fade-in bg-[#f8fbf9] min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-[#1a7c5b] rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Zap className="w-6 h-6 fill-white" />
                        </div>
                        <span className="text-[11px] font-black text-[#1a7c5b] uppercase tracking-[0.2em]">Live Surveillance Portal</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-[#1a3a32] tracking-tighter uppercase leading-none">
                        Unified <br />Registry
                    </h1>
                </div>

                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => setShowDashboard(!showDashboard)}
                        className={cn(
                            "px-8 py-5 rounded-[24px] font-black text-[12px] uppercase tracking-widest flex items-center gap-3 transition-all",
                            showDashboard ? "bg-[#1a3a32] text-white" : "bg-white text-[#1a3a32] border border-slate-100 shadow-sm"
                        )}
                    >
                        {showDashboard ? <LayoutGrid className="w-4 h-4" /> : <BarChart2 className="w-4 h-4" />}
                        {showDashboard ? 'View Records' : 'View Insights'}
                    </button>

                    <button className="px-8 py-5 bg-white border border-slate-100 rounded-[24px] font-black text-[12px] uppercase tracking-widest text-slate-400 flex items-center gap-3">
                        <Download className="w-4 h-4" /> Global Export
                    </button>
                </div>
            </div>

            {showDashboard && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[60px] p-2 overflow-hidden border border-slate-50 shadow-2xl shadow-emerald-900/[0.02]"
                >
                    <Dashboard />
                </motion.div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 items-center bg-white p-4 md:p-6 rounded-[32px] border border-gray-100 shadow-2xl shadow-primary/5">
                <div className="relative flex-grow w-full md:max-w-md order-2 md:order-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Filter by ABHA, Patient ID, or Name..."
                        className="w-full pl-16 pr-8 py-4 md:py-5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary/20 transition-all text-sm font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto order-1 md:order-2 justify-between md:justify-start">
                    <select
                        className="flex-grow md:flex-grow-0 px-6 md:px-8 py-4 md:py-5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-black text-xs uppercase text-primary-dark tracking-widest"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    >
                        {['All Districts', 'Thiruvananthapuram', 'Kollam', 'Alappuzha', 'Kottayam', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod', 'Pathanamthitta', 'Idukki'].map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>

                    <select
                        className="flex-grow md:flex-grow-0 px-6 md:px-8 py-4 md:py-5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-black text-xs uppercase text-primary-dark tracking-widest"
                        value={searchTerm.startsWith('disease:') ? searchTerm.replace('disease:', '') : 'All Diseases'}
                        onChange={(e) => setSearchTerm(e.target.value === 'All Diseases' ? '' : `disease:${e.target.value}`)}
                    >
                        {['All Diseases', 'Asthma', 'Diabetes', 'Hypertension', 'TB'].map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>

                    <button className="p-4 md:p-5 bg-gray-50 rounded-2xl text-gray-400 hover:text-primary transition-colors">
                        <Filter className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {loading && patients.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    {patients.map((p) => (
                        <motion.div
                            key={p.id}
                            layoutId={String(p.id)}
                            onClick={() => setSelectedPatient(p)}
                            whileHover={{ scale: 1.02, translateY: -5 }}
                            className="group bg-white rounded-[48px] p-10 cursor-pointer border-2 border-transparent hover:border-[#1a7c5b]/10 shadow-xl shadow-emerald-900/[0.03] hover:shadow-2xl transition-all relative overflow-hidden flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-[28px] bg-[#1a7c5b] text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-[#1a7c5b]/20">
                                        {p.full_name[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-[#1a3a32] leading-none mb-2 tracking-tight">{p.full_name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-widest">{p.patient_id}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <span className="text-[11px] font-black text-[#1a7c5b] uppercase tracking-widest">verified</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-[#1a7c5b]/5 transition-colors">
                                    <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-[#1a7c5b]" />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-10">
                                <div className="px-6 py-2.5 bg-slate-50 rounded-full text-[11px] font-black text-slate-400 uppercase tracking-widest">{p.age} YEARS</div>
                                <div className="px-6 py-2.5 bg-rose-50 rounded-full text-[11px] font-black text-rose-500 uppercase tracking-widest">{p.blood_group || 'O+'} TYPE</div>
                                {p.conditions_count > 0 && <div className="px-6 py-2.5 bg-orange-50 rounded-full text-[11px] font-black text-orange-500 uppercase tracking-widest">DIABETIC</div>}
                            </div>

                            <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <MapPin className="w-5 h-5 text-[#1a7c5b]/40" />
                                    <span className="text-[11px] font-black uppercase tracking-widest tracking-[0.1em]">{p.current_location}</span>
                                </div>
                                <div className="flex -space-x-2.5">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={cn(
                                            "w-3.5 h-3.5 rounded-full border-[3px] border-white shadow-sm",
                                            i <= (p.vaccines_completed || 0) ? "bg-[#1a7c5b]" : "bg-slate-200"
                                        )} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination ... */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-12">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p: any) => Math.max(1, p - 1))}
                        className="px-8 py-4 bg-white rounded-2xl shadow-sm font-black text-[10px] uppercase tracking-widest text-slate-400 disabled:opacity-30"
                    >Prev</button>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p: any) => Math.min(totalPages, p + 1))}
                        className="px-8 py-4 bg-white rounded-2xl shadow-sm font-black text-[10px] uppercase tracking-widest text-[#1a3a32] disabled:opacity-30"
                    >Next</button>
                </div>
            )}

            {/* Detailed Modal */}
            <AnimatePresence>
                {selectedPatient && (
                    <PatientProfileModal
                        selectedPatient={selectedPatient}
                        onClose={() => setSelectedPatient(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Records;
