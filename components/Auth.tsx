
import React, { useState } from 'react';
import { ViewState, User, UserRole } from '../types';
import { Eye, EyeOff, ArrowRight, AlertCircle, Database, ShieldAlert } from 'lucide-react';

interface AuthProps {
  view: ViewState.LOGIN | ViewState.REGISTER;
  onSuccess: (user: User) => void;
  onSwitch: (view: ViewState) => void;
}

const Auth: React.FC<AuthProps> = ({ view, onSuccess, onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{username?: boolean, password?: boolean}>({});
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = view === ViewState.LOGIN;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setValidationErrors(prev => ({ ...prev, [e.target.name]: false }));
  };

  const dumpDatabase = () => {
    const users = localStorage.getItem('pirat_users');
    console.log("=== DATABASE DUMP ===");
    console.log(users ? JSON.parse(users) : "Database is empty");
    console.log("=====================");
    alert(users ? `DATABASE CONTENT:\n${users}` : "Database is empty");
  };

  const validate = () => {
    const errors: {username?: boolean, password?: boolean} = {};
    if (!formData.username.trim()) errors.username = true;
    if (!formData.password.trim()) errors.password = true;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (!isLogin && formData.password.length < 8) {
        setError('Пароль должен содержать минимум 8 символов');
        setValidationErrors({ password: true });
        return;
    }

    setIsLoading(true);

    setTimeout(() => {
        try {
            const users: User[] = JSON.parse(localStorage.getItem('pirat_users') || '[]');
            
            if (isLogin) {
                const user = users.find((u: any) => u.username === formData.username && u.password === formData.password);
                if (user) {
                    onSuccess(user);
                } else {
                    setError('Неверный логин или пароль');
                }
            } else {
                const username = formData.username;
                const lowerName = username.toLowerCase();
                
                if (lowerName === 'developer' || 
                   (lowerName === 'root' && username !== 'root') || 
                   (lowerName === 'dev' && username !== 'dev') ||
                   (lowerName.includes('admin') && lowerName !== 'admin')) {
                    setError('Данный ник запрещен');
                    setValidationErrors({ username: true });
                    setIsLoading(false);
                    return;
                }

                const existingUsername = users.find((u: any) => u.username === formData.username);

                if (existingUsername) {
                    setError('Пользователь с таким именем уже существует');
                    setValidationErrors({ username: true });
                } else {
                    let initialRole = UserRole.USER;
                    
                    if (username === 'root' || username === 'PiRAT') {
                        initialRole = UserRole.OWNER;
                    } else if (username === 'dev') {
                        initialRole = UserRole.DEVELOPER;
                    } else if (lowerName === 'admin') {
                        initialRole = UserRole.ADMIN;
                    }

                    const numericIds = users
                        .map(u => typeof u.id === 'number' ? u.id : parseInt(u.id as string))
                        .filter(n => !isNaN(n));
                    
                    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 0;

                    const newUser: User = { 
                        id: nextId,
                        username: username,
                        password: formData.password,
                        createdAt: new Date().toISOString(),
                        bio: 'Новый пользователь PiRAT',
                        telegramId: '',
                        avatarUrl: '',
                        roles: [initialRole],
                        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                        referralCount: 0,
                        subscriptionDays: 0
                    };
                    users.push(newUser);
                    localStorage.setItem('pirat_users', JSON.stringify(users));
                    onSuccess(newUser);
                }
            }
        } catch (err) {
            setError('Произошла ошибка базы данных.');
        } finally {
            setIsLoading(false);
        }
    }, 800);
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative z-10 px-4">
      <div className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden group">
        
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-500/30 transition-all duration-1000"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-blue-500/30 transition-all duration-1000"></div>
        
        <button 
            onClick={dumpDatabase}
            className="absolute top-6 right-6 text-gray-700 hover:text-white transition-colors"
            title="View Database"
        >
            <Database size={16} />
        </button>

        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-3 text-center tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join PiRAT'}
          </h2>
          <p className="text-gray-400 text-center mb-8 font-light">
            {isLogin ? 'Войдите в систему' : 'Создайте анонимный аккаунт'}
          </p>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl flex items-center text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <ShieldAlert className="w-5 h-5 mr-3 flex-shrink-0 text-red-500" />
                <span className="font-bold tracking-tight">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="group/input relative">
               <div className="flex justify-between items-center mb-2 px-4">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Username</label>
                 {validationErrors.username && (
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse flex items-center gap-1">
                      <AlertCircle size={10} /> Заполните поле
                    </span>
                 )}
               </div>
               <input 
                 type="text" 
                 name="username"
                 value={formData.username}
                 onChange={handleInputChange}
                 className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:outline-none transition-all placeholder-gray-700 font-medium ${validationErrors.username ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-white/30 focus:bg-white/10 group-hover/input:border-white/20'}`}
                 placeholder="Логин"
                 autoComplete="off"
               />
             </div>
            
            <div className="group/input relative">
              <div className="flex justify-between items-center mb-2 px-4">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Password</label>
                 {validationErrors.password && (
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse flex items-center gap-1">
                      <AlertCircle size={10} /> Заполните поле
                    </span>
                 )}
               </div>
              <div className="relative">
                <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:outline-none transition-all placeholder-gray-700 pr-12 font-medium ${validationErrors.password ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-white/30 focus:bg-white/10 group-hover/input:border-white/20'}`}
                    placeholder="Пароль"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-2"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-white via-gray-200 to-gray-400 text-black font-black text-sm uppercase tracking-widest py-4 rounded-full hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-3 mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                  <>
                    <span>{isLogin ? 'Войти' : 'Создать аккаунт'}</span>
                    <ArrowRight size={18} />
                  </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 font-medium">
              {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
              <button 
                onClick={() => {
                    setError(null);
                    setValidationErrors({});
                    onSwitch(isLogin ? ViewState.REGISTER : ViewState.LOGIN);
                }}
                className="text-white font-black hover:text-gray-300 transition-colors ml-1 uppercase text-xs tracking-wider"
              >
                {isLogin ? 'Регистрация' : 'Вход'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
