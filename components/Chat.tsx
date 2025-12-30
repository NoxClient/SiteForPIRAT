import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Message, Report } from '../types';
import { Send, X, User as UserIcon, MicOff, Image as ImageIcon, Globe, MessageCircle, MoreVertical, Trash2, Ban, AlertOctagon, Search, ChevronRight, Shield, Star, Info } from 'lucide-react';

interface ChatProps {
    currentUser: User;
    allUsers: User[]; 
}

const Chat: React.FC<ChatProps> = ({ currentUser, allUsers }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [dmUser, setDmUser] = useState<User | null>(null);
    const [attachment, setAttachment] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [inspectedUser, setInspectedUser] = useState<User | null>(null);
    const [reportData, setReportData] = useState({ reason: 'Спам', desc: '' });
    const [searchContact, setSearchContact] = useState('');
    
    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadMessages();
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'pirat_chat_messages' || e.key === 'pirat_users') loadMessages();
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, dmUser]);

    const loadMessages = () => {
        const stored = localStorage.getItem('pirat_chat_messages');
        if (stored) setMessages(JSON.parse(stored));
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() && !attachment) return;

        const users = JSON.parse(localStorage.getItem('pirat_users') || '[]');
        const updatedMe = users.find((u: User) => u.id === currentUser.id);
        
        if (updatedMe?.isMuted && updatedMe.muteUntil && updatedMe.muteUntil > Date.now()) return;
        
        if (dmUser && dmUser.id === currentUser.id) {
            alert("Вы не можете писать самому себе!");
            return;
        }

        const newMessage: Message = {
            id: Date.now(),
            senderId: currentUser.id,
            recipientId: dmUser ? dmUser.id : undefined,
            username: currentUser.username,
            roles: updatedMe?.roles || [UserRole.USER],
            text: inputValue.trim(),
            image: attachment || undefined,
            timestamp: Date.now()
        };

        if (dmUser) {
            const myIdx = users.findIndex((u: User) => u.id === currentUser.id);
            if (myIdx !== -1) {
                const contacts = users[myIdx].activeContactIds || [];
                if (!contacts.includes(dmUser.id)) {
                    users[myIdx].activeContactIds = [...contacts, dmUser.id];
                    localStorage.setItem('pirat_users', JSON.stringify(users));
                }
            }
        }

        const updatedMessages = [...messages, newMessage];
        localStorage.setItem('pirat_chat_messages', JSON.stringify(updatedMessages));
        setMessages(updatedMessages);
        setInputValue('');
        setAttachment(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAttachment(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUserClick = (userId: string | number) => {
        if (userId === 'system_pirat') return;
        const found = allUsers.find(u => u.id === userId);
        if (found) setInspectedUser(found);
    };

    const handleStartChat = (user: User) => {
        if (user.id === currentUser.id) {
            alert("Вы не можете начать чат с самим собой!");
            return;
        }
        setDmUser(user);
        setInspectedUser(null);
        
        // Ensure user is in contacts
        const users = JSON.parse(localStorage.getItem('pirat_users') || '[]');
        const myIdx = users.findIndex((u: User) => u.id === currentUser.id);
        if (myIdx !== -1) {
            const contacts = users[myIdx].activeContactIds || [];
            if (!contacts.includes(user.id)) {
                users[myIdx].activeContactIds = [...contacts, user.id];
                localStorage.setItem('pirat_users', JSON.stringify(users));
            }
        }
    };

    const handleDeleteChat = () => {
        if (!dmUser) return;
        const users = JSON.parse(localStorage.getItem('pirat_users') || '[]');
        const myIdx = users.findIndex((u: User) => u.id === currentUser.id);
        if (myIdx !== -1) {
            users[myIdx].activeContactIds = (users[myIdx].activeContactIds || []).filter((id: any) => id !== dmUser.id);
            localStorage.setItem('pirat_users', JSON.stringify(users));
            setDmUser(null);
        }
        setShowMenu(false);
    };

    const handleBlockUser = () => {
        if (!dmUser) return;
        const users = JSON.parse(localStorage.getItem('pirat_users') || '[]');
        const myIdx = users.findIndex((u: User) => u.id === currentUser.id);
        if (myIdx !== -1) {
            users[myIdx].blockedUserIds = [...(users[myIdx].blockedUserIds || []), dmUser.id];
            users[myIdx].activeContactIds = (users[myIdx].activeContactIds || []).filter((id: any) => id !== dmUser.id);
            localStorage.setItem('pirat_users', JSON.stringify(users));
            setDmUser(null);
        }
        setShowMenu(false);
    };

    const handleReportSubmit = () => {
        const targetId = inspectedUser?.id || dmUser?.id;
        if (!targetId) return;
        const reports: Report[] = JSON.parse(localStorage.getItem('pirat_reports') || '[]');
        const newReport: Report = {
            id: Math.random().toString(36).substr(2, 9),
            reporterId: currentUser.id,
            reportedId: targetId,
            reason: reportData.reason,
            description: reportData.desc,
            timestamp: Date.now(),
            status: 'pending'
        };
        localStorage.setItem('pirat_reports', JSON.stringify([...reports, newReport]));
        setShowReportModal(false);
        setInspectedUser(null);
        alert("Жалоба отправлена.");
    };

    const getRoleColors = (role: UserRole) => {
        switch (role) {
            case UserRole.OWNER: return 'from-red-900 to-red-600 border-red-500/50';
            case UserRole.ADMIN: return 'from-green-900 to-green-600 border-green-500/50';
            case UserRole.HELPER: return 'from-sky-900 to-sky-600 border-sky-500/50';
            case UserRole.DEVELOPER: return 'from-purple-900 to-purple-600 border-purple-500/50';
            case UserRole.VERIFIED: return 'animate-rgb border-white/20';
            case UserRole.WASTED: return 'bg-white text-black border-white';
            default: return 'from-gray-800 to-gray-600 border-gray-500/50';
        }
    };

    const meFull = allUsers.find(u => u.id === currentUser.id) || currentUser;
    const blockedIds = meFull.blockedUserIds || [];
    const activeIds = meFull.activeContactIds || [];

    const filteredMessages = messages.filter(m => {
        if (blockedIds.includes(m.senderId)) return false;
        if (!dmUser) return !m.recipientId;
        return (m.senderId === currentUser.id && m.recipientId === dmUser.id) ||
               (m.senderId === dmUser.id && m.recipientId === currentUser.id) ||
               (m.senderId === 'system_pirat' && m.recipientId === currentUser.id);
    });

    const contactUsers = allUsers.filter(u => activeIds.includes(u.id) && u.id !== currentUser.id);

    return (
        <div className="min-h-screen pt-20 md:ml-64 flex flex-col items-center justify-center relative overflow-hidden h-screen md:h-screen bg-black">
            
            {/* USER INFO MODAL */}
            {inspectedUser && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setInspectedUser(null)}></div>
                    <div className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
                        <button onClick={() => setInspectedUser(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={20} /></button>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-white/10 overflow-hidden mb-4 shadow-xl">
                                {inspectedUser.avatarUrl ? <img src={inspectedUser.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl font-black">{inspectedUser.username[0]}</div>}
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">{inspectedUser.username}</h3>
                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                {inspectedUser.roles.map((r, i) => (
                                    <div key={i} className={`bg-gradient-to-r ${getRoleColors(r)} border px-3 py-1 rounded-lg text-[10px] font-black uppercase text-white shadow-lg`}>
                                        {r}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="w-full space-y-3">
                                {inspectedUser.id !== currentUser.id && (
                                    <button 
                                        onClick={() => handleStartChat(inspectedUser)}
                                        className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
                                    >
                                        <MessageCircle size={18} /> Написать сообщение
                                    </button>
                                )}
                                <button 
                                    onClick={() => { setShowReportModal(true); }}
                                    className="w-full bg-white/5 border border-white/10 text-orange-500 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
                                >
                                    <AlertOctagon size={18} /> Пожаловаться
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* REPORT MODAL */}
            {showReportModal && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowReportModal(false)}></div>
                    <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest text-center">Тип нарушения</h3>
                        <div className="space-y-4">
                            <select 
                                value={reportData.reason}
                                onChange={(e) => setReportData({...reportData, reason: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none"
                            >
                                <option>Спам</option>
                                <option>Оскорбление</option>
                                <option>Скам / Подозрение</option>
                                <option>Другое</option>
                            </select>
                            <textarea 
                                value={reportData.desc}
                                onChange={(e) => setReportData({...reportData, desc: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none h-24 resize-none"
                                placeholder="Доп. информация..."
                            />
                            <button onClick={handleReportSubmit} className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl text-xs uppercase transition-all">Отправить жалобу</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-6xl h-full md:h-[85vh] bg-[#050505] border-x md:border border-white/5 md:rounded-[2.5rem] flex overflow-hidden shadow-2xl relative">
                
                {/* CONTACTS SIDEBAR */}
                <div className="w-20 md:w-80 border-r border-white/5 flex flex-col bg-black/20">
                    <div className="p-4 border-b border-white/5 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                            <input 
                                type="text" 
                                value={searchContact}
                                onChange={(e) => setSearchContact(e.target.value)}
                                placeholder="Поиск диалогов..." 
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-white/10"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <button 
                            onClick={() => setDmUser(null)}
                            className={`w-full p-4 flex items-center gap-4 transition-all hover:bg-white/5 ${!dmUser ? 'bg-white/10 border-r-4 border-blue-500' : ''}`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                                <Globe className="text-blue-500" size={20} />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-black text-white uppercase tracking-tighter">Общий чат</p>
                                <p className="text-[10px] text-gray-500">Глобальная лента</p>
                            </div>
                        </button>

                        <div className="px-6 py-4 text-[10px] font-black text-gray-700 uppercase tracking-widest hidden md:block mt-2">Ваши контакты</div>
                        
                        {contactUsers.map(user => (
                            <button 
                                key={user.id}
                                onClick={() => setDmUser(user)}
                                className={`w-full p-4 flex items-center gap-4 transition-all hover:bg-white/5 ${dmUser?.id === user.id ? 'bg-white/10 border-r-4 border-white' : ''}`}
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-800 shrink-0 border border-white/5 overflow-hidden shadow-md">
                                    {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black">{user.username[0]}</div>}
                                </div>
                                <div className="hidden md:block text-left truncate flex-1">
                                    <p className="text-sm font-black text-white">{user.username}</p>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{user.roles[0]}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* CHAT VIEW */}
                <div className="flex-1 flex flex-col relative bg-grid">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 bg-black/60 backdrop-blur-md flex justify-between items-center z-20">
                        <div className="flex items-center gap-4">
                            {!dmUser ? (
                                <>
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"><Globe className="text-blue-400" size={18} /></div>
                                    <h2 className="text-sm font-black text-white uppercase tracking-widest">PiRAT GLOBAL</h2>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden border border-white/10 cursor-pointer" onClick={() => handleUserClick(dmUser.id)}>
                                        {dmUser.avatarUrl ? <img src={dmUser.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-black">{dmUser.username[0]}</div>}
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-white flex items-center gap-2 cursor-pointer hover:underline" onClick={() => handleUserClick(dmUser.id)}>{dmUser.username} <Info size={12} className="text-gray-500" /></h2>
                                        <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded bg-gradient-to-r ${getRoleColors(dmUser.roles[0])} text-white w-fit`}>{dmUser.roles[0]}</div>
                                    </div>
                                </>
                            )}
                        </div>

                        {dmUser && dmUser.id !== 'system_pirat' && (
                            <div className="relative">
                                <button onClick={() => setShowMenu(!showMenu)} className="p-3 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5">
                                    <MoreVertical size={20} />
                                </button>
                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-[#0d0d0d] border border-white/10 rounded-3xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in duration-150">
                                        <button onClick={handleDeleteChat} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-black uppercase">
                                            <Trash2 size={14} /> Удалить чат
                                        </button>
                                        <button onClick={handleBlockUser} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-black uppercase">
                                            <Ban size={14} /> Заблокировать
                                        </button>
                                        <button onClick={() => { setShowReportModal(true); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-orange-500 hover:bg-orange-500/10 rounded-2xl transition-all border-t border-white/5 mt-2 pt-2 font-black uppercase">
                                            <AlertOctagon size={14} /> Пожаловаться
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 pb-24 no-scrollbar">
                        {filteredMessages.map((msg) => {
                            const isMe = msg.senderId === currentUser.id;
                            const isSystem = msg.isSystem;
                            const firstRole = msg.roles?.[0] || UserRole.USER;

                            return (
                                <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'} items-start animate-in slide-in-from-bottom-2 duration-300`}>
                                    {!isSystem && (
                                        <div 
                                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800 border-2 border-white/5 shrink-0 overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-lg"
                                            onClick={() => handleUserClick(msg.senderId)}
                                        >
                                            {allUsers.find(u => u.id === msg.senderId)?.avatarUrl ? <img src={allUsers.find(u => u.id === msg.senderId)?.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-sm">{msg.username[0]}</div>}
                                        </div>
                                    )}
                                    <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`flex items-center gap-2 mb-1.5 px-1`}>
                                            <span 
                                                className={`text-[10px] font-black uppercase tracking-widest cursor-pointer hover:underline ${isSystem ? 'text-red-500' : 'text-gray-400'}`}
                                                onClick={() => handleUserClick(msg.senderId)}
                                            >
                                                {msg.username}
                                            </span>
                                            {!isSystem && (
                                                <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-md bg-gradient-to-r ${getRoleColors(firstRole)} text-white shadow-sm`}>
                                                    {firstRole}
                                                </span>
                                            )}
                                        </div>
                                        <div className={`rounded-3xl p-4 shadow-xl ${isMe ? 'bg-white text-black font-medium' : isSystem ? 'bg-red-600/10 border border-red-500/20' : 'bg-[#121212] border border-white/5'}`}>
                                            {msg.image && <img src={msg.image} className="rounded-2xl mb-3 border border-black/10 max-h-72 object-cover w-full shadow-lg" />}
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                        <span className="text-[8px] mt-1.5 text-gray-700 px-2 uppercase font-black tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-10">
                        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3 items-end">
                            <div className="flex-1 bg-white/5 border border-white/5 rounded-[2rem] p-2 flex flex-col transition-all focus-within:border-white/20 backdrop-blur-md">
                                {attachment && (
                                    <div className="relative p-2 w-20">
                                        <img src={attachment} className="w-16 h-16 rounded-2xl object-cover shadow-xl" />
                                        <button type="button" onClick={() => setAttachment(null)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-lg"><X size={10} /></button>
                                    </div>
                                )}
                                <div className="flex items-center px-2">
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-500 hover:text-white transition-colors"><ImageIcon size={22} /></button>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                    <textarea 
                                        rows={1}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={dmUser?.id === 'system_pirat' ? "Нельзя ответить системе" : "Ваше сообщение..."}
                                        disabled={dmUser?.id === 'system_pirat'}
                                        className="flex-1 bg-transparent border-none focus:outline-none py-4 px-3 text-sm text-white resize-none no-scrollbar"
                                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as any); } }}
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit"
                                disabled={(!inputValue.trim() && !attachment) || dmUser?.id === 'system_pirat'}
                                className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-all disabled:opacity-30 active:scale-95 shadow-2xl"
                            >
                                <Send size={24} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;