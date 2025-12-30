import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-black/80 border border-red-500/30 p-8 rounded-[2rem] max-w-sm w-full shadow-[0_0_50px_rgba(220,38,38,0.2)] transform transition-all scale-100">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Доступ запрещен</h3>
                    <p className="text-gray-400 mb-6 font-medium">{message}</p>
                    <button 
                        onClick={onClose}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transform hover:scale-105"
                    >
                        Понятно
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;