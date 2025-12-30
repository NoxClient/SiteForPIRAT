import React, { useState } from 'react';
import { User, UserRole, AppSettings } from '../types';
import { Check, User as UserIcon, Lock, Settings, ShieldAlert, Palette, Snowflake, AlertCircle, Shield, ShieldCheck, Award, Star, AlertTriangle, Cpu, Fingerprint, Info, Code, CheckCircle2, Skull, Send as SendIcon } from 'lucide-react';

interface ProfileProps {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
    appSettings: AppSettings;
    onUpdateSettings: (settings: AppSettings) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, appSettings, onUpdateSettings }) => {
    const [activeSection, setActiveSection] = useState<'general' | 'security' | 'settings'>('general');
    const [formData, setFormData] = useState({
        bio: user.bio || '',
        telegramId: user.telegramId || '',
        avatarUrl: user.avatarUrl || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage(null);
    };

    const handleGeneralSave = () => {
        if (user.isInfoLocked) {
             setMessage({ type: 'error', text: 'Редактирование профиля запрещено.' });
             return;
        }

        const updatedUser = {
            ...user,
            bio: formData.bio,
            avatarUrl: user.isPhotoLocked ? user.avatarUrl : formData.avatarUrl
        };

        setMessage({ type: 'success', text: 'Профиль успешно обновлен' });
        updateUserInDb(updatedUser);
    };

    const handleSecuritySave = () => {
        let updatedUser = { ...user, telegramId: formData.telegramId };
        let updated = false;

        if (formData.telegramId !== user.telegramId) {
            updated = true;
        }

        if (formData.newPassword) {
             if (!formData.currentPassword || !formData.confirmPassword) {
                setMessage({ type: 'error', text: 'Заполните все поля пароля' });
                return;
            }
            
            if (formData.currentPassword !== user.password) {
                setMessage({ type: 'error', text: 'Текущий пароль неверен' });
                return;
            }

            if (formData.newPassword.length < 8) {
                 setMessage({ type: 'error', text: 'Минимум 8 символов' });
                 return;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'Пароли не совпадают' });
                return;
            }
            
            updatedUser.password = formData.newPassword;
            updated = true;
        }

        if (updated) {
            updateUserInDb(updatedUser);
            setMessage({ type: 'success', text: 'Данные безопасности обновлены' });
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } else {
             setMessage({ type: 'error', text: 'Нет изменений для сохранения' });
        }
    };

    const updateUserInDb = (updated: User) => {
        const users = JSON.parse(localStorage.getItem('pirat_users') || '[]');
        const userIndex = users.findIndex((u: User) => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = updated;
            localStorage.setItem('pirat_users', JSON.stringify(users));
            onUpdateUser(updated);
        }
    };

    const getRoleColors = (role: UserRole) => {
        switch (role) {
            case UserRole.OWNER: return 'from-red-900 to-red-600 border-red-500/50';
            case UserRole.ADMIN: return 'from-green-900 to-green-600 border-green-500/50';
            case UserRole.HELPER: return 'from-sky-900 to-sky-600 border-sky-500/50';
            case UserRole.LOGER: return 'from-lime-900 to-lime-600 border-lime-500/50';
            case UserRole.DEVELOPER: return 'from-purple-900 to-purple-600 border-purple-500/50';
            case UserRole.VERIFIED: return 'animate-rgb border-white/20';
            case UserRole.WASTED: return 'bg-white text-black line-through decoration-red-600 decoration-2 border-white';
            case UserRole.MINUS_REP: return 'from-blue-900 to-blue-600 border-blue-500/50';
            case UserRole.PLUS_REP: return 'from-red-900 to-red-600 border-red-500/50';
            case UserRole.SCAM: return 'from-red-900 to-red-800 border-red-600';
            default: return 'from-gray-800 to-gray-600 border-gray-500/50';
        }
    };

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case UserRole.OWNER: return <ShieldAlert size={14} />;
            case UserRole.ADMIN: return <ShieldCheck size={14} />;
            case UserRole.HELPER: return <Award size={14} />;
            case UserRole.LOGER: return <Cpu size={14} />;
            case UserRole.DEVELOPER: return <Code size={14} />;
            case UserRole.VERIFIED: return <CheckCircle2 size={14} />;
            case UserRole.WASTED: return <Skull size={14} />;
            case UserRole.PLUS_REP: return <Star size={14} className="fill-white" />;
            case UserRole.MINUS_REP: return <Star size={14} />;
            case UserRole.SCAM: return <AlertTriangle size={14} />;
            default: return <UserIcon size={14} />;
        }
    };

    return (
        <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:ml-64 max-w-5xl mx-auto relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-8 px-2">Настройки</h1>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
                {/* NAVIGATION SIDEBAR */}
                <div className="w-full lg:w-64 flex-shrink-0 sticky top-24 lg:top-32 z-30 h-fit">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 no-scrollbar shadow-2xl">
                        <button 
                            onClick={() => setActiveSection('general')} 
                            className={`group relative flex-1 lg:w-full flex items-center justify-center lg:justify-start p-4 rounded-2xl transition-all shrink-0 ${activeSection === 'general' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
                        >
                            <UserIcon size={20} className="lg:mr-3" /> <span className="hidden lg:inline">Основное</span>
                            <span className="absolute left-1/2 -translate-x-1/2 -bottom-10 lg:left-full lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-4 bg-black border border-white/20 text-white text-[10px] px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 font-bold tracking-wider shadow-xl">
                                Основное
                            </span>
                        </button>
                        <button 
                            onClick={() => setActiveSection('security')} 
                            className={`group relative flex-1 lg:w-full flex items-center justify-center lg:justify-start p-4 rounded-2xl transition-all shrink-0 ${activeSection === 'security' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
                        >
                            <Lock size={20} className="lg:mr-3" /> <span className="hidden lg:inline">Безопасность</span>
                            <span className="absolute left-1/2 -translate-x-1/2 -bottom-10 lg:left-full lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-4 bg-black border border-white/20 text-white text-[10px] px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 font-bold tracking-wider shadow-xl">
                                Безопасность
                            </span>
                        </button>
                        <button 
                            onClick={() => setActiveSection('settings')} 
                            className={`group relative flex-1 lg:w-full flex items-center justify-center lg:justify-start p-4 rounded-2xl transition-all shrink-0 ${activeSection === 'settings' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
                        >
                            <Settings size={20} className="lg:mr-3" /> <span className="hidden lg:inline">Визуал</span>
                            <span className="absolute left-1/2 -translate-x-1/2 -bottom-10 lg:left-full lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-4 bg-black border border-white/20 text-white text-[10px] px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 font-bold tracking-wider shadow-xl">
                                Визуал
                            </span>
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden min-h-[500px]">
                    {message && (
                        <div className={`mb-6 p-4 rounded-2xl flex items-center border text-sm animate-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            {message.type === 'success' ? <Check size={18} className="mr-2 shrink-0" /> : <AlertCircle size={18} className="mr-2 shrink-0" />}
                            {message.text}
                        </div>
                    )}

                    {activeSection === 'general' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
                                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-4 border-white/5 overflow-hidden shadow-2xl shrink-0">
                                     {formData.avatarUrl ? <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-4xl font-black">{user.username[0].toUpperCase()}</span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-2xl font-black text-white mb-2 truncate">{user.username}</h3>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                        {user.roles.map((role, idx) => (
                                            <div key={idx} className={`bg-gradient-to-r ${getRoleColors(role)} border rounded-lg px-2.5 py-1 flex items-center gap-2 shadow-lg`}>
                                                <div className={`${role === UserRole.WASTED ? 'text-black' : 'text-white'}`}>{getRoleIcon(role)}</div>
                                                <span className={`text-[10px] font-black uppercase tracking-tighter ${role === UserRole.WASTED ? 'text-black' : 'text-white'}`}>{role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-4 flex items-center gap-1.5">
                                            <Fingerprint size={12} className="text-gray-600" /> ID пользователя
                                        </label>
                                        <div className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-white font-mono text-sm opacity-60">
                                            {user.id}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-4 flex items-center gap-1.5">
                                        <Palette size={12} className="text-gray-600" /> Аватар URL
                                    </label>
                                    <input type="text" name="avatarUrl" value={formData.avatarUrl} onChange={handleInputChange} disabled={user.isPhotoLocked} className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/20 disabled:opacity-50 transition-colors" placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-4 flex items-center gap-1.5">
                                        <Info size={12} className="text-gray-600" /> О себе
                                    </label>
                                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} disabled={user.isInfoLocked} rows={3} className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white resize-none text-sm focus:outline-none focus:border-white/20 disabled:opacity-50 transition-colors" placeholder="Расскажите немного о себе..." />
                                </div>
                            </div>

                            <div className="group relative w-full sm:w-auto inline-block">
                                <button onClick={handleGeneralSave} className="w-full sm:w-auto bg-white text-black px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-xl">
                                    Сохранить изменения
                                </button>
                                <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                    Сохранить профиль
                                </span>
                            </div>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="bg-black/20 rounded-2xl p-6 border border-white/10 space-y-4">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><SendIcon size={12} /> Контакты</h3>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Telegram ID</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                                        <input 
                                            type="text" 
                                            name="telegramId" 
                                            value={formData.telegramId} 
                                            onChange={handleInputChange} 
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-8 pr-6 py-4 text-white text-sm focus:outline-none focus:border-white/20 transition-colors" 
                                            placeholder="username" 
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-600 mt-2 ml-2">Используется для восстановления доступа и уведомлений.</p>
                                </div>
                            </div>

                            <div className="bg-black/20 rounded-2xl p-6 border border-white/10 space-y-4">
                                 <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Shield size={12} /> Смена пароля</h3>
                                 <div className="space-y-4">
                                     <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/20 transition-colors" placeholder="Текущий пароль" />
                                     <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/20 transition-colors" placeholder="Новый пароль" />
                                     <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/20 transition-colors" placeholder="Повторите пароль" />
                                 </div>
                            </div>

                            <div className="group relative w-full sm:w-auto inline-block">
                                <button onClick={handleSecuritySave} className="w-full sm:w-auto bg-white text-black px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl active:scale-95">
                                    Обновить данные
                                </button>
                                <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                    Сохранить безопасность
                                </span>
                            </div>
                        </div>
                    )}

                    {activeSection === 'settings' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-black/20 rounded-3xl p-6 md:p-8 border border-white/10">
                                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                                    <Settings className="text-blue-500" /> Интерфейс
                                </h3>
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                                                <Snowflake className="text-sky-400" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-gray-200 font-bold">Снег на экране</p>
                                                <p className="text-xs text-gray-500">Добавляет эффект падающих частиц</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => onUpdateSettings({...appSettings, enableSnow: !appSettings.enableSnow})} 
                                            className={`w-14 h-7 rounded-full transition-all relative ${appSettings.enableSnow ? 'bg-blue-600' : 'bg-gray-700'}`}
                                            title="Переключить снег"
                                        >
                                            <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${appSettings.enableSnow ? 'translate-x-7' : ''}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                                                <Palette className="text-purple-400" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-gray-200 font-bold">След от мыши</p>
                                                <p className="text-xs text-gray-500">Красивый эффект движения курсора</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => onUpdateSettings({...appSettings, enableMouseTrail: !appSettings.enableMouseTrail})} 
                                            className={`w-14 h-7 rounded-full transition-all relative ${appSettings.enableMouseTrail ? 'bg-blue-600' : 'bg-gray-700'}`}
                                            title="Переключить след"
                                        >
                                            <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${appSettings.enableMouseTrail ? 'translate-x-7' : ''}`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;