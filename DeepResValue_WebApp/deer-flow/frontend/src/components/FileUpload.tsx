import React, { useState, useRef } from 'react';
import { Upload, File as FileIcon, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// Allowed file types based on the backend requirements
const ALLOWED_EXTENSIONS = [
  '.csv', '.xlsx', '.xls', '.dta', '.sav', '.sas7bdat',
  '.pdf', '.doc', '.docx',
  '.zip', '.shp', '.geojson', '.txt', '.md', '.json'
];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMsg?: string;
}

export function FileUpload() {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const token = useAuthStore((state) => state.token);

  const validateFile = (file: File): string | null => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `不支持的文件格式: ${ext}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `文件大小不能超过 100MB`;
    }
    return null;
  };

  const handleFiles = (newFiles: File[]) => {
    const toUpload: UploadingFile[] = newFiles.map(file => {
      const error = validateFile(file);
      return {
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        status: error ? 'error' : 'pending',
        errorMsg: error || undefined
      };
    });
    
    setFiles(prev => [...prev, ...toUpload]);
    
    // Start uploading valid files
    toUpload.forEach(f => {
      if (f.status === 'pending') {
        uploadFile(f);
      }
    });
  };

  const uploadFile = async (uploadFile: UploadingFile) => {
    try {
      setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: 'uploading' } : f));
      
      // 1. 获取预签名 URL
      const presignedRes = await fetch('/api/files/presigned', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          filename: uploadFile.file.name,
          content_type: uploadFile.file.type || 'application/octet-stream',
          size: uploadFile.file.size
        })
      });
      
      if (!presignedRes.ok) {
        throw new Error('获取上传链接失败');
      }
      
      const presignedData = await presignedRes.json();
      const { upload_url, file_id } = presignedData;
      
      // 2. 直传 OSS
      const uploadRes = await fetch(upload_url, {
        method: 'PUT',
        body: uploadFile.file,
        headers: {
          'Content-Type': uploadFile.file.type || 'application/octet-stream'
        }
      });
      
      if (!uploadRes.ok) {
        throw new Error('文件上传到 OSS 失败');
      }
      
      // 3. 确认文件状态
      const confirmRes = await fetch(`/api/files/confirm/${file_id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!confirmRes.ok) {
        throw new Error('确认文件状态失败');
      }
      
      setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: 'success', progress: 100 } : f));
      
    } catch (error: any) {
      setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: 'error', errorMsg: error.message } : f));
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          onChange={onFileChange}
          accept={ALLOWED_EXTENSIONS.join(',')}
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">点击或拖拽文件上传</h3>
        <p className="text-sm text-gray-500 mb-2">支持多文件上传，单个文件不超过 100MB</p>
        <p className="text-xs text-gray-400">支持 {ALLOWED_EXTENSIONS.join(', ')}</p>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">上传列表</h4>
          <div className="space-y-2">
            {files.map(file => (
              <div key={file.id} className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <FileIcon className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate pr-4">{file.file.name}</p>
                    {file.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                    {file.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {file.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                  
                  {file.status === 'error' ? (
                    <p className="text-xs text-red-500">{file.errorMsg}</p>
                  ) : (
                    <p className="text-xs text-gray-500">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  )}
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                  className="ml-4 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
