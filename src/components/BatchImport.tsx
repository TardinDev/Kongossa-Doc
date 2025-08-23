import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, Film, Music, Archive, X, CheckCircle, AlertCircle } from 'lucide-react';
interface Document {
  name: string;
  type: string;
  size: number;
  file?: File;
  uploadDate: string;
  category: string;
  tags: string[];
  description: string;
  thumbnail?: string;
}

interface ImportFile {
  file: File;
  preview?: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
  documentId?: string;
}

interface BatchImportProps {
  onImport: (documents: Document[]) => Promise<void>;
  onClose: () => void;
}

export const BatchImport: React.FC<BatchImportProps> = ({ onImport, onClose }) => {
  const [files, setFiles] = useState<ImportFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [defaultCategory, setDefaultCategory] = useState('General');
  const [defaultTags, setDefaultTags] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/avi',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
    'text/plain',
    'application/zip',
    'application/json'
  ];

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (type.startsWith('video/')) return <Film className="h-5 w-5 text-purple-500" />;
    if (type.startsWith('audio/')) return <Music className="h-5 w-5 text-green-500" />;
    if (type.includes('pdf') || type.includes('word') || type.includes('document')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <Archive className="h-5 w-5 text-gray-500" />;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (!supportedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert(`File ${file.name} is too large (max 50MB)`);
        return false;
      }
      return true;
    });

    const importFiles: ImportFile[] = validFiles.map(file => {
      const importFile: ImportFile = {
        file,
        status: 'pending'
      };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          importFile.preview = e.target?.result as string;
          setFiles(prev => [...prev]);
        };
        reader.readAsDataURL(file);
      }

      return importFile;
    });

    setFiles(prev => [...prev, ...importFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    setIsImporting(true);
    const processedDocuments: Document[] = [];

    for (let i = 0; i < files.length; i++) {
      const importFile = files[i];
      setFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, status: 'processing' } : f
      ));

      try {
        const fileExtension = importFile.file.name.split('.').pop()?.toLowerCase() || '';
        const tags = defaultTags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);

        const document: Document = {
          name: importFile.file.name,
          type: fileExtension,
          size: importFile.file.size,
          file: importFile.file,
          uploadDate: new Date().toISOString(),
          category: defaultCategory,
          tags: tags,
          description: '',
          thumbnail: importFile.preview
        };

        processedDocuments.push(document);

        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'success' } : f
        ));
      } catch (error) {
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { 
            ...f, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error'
          } : f
        ));
      }
    }

    try {
      await onImport(processedDocuments);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Batch import failed:', error);
      alert('Some files failed to import. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const successCount = files.filter(f => f.status === 'success').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  const processingCount = files.filter(f => f.status === 'processing').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Import Documents</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isImporting}
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* Default Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Category
              </label>
              <select
                value={defaultCategory}
                onChange={(e) => setDefaultCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                disabled={isImporting}
              >
                <option value="General">General</option>
                <option value="Contracts">Contracts</option>
                <option value="Invoices">Invoices</option>
                <option value="Reports">Reports</option>
                <option value="Presentations">Presentations</option>
                <option value="Media">Media</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Tags (comma-separated)
              </label>
              <input
                type="text"
                value={defaultTags}
                onChange={(e) => setDefaultTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                disabled={isImporting}
              />
            </div>
          </div>

          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-500 mb-4">
              Supports: PDF, DOC, DOCX, Images, Videos, Audio (max 50MB each)
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isImporting}
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={supportedTypes.join(',')}
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {files.map((importFile, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                  >
                    {importFile.preview ? (
                      <img
                        src={importFile.preview}
                        alt={importFile.file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center">
                        {getFileIcon(importFile.file.type)}
                      </div>
                    )}

                    <div className="flex-grow min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {importFile.file.name}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{(importFile.file.size / 1024 / 1024).toFixed(1)} MB</span>
                        <span>{importFile.file.type}</span>
                      </div>
                      {importFile.error && (
                        <p className="text-sm text-red-600 mt-1">{importFile.error}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {importFile.status === 'pending' && (
                        <span className="text-gray-500 text-sm">Waiting</span>
                      )}
                      {importFile.status === 'processing' && (
                        <span className="text-blue-600 text-sm">Processing...</span>
                      )}
                      {importFile.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {importFile.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      
                      {!isImporting && (
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Summary */}
          {isImporting && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>Import Progress</span>
                <span>{successCount + errorCount} / {files.length}</span>
              </div>
              <div className="mt-2 bg-white rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((successCount + errorCount) / files.length) * 100}%` }}
                ></div>
              </div>
              {processingCount > 0 && (
                <p className="text-sm text-blue-600 mt-2">
                  Processing {processingCount} file(s)...
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {files.length > 0 && (
              <>
                {successCount > 0 && (
                  <span className="text-green-600 mr-4">✓ {successCount} successful</span>
                )}
                {errorCount > 0 && (
                  <span className="text-red-600">✗ {errorCount} failed</span>
                )}
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isImporting}
            >
              Cancel
            </button>
            <button
              onClick={processFiles}
              disabled={files.length === 0 || isImporting}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-4 w-4" />
              {isImporting ? 'Importing...' : `Import ${files.length} Files`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};