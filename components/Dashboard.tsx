import React, { useState, useEffect } from 'react';
import { User, ViewState } from '../types';
import { Monitor, Smartphone, Check, ArrowLeft, CreditCard, Copy, Bitcoin, Wallet, ShieldCheck, Zap, Activity, Globe, Shield, Lock } from 'lucide-react';

interface DashboardProps {
    currentUser: User;
}

type Step = 'select-product' | 'select-plan' | 'payment';
type ProductType = 'pc' | 'mobile';

interface Plan {
  id: string;
  duration: string;
  price: number;
  label: string;
  isBest?: boolean;
}

const plans: Plan[] = [
  { id: '3d', duration: '3 Days', price: 15, label: 'Starter' },
  { id: '7d', duration: '7 Days', price: 30, label: 'Week' },
  { id: '30d', duration: '30 Days', price: 80, label: 'Month' },
  { id: '90d', duration: '90 Days', price: 200, label: 'Season' },
  { id: 'forever', duration: 'Forever', price: 500, label: 'Lifetime', isBest: true },
];

const cryptoWallets = {
    BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ETH: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    USDT: 'TE71C7656EC7ab88b098defB751B7401B5f'
};

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
    const [step, setStep] = useState<Step>('select-product');
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'USDT'>('BTC');
    const [copied, setCopied] = useState(false);

    const hasActiveSubscription = currentUser.subscriptionDays > 0;

    const handleProductSelect = (prod: ProductType) => {
        setSelectedProduct(prod);
        setStep('select-plan');
    };

    const handlePlanSelect = (plan: Plan) => {
        setSelectedPlan(plan);
        setStep('payment');
    };

    const handleBack = () => {
        if (step === 'payment') setStep('select-plan');
        if (step === 'select-plan') setStep('select-product');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cryptoWallets[selectedCrypto]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ACTIVE PANEL VIEW
    if (hasActiveSubscription) {
        return (
            <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:ml-64 max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center animate-pulse border border-white/20">
                            <Zap className="text-yellow-400 w-10 h-10 fill-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white uppercase italic">Active License</h1>
                            <p className="text-gray-300 font-medium text-sm md:text-base">Ваша подписка активна. Доступ ко всем функциям разблокирован.</p>
                        </div>
                    </div>
                    <div className="bg-black/60 px-8 py-4 rounded-2xl border border-white/10 text-center w-full md:w-auto">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Осталось дней</p>
                        <p className="text-3xl font-black text-white">{currentUser.subscriptionDays}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group">
                        <Activity className="text-blue-400 mb-6 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-xl font-black text-white mb-2">Статистика</h3>
                        <p className="text-gray-500 text-sm">Мониторинг подключений в реальном времени.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group">
                        <Globe className="text-purple-400 mb-6 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-xl font-black text-white mb-2">Сеть</h3>
                        <p className="text-gray-500 text-sm">Управление портами и защищенным прокси.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group">
                        <Shield className="text-green-400 mb-6 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-xl font-black text-white mb-2">Безопасность</h3>
                        <p className="text-gray-500 text-sm">Шифрование трафика и анти-анализ.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group">
                        <Lock className="text-red-400 mb-6 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-xl font-black text-white mb-2">Логи</h3>
                        <p className="text-gray-500 text-sm">История действий и перехваченных данных.</p>
                    </div>
                </div>
            </div>
        );
    }

    // PURCHASE VIEW
    if (step === 'select-product') {
        return (
            <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:ml-64 flex flex-col items-center justify-center relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase italic tracking-tighter">Выберите версию</h1>
                    <p className="text-gray-400 text-sm md:text-lg px-6 max-w-2xl mx-auto">Для активации панели управления PiRAT необходимо приобрести лицензию или активировать промокод.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl">
                    <button onClick={() => handleProductSelect('pc')} className="group relative bg-gradient-to-b from-white/[0.08] to-black border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-left hover:border-blue-500/50 transition-all shadow-2xl">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-3xl md:text-4xl font-black text-white mb-2 italic">PiRAT <span className="text-blue-500">PC</span></h3>
                                <p className="text-gray-500 font-black tracking-widest text-[10px]">WINDOWS & MACOS SECURITY</p>
                            </div>
                            <div className="bg-blue-500/10 p-4 rounded-full group-hover:bg-blue-500/20 transition-colors border border-blue-500/20 shrink-0"><Monitor className="w-8 h-8 md:w-10 md:h-10 text-blue-500" /></div>
                        </div>
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center text-gray-400 text-xs md:text-sm"><Check className="w-5 h-5 mr-3 text-blue-500" /> Remote Desktop Access</div>
                            <div className="flex items-center text-gray-400 text-xs md:text-sm"><Check className="w-5 h-5 mr-3 text-blue-500" /> Advanced Keylogger Suite</div>
                            <div className="flex items-center text-gray-400 text-xs md:text-sm"><Check className="w-5 h-5 mr-3 text-blue-500" /> System File Manager</div>
                        </div>
                        <div className="flex items-center text-blue-400 font-black uppercase text-xs tracking-widest group-hover:translate-x-2 transition-transform">Выбрать тариф <ArrowLeft className="w-5 h-5 ml-2 rotate-180" /></div>
                    </button>

                    <button onClick={() => handleProductSelect('mobile')} className="group relative bg-gradient-to-b from-white/[0.08] to-black border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-left hover:border-purple-500/50 transition-all shadow-2xl">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-3xl md:text-4xl font-black text-white mb-2 italic">PiRAT <span className="text-purple-500">Mobile</span></h3>
                                <p className="text-gray-500 font-black tracking-widest text-[10px]">ANDROID & IOS ANALYTICS</p>
                            </div>
                            <div className="bg-purple-500/10 p-4 rounded-full group-hover:bg-purple-500/20 transition-colors border border-purple-500/20 shrink-0"><Smartphone className="w-8 h-8 md:w-10 md:h-10 text-purple-500" /></div>
                        </div>
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center text-gray-400 text-xs md:text-sm"><Check className="w-5 h-5 mr-3 text-purple-500" /> Precise GPS Geolocation</div>
                            <div className="flex items-center text-gray-400 text-xs md:text-sm"><Check className="w-5 h-5 mr-3 text-purple-500" /> Social Apps Mirroring</div>
                            <div className="flex items-center text-gray-400 text-xs md:text-sm"><Check className="w-5 h-5 mr-3 text-purple-500" /> Live Media Interception</div>
                        </div>
                        <div className="flex items-center text-purple-400 font-black uppercase text-xs tracking-widest group-hover:translate-x-2 transition-transform">Выбрать тариф <ArrowLeft className="w-5 h-5 ml-2 rotate-180" /></div>
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'select-plan') {
        const accentColor = selectedProduct === 'pc' ? 'blue' : 'purple';
        return (
            <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:ml-64 max-w-7xl mx-auto relative z-10">
                <button onClick={handleBack} className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors uppercase font-black text-xs tracking-widest"><ArrowLeft className="w-5 h-5 mr-2" /> Назад</button>
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tighter">Тарифы <span className={`italic text-${accentColor}-500`}>{selectedProduct}</span></h2>
                    <p className="text-gray-400 font-medium">Выберите подходящий срок действия лицензии</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {plans.map((plan) => (
                        <div key={plan.id} onClick={() => handlePlanSelect(plan)} className={`relative bg-white/5 border rounded-3xl p-6 cursor-pointer transition-all hover:-translate-y-2 group ${plan.isBest ? `border-${accentColor}-500/50 bg-${accentColor}-500/5` : 'border-white/10'}`}>
                            {plan.isBest && <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-${accentColor}-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase`}>Best Value</div>}
                            <div className="text-center">
                                <h3 className="text-gray-500 text-[10px] font-black uppercase mb-2 tracking-widest">{plan.label}</h3>
                                <div className="text-2xl font-black text-white mb-1">{plan.duration}</div>
                                <div className={`text-xl font-black text-${accentColor}-500 mb-6`}>${plan.price}</div>
                                <button className={`w-full py-3 rounded-xl text-[10px] font-black uppercase transition-all ${plan.isBest ? `bg-${accentColor}-500 text-white shadow-lg shadow-${accentColor}-500/20` : 'bg-white/10 text-white hover:bg-white/20'}`}>Выбрать</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (step === 'payment' && selectedPlan) {
        return (
            <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:ml-64 max-w-3xl mx-auto relative z-10 flex items-center justify-center">
                <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="bg-white/5 p-6 border-b border-white/5 flex items-center justify-between">
                        <button onClick={handleBack} className="flex items-center text-gray-400 hover:text-white transition-colors uppercase font-black text-xs tracking-widest"><ArrowLeft className="w-5 h-5 mr-2" /> Назад</button>
                        <h2 className="text-sm md:text-lg font-black text-white flex items-center uppercase tracking-tighter"><ShieldCheck className="w-5 h-5 mr-2 text-green-500" /> Оплата счета</h2>
                        <div className="w-8"></div>
                    </div>
                    <div className="p-6 md:p-10">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white/5 p-6 rounded-3xl border border-white/5 gap-4">
                            <div className="text-center sm:text-left">
                                <p className="text-gray-500 text-[10px] mb-1 uppercase font-black tracking-widest">Лицензия</p>
                                <h3 className="text-2xl font-black text-white uppercase italic">PiRAT {selectedProduct}</h3>
                                <p className="text-blue-400 font-bold text-sm">{selectedPlan.duration} Access</p>
                            </div>
                            <div className="text-center sm:text-right">
                                <p className="text-gray-500 text-[10px] mb-1 uppercase font-black tracking-widest">К оплате</p>
                                <h3 className="text-4xl font-black text-white">${selectedPlan.price}</h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {(['BTC', 'ETH', 'USDT'] as const).map((crypto) => (
                                <button key={crypto} onClick={() => setSelectedCrypto(crypto)} className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all ${selectedCrypto === crypto ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}>
                                    <span className="font-black text-sm uppercase tracking-widest">{crypto}</span>
                                </button>
                            ))}
                        </div>
                        <div className="bg-black rounded-3xl p-8 border border-white/10 text-center">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-white mx-auto rounded-2xl mb-6 p-3 shadow-xl shadow-black/50"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${cryptoWallets[selectedCrypto]}`} alt="QR Code" className="w-full h-full" /></div>
                            <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/10">
                                <div className="truncate text-gray-400 font-mono text-[10px] mr-2 text-left select-all w-full">{cryptoWallets[selectedCrypto]}</div>
                                <button onClick={copyToClipboard} className="bg-white text-black p-2.5 rounded-xl shrink-0 transition-transform active:scale-90">{copied ? <Check size={18} /> : <Copy size={18} />}</button>
                            </div>
                        </div>
                        <button className="w-full mt-8 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-sm shadow-xl shadow-green-900/20 active:scale-[0.98] transition-all">Я оплатил ${selectedPlan.price}</button>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default Dashboard;