import React from 'react';
import { Terminal } from 'lucide-react';

const Scripts: React.FC = () => {
    return (
        <div className="min-h-screen pt-28 pb-20 px-4 md:ml-64 flex flex-col items-center justify-center">
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl text-center max-w-lg">
                <Terminal className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-white mb-4">Скрипты в разработке</h2>
                <p className="text-gray-400">
                    Раздел автоматизации находится на стадии бета-тестирования. 
                    Скоро здесь появятся готовые пресеты для задач.
                </p>
            </div>
        </div>
    );
};

export default Scripts;