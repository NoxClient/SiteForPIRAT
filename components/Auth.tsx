import React, { useState } from 'react';
import { ViewState } from '../types';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

interface AuthProps {
  view: ViewState.LOGIN | ViewState.REGISTER;
  onSuccess: () => void;
  onSwitch: (view: ViewState) => void;
}

const Auth: React.FC<AuthProps> = ({ view, onSuccess, onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = view === ViewState.LOGIN;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
        try {
            const users = JSON.parse(localStorage.getItem('pirat_users') || '[]');
            
            if (isLogin) {
                // LOGIN LOGIC
                const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
                if (user) {
                    onSuccess();
                } else {
                    setError('Неверный Email или пароль');
                }
            } else {
                // REGISTER LOGIC
                const existingUser = users.find((u: any) => u.email === formData.email);
                if (existingUser) {
                    setError('Пользователь с таким Email уже существует');
                } else {
                    const newUser = { 
                        id: Date.now(),
                        username: formData.username, 
                        email: formData.email, 
                        password: formData.password 
                    };
                    users.push(newUser);
                    localStorage.setItem('pirat_users', JSON.stringify(users));
                    // Auto login after register
                    onSuccess();
                }
            }
        } catch (err) {
            setError('Произошла ошибка системы. Попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative z-10 px-4">
      <div className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden group">
        
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-500/30 transition-all duration-1000"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-blue-500/30 transition-all duration-1000"></div>

        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-3 text-center tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join PiRAT'}
          </h2>
          <p className="text-gray-400 text-center mb-8 font-light">
            {isLogin ? 'Войдите, чтобы продолжить работу' : 'Создайте защищенный аккаунт'}
          </p>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-2xl flex items-center text-sm">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="group/input">
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-4">Username</label>
               <input 
                 type="text" 
                 name="username"
                 value={formData.username}
                 onChange={handleInputChange}
                 required
                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder-gray-600 group-hover/input:border-white/20"
                 placeholder="Создайте имя пользователя"
               />
             </div>
            )}
            
            <div className="group/input">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-4">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder-gray-600 group-hover/input:border-white/20"
                placeholder="name@example.com"
              />
            </div>

            <div className="relative group/input">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-4">Password</label>
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder-gray-600 group-hover/input:border-white/20"
                placeholder="••••••••"
              />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-[42px] text-gray-400 hover:text-white transition-colors"
              >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-white via-gray-100 to-gray-300 text-black font-bold py-4 rounded-full hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-3 mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                  <>
                    <span>{isLogin ? 'Войти в систему' : 'Создать аккаунт'}</span>
                    <ArrowRight size={20} />
                  </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
              <button 
                onClick={() => {
                    setError(null);
                    onSwitch(isLogin ? ViewState.REGISTER : ViewState.LOGIN);
                }}
                className="text-white font-bold hover:text-gray-300 transition-colors ml-1"
              >
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;