import React, { useState, useEffect } from 'react';
import { User, UserRole, Promocode, Message, Report } from '../types';
import { ShieldAlert, ShieldCheck, Award, User as UserIcon, Star, Code, CheckCircle2, Skull, AlertTriangle, Cpu, Users, Search, Ticket, Plus, Trash2, LayoutGrid, Fingerprint, Info, X, MessageSquare, AlertOctagon, Eye, Menu } from 'lucide-react';

interface AdminPanelProps {
    currentUser: User;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser }) => {
    const [activeTab, setActiveTab] = useState<'staff' | 'users' | 'promocodes' | 'reports'>('staff');
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [promocodes, setPromocodes] = useState<Promocode[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [muteDuration, setMuteDuration] = useState('10');
    const [inspectChat, setInspectChat] = useState<{ u1: string | number, u2: string | number } | null>(null);

    const [newPromoCode, setNewPromoCode] = useState('');
    const [newPromoDays, setNewPromoDays] = useState('7');
    const [newPromoMaxActivations, setNewPromoMaxActivations] = useState('1');

    const canAccessAdvanced = currentUser.roles.some(r => [UserRole.OWNER, UserRole.DEVELOPER, UserRole.ADMIN].includes(r));

    useEffect(() => {
        loadData();
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);

    const loadData = () => {
        const users: User[] = JSON.parse(localStorage.getItem('pirat_users') || '[]');
        const promos: Promocode[] = JSON.parse(localStorage.getItem('pirat_promocodes') || '[]');
        const reps: Report[] = JSON.parse(localStorage.getItem('pirat_reports') || '[]');
        setAllUsers(users);
        setPromocodes(promos);
        setReports(reps);
    };

    const handleCreatePromo = () => {
        if (!newPromoCode.trim()) return;
        const code = newPromoCode.trim().toUpperCase();
        
        // Дубликат проверка
        const exists = promocodes.some(p => p.code === code);
        if (exists) {
            alert(`Ошибка: Промокод с именем "${code}" уже существует в базе!`);
            return;
        }

        const newPromo: Promocode = {
            id: Math.random().toString(36).substr(2, 9),
            code: code,
            days: parseInt(newPromoDays) || 1,
            maxActivations: parseInt(newPromoMaxActivations) || 1,
            currentActivations: 0,
            createdBy: currentUser.username,
            createdAt: new Date().toISOString()
        };

        const updated = [...promocodes, newPromo];
        localStorage.setItem('pirat_promocodes', JSON.stringify(updated));
        setPromocodes(updated);
        setNewPromoCode('');
        setNewPromoMaxActivations('1');
        alert("Промокод создан успешно.");
    };

    const handleResolveReport = (id: string) => {
        const updated = reports.filter(r => r.id !== id);
        localStorage.setItem('pirat_reports', JSON.stringify(updated));
        setReports(updated);
    };

    const handleMuteFromAdmin = () => {
        if (!selectedUser) return;
        const users = [...allUsers];
        const idx = users.findIndex((u: User) => u.id === selectedUser.id);
        if (idx !== -1) {
            const duration = parseInt(muteDuration) || 10;
            const muteUntil = Date.now() + (duration * 60000);
            users[idx] = { ...users[idx], isMuted: true, muteUntil: muteUntil };
            localStorage.setItem('pirat_users', JSON.stringify(users));
            setAllUsers(users);
            setSelectedUser({ ...users[idx] });
            alert(`Мут наложен на ${selectedUser.username}`);
        }
    };

    const getRoleColors = (role: UserRole) => {
        switch (role) {
            case UserRole.OWNER: return 'from-red-900 to-red-600 border-red-500/50';
            case UserRole.ADMIN: return 'from-green-900 to-green-600 border-green-500/50';
            case UserRole.HELPER: return 'from-sky-900 to-sky-600 border-sky-500/50';
            default: return 'from-gray-800 to-gray-600 border-gray-500/50';
        }
    };

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:ml-64 max-w-7xl mx-auto relative z-10 overflow-x-hidden">
            {/* INSPECT MODAL */}
            {inspectChat && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setInspectChat(null)}></div>
                    <div className="relative bg-[#050505] border border-white/10 rounded-[2rem] md:rounded-[3rem] w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="font-black text-white uppercase tracking-widest italic text-sm md:text-base">Конфиденциальный просмотр</h3>
                            <button onClick={() => setInspectChat(null)} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar">
                            {JSON.parse(localStorage.getItem('pirat_chat_messages') || '[]')
                                .filter((m: any) => 
                                    (m.senderId === inspectChat.u1 && m.recipientId === inspectChat.u2) || 
                                    (m.senderId === inspectChat.u2 && m.recipientId === inspectChat.u1)
                                )
                                .map((m: any) => (
                                    <div key={m.id} className={`flex ${m.senderId === inspectChat.u1 ? 'justify-start' : 'justify-end'}`}>
                                        <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-3xl max-w-[85%]">
                                            <p className="text-[10px] text-blue-500 font-black uppercase mb-2 tracking-widest">{m.username}</p>
                                            <p className="text-sm text-gray-200 break-words">{m.text}</p>
                                            {m.image && <img src={m.image} className="mt-4 rounded-xl max-h-48 shadow-xl" />}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* CENTERED HEADER & NAVIGATION */}
            <div className="flex flex-col items-center justify-center mb-12 space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-2 italic tracking-tighter">Control <span className="text-red-600">Panel</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] md:text-xs tracking-[0.3em]">Администрирование проекта PiRAT</p>
                </div>
                
                {/* Centered Pill Menu */}
                <div className="bg-[#0f0f0f] p-1.5 rounded-full border border-white/10 flex items-center justify-center gap-1 overflow-x-auto max-w-[95vw] md:max-w-none no-scrollbar shadow-2xl">
                    <button 
                        onClick={() => setActiveTab('staff')} 
                        className={`px-6 md:px-8 py-3 rounded-full text-[10px] md:text-xs font-black uppercase transition-all shrink-0 ${activeTab === 'staff' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Персонал
                    </button>
                    {canAccessAdvanced && (
                        <>
                            <button 
                                onClick={() => setActiveTab('users')} 
                                className={`px-6 md:px-8 py-3 rounded-full text-[10px] md:text-xs font-black uppercase transition-all shrink-0 ${activeTab === 'users' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                Юзеры
                            </button>
                            <button 
                                onClick={() => setActiveTab('promocodes')} 
                                className={`px-6 md:px-8 py-3 rounded-full text-[10px] md:text-xs font-black uppercase transition-all shrink-0 ${activeTab === 'promocodes' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                Промо
                            </button>
                            <button 
                                onClick={() => setActiveTab('reports')} 
                                className={`px-6 md:px-8 py-3 rounded-full text-[10px] md:text-xs font-black uppercase transition-all shrink-0 ${activeTab === 'reports' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-gray-500 hover:text-white hover:bg-white/5'} flex items-center gap-2`}
                            >
                                Жалобы {reports.length > 0 && <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* TAB CONTENT: PROMOCODES (With Duplicate Check & Updated Design) */}
            {activeTab === 'promocodes' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                    {/* GENERATOR CARD */}
                    <div className="lg:col-span-1 order-1">
                        <div className="bg-[#080808] border border-white/10 p-6 md:p-8 rounded-[2.5rem] sticky top-32 shadow-2xl relative overflow-hidden max-w-md mx-auto lg:max-w-none">
                            {/* Green glow effect */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                            
                            <h3 className="text-2xl font-black text-white mb-8 uppercase italic flex items-center gap-3">
                                <Plus className="text-green-500" size={24} /> Генератор
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-2">Название</label>
                                    <input 
                                        type="text" 
                                        value={newPromoCode} 
                                        onChange={(e) => setNewPromoCode(e.target.value)} 
                                        placeholder="FREE-DAY" 
                                        className="w-full bg-[#030303] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-green-500/50 uppercase font-mono tracking-widest transition-all" 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-2">Дни</label>
                                        <input 
                                            type="number" 
                                            value={newPromoDays} 
                                            onChange={(e) => setNewPromoDays(e.target.value)} 
                                            className="w-full bg-[#030303] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-green-500/50 text-center transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-2">Лимит</label>
                                        <input 
                                            type="number" 
                                            value={newPromoMaxActivations} 
                                            onChange={(e) => setNewPromoMaxActivations(e.target.value)} 
                                            className="w-full bg-[#030303] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-green-500/50 text-center transition-all" 
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={handleCreatePromo} 
                                    className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 mt-4"
                                >
                                    Записать в БД
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* LIST COLUMN */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 order-2">
                        {promocodes.map(promo => (
                            <div key={promo.id} className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-[2.5rem] relative group hover:border-white/20 transition-all">
                                <button 
                                    onClick={() => { if(confirm('Удалить?')) { const u = promocodes.filter(p => p.id !== promo.id); localStorage.setItem('pirat_promocodes', JSON.stringify(u)); setPromocodes(u); } }} 
                                    className="absolute top-6 right-6 text-gray-700 hover:text-red-500 transition-all bg-white/5 p-2 rounded-full"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <p className="text-xl md:text-2xl font-black text-white font-mono tracking-tighter mb-4">{promo.code}</p>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-xl">
                                        <span className="text-[10px] font-black uppercase text-gray-500">Награда</span>
                                        <span className="text-xs font-black uppercase text-blue-400">{promo.days} дн.</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-xl">
                                        <span className="text-[10px] font-black uppercase text-gray-500">Активации</span>
                                        <span className="text-xs font-black uppercase text-purple-400">{promo.currentActivations} / {promo.maxActivations}</span>
                                    </div>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full mt-6 overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: `${(promo.currentActivations / promo.maxActivations) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                        {promocodes.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/5 rounded-[3rem] border border-white/5 border-dashed">
                                <Ticket className="text-gray-700 w-12 h-12 mb-4" />
                                <p className="text-gray-500 font-bold">Промокодов пока нет</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: REPORTS */}
            {activeTab === 'reports' && (
                <div className="space-y-6">
                    {reports.length === 0 ? (
                        <div className="bg-white/5 border border-white/5 p-12 md:p-20 rounded-[3rem] text-center backdrop-blur-md">
                            <CheckCircle2 className="mx-auto text-gray-800 mb-6" size={64} />
                            <p className="text-gray-500 font-black uppercase tracking-widest italic">Жалоб не обнаружено</p>
                        </div>
                    ) : (
                        reports.map(rep => {
                            const u1 = allUsers.find(u => u.id === rep.reporterId);
                            const u2 = allUsers.find(u => u.id === rep.reportedId);
                            return (
                                <div key={rep.id} className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 backdrop-blur-md hover:border-white/20 transition-all">
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-500/20">{rep.reason}</span>
                                            <span className="text-[10px] text-gray-600 font-mono">{new Date(rep.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm md:text-lg text-white font-black mb-2 tracking-tighter flex items-center flex-wrap gap-2">
                                            От: <span className="text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">{u1?.username || 'Unknown'}</span> 
                                            <span className="text-gray-600">→</span> 
                                            На: <span className="text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">{u2?.username || 'Unknown'}</span>
                                        </p>
                                        <p className="text-xs md:text-sm text-gray-400 italic font-medium bg-white/5 p-3 rounded-xl mt-3">"{rep.description}"</p>
                                    </div>
                                    <div className="flex gap-3 shrink-0 w-full md:w-auto">
                                        <button onClick={() => setInspectChat({ u1: rep.reporterId, u2: rep.reportedId })} className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 text-white p-4 md:p-5 rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-2">
                                            <Eye size={20} /> <span className="md:hidden text-xs font-bold uppercase">Чат</span>
                                        </button>
                                        <button onClick={() => handleResolveReport(rep.id)} className="flex-[2] md:flex-none bg-white text-black px-6 md:px-8 py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-gray-200 transition-all shadow-xl">
                                            Разобрано
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
            
            {/* OTHER TABS (Staff, Users) */}
            {(activeTab === 'staff' || activeTab === 'users') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {(activeTab === 'staff' 
                        ? allUsers.filter(u => u.roles.some(r => [UserRole.OWNER, UserRole.ADMIN, UserRole.HELPER, UserRole.DEVELOPER].includes(r)))
                        : allUsers.filter(u => 
                            u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            u.id.toString().includes(searchTerm)
                        )
                    ).map(user => (
                        <div key={user.id} className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-[2.5rem] flex items-center gap-5 md:gap-6 relative overflow-hidden group hover:border-white/20 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gray-900 flex items-center justify-center font-black text-xl md:text-2xl border border-white/10 shrink-0 shadow-xl">
                                {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover rounded-2xl" /> : user.username[0]}
                            </div>
                            <div className="min-w-0 relative z-10 flex-1">
                                <h3 className="text-lg md:text-xl font-black text-white truncate mb-2">{user.username}</h3>
                                <div className="flex flex-wrap gap-1">
                                    <div className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg bg-gradient-to-r ${getRoleColors(user.roles[0])} text-white w-fit shadow-lg`}>
                                        {user.roles[0]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {activeTab === 'users' && (
                        <div className="col-span-full mb-6 order-first">
                             <div className="relative group max-w-md mx-auto">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input 
                                    type="text" 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    placeholder="Поиск по ID или Нику..." 
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-full py-4 pl-14 pr-6 text-white text-sm focus:outline-none focus:border-white/30 transition-all shadow-lg" 
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;