import React, { useState } from 'react';
import { Download, FileText, Image, Film, Music, Archive, CheckSquare, Square } from 'lucide-react';
import type { BatchExportProps } from '../types/batch';

export const BatchExport: React.FC<BatchExportProps> = ({ documents, onClose }) => {
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [exportFormat, setExportFormat] = useState<'zip' | 'pdf' | 'json'>('zip');
  const [isExporting, setIsExporting] = useState(false);

  const toggleDocumentSelection = (docId: string) => {
    const newSelection = new Set(selectedDocuments);
    if (newSelection.has(docId)) {
      newSelection.delete(docId);
    } else {
      newSelection.add(docId);
    }
    setSelectedDocuments(newSelection);
  };

  const selectAll = () => {
    if (selectedDocuments.size === documents.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(documents.map(doc => doc.id)));
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Film className="h-4 w-4 text-purple-500" />;
      case 'mp3':
      case 'wav':
        return <Music className="h-4 w-4 text-green-500" />;
      default:
        return <Archive className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleExport = async () => {
    if (selectedDocuments.size === 0) return;

    setIsExporting(true);
    try {
      const selectedDocs = documents.filter(doc => selectedDocuments.has(doc.id));
      
      if (exportFormat === 'zip') {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        for (const doc of selectedDocs) {
          if (doc.file) {
            zip.file(doc.name, doc.file);
          } else if (doc.downloadUrl) {
            // Fetch the file from the download URL
            try {
              const response = await fetch(doc.downloadUrl);
              const blob = await response.blob();
              zip.file(doc.name, blob);
            } catch (error) {
              console.warn(`Failed to download file for ${doc.name}:`, error);
            }
          }
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `documents-export-${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'json') {
        const exportData = {
          exportDate: new Date().toISOString(),
          documents: selectedDocs.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            size: doc.size,
            tags: doc.tags,
            category: doc.category,
            uploadDate: doc.uploadDate,
            description: doc.description
          }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `documents-metadata-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Export Documents</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={selectAll}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              {selectedDocuments.size === documents.length ? (
                <CheckSquare className="h-5 w-5" />
              ) : (
                <Square className="h-5 w-5" />
              )}
              {selectedDocuments.size === documents.length ? 'Deselect All' : 'Select All'}
            </button>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Export Format:</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as 'zip' | 'pdf' | 'json')}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="zip">ZIP Archive</option>
                <option value="json">JSON Metadata</option>
              </select>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto border rounded-lg">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`flex items-center gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                  selectedDocuments.has(doc.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => toggleDocumentSelection(doc.id)}
              >
                <div className="flex-shrink-0">
                  {selectedDocuments.has(doc.id) ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-shrink-0">
                  {getFileIcon(doc.type)}
                </div>

                <div className="flex-grow min-w-0">
                  <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{doc.type.toUpperCase()}</span>
                    <span>{(doc.size / 1024 / 1024).toFixed(1)} MB</span>
                    <span>{doc.category}</span>
                  </div>
                </div>

                {doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {doc.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{doc.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-gray-600">
              {selectedDocuments.size} of {documents.length} documents selected
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isExporting}
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={selectedDocuments.size === 0 || isExporting}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export Selected'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};