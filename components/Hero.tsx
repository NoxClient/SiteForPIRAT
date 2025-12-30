
import React from 'react';
import { Monitor, Smartphone, ShieldCheck, PlayCircle, Check, ShoppingCart, Cpu, Wifi } from 'lucide-react';
import { User, ViewState } from '../types';

interface HeroProps {
    currentUser: User | null;
    onShowAlert: (msg: string) => void;
    onNavigate: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ currentUser, onShowAlert, onNavigate }) => {

  const handleBuyClick = () => {
      if (currentUser) {
          onNavigate(ViewState.DASHBOARD);
      } else {
          onShowAlert('Для покупки необходимо авторизоваться!');
      }
  };

  return (
    <div className="relative pt-16 md:pt-20 min-h-screen flex flex-col items-center justify-start overflow-hidden pb-20">
      <div className="absolute inset-0 bg-grid z-0 pointer-events-none opacity-50"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[1000px] h-[300px] md:h-[500px] bg-purple-900/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center mt-12 md:mt-20">
        
        <div className="flex items-center justify-center space-x-1 md:space-x-4 mb-8 select-none scale-75 sm:scale-90 md:scale-100">
          {['P', 'i', 'R', 'A', 'T'].map((char, index) => (
            <span 
              key={index}
              className={`text-6xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 animate-glow inline-block hover:to-white transition-all cursor-default animate-bounce`}
              style={{ animationDuration: '3s', animationDelay: `${index * 150}ms` }}
            >
              {char}
            </span>
          ))}
        </div>

        <div id="about" className="backdrop-blur-sm bg-black/30 p-6 md:p-8 rounded-3xl border border-white/5 mb-16 max-w-3xl scroll-mt-32 w-full">
          <p className="text-lg md:text-2xl text-gray-300 text-center leading-relaxed">
            Профессиональные <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-xl">RAT</span> решения для мониторинга.
            <br className="hidden md:block" />
            Безопасность, анонимность и полный контроль.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-24">
          <div className="group relative bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="p-4 bg-white/5 rounded-full mb-6 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-black/50">
                <Monitor className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black italic text-white mb-2 tracking-wide">PC</h3>
              <p className="text-gray-500 font-medium">Windows & MacOS</p>
            </div>
          </div>

          <div className="group relative bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="p-4 bg-white/5 rounded-full mb-6 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-black/50">
                <Smartphone className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black italic text-white mb-2 tracking-wide">MOBILE</h3>
              <p className="text-gray-500 font-medium">Android & iOS</p>
            </div>
          </div>

           <div className="group relative bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="p-4 bg-white/5 rounded-full mb-6 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-black/50">
                <ShieldCheck className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black italic text-white mb-2 tracking-wide">SECURE</h3>
              <p className="text-gray-500 font-medium">Encrypted & Safe</p>
            </div>
          </div>
        </div>

        <div id="video" className="w-full max-w-5xl mb-32 scroll-mt-32">
            <div className="relative w-full aspect-video bg-gray-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] group cursor-pointer transition-transform hover:scale-[1.01] duration-500">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-500">
                    <PlayCircle className="w-16 h-16 md:w-24 md:h-24 text-white/80 group-hover:text-white relative z-10 transition-all duration-300 transform group-hover:scale-110" />
                    <p className="text-white/80 font-bold mt-4 md:mt-6 text-sm md:text-xl tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">Запустить демо</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <h3 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">Демонстрация работы</h3>
                    <p className="text-gray-300 text-sm md:text-lg">Обзор функционала v2.0</p>
                </div>
            </div>
        </div>

        <div id="products" className="w-full max-w-7xl px-2 mb-24 scroll-mt-32">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Магазин лицензий</h2>
                <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-b from-white/[0.08] to-black border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 hover:border-blue-500/50 transition-all duration-500 group relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="inline-block bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full text-xs font-bold mb-6 border border-blue-500/30">
                            DESKTOP VERSION
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-white mb-4">PiRAT <span className="text-blue-500">PC</span></h3>
                        <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-md">
                            Полный контроль над Windows, MacOS и Linux системами. Скрытый доступ, кейлоггер, управление файлами и веб-камерой.
                        </p>
                        
                        <div className="space-y-4 mb-10">
                            {['Полная невидимость (FUD)', 'Remote Desktop Control', 'File Manager Access', 'Keylogger & Recovery'].map((feature, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="bg-blue-500 rounded-full p-1 shrink-0"><Check className="w-3 h-3 text-black" strokeWidth={4} /></div>
                                    <span className="text-gray-300 text-sm md:text-base font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Lifetime License</p>
                                <p className="text-3xl md:text-4xl font-black text-white">$149</p>
                            </div>
                            <button onClick={handleBuyClick} className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all">
                                <ShoppingCart className="w-5 h-5" />
                                <span>Купить</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-b from-white/[0.08] to-black border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 hover:border-purple-500/50 transition-all duration-500 group relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="inline-block bg-purple-500/20 text-purple-300 px-4 py-1 rounded-full text-xs font-bold mb-6 border border-purple-500/30">
                            MOBILE VERSION
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-white mb-4">PiRAT <span className="text-purple-500">Mobile</span></h3>
                        <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-md">
                            Мощный инструмент для Android и iOS. GPS трекинг, перехват SMS, запись звонков и доступ к камере в реальном времени.
                        </p>
                        
                        <div className="space-y-4 mb-10">
                            {['GPS Location Tracking', 'SMS & Call Logs', 'Live Camera Stream', 'Social Monitoring'].map((feature, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="bg-purple-500 rounded-full p-1 shrink-0"><Check className="w-3 h-3 text-black" strokeWidth={4} /></div>
                                    <span className="text-gray-300 text-sm md:text-base font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Lifetime License</p>
                                <p className="text-3xl md:text-4xl font-black text-white">$119</p>
                            </div>
                            <button onClick={handleBuyClick} className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all">
                                <ShoppingCart className="w-5 h-5" />
                                <span>Купить</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
