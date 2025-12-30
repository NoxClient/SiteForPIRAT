
import React, { useState, useEffect } from 'react';
import { User, Promocode } from '../types';
import { Gift, Copy, Check, Ticket, Star, Users, ArrowRight } from 'lucide-react';

interface ReferralProps {
    currentUser: User;
    onUpdateUser: (u: User) => void;
}

const Referrals: React.FC<ReferralProps> = ({ currentUser, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState<'promocode' | 'referral'>('promocode');
    const [promoInput, setPromoInput] = useState('');
    const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUser.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const updateUserInDb = (updated: User) => {
        const users = JSON.parse(localStorage.getItem('pirat_users') || '[]');
        const idx = users.findIndex((u: User) => u.id === currentUser.id);
        if (idx !== -1) {
            users[idx] = updated;
            localStorage.setItem('pirat_users', JSON.stringify(users));
        }
        onUpdateUser(updated);
    };

    const handleActivate = () => {
        if (!promoInput.trim()) return;
        setMessage(null);

        const globalPromos: Promocode[] = JSON.parse(localStorage.getItem('pirat_promocodes') || '[]');
        const promoIdx = globalPromos.findIndex(p => p.code.toUpperCase() === promoInput.toUpperCase());

        if (promoIdx !== -1) {
            const foundPromo = globalPromos[promoIdx];
            
            // Check if activations left
            if (foundPromo.currentActivations >= foundPromo.maxActivations) {
                setMessage({ text: 'Этот промокод исчерпал лимит активаций', type: 'error' });
                return;
            }

            // Update user subscription
            const updatedUser = { ...currentUser, subscriptionDays: currentUser.subscriptionDays + foundPromo.days };
            updateUserInDb(updatedUser);

            // Update promo activation count
            foundPromo.currentActivations += 1;
            
            let newPromos;
            if (foundPromo.currentActivations >= foundPromo.maxActivations) {
                // Remove if limit reached
                newPromos = globalPromos.filter((_, i) => i !== promoIdx);
            } else {
                // Update the count in the list
                newPromos = [...globalPromos];
                newPromos[promoIdx] = foundPromo;
            }
            
            localStorage.setItem('pirat_promocodes', JSON.stringify(newPromos));
            
            setMessage({ text: `Успех! Получено +${foundPromo.days} дн. подписки`, type: 'success' });
            setPromoInput('');
        } else if (promoInput === 'FREE3DAY') {
             // Hardcoded legacy support
             const updated = { ...currentUser, subscriptionDays: currentUser.subscriptionDays + 3 };
             updateUserInDb(updated);
             setMessage({ text: 'Активирован бонусный код: +3 дня!', type: 'success' });
             setPromoInput('');
        } else {
             setMessage({ text: 'Неверный или несуществующий промокод', type: 'error' });
        }
    };

    const referralTiers = [
        { count: 1, days: 1, label: 'Новичок' },
        { count: 5, days: 3, label: 'Активный' },
        { count: 10, days: 7, label: 'Пригласитель' },
        { count: 30, days: 30, label: 'Партнер' },
        { count: 90, days: 90, label: 'Амбассадор' },
    ];

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:ml-64 max-w-5xl mx-auto relative z-10 overflow-x-hidden">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tighter">Бонусная система</h1>
                    <p className="text-gray-400 text-sm md:text-base">Управляйте подпиской через коды и приглашения</p>
                </div>
                {/* Centered Pill Tab */}
                <div className="bg-white/5 p-1.5 rounded-full border border-white/10 flex gap-1 shrink-0 overflow-x-auto max-w-full">
                    <button onClick={() => setActiveTab('promocode')} className={`px-6 py-2.5 rounded-full text-xs font-black uppercase transition-all ${activeTab === 'promocode' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-500 hover:text-white'}`}>Промокод</button>
                    <button onClick={() => setActiveTab('referral')} className={`px-6 py-2.5 rounded-full text-xs font-black uppercase transition-all ${activeTab === 'referral' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-500 hover:text-white'}`}>Рефералы</button>
                </div>
            </div>

            {activeTab === 'promocode' ? (
                <div className="max-w-xl mx-auto">
                    <div className="bg-[#080808] border border-blue-500/20 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
                        
                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                <Ticket className="text-blue-400 w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">Активация лицензии</h2>
                            <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm">Введите полученный промокод ниже для мгновенного продления подписки.</p>
                            
                            <div className="w-full space-y-4">
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        value={promoInput}
                                        onChange={(e) => setPromoInput(e.target.value)}
                                        placeholder="XXXX-XXXX-XXXX"
                                        className="w-full bg-[#030303] border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-blue-500/50 text-center font-mono text-lg md:text-xl tracking-[0.2em] uppercase transition-all"
                                    />
                                    {message && (
                                        <div className={`mt-4 p-4 rounded-xl text-xs md:text-sm font-bold border animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                            {message.text}
                                        </div>
                                    )}
                                </div>
                                <button onClick={handleActivate} className="w-full bg-white text-black font-black py-5 rounded-2xl text-xs md:text-sm uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl">
                                    Активировать сейчас <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#080808] border border-purple-500/20 p-8 rounded-[2rem] relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full"></div>
                             <Gift className="text-purple-400 w-10 h-10 mb-4" />
                             <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Ваш код</h3>
                             <p className="text-gray-500 text-sm mb-6 font-medium">Приглашайте друзей и получайте дни подписки автоматически при достижении целей.</p>
                             
                             <div className="flex flex-col sm:flex-row items-center gap-2 bg-black/40 border border-white/10 p-2.5 rounded-xl mb-4">
                                 <code className="w-full sm:flex-1 text-center font-mono text-lg md:text-xl text-purple-200 tracking-widest font-black uppercase py-2">{currentUser.referralCode}</code>
                                 <button onClick={handleCopy} className="w-full sm:w-auto p-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-all active:scale-90 flex justify-center">
                                     {copied ? <Check size={20} /> : <Copy size={20} />}
                                 </button>
                             </div>
                             <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center text-xs font-black uppercase text-gray-400 mb-1">
                                    <span>Ваши рефералы</span>
                                    <span className="text-purple-400">{currentUser.referralCount || 0} чел.</span>
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8">
                        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3"><Star className="text-yellow-500" /> Награды за приглашения</h3>
                        <div className="space-y-4">
                            {referralTiers.map((tier) => (
                                <div key={tier.count} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all gap-4 ${ (currentUser.referralCount || 0) >= tier.count ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/5'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black shrink-0 ${ (currentUser.referralCount || 0) >= tier.count ? 'bg-green-500 text-black' : 'bg-white/10 text-white'}`}>
                                            {tier.count}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm md:text-base">{tier.label}</p>
                                            <p className="text-xs text-gray-500 font-medium">Требуется рефералов: {tier.count}</p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right pl-16 sm:pl-0">
                                        <p className={`text-lg font-black ${ (currentUser.referralCount || 0) >= tier.count ? 'text-green-400' : 'text-gray-400'}`}>+{tier.days} дн.</p>
                                        {(currentUser.referralCount || 0) >= tier.count ? (
                                            <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1 justify-start sm:justify-end"><Check size={10} /> Получено</span>
                                        ) : (
                                            <span className="text-[10px] font-black text-gray-600 uppercase">В процессе</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Referrals;
