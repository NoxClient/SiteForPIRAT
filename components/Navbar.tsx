import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onShowAlert: (msg: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isLoggedIn, onLogout, onShowAlert }) => {
  const [activeTab, setActiveTab] = useState('Главная');

  // Sync activeTab with currentView when it changes from outside
  useEffect(() => {
    if (currentView === ViewState.DASHBOARD) {
        setActiveTab('Дашборд');
    } else if (currentView === ViewState.HOME) {
        // Keep specific section active if we are on home, otherwise default to Main
        if (!['Главная', 'О нас', 'Продукты', 'Видео'].includes(activeTab)) {
            setActiveTab('Главная');
        }
    } else {
        setActiveTab('');
    }
  }, [currentView]); // activeTab is intentionally excluded to prevent reset on internal clicks

  const handleNavClick = (label: string, view: ViewState | null, targetId?: string) => {
    if (label === 'Дашборд') {
        if (isLoggedIn) {
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
    <nav className="fixed top-0 left-0 w-full z-40 bg-black/20 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div 
            className="flex-shrink-0 cursor-pointer group"
            onClick={() => handleNavClick('Главная', ViewState.HOME)}
          >
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tighter hover:to-white transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              PiRAT
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1 bg-black/20 p-2 rounded-full border border-white/5 backdrop-blur-sm">
              {navItems.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleNavClick(item.label, item.view, item.targetId)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 ease-out relative overflow-hidden ${
                    activeTab === item.label
                      ? 'text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.25)] border border-white/10 scale-105' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {activeTab === item.label && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]"
              >
                Выйти
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate(ViewState.LOGIN)}
                  className="text-gray-400 hover:text-white px-5 py-2.5 text-sm font-bold transition-all"
                >
                  Войти
                </button>
                <button
                  onClick={() => onNavigate(ViewState.REGISTER)}
                  className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105"
                >
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