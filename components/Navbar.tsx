
import React, { useState, useEffect } from 'react';
import { ViewState, User } from '../types';
import { LogOut, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  currentUser: User | null;
  onLogout: () => void;
  onShowAlert: (msg: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, currentUser, onLogout, onShowAlert }) => {
  const [activeTab, setActiveTab] = useState('Главная');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentView === ViewState.DASHBOARD) {
        setActiveTab('Дашборд');
    } else if (currentView === ViewState.PROFILE) {
        setActiveTab('Профиль');
    } else if (currentView === ViewState.HOME) {
        if (!['Главная', 'О нас', 'Продукты', 'Видео'].includes(activeTab)) {
            setActiveTab('Главная');
        }
    } else {
        setActiveTab('');
    }
  }, [currentView]);

  const handleNavClick = (label: string, view: ViewState | null, targetId?: string) => {
    setIsMobileMenuOpen(false);
    if (label === 'Дашборд') {
        if (currentUser) {
            onNavigate(ViewState.DASHBOARD);
            setActiveTab(label);
        } else {
            onShowAlert('Вы не авторизированы!');
        }
        return;
    }

    setActiveTab(label);

    if (view === ViewState.HOME && !targetId) {
        onNavigate(ViewState.HOME);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (targetId) {
        if (currentView !== ViewState.HOME) {
            onNavigate(ViewState.HOME);
            setTimeout(() => {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
  };

  const navItems = [
    { label: 'Главная', view: ViewState.HOME },
    { label: 'О нас', view: null, targetId: 'about' },
    { label: 'Продукты', view: null, targetId: 'products' },
    { label: 'Видео', view: null, targetId: 'video' },
    { label: 'Дашборд', view: ViewState.DASHBOARD }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-black/40 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <div 
            className="flex-shrink-0 cursor-pointer group"
            onClick={() => handleNavClick('Главная', ViewState.HOME)}
          >
            <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tighter hover:to-white transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              PiRAT
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1 bg-black/20 p-2 rounded-full border border-white/5 backdrop-blur-sm">
              {navItems.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleNavClick(item.label, item.view, item.targetId)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-500 ease-out relative overflow-hidden ${
                    activeTab === item.label
                      ? 'text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.25)] border border-white/10 scale-105' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-3">
                {currentUser ? (
                  <div className="flex items-center space-x-4 pl-4">
                      <button 
                        onClick={() => onNavigate(ViewState.PROFILE)}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-transparent hover:border-white/50 transition-all transform hover:scale-105"
                      >
                         {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" /> : currentUser.username.charAt(0).toUpperCase()}
                      </button>
                      <button onClick={onLogout} className="text-gray-400 hover:text-red-400 p-2 transition-colors"><LogOut size={20} /></button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => onNavigate(ViewState.LOGIN)} className="text-gray-400 hover:text-white px-4 py-2 text-sm font-bold">Войти</button>
                    <button onClick={() => onNavigate(ViewState.REGISTER)} className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold shadow-lg">Регистрация</button>
                  </>
                )}
            </div>
            
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white p-2 bg-white/5 rounded-xl border border-white/10"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-x-0 top-20 bg-black/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'}`}>
        <div className="px-6 space-y-4">
            {navItems.map((item, idx) => (
                <button 
                    key={idx}
                    onClick={() => handleNavClick(item.label, item.view, item.targetId)}
                    className={`w-full text-left py-4 px-6 rounded-2xl text-lg font-bold transition-all ${activeTab === item.label ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                >
                    {item.label}
                </button>
            ))}
            <div className="pt-4 border-t border-white/5 space-y-4">
                {currentUser ? (
                    <>
                        <button onClick={() => { onNavigate(ViewState.PROFILE); setIsMobileMenuOpen(false); }} className="w-full flex items-center space-x-4 py-4 px-6 text-white font-bold">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full rounded-full object-cover" /> : currentUser.username[0].toUpperCase()}
                            </div>
                            <span>Профиль</span>
                        </button>
                        <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="w-full py-4 px-6 text-red-500 font-bold bg-red-500/10 rounded-2xl">
                            Выйти
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => { onNavigate(ViewState.LOGIN); setIsMobileMenuOpen(false); }} className="w-full py-4 px-6 text-white font-bold border border-white/10 rounded-2xl">
                            Войти
                        </button>
                        <button onClick={() => { onNavigate(ViewState.REGISTER); setIsMobileMenuOpen(false); }} className="w-full py-4 px-6 bg-white text-black font-bold rounded-2xl">
                            Регистрация
                        </button>
                    </>
                )}
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
