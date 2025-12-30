import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Scripts from './components/Scripts';
import Referrals from './components/Referrals';
import AdminPanel from './components/AdminPanel';
import Loader from './components/Loader';
import SnowEffect from './components/SnowEffect';
import AlertModal from './components/AlertModal';
import { ViewState, User, AppSettings, UserRole } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // App Settings
  const [settings, setSettings] = useState<AppSettings>({
      enableSnow: true,
      enableMouseTrail: true,
      dashboardBg: 'bg-[#0a0a0a]'
  });

  const [alertData, setAlertData] = useState<{isOpen: boolean, message: string}>({
    isOpen: false,
    message: ''
  });

  const handleNavigate = (view: ViewState) => {
    // Subscription enforcement
    if (currentUser && currentUser.subscriptionDays <= 0) {
      const restrictedViews = [ViewState.DASHBOARD, ViewState.SCRIPTS, ViewState.CHAT];
      if (restrictedViews.includes(view)) {
        handleShowAlert('Для доступа к этому разделу необходима активная подписка. Пожалуйста, активируйте промокод.');
        setCurrentView(ViewState.REFERRALS);
        return;
      }
    }

    setCurrentView(view);
    if (view !== ViewState.HOME) {
        window.scrollTo(0, 0);
    }
  };

  const handleLoginSuccess = (user: any) => {
    const roles = Array.isArray(user.roles) 
        ? user.roles 
        : (user.role ? [user.role] : [UserRole.USER]);

    const upgradedUser: User = {
        ...user,
        roles: roles,
        referralCode: user.referralCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
        referralCount: user.referralCount || 0,
        subscriptionDays: user.subscriptionDays || 0
    };
    
    setCurrentUser(upgradedUser);
    
    // Redirect if no sub
    if (upgradedUser.subscriptionDays <= 0) {
        handleNavigate(ViewState.REFERRALS);
    } else {
        handleNavigate(ViewState.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleNavigate(ViewState.HOME);
  };

  const handleUpdateUser = (updatedUser: User) => {
      setCurrentUser(updatedUser);
  };

  const handleShowAlert = (msg: string) => {
    setAlertData({ isOpen: true, message: msg });
  };

  const closeAlert = () => {
    setAlertData({ ...alertData, isOpen: false });
  };

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className={`min-h-screen bg-black text-white relative selection:bg-white selection:text-black ${currentUser ? 'md:pl-0' : ''}`}>
      <SnowEffect enableFalling={settings.enableSnow} enableMouse={settings.enableMouseTrail} />
      
      {currentUser ? (
        <Sidebar currentView={currentView} onNavigate={handleNavigate} onLogout={handleLogout} currentUser={currentUser} />
      ) : (
        <Navbar currentView={currentView} onNavigate={handleNavigate} currentUser={currentUser} onLogout={handleLogout} onShowAlert={handleShowAlert} />
      )}

      <AlertModal isOpen={alertData.isOpen} onClose={closeAlert} message={alertData.message} />

      <main>
        {currentView === ViewState.HOME && <Hero currentUser={currentUser} onShowAlert={handleShowAlert} onNavigate={handleNavigate} />}
        {(currentView === ViewState.LOGIN || currentView === ViewState.REGISTER) && (
          <Auth view={currentView as ViewState.LOGIN | ViewState.REGISTER} onSuccess={handleLoginSuccess} onSwitch={handleNavigate} />
        )}

        {currentUser && (
            <>
                {currentView === ViewState.DASHBOARD && <Dashboard currentUser={currentUser} />}
                {currentView === ViewState.PROFILE && <Profile user={currentUser} onUpdateUser={handleUpdateUser} appSettings={settings} onUpdateSettings={setSettings} />}
                {currentView === ViewState.CHAT && <Chat currentUser={currentUser} allUsers={JSON.parse(localStorage.getItem('pirat_users') || '[]')} />}
                {currentView === ViewState.SCRIPTS && <Scripts />}
                {currentView === ViewState.REFERRALS && <Referrals currentUser={currentUser} onUpdateUser={handleUpdateUser} />}
                {currentView === ViewState.ADMIN_PANEL && <AdminPanel currentUser={currentUser} />}
            </>
        )}

        {(currentView === ViewState.DASHBOARD || currentView === ViewState.PROFILE || currentView === ViewState.CHAT || currentView === ViewState.ADMIN_PANEL) && !currentUser && (
           <div className="pt-32 text-center relative z-20">
             <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
             <button onClick={() => handleNavigate(ViewState.LOGIN)} className="text-blue-500 hover:underline">Please Login</button>
           </div>
        )}
      </main>

      {(!currentUser || currentView === ViewState.HOME) && (
          <footer className="bg-black border-t border-white/10 py-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-600 text-sm">© 2024 PiRAT Project. Educational & Security Research purposes only.</p>
            </div>
          </footer>
      )}
    </div>
  );
};

export default App;