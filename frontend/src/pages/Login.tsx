import { useState, useEffect } from 'react';
import { AlertCircle, Loader2, Chrome, Facebook, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';


const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

    // Handle OAuth callback
    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                localStorage.setItem('authToken', token);
                // Redirect based on user role or default to register
                navigate(user.role === 'Super Admin' ? '/dashboard' : '/register');
            } catch (error) {
                setError('Failed to process authentication');
            }
        }
    }, [searchParams, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        performLogin({ username, password });
    };

    const handleSocialLogin = async (provider: 'google' | 'facebook') => {
        setSocialLoading(provider);

        if (provider === 'google') {
            try {
                // Get Google OAuth URL from backend
                const response = await fetch('/api/auth/google');
                const data = await response.json();

                if (data.success && data.authUrl) {
                    // Redirect to Google OAuth
                    window.location.href = data.authUrl;
                } else {
                    setError('Failed to initiate Google login');
                    setSocialLoading(null);
                }
            } catch (error) {
                setError('Failed to connect to authentication service');
                setSocialLoading(null);
            }
        } else {
            // Facebook login - keep mock for now
            setTimeout(() => {
                performLogin({ provider });
            }, 1500);
        }
    };


    const performLogin = async (credentials: any) => {
        setError('');
        if (!credentials.provider) setIsLoggingIn(true);

        const success = await login(credentials);

        if (success) {
            if (credentials.provider === 'google') navigate('/register');
            else if (credentials.provider === 'facebook') navigate('/records');
            else if (username.includes('admin') || username.includes('wayanad')) navigate('/dashboard');
            else navigate('/register');
        } else {
            // Check console for detailed error logs
            console.log('Login failed - check browser console for details');
            setError('Authentication failed. Please check your credentials. If using demo: admin@kerala.gov / admin');
            setIsLoggingIn(false);
            setSocialLoading(null);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] relative overflow-hidden font-sans">
            {/* Aesthetic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-teal-50/50 rounded-full blur-3xl opacity-60"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[440px] z-10 p-4"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="mb-5">
                            <Logo showText={false} className="scale-150" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight text-center">Welcome Back</h1>
                        <p className="text-sm text-gray-400 font-medium text-center mt-1">Kerala Digital Health Portal</p>
                    </div>

                    {/* Social Login - Matching Style */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <button
                            onClick={() => handleSocialLogin('google')}
                            disabled={!!socialLoading}
                            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 group active:scale-95 shadow-sm"
                        >
                            {socialLoading === 'google' ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : (
                                <>
                                    <Chrome className="w-4 h-4 text-gray-600 group-hover:text-emerald-600 transition-colors" />
                                    <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">Google</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => handleSocialLogin('facebook')}
                            disabled={!!socialLoading}
                            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 group active:scale-95 shadow-sm"
                        >
                            {socialLoading === 'facebook' ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : (
                                <>
                                    <Facebook className="w-4 h-4 text-gray-600 group-hover:text-[#1877F2] transition-colors" />
                                    <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">Facebook</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100/80"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white/80 px-3 text-gray-300 backdrop-blur-sm">Or Login With ID</span></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="group">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block group-focus-within:text-emerald-600 transition-colors">Official ID</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl outline-none text-sm font-semibold text-gray-700 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 placeholder:text-gray-300"
                                    placeholder="admin@kerala.gov"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="group">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block group-focus-within:text-emerald-600 transition-colors">Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl outline-none text-sm font-semibold text-gray-700 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 placeholder:text-gray-300"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoggingIn || !!socialLoading}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    Access Portal <ArrowRight className="w-4 h-4 opacity-80" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <div className="flex justify-center flex-wrap gap-2 text-[10px] font-medium text-gray-300">
                            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Privacy Policy</span>
                            <span>•</span>
                            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Terms of Service</span>
                            <span>•</span>
                            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Help Center</span>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default Login;
