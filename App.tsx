import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Loader from './components/Loader';
import SnowEffect from './components/SnowEffect';
import AlertModal from './components/AlertModal';
import { ViewState } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alertData, setAlertData] = useState<{isOpen: boolean, message: string}>({
    isOpen: false,
    message: ''
  });

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    // Only scroll to top if not home (home navigation handles its own scrolling logic often)
    if (view !== ViewState.HOME) {
        window.scrollTo(0, 0);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    handleNavigate(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    handleNavigate(ViewState.HOME);
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
    <div className="min-h-screen bg-black text-white relative selection:bg-white selection:text-black">
      <SnowEffect />
      
      <Navbar 
        currentView={currentView} 
        onNavigate={handleNavigate}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onShowAlert={handleShowAlert}
      />

      <AlertModal 
        isOpen={alertData.isOpen} 
        onClose={closeAlert} 
        message={alertData.message} 
      />

      <main>
        {currentView === ViewState.HOME && <Hero />}
        
        {(currentView === ViewState.LOGIN || currentView === ViewState.REGISTER) && (
          <Auth 
            view={currentView as ViewState.LOGIN | ViewState.REGISTER} 
            onSuccess={handleLoginSuccess}
            onSwitch={handleNavigate}
          />
        )}

        {currentView === ViewState.DASHBOARD && isLoggedIn && (
          <Dashboard />
        )}

        {/* Protected Route Redirect Logic is handled by Navbar now, but as a fallback: */}
        {currentView === ViewState.DASHBOARD && !isLoggedIn && (
           <div className="pt-32 text-center">
             <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
             <button 
              onClick={() => handleNavigate(ViewState.LOGIN)}
              className="text-blue-500 hover:underline"
             >
               Please Login
             </button>
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 PiRAT Project. Not affiliated with any illegal activities. Educational & Security Research purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;