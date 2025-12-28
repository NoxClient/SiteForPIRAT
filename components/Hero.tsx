import React from 'react';
import { Monitor, Smartphone, ShieldCheck, PlayCircle, Check, ShoppingCart, Cpu, Wifi } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative pt-20 min-h-screen flex flex-col items-center justify-start overflow-hidden pb-20">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid z-0 pointer-events-none opacity-50"></div>
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-10 md:mt-20">
        
        {/* Animated Title */}
        <div className="flex items-center justify-center space-x-1 md:space-x-4 mb-8 select-none scale-90 md:scale-100">
          {['P', 'i', 'R', 'A', 'T'].map((char, index) => (
            <span 
              key={index}
              className={`text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 animate-glow inline-block hover:to-white transition-all cursor-default animate-bounce`}
              style={{ animationDuration: '3s', animationDelay: `${index * 150}ms` }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Subtitle - About Section */}
        <div id="about" className="backdrop-blur-sm bg-black/30 p-6 rounded-[2rem] border border-white/5 mb-16 max-w-3xl scroll-mt-32">
          <p className="text-xl md:text-2xl text-gray-300 text-center leading-relaxed">
            Профессиональные <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-xl">RAT</span> решения для мониторинга.
            <br className="hidden md:block" />
            Безопасность, анонимность и полный контроль.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-24 px-4">
          
          {/* Card 1 */}
          <div className="group relative bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center h-48 justify-center">
              <div className="p-4 bg-white/5 rounded-full mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-xl shadow-black/50">
                <Monitor className="w-10 h-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <h3 className="text-3xl font-black italic text-white mb-2 tracking-wide">PC</h3>
              <p className="text-gray-500 font-medium">Windows & MacOS</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center h-48 justify-center">
              <div className="p-4 bg-white/5 rounded-full mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-xl shadow-black/50">
                <Smartphone className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <h3 className="text-3xl font-black italic text-white mb-2 tracking-wide">MOBILE</h3>
              <p className="text-gray-500 font-medium">Android & iOS</p>
            </div>
          </div>

           {/* Card 3 */}
           <div className="group relative bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center h-48 justify-center">
              <div className="p-4 bg-white/5 rounded-full mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-xl shadow-black/50">
                <ShieldCheck className="w-10 h-10 text-green-400 group-hover:text-green-300 transition-colors" />
              </div>
              <h3 className="text-3xl font-black italic text-white mb-2 tracking-wide">SECURE</h3>
              <p className="text-gray-500 font-medium">Encrypted & Safe</p>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div id="video" className="w-full max-w-5xl mb-32 px-4 scroll-mt-32">
            <div className="relative w-full aspect-video bg-gray-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] group cursor-pointer transition-transform hover:scale-[1.01] duration-500">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-500">
                    <div className="relative">
                         <div className="absolute inset-0 bg-white/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                         <PlayCircle className="w-24 h-24 text-white/80 group-hover:text-white relative z-10 transition-all duration-300 transform group-hover:scale-110" />
                    </div>
                    <p className="text-white/80 font-bold mt-6 text-xl tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">Запустить демо</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <h3 className="text-3xl font-bold text-white mb-2">Демонстрация работы</h3>
                    <p className="text-gray-300 text-lg">Полный обзор функционала панели управления v2.0</p>
                </div>
            </div>
        </div>

        {/* New Products Section */}
        <div id="products" className="w-full max-w-7xl px-4 mb-24 scroll-mt-32">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Магазин лицензий</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                
                {/* Product 1: PC */}
                <div className="bg-gradient-to-b from-white/[0.08] to-black border border-white/10 rounded-[3rem] p-8 md:p-12 hover:border-blue-500/50 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                        <Cpu className="w-64 h-64 text-blue-500" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="inline-block bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-blue-500/30">
                            DESKTOP VERSION
                        </div>
                        <h3 className="text-4xl font-black text-white mb-4">PiRAT <span className="text-blue-500">PC</span></h3>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-md">
                            Полный контроль над Windows, MacOS и Linux системами. Скрытый доступ, кейлоггер, управление файлами и веб-камерой.
                        </p>
                        
                        <div className="space-y-4 mb-10">
                            {['Полная невидимость (FUD)', 'Remote Desktop Control', 'File Manager Access', 'Keylogger & Password Recovery'].map((feature, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="bg-blue-500 rounded-full p-1">
                                        <Check className="w-3 h-3 text-black" strokeWidth={4} />
                                    </div>
                                    <span className="text-gray-300 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <div>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Lifetime License</p>
                                <p className="text-4xl font-black text-white">$149</p>
                            </div>
                            <button className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center space-x-2 hover:bg-gray-200 transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                <ShoppingCart className="w-5 h-5" />
                                <span>Купить</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product 2: Mobile */}
                <div className="bg-gradient-to-b from-white/[0.08] to-black border border-white/10 rounded-[3rem] p-8 md:p-12 hover:border-purple-500/50 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                        <Wifi className="w-64 h-64 text-purple-500" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="inline-block bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-purple-500/30">
                            MOBILE VERSION
                        </div>
                        <h3 className="text-4xl font-black text-white mb-4">PiRAT <span className="text-purple-500">Mobile</span></h3>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-md">
                            Мощный инструмент для Android и iOS. GPS трекинг, перехват SMS, запись звонков и доступ к камере в реальном времени.
                        </p>
                        
                        <div className="space-y-4 mb-10">
                            {['GPS Location Tracking', 'SMS & Call Logs', 'Live Camera Stream', 'Social Media Monitoring'].map((feature, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="bg-purple-500 rounded-full p-1">
                                        <Check className="w-3 h-3 text-black" strokeWidth={4} />
                                    </div>
                                    <span className="text-gray-300 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <div>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Lifetime License</p>
                                <p className="text-4xl font-black text-white">$119</p>
                            </div>
                            <button className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center space-x-2 hover:bg-gray-200 transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
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