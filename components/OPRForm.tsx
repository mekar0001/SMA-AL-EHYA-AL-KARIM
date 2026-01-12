
import React, { useState } from 'react';
import { OPRReport } from '../types';
import { CyberInput, CyberButton, InputWrapper, TechTitle } from './CyberUI';
import { Sparkles, Trash2, Camera, Wand2, Loader2, Info } from 'lucide-react';
import { refineReportContent, suggestObjectives } from '../services/geminiService';

interface OPRFormProps {
  onSave: (report: OPRReport) => void;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const OPRForm: React.FC<OPRFormProps> = ({ onSave, onToast }) => {
  const [formData, setFormData] = useState<Partial<OPRReport>>({
    tarikh: new Date().toISOString().split('T')[0],
    masa: new Date().toTimeString().slice(0, 5),
    images_data: [],
  });
  const [isRefining, setIsRefining] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImages = formData.images_data || [];
    const available = 4 - currentImages.length;
    
    if (files.length > available) {
      onToast(`Hanya ${available} slot gambar lagi tersedia.`, 'info');
    }
    
    const toUpload = files.slice(0, available);

    toUpload.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        onToast(`Fail ${file.name} terlalu besar (Max 5MB).`, 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({
          ...prev,
          images_data: [...(prev.images_data || []), ev.target?.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images_data: (prev.images_data || []).filter((_, i) => i !== index)
    }));
  };

  const refineField = async (field: keyof OPRReport) => {
    const originalText = formData[field] as string;
    if (!originalText || originalText.length < 5) {
      onToast("Teks terlalu pendek untuk dimurnikan.", "info");
      return;
    }
    
    setIsRefining(field);
    try {
      const refined = await refineReportContent(field, originalText);
      setFormData(prev => ({ ...prev, [field]: refined }));
      onToast("Teks Berjaya Dimurnikan oleh AI!", "success");
    } catch (err) {
      onToast("AI gagal memproses permintaan.", "error");
    } finally {
      setIsRefining(null);
    }
  };

  const generateAIObjectives = async () => {
    if (!formData.nama_program) {
      onToast("Sila isi Nama Program terlebih dahulu.", "info");
      return;
    }
    setIsRefining('objektif');
    try {
      const result = await suggestObjectives(formData.nama_program);
      setFormData(prev => ({ ...prev, objektif: result }));
      onToast("Objektif Cadangan AI Telah Dijana!", "success");
    } catch (err) {
      onToast("AI gagal menjana objektif.", "error");
    } finally {
      setIsRefining(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_program || !formData.anjuran || !formData.disediakan_oleh) {
      onToast("Sila lengkapkan maklumat wajib.", "error");
      return;
    }

    const completeReport: OPRReport = {
      ...formData as OPRReport,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    onSave(completeReport);
  };

  return (
    <div className="relative p-6 md:p-10 bg-blue-900/10 border border-cyan-500/20 rounded-3xl backdrop-blur-sm overflow-hidden cyber-corners">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Info size={120} className="text-cyan-400" />
      </div>

      <div className="text-center mb-12 relative">
        <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4 animate-pulse">
          <span className="text-[10px] font-orbitron font-bold text-cyan-400 tracking-widest">SYSTEM INITIALIZED</span>
        </div>
        <TechTitle text="BORANG LAPORAN OPR" className="text-3xl md:text-5xl" glitch />
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-cyan-500/40" />
          <p className="text-blue-300 font-orbitron text-[10px] tracking-widest uppercase">Input Data Terminal</p>
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-cyan-500/40" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputWrapper label="Nama Program / Aktiviti">
            <input type="text" id="nama_program" required className={CyberInput} value={formData.nama_program || ''} onChange={handleChange} placeholder="Contoh: Kejohanan Sukan Tahunan" />
          </InputWrapper>
          <InputWrapper label="Unit Penganjur">
            <input type="text" id="anjuran" required className={CyberInput} value={formData.anjuran || ''} onChange={handleChange} placeholder="Contoh: Unit Kokurikulum" />
          </InputWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InputWrapper label="Tarikh">
            <input type="date" id="tarikh" required className={CyberInput} value={formData.tarikh || ''} onChange={handleChange} />
          </InputWrapper>
          <InputWrapper label="Masa">
            <input type="time" id="masa" required className={CyberInput} value={formData.masa || ''} onChange={handleChange} />
          </InputWrapper>
          <InputWrapper label="Tempat Lokasi">
            <input type="text" id="tempat" required className={CyberInput} value={formData.tempat || ''} onChange={handleChange} placeholder="Contoh: Dewan Al-Ghazali" />
          </InputWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputWrapper label="Bilangan Peserta">
            <input type="text" id="bilangan_peserta" required className={CyberInput} value={formData.bilangan_peserta || ''} onChange={handleChange} placeholder="Contoh: 150 Orang" />
          </InputWrapper>
          <InputWrapper label="Kumpulan Sasaran">
            <input type="text" id="sasaran" required className={CyberInput} value={formData.sasaran || ''} onChange={handleChange} placeholder="Contoh: Semua Pelajar Tingkatan 5" />
          </InputWrapper>
        </div>

        <InputWrapper label="Objektif Program">
          <div className="relative">
            <textarea id="objektif" required rows={3} className={`${CyberInput} resize-none pr-14`} value={formData.objektif || ''} onChange={handleChange} placeholder="Apa yang ingin dicapai melalui program ini?" />
            <div className="absolute top-2 right-2 flex flex-col gap-2">
               <button 
                type="button" 
                onClick={generateAIObjectives}
                disabled={isRefining === 'objektif'}
                title="Guna AI untuk cadang objektif"
                className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 transition-all border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
              >
                {isRefining === 'objektif' ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
              </button>
            </div>
          </div>
        </InputWrapper>

        <InputWrapper label="Ringkasan Aktiviti">
          <div className="relative">
            <textarea id="aktiviti" required rows={4} className={`${CyberInput} resize-none pr-14`} value={formData.aktiviti || ''} onChange={handleChange} placeholder="Nyatakan aktiviti utama yang dijalankan..." />
            <button 
              type="button" 
              onClick={() => refineField('aktiviti')}
              disabled={isRefining === 'aktiviti'}
              title="Guna AI untuk murnikan ayat"
              className="absolute top-2 right-2 p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 transition-all border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
            >
              {isRefining === 'aktiviti' ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            </button>
          </div>
        </InputWrapper>

        <InputWrapper label="Rumusan & Pencapaian">
          <div className="relative">
            <textarea id="rumusan" required rows={4} className={`${CyberInput} resize-none pr-14`} value={formData.rumusan || ''} onChange={handleChange} placeholder="Rumuskan hasil atau impak program..." />
            <button 
              type="button" 
              onClick={() => refineField('rumusan')}
              disabled={isRefining === 'rumusan'}
              title="Guna AI untuk murnikan ayat"
              className="absolute top-2 right-2 p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 transition-all border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
            >
              {isRefining === 'rumusan' ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            </button>
          </div>
        </InputWrapper>

        <InputWrapper label="Disediakan Oleh (Nama Penuh)">
          <input type="text" id="disediakan_oleh" required className={CyberInput} value={formData.disediakan_oleh || ''} onChange={handleChange} placeholder="Masukkan nama penuh anda" />
        </InputWrapper>

        <div className="space-y-4">
          <label className="block font-orbitron text-[10px] text-cyan-400 tracking-widest uppercase font-bold pl-1">
            📷 Galeri Dokumentasi (Maksimum 4)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images_data?.map((img, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl border-2 border-cyan-500/40 overflow-hidden group shadow-lg shadow-cyan-500/5">
                <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={`Dokumentasi ${idx + 1}`} />
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  className="absolute inset-0 bg-red-600/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            ))}
            {(formData.images_data?.length || 0) < 4 && (
              <label className="cursor-pointer aspect-video flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all group">
                <Camera className="text-cyan-400/50 group-hover:text-cyan-400 mb-2 transition-colors" size={28} />
                <span className="text-[9px] text-blue-300/70 font-orbitron font-bold uppercase tracking-widest group-hover:text-cyan-400 transition-colors">Add Visual</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        <div className="pt-10">
          <CyberButton type="submit" className="w-full py-5 !text-xl shadow-[0_0_30px_rgba(0,194,255,0.2)]">
            HANTAR LAPORAN DIGITAL
          </CyberButton>
        </div>
      </form>
    </div>
  );
};

export default OPRForm;
