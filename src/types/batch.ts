export interface BatchDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  file?: File;
  downloadUrl?: string;
  uploadDate: string;
  category: string;
  tags: string[];
  description: string;
  thumbnail?: string;
}

export interface BatchExportProps {
  documents: BatchDocument[];
  onClose: () => void;
}

export interface BatchImportProps {
  onImport: (documents: BatchDocument[]) => Promise<void>;
  onClose: () => void;
}

export interface ImportFile {
  file: File;
  preview?: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
  documentId?: string;
}