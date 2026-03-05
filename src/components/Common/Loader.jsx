import React from 'react';
import { Swords } from 'lucide-react';

const Loader = ({ message = '', full = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-8 ${full ? 'fixed inset-0 z-[9999]' : 'lg:min-h-[100vh] min-h-[105vh] w-full'}`} style={{ 
      background: full ? 'var(--bg-dark)' : 'transparent' 
    }}>
      <div className="relative">
        {/* Pulsing Concentric Circles */}
        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full scale-[2.5] animate-pulse" />
        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse delay-700" />
        
        {/* Symbol with Rotating Ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
          <div className="bg-white p-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-emerald-50 relative z-10 transition-transform hover:scale-105 duration-500">
            <Swords 
              size={40} 
              className="text-emerald-600" 
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-1000">
        <h3 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{message}</h3>
        <div className="flex items-center gap-2 mt-2">
        </div>
      </div>
    </div>
  );
};

export default Loader;
