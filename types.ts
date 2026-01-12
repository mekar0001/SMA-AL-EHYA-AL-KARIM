
export interface OPRReport {
  id: string;
  nama_program: string;
  anjuran: string;
  tarikh: string;
  masa: string;
  tempat: string;
  bilangan_peserta: string;
  sasaran: string;
  objektif: string;
  aktiviti: string;
  rumusan: string;
  disediakan_oleh: string;
  created_at: string;
  images_data: string[]; // base64 strings
}

export type ViewState = 'form' | 'dashboard' | 'preview';
