
import React from 'react';

export const GradientBG: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#000428] relative overflow-hidden selection:bg-cyan-500 selection:text-white">
    {/* Grid Overlay */}
    <div className="absolute inset-0 pointer-events-none opacity-10"
         style={{
           backgroundImage: `linear-gradient(#00c2ff 1px, transparent 1px), linear-gradient(90deg, #00c2ff 1px, transparent 1px)`,
           backgroundSize: '40px 40px'
         }} />
    
    {/* Scanlines Effect */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 overflow-hidden">
      <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
    </div>

    {/* Moving Scanline */}
    <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/20 shadow-[0_0_10px_#00c2ff] animate-[scanline_8s_linear_infinite] z-50 pointer-events-none" />

    {/* Neon Glows */}
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
    
    <div className="relative z-10">{children}</div>
    
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes scanline {
        0% { transform: translateY(-100vh); }
        100% { transform: translateY(100vh); }
      }
      .cyber-corners {
        position: relative;
      }
      .cyber-corners::before {
        content: '';
        position: absolute;
        top: -2px; left: -2px; width: 20px; height: 20px;
        border-top: 2px solid #00c2ff; border-left: 2px solid #00c2ff;
      }
      .cyber-corners::after {
        content: '';
        position: absolute;
        bottom: -2px; right: -2px; width: 20px; height: 20px;
        border-bottom: 2px solid #00c2ff; border-right: 2px solid #00c2ff;
      }
    `}} />
  </div>
);

export const TechTitle: React.FC<{ text: string; className?: string; glitch?: boolean }> = ({ text, className = "", glitch }) => (
  <h2 className={`font-orbitron font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,194,255,0.5)] ${glitch ? 'animate-pulse' : ''} ${className}`}>
    {text}
  </h2>
);

export const CyberButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, type = 'button', variant = 'primary', className = "", disabled }) => {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,194,255,0.4)] hover:shadow-[0_0_25px_rgba(0,194,255,0.6)]",
    danger: "bg-gradient-to-r from-rose-500 to-red-600 border-rose-400 text-white shadow-[0_0_15px_rgba(255,0,85,0.4)] hover:shadow-[0_0_25px_rgba(255,0,85,0.6)]",
    ghost: "bg-blue-500/10 border-blue-400/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative px-6 py-2.5 rounded-lg border-2 font-orbitron font-bold text-sm tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 uppercase ${variants[variant]} ${className}`}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-white/10 rounded-lg pointer-events-none" />
    </button>
  );
};

export const InputWrapper: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-2 group">
    <label className="block font-orbitron text-[10px] text-cyan-400/70 tracking-tighter uppercase font-bold pl-1 group-focus-within:text-cyan-400 transition-colors">
      ▸ {label}
    </label>
    {children}
  </div>
);

export const CyberInput = "w-full bg-blue-900/20 border-2 border-cyan-500/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/20 focus:border-cyan-400 focus:bg-blue-900/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium";

export const LoadingOverlay: React.FC<{ text?: string }> = ({ text = "SILA TUNGGU..." }) => (
  <div className="fixed inset-0 bg-[#000428]/90 z-[100] flex flex-col items-center justify-center backdrop-blur-sm">
    <div className="relative w-24 h-24 mb-6">
      <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
      <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin" />
      <div className="absolute inset-4 border-b-4 border-blue-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
    </div>
    <p className="font-orbitron font-bold text-cyan-400 tracking-[0.3em] text-sm animate-pulse">{text}</p>
  </div>
);

export const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "border-cyan-400 bg-cyan-900/80 text-cyan-100 shadow-[0_0_20px_rgba(0,194,255,0.4)]",
    error: "border-rose-400 bg-rose-900/80 text-rose-100 shadow-[0_0_20px_rgba(255,0,85,0.4)]",
    info: "border-blue-400 bg-blue-900/80 text-blue-100 shadow-[0_0_20px_rgba(0,132,255,0.4)]"
  };

  return (
    <div className={`fixed top-6 right-6 z-[110] px-6 py-4 rounded-xl border-2 backdrop-blur-md flex items-center gap-4 animate-[slideIn_0.3s_ease-out] ${colors[type]}`}>
      <span className="font-bold font-orbitron text-xs tracking-widest uppercase">{message}</span>
      <button onClick={onClose} className="hover:text-white opacity-50 hover:opacity-100 transition-opacity">×</button>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }` }} />
    </div>
  );
};
