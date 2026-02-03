'use client';

import Image from 'next/image';
import { X, Heart, Crown } from 'lucide-react';
import { useEffect } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    _id: string;
    name: string;
    image: string;
    votes: number;
    category: 'queen' | 'king';
  } | null;
  rank?: number;
}

export default function ImageModal({ isOpen, onClose, candidate, rank }: ImageModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !candidate) return null;

  const isQueen = candidate.category === 'queen';

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Rank badge */}
        {rank && rank <= 3 && (
          <div className={`absolute top-4 left-4 z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${
            rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900' :
            rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900' :
            'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
          }`}>
            {rank === 1 && <Crown className="w-6 h-6" />}
            {rank !== 1 && rank}
          </div>
        )}

        {/* Image */}
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={candidate.image || '/placeholder.svg'}
            alt={candidate.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 512px"
            priority
          />
        </div>

        {/* Info section */}
        <div className={`p-6 bg-gradient-to-r ${isQueen ? 'from-pink-50 to-rose-50' : 'from-emerald-50 to-teal-50'}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{candidate.name}</h2>
          <div className="flex items-center gap-2">
            <Heart className={`w-5 h-5 ${isQueen ? 'text-pink-500' : 'text-emerald-500'} fill-current`} />
            <span className={`text-lg font-semibold ${isQueen ? 'text-pink-600' : 'text-emerald-600'}`}>
              {candidate.votes} lượt bình chọn
            </span>
          </div>
          {rank && (
            <p className="text-gray-500 mt-2">
              Đang xếp hạng #{rank} trong cuộc thi {isQueen ? 'Queen' : 'King'}
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
