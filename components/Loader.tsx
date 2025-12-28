import React, { useState, useEffect } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [text, setText] = useState('');
  const fullText = "PIRAT PROJECT";

  useEffect(() => {
    let mounted = true;

    const animate = async () => {
      // Typing phase
      for (let i = 0; i <= fullText.length; i++) {
        if (!mounted) return;
        setText(fullText.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 100)); // Typing speed
      }

      // Pause phase
      if (!mounted) return;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Time to read

      // Deleting phase
      for (let i = fullText.length; i >= 0; i--) {
        if (!mounted) return;
        setText(fullText.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 50)); // Erase speed
      }
      
      // Short buffer before closing
      if (!mounted) return;
      await new Promise(resolve => setTimeout(resolve, 300));
      onComplete();
    };

    animate();

    return () => {
      mounted = false;
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-mono">
      <div className="loader mb-8 border-t-white border-r-white/50 border-b-white/10 border-l-white/10"></div>
      <div className="h-16 flex items-center justify-center">
        <h2 className="text-white text-3xl md:text-5xl font-black tracking-wider flex items-center">
          {text}
          <span className="inline-block w-3 h-8 md:h-12 bg-white ml-2 animate-pulse"></span>
        </h2>
      </div>
    </div>
  );
};

export default Loader;