
import React, { useState, useEffect } from 'react';
import { GradientBG, TechTitle, CyberButton, LoadingOverlay, Toast } from './components/CyberUI';
import { OPRReport, ViewState } from './types';
import OPRForm from './components/OPRForm';
import Dashboard from './components/Dashboard';
import ReportPreview from './components/ReportPreview';
import { LayoutDashboard, PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('form');
  const [reports, setReports] = useState<OPRReport[]>([]);
  const [activeReport, setActiveReport] = useState<OPRReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("MEMPROSES...");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cyber_opr_reports');
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reports", e);
      }
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const saveReports = (newReports: OPRReport[]) => {
    setReports(newReports);
    localStorage.setItem('cyber_opr_reports', JSON.stringify(newReports));
  };

  const addReport = (report: OPRReport) => {
    setIsLoading(true);
    setLoadingText("MENYIMPAN LAPORAN...");
    setTimeout(() => {
      const updated = [report, ...reports];
      saveReports(updated);
      setIsLoading(false);
      showToast("Laporan Berjaya Disimpan!", "success");
      setView('dashboard');
    }, 800);
  };

  const deleteReport = (id: string) => {
    if (confirm("Adakah anda pasti untuk memadam laporan ini?")) {
      const updated = reports.filter(r => r.id !== id);
      saveReports(updated);
      showToast("Laporan Berjaya Dipadam.", "info");
    }
  };

  const openPreview = (report: OPRReport) => {
    setActiveReport(report);
    setView('preview');
  };

  return (
    <GradientBG>
      {isLoading && <LoadingOverlay text={loadingText} />}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <header className="sticky top-0 z-50 bg-[#000428]/80 backdrop-blur-xl border-b border-cyan-500/20 px-4 py-4 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full border-2 border-cyan-400 p-0.5 bg-blue-900/40 shadow-[0_0_20px_rgba(0,194,255,0.3)] animate-pulse">
              <img 
                src="https://i.postimg.cc/L6bXZbNM/Gemini-Generated-Image-eupsu3eupsu3eups.png" 
                alt="Logo" 
                className="w-full h-full rounded-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-[-4px] border border-cyan-400/20 rounded-full animate-ping" />
            </div>
            <div>
              <TechTitle text="CyberOPR" className="text-2xl tracking-tighter" glitch />
              <p className="text-[10px] text-blue-300/70 font-orbitron uppercase tracking-[0.2em] font-bold">SMA Al Ehya Al Karim</p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <CyberButton 
              variant={view === 'form' ? 'primary' : 'ghost'} 
              onClick={() => setView('form')}
              className="!px-6 !py-2 !text-xs"
            >
              <div className="flex items-center gap-2">
                <PlusCircle size={14} /> <span>BORANG</span>
              </div>
            </CyberButton>
            <CyberButton 
              variant={view === 'dashboard' ? 'primary' : 'ghost'} 
              onClick={() => setView('dashboard')}
              className="!px-6 !py-2 !text-xs"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard size={14} /> <span>REKOD</span>
              </div>
            </CyberButton>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {view === 'form' && <OPRForm onSave={addReport} onToast={showToast} />}
        {view === 'dashboard' && (
          <Dashboard 
            reports={reports} 
            onView={openPreview} 
            onDelete={deleteReport} 
          />
        )}
        {view === 'preview' && activeReport && (
          <ReportPreview 
            report={activeReport} 
            onBack={() => setView('dashboard')} 
            onToast={showToast}
          />
        )}
      </main>

      <footer className="mt-20 py-12 text-center border-t border-cyan-500/10 no-print">
        <div className="max-w-md mx-auto space-y-4">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent w-full" />
          <p className="text-blue-400/40 text-[10px] font-orbitron tracking-[0.4em] uppercase">
            Sistem Pintar Laporan Satu Muka • V2.5
          </p>
          <p className="text-blue-500/20 text-[8px] font-orbitron tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} SMA AL EHYA AL KARIM • POWERED BY GOOGLE GENAI
          </p>
        </div>
      </footer>
    </GradientBG>
  );
};

export default App;
