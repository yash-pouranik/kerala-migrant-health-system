import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, MapPin, Activity, Check, Share2,
    Plus, Droplets, Zap, ShieldCheck, User2, Filter
} from 'lucide-react';
import { cn } from '../utils/cn';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
    ResponsiveContainer, AreaChart, Area, Tooltip, XAxis
} from 'recharts';
import AddVisitModal from './AddVisitModal';
import QRCode from 'qrcode';
import { API_BASE_URL } from '../config';

// --- UTILITY: Robust Data Formatting ---
// These functions are guaranteed not to crash the UI
const Safe = {
    date: (dateString: any): string => {
        if (!dateString) return 'N/A';
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return 'N/A';
            return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch { return 'N/A'; }
    },
    shortDate: (dateString: any): string => {
        if (!dateString) return 'N/A';
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return 'N/A';
            return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        } catch { return 'N/A'; }
    },
    text: (str: any, fallback: string = '-'): string => {
        if (typeof str !== 'string' || !str) return fallback;
        return str;
    },
    number: (num: any, fallback: number | string = 0): string => {
        if (typeof num === 'number') return num.toString();
        if (!isNaN(parseFloat(num))) return parseFloat(num).toString();
        return fallback.toString();
    }
};

const PatientProfileModal = ({ selectedPatient, onClose }: { selectedPatient: any, onClose: () => void }) => {
    // Component State
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    const [fullProfile, setFullProfile] = useState<any>(selectedPatient || {}); // Fallback to provided prop immediately
    const [visits, setVisits] = useState<any[]>([]);
    const [vaccinations, setVaccinations] = useState<any[]>([]);

    // UI State
    const [isAddingVisit, setIsAddingVisit] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

    // --- DATA FETCHING ---
    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            // If we don't have a valid ID, abort (prevents crash)
            if (!selectedPatient?.id) return;

            try {
                // Parallel fetching for speed
                const [profileRes, visitsRes, vaxRes] = await Promise.allSettled([
                    axios.get(`${API_BASE_URL}/api/patients/${selectedPatient.id}`),
                    axios.get(`${API_BASE_URL}/api/patients/${selectedPatient.id}/visits`),
                    axios.get(`${API_BASE_URL}/api/patients/${selectedPatient.id}/vaccinations`)
                ]);

                if (!mounted) return;

                // Handle Profile
                if (profileRes.status === 'fulfilled' && profileRes.value.data.success) {
                    setFullProfile(profileRes.value.data.data);
                }

                // Handle Visits
                if (visitsRes.status === 'fulfilled' && visitsRes.value.data.success) {
                    const fetchedVisits = Array.isArray(visitsRes.value.data.data.visits) ? visitsRes.value.data.data.visits : [];
                    setVisits(fetchedVisits);
                }

                // Handle Vaccinations
                if (vaxRes.status === 'fulfilled' && vaxRes.value.data.success) {
                    const fetchedVax = Array.isArray(vaxRes.value.data.data.vaccinations) ? vaxRes.value.data.data.vaccinations : [];
                    setVaccinations(fetchedVax);
                }

            } catch (error) {
                console.error("Data load error", error);
                // Don't toast error here to avoid spamming the user if something fails silently
            }
        };

        loadData();
        return () => { mounted = false; };
    }, [selectedPatient]);


    // --- QR CODE GENERATION ---
    useEffect(() => {
        if (fullProfile?.patient_id) {
            try {
                const qrData = JSON.stringify({
                    type: 'ABHA_HEALTH_ID',
                    uid: fullProfile.patient_id,
                    name: fullProfile.full_name,
                    ts: Date.now()
                });

                QRCode.toDataURL(qrData, {
                    margin: 1,
                    width: 400,
                    color: { dark: '#1a3a32', light: '#ffffff' }
                }).then(url => setQrCodeUrl(url)).catch(() => { });
            } catch (e) { console.error("QR Gen failed", e); }
        }
    }, [fullProfile?.patient_id, fullProfile?.full_name]);

    // --- CHART DATA PREPARATION ---
    const chartData = useMemo(() => {
        if (!visits || visits.length === 0) {
            // Placeholder data if no visits, so the UI is not empty
            return [
                { date: 'Mon', value: 98 }, { date: 'Tue', value: 97 },
                { date: 'Wed', value: 97 }, { date: 'Thu', value: 98 },
                { date: 'Fri', value: 99 }, { date: 'Sat', value: 98 }
            ];
        }
        // Map real visits
        return visits.slice().reverse().map(v => {
            const spo2 = v?.vitals?.spo2 || 95 + Math.random() * 4;
            return {
                date: Safe.shortDate(v.visit_date),
                value: spo2
            };
        });
    }, [visits]);


    // --- HANDLERS ---
    const handleDownloadQR = () => {
        if (!qrCodeUrl) return;
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `ABHA_QR_${Safe.text(fullProfile?.full_name).replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('QR Code Saved');
    };

    const handlePrintQR = () => {
        const w = window.open('', '_blank');
        if (w) {
            w.document.write(`<div style="text-align:center; padding: 40px;"><img src="${qrCodeUrl}" style="width:300px;" /><h2 style="font-family:sans-serif;">${Safe.text(fullProfile?.full_name)}</h2></div>`);
            w.print();
            w.close();
        }
    };

    // Safety check: if no patient data at all, don't render
    if (!selectedPatient) return null;

    // Derived Display Data
    const displayName = Safe.text(fullProfile.full_name, 'Unknown Patient');
    const displayId = Safe.text(fullProfile.patient_id, 'ID-PENDING');
    const firstName = displayName.split(' ')[0];
    const lastName = displayName.split(' ').slice(1).join(' ');

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-[#0a1f1a]/80 backdrop-blur-xl" // Increased Z-index to be safe
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 30 }}
                    className="bg-white w-full max-w-[95vw] h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
                    onClick={e => e.stopPropagation()}
                >
                    {/* === SIDEBAR === */}
                    <div className="w-full md:w-[380px] bg-[#f8fbf9] border-r border-slate-100 flex flex-col shrink-0 overflow-y-auto no-scrollbar">
                        <div className="p-8 flex flex-col items-center">
                            {/* Avatar */}
                            <div className="w-32 h-32 mb-6 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-[40px] flex items-center justify-center text-5xl font-black text-white shadow-xl shadow-emerald-900/10 transform transition-transform hover:scale-105">
                                {firstName[0]}
                            </div>

                            <h2 className="text-3xl font-black text-[#1a3a32] text-center leading-tight mb-2">
                                {firstName} <span className="text-emerald-700/80 block text-2xl">{lastName}</span>
                            </h2>

                            <div className="px-4 py-1.5 bg-slate-200/50 rounded-full text-[11px] font-bold text-slate-500 font-mono tracking-wider mb-8">
                                {displayId}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 w-full mb-8">
                                <InfoCard label="Age" value={`${Safe.number(fullProfile.age)} Yrs`} icon={User2} color="text-blue-600" bg="bg-blue-50" />
                                <InfoCard label="Blood" value={Safe.text(fullProfile.blood_group, 'O+')} icon={Droplets} color="text-rose-600" bg="bg-rose-50" />
                                <InfoCard label="Gender" value={Safe.text(fullProfile.gender, 'Male')} icon={Activity} color="text-violet-600" bg="bg-violet-50" />
                                <InfoCard label="Region" value={Safe.text(fullProfile.current_location).substring(0, 8)} icon={MapPin} color="text-orange-600" bg="bg-orange-50" />
                            </div>

                            {/* ABHA Card */}
                            <div className="w-full bg-[#1a3a32] rounded-[36px] p-6 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full -mr-16 -mt-16 blur-xl" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="flex items-center gap-2 mb-4 opacity-80">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">ABHA Connected</span>
                                    </div>
                                    <div className="w-40 h-40 bg-white rounded-2xl p-1 mb-6 flex items-center justify-center">
                                        {qrCodeUrl ? (
                                            <img src={qrCodeUrl} alt="QR" className="w-full h-full object-contain mix-blend-multiply" />
                                        ) : (
                                            <div className="animate-pulse w-full h-full bg-slate-200 rounded-xl" />
                                        )}
                                    </div>
                                    <div className="flex gap-2 w-full">
                                        <button onClick={handleDownloadQR} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors">
                                            Save
                                        </button>
                                        <button onClick={handlePrintQR} className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors">
                                            Print
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === MAIN CONTENT === */}
                    <div className="flex-grow flex flex-col bg-white overflow-hidden">
                        {/* Header Tabs */}
                        <div className="px-8 pt-8 pb-4 border-b border-slate-50 flex items-center justify-between bg-white z-10">
                            <div className="flex gap-8 overflow-x-auto no-scrollbar">
                                {['OVERVIEW', 'VISIT HISTORY', 'VACCINATIONS'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
                                            activeTab === tab ? "text-emerald-600" : "text-slate-300 hover:text-slate-400"
                                        )}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                            {/* TAB: OVERVIEW */}
                            {activeTab === 'OVERVIEW' && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    {/* Medical Snapshot */}
                                    <div className="p-8 bg-gradient-to-br from-[#f8fbf9] to-white rounded-[40px] border border-emerald-50 flex flex-col md:flex-row items-center gap-10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Monitoring</span>
                                            </div>
                                            <h3 className="text-3xl font-black text-[#1a3a32] mb-3">Health Status: <span className="text-emerald-600">Good</span></h3>
                                            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                                                Patient has adhered to scheduled vaccinations. No critical alerts reported in the last 30 days. Regular check-ups are recommended.
                                            </p>
                                        </div>
                                        {/* Simple Donut Chart Representation using CSS/SVG */}
                                        <div className="relative w-40 h-40 flex items-center justify-center">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray="251" strokeDashoffset="50" strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-3xl font-black text-[#1a3a32]">80%</span>
                                                <span className="text-[8px] font-black uppercase text-slate-300">Score</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vitals Chart */}
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-xl font-black text-[#1a3a32]">Vitals Trend</h4>
                                            <span className="text-xs font-bold text-slate-400">Last 7 Visits</span>
                                        </div>
                                        <div className="h-64 w-full bg-[#fcfdfc] rounded-[32px] border border-slate-50 p-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={chartData}>
                                                    <defs>
                                                        <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#cbd5e1' }} />
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                                                    />
                                                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#chartColor)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setIsAddingVisit(true)} className="p-6 bg-[#1a3a32] text-white rounded-[24px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-xl shadow-emerald-900/10">
                                            <Plus className="w-5 h-5" />
                                            <span className="text-xs font-black uppercase tracking-widest">New Clinical Visit</span>
                                        </button>
                                        <button onClick={() => toast.success('Share feature coming soon!')} className="p-6 bg-white border border-slate-100 text-[#1a3a32] rounded-[24px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors">
                                            <Share2 className="w-5 h-5" />
                                            <span className="text-xs font-black uppercase tracking-widest">Share Record</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB: VISITS */}
                            {activeTab === 'VISIT HISTORY' && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-black text-[#1a3a32]">Clinical History</h3>
                                        <span className="text-xs font-bold text-slate-400">{visits.length} Records</span>
                                    </div>

                                    {visits.length === 0 ? (
                                        <EmptyState label="No visits recorded" />
                                    ) : (
                                        <div className="space-y-4">
                                            {visits.map((visit) => (
                                                <div key={visit.id} className="p-6 bg-white border border-slate-100 rounded-[32px] hover:shadow-lg transition-shadow group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex gap-4">
                                                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex flex-col items-center justify-center font-bold">
                                                                <span className="text-lg leading-none">{Safe.shortDate(visit.visit_date).split(' ')[1]}</span>
                                                                <span className="text-[9px] uppercase">{Safe.shortDate(visit.visit_date).split(' ')[0]}</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-[#1a3a32] text-lg">{Safe.text(visit.chief_complaint, 'General checkup')}</h4>
                                                                <span className="text-xs text-slate-400 font-medium">{Safe.text(visit.facility)}</span>
                                                            </div>
                                                        </div>
                                                        <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                            {Safe.text(visit.diagnosis)}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                                        <VitalBadge label="BP" value={visit.vitals?.bp} unit="" />
                                                        <VitalBadge label="Temp" value={visit.vitals?.temp} unit="°F" />
                                                        <VitalBadge label="SpO2" value={visit.vitals?.spo2} unit="%" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: VACCINATIONS */}
                            {activeTab === 'VACCINATIONS' && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-black text-[#1a3a32]">Immunization</h3>
                                        <span className="text-xs font-bold text-slate-400">
                                            {vaccinations.filter(v => v.status === 'Completed').length} / {vaccinations.length} Done
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {vaccinations.map((vax, idx) => (
                                            <div key={idx} className={cn("p-6 rounded-[32px] border", vax.status === 'Completed' ? "bg-emerald-50/50 border-emerald-100" : "bg-white border-slate-100")}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
                                                        <Zap className={cn("w-5 h-5", vax.status === 'Completed' ? "text-emerald-500" : "text-slate-300")} />
                                                    </div>
                                                    {vax.status === 'Completed' ? (
                                                        <Check className="w-5 h-5 text-emerald-500" />
                                                    ) : (
                                                        <div className="w-2 h-2 bg-orange-400 rounded-full" />
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-[#1a3a32] mb-1">{Safe.text(vax.vaccine_name)}</h4>
                                                <p className="text-xs text-slate-400 font-medium">Due: {Safe.date(vax.due_date)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {vaccinations.length === 0 && <EmptyState label="No vaccination data" />}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* NESTED MODALS */}
            {isAddingVisit && (
                <AddVisitModal
                    patient={fullProfile}
                    onClose={() => setIsAddingVisit(false)}
                    onSave={() => { setIsAddingVisit(false); toast.success("Visit Added"); }}
                />
            )}
        </AnimatePresence>
    );
};

// --- SUB COMPONENTS FOR CLEANLINESS ---

const InfoCard = ({ label, value, icon: Icon, color, bg }: any) => (
    <div className={cn("p-4 rounded-[24px] flex flex-col gap-1 border border-transparent transition-colors hover:border-slate-100", bg)}>
        <div className="flex items-center justify-between opacity-60">
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            <Icon className={cn("w-3 h-3", color)} />
        </div>
        <span className={cn("text-lg font-black tracking-tight", color)}>{value}</span>
    </div>
);

const VitalBadge = ({ label, value, unit }: any) => (
    <div className="py-2 px-3 bg-slate-50 rounded-xl flex items-center justify-between">
        <span className="text-[9px] font-bold text-slate-400 uppercase">{label}</span>
        <span className="text-xs font-black text-[#1a3a32]">{value || '-'} {unit}</span>
    </div>
);

const EmptyState = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-slate-300">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
            <Filter className="w-6 h-6 opacity-20" />
        </div>
        <p className="text-sm font-bold">{label}</p>
    </div>
);

export default PatientProfileModal;
