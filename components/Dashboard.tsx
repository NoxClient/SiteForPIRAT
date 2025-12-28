import React from 'react';
import { Activity, Users, Server, Globe, Terminal, Shield } from 'lucide-react';

interface DashboardProps {
    //
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-[2rem] p-6 hover:bg-white/10 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group">
        <div className="flex items-center justify-between mb-6">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-20 group-hover:scale-110 transition-transform`}>
                 {React.isValidElement(icon) 
                    ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-6 h-6 ${color.replace('bg-', 'text-')}` })
                    : icon
                 }
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">Active</span>
        </div>
        <h3 className="text-4xl font-bold text-white mb-2">{value}</h3>
        <p className="text-sm text-gray-400 font-medium">{title}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = () => {
    return (
        <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 pb-20">
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Панель управления</h1>
                    <p className="text-gray-400">Обзор состояния системы PiRAT</p>
                </div>
                <div className="flex items-center space-x-3 bg-green-500/10 px-6 py-3 rounded-full border border-green-500/20 backdrop-blur-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                    <span className="text-green-400 text-sm font-bold tracking-wide">SYSTEM ONLINE</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Подключенные устройства" value="124" icon={<MonitorIcon />} color="bg-blue-500" />
                <StatCard title="Активные сессии" value="45" icon={<Activity />} color="bg-green-500" />
                <StatCard title="Логи событий" value="12.4k" icon={<Terminal />} color="bg-purple-500" />
                <StatCard title="Статус защиты" value="100%" icon={<Shield />} color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-white flex items-center">
                            <Globe className="w-6 h-6 mr-3 text-gray-400" />
                            География подключений
                        </h3>
                        <button className="text-xs font-bold text-white/50 hover:text-white bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                            VIEW FULL MAP
                        </button>
                    </div>
                    <div className="h-80 bg-black/40 rounded-[2rem] flex items-center justify-center border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]"></div>
                        <p className="text-gray-500 text-sm font-medium z-10 group-hover:text-white transition-colors">[Interactive Map Visualization]</p>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                        <Server className="w-6 h-6 mr-3 text-gray-400" />
                        Последние действия
                    </h3>
                    <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default border border-transparent hover:border-white/5">
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:shadow-[0_0_8px_#3b82f6] transition-shadow"></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-200">Connection established</p>
                                        <p className="text-xs text-gray-500">ID: 8823-F2A</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-gray-600 group-hover:text-gray-400">14:2{i}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper icon
const MonitorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
);

export default Dashboard;