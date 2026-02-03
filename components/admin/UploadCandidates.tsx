'use client';

import React from "react"
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Plus, Crown, ImagePlus, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

interface UploadCandidatesProps {
  onCandidateAdded: () => void;
}

export default function UploadCandidates({ onCandidateAdded }: UploadCandidatesProps) {
  const [category, setCategory] = useState<'queen' | 'king' | ''>('');
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File, nameOverride?: string) => {
    try {
      const adminPassword = sessionStorage.getItem('adminPassword');
      
      // Get filename without extension for candidate name
      const fullName = file.name.split('/').pop() || file.name;
      const filename = fullName.replace(/\.[^/.]+$/, '');

      // Step 1: Get Cloudinary signature from our API
      const signatureResponse = await fetch('/api/admin/cloudinary-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword || '',
        },
        body: JSON.stringify({ filename }),
      });

      if (!signatureResponse.ok) {
        throw new Error('Failed to get upload signature');
      }

      const { signature, timestamp, publicId, cloudName, apiKey } = await signatureResponse.json();

      // Step 2: Upload directly to Cloudinary from client
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp.toString());
      formData.append('public_id', publicId);
      formData.append('folder', 'voting_app');
      formData.append('api_key', apiKey);

      const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      
      const uploadResponse = await fetch(cloudinaryUploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Cloudinary upload failed:', errorText);
        throw new Error('Failed to upload to Cloudinary');
      }

      const uploadData = await uploadResponse.json();
      console.log('Cloudinary upload success:', uploadData);

      // Step 3: Create candidate with the Cloudinary URL
      const candidateName = nameOverride || filename;
      const candidateResponse = await fetch('/api/admin/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword || '',
        },
        body: JSON.stringify({
          name: candidateName,
          image: uploadData.secure_url,
          cloudinaryId: uploadData.public_id,
          category,
        }),
      });

      if (!candidateResponse.ok) {
        const errorText = await candidateResponse.text();
        console.error('Candidate creation failed:', errorText);
        throw new Error('Failed to create candidate');
      }

      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      return false;
    }
  };

  const handleSingleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!category) {
      toast.error('Vui lòng chọn hạng mục');
      return;
    }

    const files = e.target.files;
    if (!files) return;

    setLoading(true);
    try {
      const file = files[0];
      const success = await uploadFile(file, customName || undefined);

      if (success) {
        toast.success('Đã thêm ứng viên thành công');
        setCustomName('');
        onCandidateAdded();
      } else {
        toast.error('Không thể thêm ứng viên');
      }
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!category) {
      toast.error('Vui lòng chọn hạng mục');
      return;
    }

    const files = e.target.files;
    if (!files) return;

    // Filter for image files only
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      toast.error('Không tìm thấy file ảnh nào');
      return;
    }

    setLoading(true);
    setUploadProgress({ current: 0, total: imageFiles.length });

    try {
      // Upload all files in parallel using Promise.all
      const uploadPromises = imageFiles.map(async (file, index) => {
        const success = await uploadFile(file);
        // Update progress after each file completes
        setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }));
        return success;
      });

      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(r => r).length;

      toast.success(`Đã thêm ${successCount}/${imageFiles.length} ứng viên thành công`);
      onCandidateAdded();
    } finally {
      setLoading(false);
      setUploadProgress({ current: 0, total: 0 });
      if (multiFileInputRef.current) multiFileInputRef.current.value = '';
    }
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!category) {
      toast.error('Vui lòng chọn hạng mục');
      return;
    }

    const files = e.target.files;
    if (!files) return;

    // Filter for image files only
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      toast.error('Không tìm thấy file ảnh nào trong folder');
      return;
    }

    setLoading(true);
    setUploadProgress({ current: 0, total: imageFiles.length });

    try {
      // Upload all files in parallel using Promise.all
      const uploadPromises = imageFiles.map(async (file, index) => {
        const success = await uploadFile(file);
        // Update progress after each file completes
        setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }));
        return success;
      });

      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(r => r).length;

      toast.success(`Đã thêm ${successCount}/${imageFiles.length} ứng viên từ folder`);
      onCandidateAdded();
    } finally {
      setLoading(false);
      setUploadProgress({ current: 0, total: 0 });
      if (folderInputRef.current) folderInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Selection */}
      <div>
        <label className="text-sm font-medium mb-2 block text-slate-300">Hạng mục</label>
        <Select value={category} onValueChange={(v) => setCategory(v as 'queen' | 'king')}>
          <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white focus:ring-yellow-500/20">
            <SelectValue placeholder="Chọn hạng mục" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="queen" className="text-white hover:bg-slate-700 focus:bg-slate-700">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-pink-400" />
                Queen
              </div>
            </SelectItem>
            <SelectItem value="king" className="text-white hover:bg-slate-700 focus:bg-slate-700">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-blue-400" />
                King
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Progress Bar */}
      {loading && uploadProgress.total > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Đang upload...</span>
            <span className="text-sm font-medium text-yellow-400">
              {uploadProgress.current}/{uploadProgress.total}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Single Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 block">Upload đơn</label>
          <Input
            type="text"
            placeholder="Tên ứng viên (tùy chọn)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            disabled={loading}
            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-yellow-500/50"
          />
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleSingleUpload}
            disabled={loading}
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || !category}
            variant="outline"
            className="w-full bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50 hover:text-yellow-400 hover:border-yellow-500/50 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Chọn 1 ảnh
          </Button>
        </div>

        {/* Bulk Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 block">Upload nhiều</label>
          <div className="h-10" /> {/* Spacer */}
          <Input
            type="file"
            ref={multiFileInputRef}
            onChange={handleBulkUpload}
            disabled={loading}
            accept="image/*"
            multiple
            className="hidden"
          />
          <Button
            onClick={() => multiFileInputRef.current?.click()}
            disabled={loading || !category}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
          >
            <Upload className="w-4 h-4 mr-2" />
            Chọn nhiều ảnh
          </Button>
        </div>

        {/* Folder Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 block">Upload folder</label>
          <div className="h-10" /> {/* Spacer */}
          <input
            type="file"
            ref={folderInputRef}
            onChange={handleFolderUpload}
            disabled={loading}
            accept="image/*"
            // @ts-ignore - webkitdirectory is not in the type definition but works in browsers
            webkitdirectory=""
            // @ts-ignore
            directory=""
            multiple
            className="hidden"
          />
          <Button
            onClick={() => folderInputRef.current?.click()}
            disabled={loading || !category}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 font-semibold shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Chọn folder
          </Button>
        </div>
      </div>

      {/* Info text */}
      <p className="text-xs text-slate-500 text-center">
        Hỗ trợ: JPG, PNG, GIF, WebP. Tên file sẽ được dùng làm tên ứng viên.
      </p>
    </div>
  );
}
