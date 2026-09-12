import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { uploadImageFile } from '../../lib/storage';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  compact?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  label = 'Image',
  placeholder = 'https://...',
  compact = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setErrorMessage(null);
    try {
      const publicUrl = await uploadImageFile(file);
      onChange(publicUrl);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setErrorMessage(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        accept="image/*"
        className="hidden"
      />

      {errorMessage && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button type="button" onClick={() => setErrorMessage(null)} className="font-bold ml-2">×</button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Thumbnail Preview if exists */}
        {value && (
          <div className="relative group shrink-0 w-12 h-10 rounded-lg overflow-hidden border border-white/10 bg-black/40">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        {/* URL Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="glass-input w-full rounded-lg px-3 py-2 text-sm pr-20"
            placeholder={placeholder}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive p-1 rounded"
              title="Clear"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {/* Upload Button */}
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="glass glass-hover px-3 py-2 rounded-lg text-xs font-semibold text-brand-blue border border-brand-blue/30 flex items-center gap-1.5 shrink-0"
          title="Upload image directly from device"
        >
          {isUploading ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={13} />
              <span>Upload File</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
