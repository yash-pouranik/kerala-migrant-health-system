import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Calendar, MapPin, Activity, Stethoscope, Thermometer,
    Droplets, Heart, Pill, Paperclip, Save,
    ChevronRight, ChevronLeft, User, Plus
} from 'lucide-react';
import { cn } from '../utils/cn';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AddVisitModal = ({ patient, onClose, onSave }: { patient: any, onClose: () => void, onSave: () => void }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        visitDate: new Date().toISOString().split('T')[0],
        facility: 'PHC Kalpetta',
        visitType: 'OPD',
        chiefComplaint: '',
        vitals: {
            temp: '98.6',
            bp: '120/80',
            pulse: '72',
            spo2: '98',
            weight: '65'
        },
        diagnosis: '',
        severity: 'Mild',
        treatmentNotes: '',
        medications: [] as any[],
        followUpRequired: false,
        followUpDate: ''
    });

    const [files, setFiles] = useState<File[]>([]);

    const handleVitalChange = (key: string, val: string) => {
        setFormData(prev => ({
            ...prev,
            vitals: { ...prev.vitals, [key]: val }
        }));
    };

    const addMedication = () => {
        setFormData(prev => ({
            ...prev,
            medications: [...prev.medications, { name: '', dosage: '', frequency: 'Twice daily', duration: '5 days' }]
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'vitals' || key === 'medications') {
                    submitData.append(key, JSON.stringify(value));
                } else {
                    submitData.append(key, String(value));
                }
            });
            files.forEach(file => submitData.append('attachments', file));

            const res = await axios.post(`${API_BASE_URL}/api/patients/${patient.id}/visits`, submitData);
            if (res.data.success) {
                toast.success('Clinical record saved successfully!');
                onSave();
                onClose();
            }
        } catch (error) {
            toast.error('Failed to save record');
        } finally {
            setLoading(false);
        }
    };

    const sections = [
        { id: 1, label: 'Visit Context', icon: Calendar },
        { id: 2, label: 'Vitals & Complain', icon: Activity },
        { id: 3, label: 'Clinical Assessment', icon: Stethoscope },
        { id: 4, label: 'Plan & Files', icon: Pill }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-12 bg-[#020617]/95 backdrop-blur-2xl"
        >
            <motion.div
                initial={{ scale: 0.95, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 50 }}
                className="bg-white w-full max-w-[1000px] h-full max-h-[900px] rounded-[60px] shadow-2xl overflow-hidden flex flex-col relative"
            >
                {/* Header Profile Summary */}
                <div className="p-10 bg-[#f8fafc] border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#1a3a32] rounded-3xl flex items-center justify-center text-2xl font-black text-white">
                            {patient.full_name?.[0]}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-[#1a3a32] tracking-tighter">New Visit: {patient.full_name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{patient.patient_id}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Enrollment</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Progress Stepper */}
                <div className="px-12 py-8 bg-white flex items-center justify-between border-b border-slate-50">
                    {sections.map(s => (
                        <div key={s.id} className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                                step >= s.id ? "bg-[#1a3a32] text-white shadow-xl shadow-emerald-900/10" : "bg-slate-50 text-slate-300"
                            )}>
                                <s.icon className="w-4 h-4" />
                            </div>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest hidden md:block",
                                step === s.id ? "text-[#1a3a32]" : "text-slate-300"
                            )}>{s.label}</span>
                            {s.id < 4 && <div className="w-12 h-[2px] bg-slate-50 mx-2" />}
                        </div>
                    ))}
                </div>

                {/* Form Body */}
                <div className="flex-grow overflow-y-auto p-12 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visit Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                            <input
                                                type="date"
                                                value={formData.visitDate}
                                                onChange={e => setFormData({ ...formData, visitDate: e.target.value })}
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none font-bold text-[#1a3a32] focus:border-emerald-500/20 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Healthcare Facility</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                                            <select
                                                value={formData.facility}
                                                onChange={e => setFormData({ ...formData, facility: e.target.value })}
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none font-bold text-[#1a3a32] focus:border-emerald-500/20 focus:bg-white transition-all appearance-none"
                                            >
                                                <option>PHC Kalpetta</option>
                                                <option>District Hospital Ernakulam</option>
                                                <option>CHC Thrissur</option>
                                                <option>Health Post Alpha</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visit Type</label>
                                        <select
                                            value={formData.visitType}
                                            onChange={e => setFormData({ ...formData, visitType: e.target.value })}
                                            className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none font-bold text-[#1a3a32] focus:border-emerald-500/20 focus:bg-white transition-all"
                                        >
                                            <option>OPD</option>
                                            <option>Emergency</option>
                                            <option>Follow-up</option>
                                            <option>Teleconsultation</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attending Officer</label>
                                        <div className="w-full px-6 py-5 bg-slate-100/50 rounded-[24px] font-bold text-slate-400 flex items-center gap-3">
                                            <User className="w-4 h-4" /> Current Logged User
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-12"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chief Complaint *</label>
                                    <textarea
                                        rows={4}
                                        value={formData.chiefComplaint}
                                        onChange={e => setFormData({ ...formData, chiefComplaint: e.target.value })}
                                        placeholder="Briefly describe patient symptoms..."
                                        className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[32px] outline-none font-bold text-[#1a3a32] focus:border-emerald-500/20 focus:bg-white transition-all"
                                    />
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vital Signs Assessment</label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                        {[
                                            { label: 'Temp', key: 'temp', icon: Thermometer, unit: '°F' },
                                            { label: 'BP', key: 'bp', icon: Heart, unit: 'SYS/DIA' },
                                            { label: 'Pulse', key: 'pulse', icon: Activity, unit: 'BPM' },
                                            { label: 'SpO2', key: 'spo2', icon: Droplets, unit: '%' },
                                            { label: 'Weight', key: 'weight', icon: Activity, unit: 'KG' }
                                        ].map(v => (
                                            <div key={v.key} className="p-6 bg-slate-50 rounded-[32px] border-2 border-transparent hover:border-emerald-500/10 transition-all flex flex-col items-center gap-3">
                                                <v.icon className="w-5 h-5 text-emerald-500/40" />
                                                <input
                                                    type="text"
                                                    value={(formData.vitals as any)[v.key]}
                                                    onChange={e => handleVitalChange(v.key, e.target.value)}
                                                    className="w-full bg-transparent text-center font-black text-xl text-[#1a3a32] outline-none"
                                                />
                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{v.unit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Diagnosis</label>
                                        <div className="relative">
                                            <Stethoscope className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                            <input
                                                type="text"
                                                value={formData.diagnosis}
                                                onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
                                                placeholder="Search ICD-10 Code or Name..."
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none font-bold text-[#1a3a32] focus:border-emerald-500/20 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Severity Assessment</label>
                                        <select
                                            value={formData.severity}
                                            onChange={e => setFormData({ ...formData, severity: e.target.value })}
                                            className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none font-bold text-[#1a3a32] focus:border-emerald-500/20 focus:bg-white transition-all"
                                        >
                                            <option>Mild</option>
                                            <option>Moderate</option>
                                            <option>Severe</option>
                                            <option>Critical</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medication Prescription</label>
                                        <button onClick={addMedication} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                                            <Plus className="w-3.5 h-3.5" /> Add Drug
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {formData.medications.map((_m, idx) => (
                                            <div key={idx} className="p-6 bg-[#f8fbf9] rounded-[32px] border border-emerald-50 flex items-center gap-6">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0">
                                                    <Pill className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <div className="grid grid-cols-4 gap-4 flex-grow">
                                                    <input placeholder="Drug Name" className="text-sm font-bold bg-transparent outline-none border-b border-transparent focus:border-emerald-500/20 py-1" />
                                                    <input placeholder="Dosage" className="text-sm font-bold bg-transparent outline-none border-b border-transparent focus:border-emerald-500/20 py-1" />
                                                    <select className="text-[10px] font-black uppercase tracking-widest bg-transparent outline-none">
                                                        <option>Twice daily</option>
                                                        <option>Once daily</option>
                                                        <option>Before Sleep</option>
                                                    </select>
                                                    <input placeholder="Duration" className="text-sm font-bold bg-transparent outline-none border-b border-transparent focus:border-emerald-500/20 py-1" />
                                                </div>
                                            </div>
                                        ))}
                                        {formData.medications.length === 0 && (
                                            <div className="text-center py-10 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100 text-slate-300 font-bold italic text-sm">
                                                No medications prescribed yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-12"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Treatment Notes</label>
                                    <textarea
                                        rows={6}
                                        value={formData.treatmentNotes}
                                        onChange={e => setFormData({ ...formData, treatmentNotes: e.target.value })}
                                        className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[32px] outline-none font-bold text-[#1a3a32] focus:border-emerald-500/20 focus:bg-white transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnostic Artifacts</label>
                                        <div
                                            onClick={() => document.getElementById('file-up')?.click()}
                                            className="p-10 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-emerald-500/20 transition-all hover:bg-emerald-50/20"
                                        >
                                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                                <Paperclip className="w-6 h-6 text-slate-300" />
                                            </div>
                                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Attach Reports/X-Rays</span>
                                            <input
                                                id="file-up" type="file" multiple className="hidden"
                                                onChange={e => setFiles(Array.from(e.target.files || []))}
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {files.map((f, idx) => (
                                                <div key={idx} className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-bold text-[#1a3a32] flex items-center gap-2">
                                                    <Paperclip className="w-3 h-3 text-slate-300" /> {f.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Follow-up Intelligence</label>
                                        <div className="p-8 bg-[#fffcf5] border border-amber-50 rounded-[40px] space-y-6">
                                            <label className="flex items-center gap-4 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.followUpRequired}
                                                    onChange={e => setFormData({ ...formData, followUpRequired: e.target.checked })}
                                                    className="w-6 h-6 accent-amber-500 rounded-lg"
                                                />
                                                <span className="text-[12px] font-black text-[#1a3a32] uppercase tracking-widest">Follow-up Required</span>
                                            </label>
                                            {formData.followUpRequired && (
                                                <div className="space-y-3">
                                                    <div className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Suggested Date</div>
                                                    <input
                                                        type="date"
                                                        value={formData.followUpDate}
                                                        onChange={e => setFormData({ ...formData, followUpDate: e.target.value })}
                                                        className="w-full p-4 bg-white rounded-2xl border border-amber-100 outline-none font-bold"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="p-10 bg-[#f8fafc] border-t border-slate-100 flex justify-between items-center">
                    <button
                        disabled={step === 1}
                        onClick={() => setStep(s => s - 1)}
                        className="px-8 py-5 bg-white border border-slate-100 rounded-[28px] text-[12px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3 disabled:opacity-20"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back Page
                    </button>

                    <div className="flex gap-4">
                        <button className="px-10 py-5 bg-white border border-slate-100 rounded-[28px] text-[12px] font-black uppercase tracking-widest text-[#1a3a32] hover:bg-slate-50">
                            Save as Draft
                        </button>
                        {step < 4 ? (
                            <button
                                onClick={() => setStep(s => s + 1)}
                                className="px-12 py-5 bg-[#1a3a32] text-white rounded-[28px] text-[12px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-all"
                            >
                                Continue To Step {step + 1} <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-16 py-5 bg-emerald-600 text-white rounded-[28px] text-[12px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving Pipeline...' : (
                                    <><Save className="w-4 h-4" /> Finalize Record</>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AddVisitModal;
