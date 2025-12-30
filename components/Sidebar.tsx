import React, { useState } from 'react';
import { ViewState, User, UserRole } from '../types';
import { 
  LayoutDashboard, 
  Terminal, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Ticket,
  Menu,
  X,
  ShieldHalf,
  Lock
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  currentUser: User;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout, currentUser }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const hasSub = currentUser.subscriptionDays > 0;
  const hasAdminAccess = currentUser.roles.some(role => 
    [UserRole.OWNER, UserRole.ADMIN, UserRole.HELPER, UserRole.DEVELOPER].includes(role)
  );

  const menuItems = [
    { label: 'Панель', view: ViewState.DASHBOARD, icon: <LayoutDashboard size={20} />, restricted: true },
    { label: 'Скрипты', view: ViewState.SCRIPTS, icon: <Terminal size={20} />, restricted: true },
    { label: 'Чат', view: ViewState.CHAT, icon: <MessageSquare size={20} />, restricted: true },
    { label: 'Промокод', view: ViewState.REFERRALS, icon: <Ticket size={20} />, restricted: false },
    { label: 'Настройки', view: ViewState.PROFILE, icon: <Settings size={20} />, restricted: false },
  ];

  if (hasAdminAccess) {
    menuItems.push({ label: 'Администрация', view: ViewState.ADMIN_PANEL, icon: <ShieldHalf size={20} className="text-red-400" />, restricted: false });
  }

  const handleNav = (item: typeof menuItems[0]) => {
    if (item.restricted && !hasSub) return;
    onNavigate(item.view);
    setIsMobileOpen(false);
  };

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl text-white shadow-xl">
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileOpen && <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]" onClick={() => setIsMobileOpen(false)} />}

      <div className={`fixed top-0 left-0 h-full bg-black/90 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 z-[56] flex flex-col ${collapsed ? 'w-20' : 'w-64'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-24 flex items-center justify-center relative border-b border-white/5">
          {!collapsed ? <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tighter">PiRAT</span> : <span className="text-2xl font-black text-white">P</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full border border-white/20 hover:bg-gray-700 transition-colors">
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
        <div className="flex-1 py-8 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isLocked = item.restricted && !hasSub;
            return (
              <button 
                key={item.label} 
                onClick={() => handleNav(item)} 
                disabled={isLocked}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative ${
                  currentView === item.view 
                    ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                    : isLocked 
                      ? 'text-gray-700 cursor-not-allowed opacity-50' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`${collapsed ? 'mx-auto' : 'mr-3'}`}>
                  {isLocked && !collapsed ? <Lock size={14} className="absolute -top-1 -left-1 text-red-500/50" /> : null}
                  {item.icon}
                </div>
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span className="font-bold text-sm">{item.label}</span>
                    {isLocked && <Lock size={12} className="text-gray-700" />}
                  </div>
                )}
                {isLocked && collapsed && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <Lock size={12} className="text-red-500" />
                   </div>
                )}
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
               <div className="flex items-center overflow-hidden cursor-pointer hover:bg-white/5 p-1.5 rounded-xl transition-colors group/user" onClick={() => onNavigate(ViewState.PROFILE)}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 group-hover/user:scale-105 transition-transform">
                      {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full rounded-full object-cover" /> : currentUser.username[0].toUpperCase()}
                  </div>
                  <div className="ml-3 truncate"><p className="text-xs font-bold text-white truncate">{currentUser.username}</p></div>
               </div>
            )}
            <button onClick={onLogout} className="text-gray-500 hover:text-red-400 transition-colors p-2"><LogOut size={20} /></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;