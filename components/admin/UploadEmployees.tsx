'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileSpreadsheet, Trash2, Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface Employee {
  employeeCode: string;
  name: string;
  department: string;
}

interface UploadEmployeesProps {
  onUploadComplete: () => void;
}

export default function UploadEmployees({ onUploadComplete }: UploadEmployeesProps) {
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<Employee[]>([]);
  const [clearExisting, setClearExisting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(extension || '')) {
      toast.error('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      // Skip header row and parse data
      const employees: Employee[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row && row.length >= 3) {
          const employeeCode = String(row[0] || '').trim();
          const name = String(row[1] || '').trim();
          const department = String(row[2] || '').trim();
          
          if (employeeCode && name) {
            employees.push({
              employeeCode,
              name,
              department,
            });
          }
        }
      }

      if (employees.length === 0) {
        toast.error('Không tìm thấy dữ liệu nhân viên trong file');
        return;
      }

      setParsedData(employees);
      toast.success(`Đã đọc ${employees.length} nhân viên từ file`);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      toast.error('Lỗi khi đọc file Excel');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) {
      toast.error('Chưa có dữ liệu để upload');
      return;
    }

    setLoading(true);
    try {
      const adminPassword = sessionStorage.getItem('adminPassword');
      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword || '',
        },
        body: JSON.stringify({
          employees: parsedData,
          clearExisting,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setParsedData([]);
        onUploadComplete();
      } else {
        toast.error(result.error || 'Lỗi khi upload');
      }
    } catch (error) {
      console.error('Error uploading employees:', error);
      toast.error('Lỗi khi upload danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setParsedData([]);
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div className="space-y-2">
        <label className="text-sm text-slate-400">
          Chọn file Excel (cột: Mã NV, Họ tên, Phòng ban)
        </label>
        <div className="flex gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="bg-slate-700/50 border-slate-600 text-white file:bg-slate-600 file:text-white file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-lg hover:file:bg-slate-500"
          />
        </div>
      </div>

      {/* Preview Data */}
      {parsedData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-300">
                Đã đọc {parsedData.length} nhân viên
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Xóa
            </Button>
          </div>

          {/* Preview Table */}
          <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-600">
            <table className="w-full text-sm">
              <thead className="bg-slate-700/50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-slate-300">Mã NV</th>
                  <th className="px-3 py-2 text-left text-slate-300">Họ tên</th>
                  <th className="px-3 py-2 text-left text-slate-300">Phòng ban</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(0, 10).map((emp, idx) => (
                  <tr key={idx} className="border-t border-slate-700">
                    <td className="px-3 py-2 text-yellow-400 font-mono">{emp.employeeCode}</td>
                    <td className="px-3 py-2 text-white">{emp.name}</td>
                    <td className="px-3 py-2 text-slate-400">{emp.department}</td>
                  </tr>
                ))}
                {parsedData.length > 10 && (
                  <tr className="border-t border-slate-700">
                    <td colSpan={3} className="px-3 py-2 text-center text-slate-500">
                      ... và {parsedData.length - 10} nhân viên khác
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Options */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="clearExisting"
              checked={clearExisting}
              onChange={(e) => setClearExisting(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-yellow-500 focus:ring-yellow-500"
            />
            <label htmlFor="clearExisting" className="text-sm text-slate-400">
              Xóa toàn bộ dữ liệu cũ trước khi upload
            </label>
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Đang upload...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {parsedData.length} nhân viên
              </>
            )}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {parsedData.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-slate-600 rounded-xl">
          <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-slate-500" />
          <p className="text-slate-400 mb-2">Chọn file Excel để bắt đầu</p>
          <p className="text-xs text-slate-500">
            File cần có 3 cột: Mã nhân viên, Họ tên, Phòng ban
          </p>
        </div>
      )}
    </div>
  );
}
