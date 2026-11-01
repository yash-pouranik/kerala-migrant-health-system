import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Download, CheckCircle, Smartphone as MobileIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const AbhaCreate = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [idType, setIdType] = useState<'AADHAAR' | 'MOBILE' | null>(null);
    const [aadhaar, setAadhaar] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedAbha, setGeneratedAbha] = useState('');

    const sendOtp = () => {
        if (aadhaar.length !== 12) {
            toast.error('Please enter a valid 12-digit Aadhaar number');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(3);
            toast.success('OTP sent to your linked mobile number');
        }, 1500);
    };

    const verifyOtp = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const newId = `34-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
            setGeneratedAbha(newId);
            setStep(4);
            toast.success('ABHA ID Created Successfully!');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-cream p-8 flex items-center justify-center">
            <div className="max-w-xl w-full">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="card !p-12 space-y-8"
                        >
                            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mx-auto transform -rotate-3">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-black text-primary-dark">Create Your ABHA ID</h1>
                                <p className="text-gray-500 font-medium">Choose a verification method to generate your digital health identity.</p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => { setIdType('AADHAAR'); setStep(2); }}
                                    className="w-full p-6 bg-white border-2 border-gray-100 rounded-3xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg text-primary-dark">Verify via Aadhaar</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Linked mobile OTP required</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => { setIdType('MOBILE'); setStep(2); }}
                                    className="w-full p-6 bg-white border-2 border-gray-100 rounded-3xl hover:border-primary hover:bg-primary/5 transition-all text-left group opacity-60"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                                            <MobileIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg text-primary-dark">Verify via Mobile</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Self-declaration mode</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="card !p-12 space-y-8"
                        >
                            <h2 className="text-3xl font-black text-primary-dark tracking-tighter">Enter {idType === 'AADHAAR' ? 'Aadhaar' : 'Mobile'} Number</h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">12-Digit Aadhaar Number</label>
                                    <input
                                        type="text"
                                        maxLength={12}
                                        value={aadhaar}
                                        onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-primary transition-all text-xl font-mono tracking-widest"
                                        placeholder="0000 0000 0000"
                                    />
                                </div>
                                <button
                                    onClick={sendOtp}
                                    disabled={isLoading}
                                    className="w-full btn-primary !py-4 text-lg font-black flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Processing...' : 'Send OTP'} <ArrowRight className="w-5 h-5" />
                                </button>
                                <button onClick={() => setStep(1)} className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">Go Back</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="card !p-12 space-y-8"
                        >
                            <h2 className="text-3xl font-black text-primary-dark tracking-tighter">Verify OTP</h2>
                            <p className="text-gray-500 font-medium italic">We've sent a 6-digit code to your mobile ending in ****{aadhaar.slice(-4)}</p>
                            <div className="space-y-6">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-primary transition-all text-3xl text-center font-mono tracking-[0.5em]"
                                    placeholder="000000"
                                />
                                <button
                                    onClick={verifyOtp}
                                    disabled={isLoading}
                                    className="w-full btn-primary !py-4 text-lg font-black"
                                >
                                    {isLoading ? 'Verifying...' : 'Complete Verification'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card !p-12 space-y-10 text-center"
                        >
                            <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-green-200">
                                <CheckCircle className="w-12 h-12" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-primary-dark">ABHA Created!</h1>
                                <p className="text-gray-500 font-medium">Your universal health identity is now ready.</p>
                            </div>

                            <div className="p-8 bg-cream border-2 border-primary/20 rounded-3xl space-y-4">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Your Unique ABHA Number</p>
                                <p className="text-3xl font-mono font-black text-primary-dark">{generatedAbha}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button className="btn-secondary !py-4 flex items-center justify-center gap-2 border-2">
                                    <Download className="w-5 h-5" /> Download QR
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="btn-primary !py-4 font-black"
                                >
                                    Proceed to Register
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AbhaCreate;
