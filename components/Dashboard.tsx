
import React from 'react';
import { OPRReport } from '../types';
import { TechTitle, CyberButton } from './CyberUI';
import { Eye, Trash2, Calendar, User, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ms } from 'date-fns/locale';

interface DashboardProps {
  reports: OPRReport[];
  onView: (report: OPRReport) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, onView, onDelete }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredReports = reports.filter(r => 
    r.nama_program.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.anjuran.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <TechTitle text="DASHBOARD LAPORAN" className="text-3xl" />
          <p className="text-blue-300/70 font-medium">Senarai semua laporan OPR yang telah disimpan.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Cari program..." 
            className="bg-blue-900/20 border-2 border-cyan-500/30 rounded-full pl-10 pr-6 py-2 text-white focus:outline-none focus:border-cyan-400 min-w-[300px] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center py-20 bg-blue-900/5 rounded-3xl border-2 border-dashed border-blue-500/10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-4">
            <Search size={40} className="text-blue-400 opacity-20" />
          </div>
          <p className="text-blue-300/50 font-orbitron tracking-widest uppercase">Tiada Laporan Dijumpai</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map((report) => (
            <div 
              key={report.id} 
              className="group relative flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-blue-900/10 border border-cyan-500/20 rounded-2xl hover:bg-blue-900/20 transition-all hover:border-cyan-400/50"
            >
              <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                {/* Visual indicator */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-orbitron font-black text-xl flex-shrink-0">
                  {report.nama_program.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <h3 className="text-xl font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {report.nama_program}
                  </h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-blue-300/60 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {format(new Date(report.tarikh), 'dd MMM yyyy', { locale: ms })}</span>
                    <span className="flex items-center gap-1.5"><User size={14} /> {report.disediakan_oleh}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] uppercase tracking-tighter border border-cyan-500/20">
                      {report.anjuran}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CyberButton variant="ghost" onClick={() => onView(report)} className="!px-4">
                  <Eye size={18} />
                </CyberButton>
                <CyberButton variant="danger" onClick={() => onDelete(report.id)} className="!px-4">
                  <Trash2 size={18} />
                </CyberButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
