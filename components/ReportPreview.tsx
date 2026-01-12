
import React, { useRef, useState } from 'react';
import { OPRReport } from '../types';
import { CyberButton, LoadingOverlay } from './CyberUI';
import { ArrowLeft, Download, Printer, CloudUpload, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ms } from 'date-fns/locale';

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxHiak2ZBkURuDJ7-LoSNBuEpRGjqbUywdUmGWinN_WGde1W1XXpQQ4tGlCt21rEFsODg/exec';

interface ReportPreviewProps {
  report: OPRReport;
  onBack: () => void;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ report, onBack, onToast }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processText, setProcessText] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  const generatePDF = async () => {
    if (!reportRef.current) return null;
    
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    return pdf;
  };

  const downloadPDF = async () => {
    setIsProcessing(true);
    setProcessText("MENJANA PDF...");
    try {
      const pdf = await generatePDF();
      if (pdf) {
        pdf.save(`OPR_${report.nama_program.replace(/\s+/g, '_')}_${format(new Date(), 'ddMMyy')}.pdf`);
        onToast("PDF Berjaya Dijana!", "success");
      }
    } catch (error) {
      onToast("Gagal menjana PDF.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadToDrive = async () => {
    setIsProcessing(true);
    setProcessText("MEMUAT NAIK KE CLOUD...");
    try {
      const pdf = await generatePDF();
      if (!pdf) throw new Error("No PDF");

      const pdfBase64 = pdf.output('datauristring').split(',')[1];
      const fileName = `OPR_${report.nama_program.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;

      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfBase64: pdfBase64,
          fileName: fileName
        })
      });

      // mode: 'no-cors' doesn't allow reading the body, but usually if it doesn't throw it's okay
      setIsUploaded(true);
      onToast("Laporan Berjaya Disimpan ke Google Drive!", "success");
    } catch (error) {
      onToast("Gagal memuat naik ke Google Drive.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {isProcessing && <LoadingOverlay text={processText} />}
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 no-print bg-blue-900/10 p-4 rounded-2xl border border-cyan-500/20 backdrop-blur-md">
        <CyberButton variant="ghost" onClick={onBack} className="!px-4">
          <div className="flex items-center gap-2"><ArrowLeft size={16} /> KEMBALI</div>
        </CyberButton>
        <div className="flex flex-wrap justify-center gap-3">
          <CyberButton variant="ghost" onClick={printReport} className="!px-4">
            <Printer size={18} />
          </CyberButton>
          <CyberButton onClick={downloadPDF} variant="ghost" className="!px-6 border-cyan-400/50">
            <div className="flex items-center gap-2 text-cyan-400"><Download size={16} /> SIMPAN LOKAL</div>
          </CyberButton>
          <CyberButton onClick={uploadToDrive} disabled={isUploaded} className="!px-6">
            <div className="flex items-center gap-2">
              {isUploaded ? <CheckCircle2 size={16} className="text-white" /> : <CloudUpload size={16} />}
              {isUploaded ? "SELESAI" : "UPLOAD KE DRIVE"}
            </div>
          </CyberButton>
        </div>
      </div>

      <div className="overflow-x-auto pb-10">
        {/* The Actual Report Content (A4 Ratio) */}
        <div 
          ref={reportRef} 
          className="bg-white text-slate-900 p-10 md:p-14 shadow-2xl rounded-sm mx-auto overflow-hidden print:p-0 print:shadow-none print:rounded-none relative"
          style={{ width: '210mm', minHeight: '297mm' }}
        >
          {/* Subtle Grid for aesthetic in preview (will be captured in PDF) */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[length:10mm_10mm]" />

          {/* Report Header */}
          <div className="flex flex-col items-center border-b-4 border-cyan-700 pb-8 mb-10 text-center relative z-10">
            <div className="relative mb-6">
              <img 
                src="https://i.postimg.cc/L6bXZbNM/Gemini-Generated-Image-eupsu3eupsu3eups.png" 
                alt="Logo" 
                className="w-24 h-24 object-contain" 
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-cyan-600 rounded-full" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-1">LAPORAN SATU MUKA (OPR)</h1>
            <h2 className="text-xl font-bold text-cyan-700 uppercase tracking-widest">SMA AL EHYA AL KARIM</h2>
            <p className="text-[10px] font-black text-slate-400 mt-2 tracking-[0.3em]">INTEGRITI • PROFESIONALISME • KECEMERLANGAN</p>
          </div>

          {/* Info Table */}
          <table className="w-full border-collapse mb-10 text-sm relative z-10">
            <tbody>
              <tr>
                <th className="w-[35%] text-left p-4 border-2 border-slate-200 bg-slate-50 uppercase font-black text-[10px] text-slate-500 tracking-wider">Nama Program</th>
                <td className="p-4 border-2 border-slate-200 font-bold text-base text-slate-800">{report.nama_program}</td>
              </tr>
              <tr>
                <th className="w-[35%] text-left p-4 border-2 border-slate-200 bg-slate-50 uppercase font-black text-[10px] text-slate-500 tracking-wider">Unit Penganjur</th>
                <td className="p-4 border-2 border-slate-200 font-semibold">{report.anjuran}</td>
              </tr>
              <tr>
                <th className="w-[35%] text-left p-4 border-2 border-slate-200 bg-slate-50 uppercase font-black text-[10px] text-slate-500 tracking-wider">Tarikh / Masa / Tempat</th>
                <td className="p-4 border-2 border-slate-200 font-medium">
                  {format(new Date(report.tarikh), 'dd MMMM yyyy', { locale: ms })} | {report.masa} | {report.tempat}
                </td>
              </tr>
              <tr>
                <th className="w-[35%] text-left p-4 border-2 border-slate-200 bg-slate-50 uppercase font-black text-[10px] text-slate-500 tracking-wider">Penyertaan / Sasaran</th>
                <td className="p-4 border-2 border-slate-200">{report.bilangan_peserta} ({report.sasaran})</td>
              </tr>
              <tr>
                <th className="w-[35%] text-left p-4 border-2 border-slate-200 bg-slate-50 uppercase font-black text-[10px] text-slate-500 tracking-wider">Objektif</th>
                <td className="p-4 border-2 border-slate-200 whitespace-pre-wrap leading-relaxed text-slate-700">{report.objektif}</td>
              </tr>
              <tr>
                <th className="w-[35%] text-left p-4 border-2 border-slate-200 bg-slate-50 uppercase font-black text-[10px] text-slate-500 tracking-wider">Ringkasan Aktiviti</th>
                <td className="p-4 border-2 border-slate-200 whitespace-pre-wrap leading-relaxed text-slate-700">{report.aktiviti}</td>
              </tr>
              <tr>
                <th className="w-[35%] text-left p-4 border-2 border-slate-200 bg-slate-50 uppercase font-black text-[10px] text-slate-500 tracking-wider">Rumusan / Impak</th>
                <td className="p-4 border-2 border-slate-200 whitespace-pre-wrap leading-relaxed text-slate-700 font-medium text-cyan-900">{report.rumusan}</td>
              </tr>
            </tbody>
          </table>

          {/* Photo Documentation */}
          <div className="mb-12 relative z-10">
            <h3 className="text-xs font-black text-slate-800 uppercase mb-5 flex items-center gap-3">
              <span className="w-10 h-1 bg-cyan-700" /> DOKUMENTASI VISUAL PROGRAM
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {report.images_data.map((img, idx) => (
                <div key={idx} className="aspect-video bg-slate-100 border-2 border-slate-200 overflow-hidden shadow-sm">
                  <img src={img} className="w-full h-full object-cover" alt={`Dokumentasi ${idx + 1}`} />
                </div>
              ))}
              {report.images_data.length === 0 && (
                <div className="col-span-2 py-16 text-center bg-slate-50 border-2 border-dashed border-slate-200 text-slate-400 text-xs italic font-medium">
                  Tiada rakaman visual disertakan dalam laporan ini.
                </div>
              )}
            </div>
          </div>

          {/* Footer / Signature */}
          <div className="mt-auto pt-10 flex justify-between items-end border-t-2 border-slate-100 relative z-10">
            <div className="text-center">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-16">Disediakan Secara Digital Oleh:</p>
              <div className="w-56 h-[1px] bg-slate-300 mx-auto" />
              <p className="text-sm font-black mt-3 text-slate-900 uppercase">({report.disediakan_oleh})</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-1">Kod Arkib Digital</p>
              <p className="text-[10px] text-slate-500 font-mono">OPR-{report.id}-{format(new Date(report.created_at), 'yyMM')}</p>
              <p className="text-[8px] text-slate-300 mt-1 uppercase italic">Timestamp: {format(new Date(report.created_at), 'dd/MM/yyyy HH:mm')}</p>
            </div>
          </div>

          {/* Official Seal Mockup */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-[0.05] pointer-events-none">
             <div className="w-40 h-40 border-4 border-slate-900 rounded-full flex items-center justify-center text-center p-4">
                <span className="font-black text-xs uppercase">SMA AL EHYA AL KARIM OFFICIAL RECORD</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
