import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Users, MapPin, Zap } from 'lucide-react';
import { useRealtime } from '../context/RealtimeContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '../utils/cn';
import { API_BASE_URL } from '../config';

const COLORS = ['#1a7c5b', '#f4a261', '#f43f5e'];

const Dashboard = () => {
    const { alerts, socket } = useRealtime();
    const [metrics, setMetrics] = useState<any>(null);
    const [charts, setCharts] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const [metricsRes, chartsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/dashboard/metrics`),
                axios.get(`${API_BASE_URL}/api/dashboard/charts`)
            ]);

            if (metricsRes.data.success) setMetrics(metricsRes.data.data);
            if (chartsRes.data.success) setCharts(chartsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        if (socket) {
            socket.on('health_data_update', () => {
                fetchDashboardData();
            });
        }

        const interval = setInterval(fetchDashboardData, 60000);
        return () => {
            clearInterval(interval);
            if (socket) socket.off('health_data_update');
        };
    }, [socket]);

    if (loading && !metrics) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#1a7c5b] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Syncing Live Data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-10 space-y-12 bg-white">
            {/* Critical Alerts Bar */}
            {alerts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#fff8f8] border-2 border-[#ffeded] rounded-[32px] p-8 flex items-center gap-6"
                >
                    <div className="w-14 h-14 bg-[#f43f5e] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-100">
                        <AlertTriangle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-[#f43f5e] uppercase tracking-[0.2em] mb-1">Surveillance Breach Detected</p>
                        <p className="text-xl font-black text-[#1a3a32] tracking-tight">{alerts[0].message}</p>
                    </div>
                    <button className="ml-auto px-6 py-3 bg-[#f43f5e] text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Deploy Response</button>
                </motion.div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Registered Migrants', value: metrics?.totalMigrants, icon: Users, change: '+12%', color: 'bg-emerald-50 text-[#1a7c5b]' },
                    { label: 'Vaccination Coverage', value: `${metrics?.vaccinationCoverage}%`, icon: Activity, change: 'Optimal', color: 'bg-slate-50 text-[#1a3a32]' },
                    { label: 'Screening Points', value: metrics?.uniqueLocations, icon: MapPin, change: 'Live', color: 'bg-[#fffcf5] text-[#f4a261]' },
                    { label: 'Active Alerts', value: metrics?.activeAlerts, icon: Zap, change: 'Critical', color: 'bg-rose-50 text-[#f43f5e]' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[40px] border-2 border-slate-50 shadow-sm hover:shadow-xl hover:shadow-emerald-900/[0.02] transition-all group"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={cn("p-4 rounded-2xl", stat.color)}>
                                <stat.icon className="w-6 h-6 stroke-[2.5px]" />
                            </div>
                            <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1 rounded-full">{stat.change}</span>
                        </div>
                        <h2 className="text-4xl font-black text-[#1a3a32] tracking-tighter mb-2">{stat.value}</h2>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Trend Chart */}
                <div className="lg:col-span-8 bg-[#f8fbf9] rounded-[50px] p-10 border border-[#eef5f2]">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-[#1a3a32] tracking-tight">Transmission Trends</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Aggregated Weekly Surveliance</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#1a7c5b]" />
                                <span className="text-[10px] font-black text-[#1a3a32] uppercase">Active Cases</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={charts?.diseaseTrends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
                                    itemStyle={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="cases"
                                    stroke="#1a7c5b"
                                    strokeWidth={6}
                                    dot={{ r: 8, fill: '#1a7c5b', strokeWidth: 4, stroke: '#fff' }}
                                    activeDot={{ r: 10, fill: '#1a3a32' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="lg:col-span-4 bg-white rounded-[50px] p-10 border-2 border-slate-50 flex flex-col">
                    <h3 className="text-2xl font-black text-[#1a3a32] tracking-tight mb-8">Health Equity</h3>
                    <div className="h-64 relative flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={charts?.vaccinationData}
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {charts?.vaccinationData?.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-black text-[#1a3a32]">88%</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase">Coverage</span>
                        </div>
                    </div>
                    <div className="mt-8 space-y-4">
                        {charts?.vaccinationData?.map((v: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-[10px] font-black text-[#1a3a32] uppercase">{v.name}</span>
                                </div>
                                <span className="text-xs font-black text-[#1a7c5b]">{v.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
