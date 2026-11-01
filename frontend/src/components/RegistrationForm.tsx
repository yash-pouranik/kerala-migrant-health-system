import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Shield, MapPin, Home, Activity, Syringe, Phone,
    CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Download,
    CloudLightning, QrCode as QrCodeIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRealtime } from '../context/RealtimeContext';

const RegistrationForm = () => {
    const [step, setStep] = useState(1);
    const { register, handleSubmit } = useForm();
    const { socket } = useRealtime();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [patientId, setPatientId] = useState('');

    const onSubmit = (data: any) => {
        const id = `KDH-2025-${Math.floor(100000 + Math.random() * 900000)}`;
        setPatientId(id);

        if (socket) {
            socket.emit('new_patient', { ...data, id });
            toast.success('Registration Synced Real-time!');
        }

        setIsSubmitted(true);
        window.scrollTo(0, 0);
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto p-12 text-center space-y-8"
            >
                <div className="w-24 h-24 bg-primary rounded-full mx-auto flex items-center justify-center text-white">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-primary-dark tracking-tight">Registration Successful!</h2>
                    <p className="text-gray-500 mt-2 font-medium">Migrant Digital Health ID has been generated and synced.</p>
                </div>

                <div className="card !p-8 border-2 border-primary/20 bg-white">
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Digital Health ID</p>
                            <h3 className="text-3xl font-black text-primary">{patientId}</h3>
                        </div>
                        <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-primary">
                            <QrCodeIcon className="w-16 h-16" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="btn-primary w-full flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Download ID Card
                        </button>
                        <button className="btn-secondary w-full" onClick={() => window.location.href = '/records'}>
                            View All Records
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    const sections = [
        { id: 1, title: 'Personal Info', icon: User },
        { id: 2, title: 'Identity', icon: Shield },
        { id: 3, title: 'Migration', icon: MapPin },
        { id: 4, title: 'Living', icon: Home },
        { id: 5, title: 'Health', icon: Activity },
        { id: 6, title: 'Vaccination', icon: Syringe },
        { id: 7, title: 'Emergency', icon: Phone },
        { id: 8, title: 'Consent', icon: ShieldCheck },
    ];

    return (
        <div className="max-w-4xl mx-auto p-8 fade-in">
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <CloudLightning className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-primary-dark tracking-tighter">Migrant Enrollment</h1>
                        <p className="text-gray-500 font-medium tracking-tight">SIH 2025 • ABHA Digital Infrastructure Pilot</p>
                    </div>
                </div>

                <div className="relative flex justify-between">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
                    {sections.map(s => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4",
                                    step >= s.id ? "bg-primary border-white text-white shadow-lg" : "bg-white border-gray-100 text-gray-400"
                                )}
                            >
                                <s.icon className="w-4 h-4" />
                            </div>
                            <span className={cn(
                                "text-[9px] font-bold uppercase tracking-widest hidden md:block",
                                step === s.id ? "text-primary" : "text-gray-400"
                            )}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="card space-y-6">
                            <h3 className="text-xl font-bold text-primary-dark">Section 1: Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Full Name *</label>
                                    <input {...register('name', { required: true })} className="input-field" placeholder="Name as per Aadhaar" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Age *</label>
                                    <input {...register('age', { required: true })} type="number" className="input-field" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Gender *</label>
                                    <select {...register('gender', { required: true })} className="input-field">
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Transgender</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Mobile Number *</label>
                                    <input {...register('mobile', { required: true })} className="input-field" placeholder="10-digit number" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="card space-y-6">
                            <h3 className="text-xl font-bold text-primary-dark">Section 2: Identity Documents</h3>
                            <div className="space-y-6">
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-primary-dark">ABHA Digital Health ID</p>
                                        <p className="text-xs text-gray-500">14-digit number for ABDM interoperability</p>
                                    </div>
                                    <input {...register('abhaId')} className="max-w-[200px] px-4 py-2 border border-primary/20 rounded-lg outline-none" placeholder="XXXX-XXXX-XXXX" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Aadhaar (Last 4 digits only)</label>
                                        <input {...register('aadhaar')} className="input-field" placeholder="XXXX-XXXX-1234" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Worker/Labor ID</label>
                                        <input {...register('workerId')} className="input-field" placeholder="Employer issued ID" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="card space-y-6">
                            <h3 className="text-xl font-bold text-primary-dark">Section 3: Migration Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Origin State *</label>
                                    <select {...register('origin')} className="input-field">
                                        <option>Jharkhand</option>
                                        <option>West Bengal</option>
                                        <option>Odisha</option>
                                        <option>Assam</option>
                                        <option>Bihar</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">District in Kerala *</label>
                                    <select {...register('district')} className="input-field">
                                        <option>Wayanad</option>
                                        <option>Ernakulam</option>
                                        <option>Thrissur</option>
                                        <option>Alappuzha</option>
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Current Workplace/Employer</label>
                                    <input {...register('employer')} className="input-field" placeholder="Construction Camp A / PWD Road Project" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="card space-y-6">
                            <h3 className="text-xl font-bold text-primary-dark">Section 4: Living Conditions</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Type of Housing</label>
                                        <select {...register('housing')} className="input-field">
                                            <option>Employer-provided quarters</option>
                                            <option>Rented room (Shared)</option>
                                            <option>Makeshift shelter</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">No. of occupants per room</label>
                                        <input {...register('occupants')} type="number" className="input-field" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step > 4 && step < 8 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="card p-12 text-center space-y-4">
                            <CloudLightning className="w-12 h-12 text-secondary mx-auto" />
                            <h3 className="text-xl font-bold">Health & Vaccination Record</h3>
                            <p className="text-gray-500 font-medium">Capturing immunization history and pre-existing conditions...</p>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 text-xs text-left font-mono text-gray-400">
                                [ Module Active: Simulated clinical data entry for step {step} ]
                            </div>
                        </motion.div>
                    )}

                    {step === 8 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="card space-y-6">
                            <h3 className="text-xl font-bold text-primary-dark">Section 8: Consent & Enrollment</h3>
                            <div className="space-y-4">
                                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                                    <label className="flex items-start gap-4 cursor-pointer">
                                        <input type="checkbox" {...register('consent', { required: true })} className="mt-1 w-6 h-6 accent-primary rounded-lg" />
                                        <div>
                                            <p className="text-base font-bold text-primary-dark leading-tight">I consent to share my health data within the ABHA ecosystem.</p>
                                            <p className="text-xs text-gray-500 mt-2 font-medium tracking-tight">Data sharing is governed by ABDM consent artifacts. I can revoke this anytime from the portal.</p>
                                        </div>
                                    </label>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Direct Benefit Enrollment</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="badge-success">Awaz Health Scheme</span>
                                        <span className="badge-success">Athidhi Portal</span>
                                        <span className="badge-warning">Ayushman Bharat Assessment</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Language Preference (SMS/UI) *</label>
                                    <select {...register('language')} className="input-field">
                                        <option value="ml">Malayalam (മലയാളം)</option>
                                        <option value="hi">Hindi (हिंदी)</option>
                                        <option value="bn">Bengali (বাংলা)</option>
                                        <option value="or">Odia (ଓଡ଼ିଆ)</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-between pt-8 border-t border-gray-100">
                    {step > 1 && (
                        <button type="button" onClick={prevStep} className="btn-secondary !px-8 flex items-center gap-2 border-2">
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                    )}
                    <div className="flex-grow" />
                    {step < 8 ? (
                        <button type="button" onClick={nextStep} className="btn-primary !px-10 flex items-center gap-2 shadow-xl shadow-primary/20">
                            Continue to Step {step + 1} <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button type="submit" className="btn-primary !px-16 !py-5 text-xl font-black shadow-2xl shadow-primary/30 transform hover:scale-105 transition-all">
                            Complete Enrollment
                        </button>
                    )}
                </div>
            </form>

            <style>{`
        .input-field {
          width: 100%;
          padding: 1rem 1.25rem;
          background-color: #f8fafc;
          border: 2px solid #f1f5f9;
          border-radius: 1rem;
          outline: none;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #1e293b;
        }
        .input-field:focus {
          border-color: #059669;
          background-color: white;
          box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.1);
        }
      `}</style>
        </div>
    );
};

export default RegistrationForm;

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
