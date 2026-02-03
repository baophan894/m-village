'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2, Heart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CandidateCardProps {
  candidate: {
    _id: string;
    name: string;
    image: string;
    votes: number;
    category: 'queen' | 'king';
  };
  onDelete: () => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export default function CandidateCard({ candidate, onDelete, isSelected, onToggleSelect }: CandidateCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa ứng viên này?')) return;

    setDeleting(true);
    try {
      const adminPassword = sessionStorage.getItem('adminPassword');
      const response = await fetch(`/api/admin/candidates?id=${candidate._id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': adminPassword || '',
        },
      });

      if (response.ok) {
        toast.success('Đã xóa ứng viên');
        onDelete();
      } else {
        toast.error('Không thể xóa ứng viên');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('Không thể xóa ứng viên');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/50">
      {/* Selection Checkbox */}
      {onToggleSelect && (
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-6 h-6 rounded-md border-2 border-slate-400 bg-slate-500 accent-cyan-400 checked:bg-cyan-400 checked:border-cyan-500 focus:ring-2 focus:ring-cyan-300 focus:ring-offset-0 cursor-pointer shadow-xl backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[3/4] w-full bg-slate-700/50 overflow-hidden">
        <Image
          src={candidate.image || "/placeholder.svg"}
          alt={candidate.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

        {/* Vote count badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-full">
          <Heart className="w-3 h-3 text-red-400 fill-red-400" />
          <span className="text-xs font-semibold text-white">{candidate.votes}</span>
        </div>

        {/* Category badge */}
        <div className={`absolute ${onToggleSelect ? 'top-9 left-2' : 'top-2 left-2'} px-2 py-1 rounded-full text-xs font-semibold ${candidate.category === 'queen'
            ? 'bg-pink-500/80 text-white'
            : 'bg-blue-500/80 text-white'
          }`}>
          {candidate.category === 'queen' ? 'Queen' : 'King'}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-white text-sm truncate mb-2">{candidate.name}</h3>

        {/* Delete button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          {deleting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
              Đang xóa...
            </div>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
