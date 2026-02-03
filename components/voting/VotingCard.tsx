'use client';

import Image from 'next/image';
import { Heart, Check, ZoomIn, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface VotingCardProps {
  candidate: {
    _id: string;
    name: string;
    image: string;
    votes: number;
    category: 'queen' | 'king';
  };
  hasVoted: boolean;
  hasVotedInCategory: boolean;
  onVote: (candidateId: string) => void;
  onImageClick: () => void;
  voting: boolean;
  rank?: number;
}

export default function VotingCard({ 
  candidate, 
  hasVoted, 
  hasVotedInCategory,
  onVote, 
  onImageClick,
  voting, 
  rank 
}: VotingCardProps) {
  const [localVotes, setLocalVotes] = useState(candidate.votes);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    setLocalVotes(candidate.votes);
  }, [candidate.votes]);

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVoted || hasVotedInCategory || isVoting || voting) return;

    setIsVoting(true);
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId: candidate._id,
          category: candidate.category,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocalVotes(data.votes);
        onVote(candidate._id);
        toast.success('🎉 Bình chọn thành công!', {
          description: `Bạn đã bình chọn cho ${candidate.name}`,
        });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Không thể bình chọn');
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Không thể bình chọn');
    } finally {
      setIsVoting(false);
    }
  };

  const canVote = !hasVoted && !hasVotedInCategory && !voting && !isVoting;
  const isDisabled = hasVotedInCategory && !hasVoted;

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl bg-[#132842] shadow-lg border-2 transition-all duration-300 
        ${hasVoted ? 'border-green-400 ring-2 ring-green-400/30' : 'border-[#FFB353]/20 hover:border-[#FFB353]/50'} 
        ${isDisabled ? 'opacity-50 grayscale' : 'hover:shadow-xl hover:-translate-y-1'}
      `}
    >
      {/* Rank Badge */}
      {rank && rank <= 3 && (
        <div className={`absolute top-3 left-3 z-20 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg ${
          rank === 1 ? 'bg-gradient-to-br from-[#FFB353] to-[#FF8C00] text-[#1A3553]' :
          rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
          'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
        }`}>
          {rank === 1 ? <Trophy className="w-5 h-5" /> : rank}
        </div>
      )}

      {/* Voted Badge */}
      {hasVoted && (
        <div className="absolute top-3 right-3 z-20 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg" style={{ fontFamily: "'Quicksand', sans-serif" }}>
          <Check className="w-3 h-3" />
          Đã chọn
        </div>
      )}

      {/* Card Image */}
      <div 
        className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer"
        onClick={onImageClick}
      >
        <Image
          src={candidate.image || "/placeholder.svg"}
          alt={candidate.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Zoom icon overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
            <ZoomIn className="w-7 h-7 text-gray-700" />
          </div>
        </div>
        
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#132842] to-transparent" />
        
        {/* Vote count on image */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFB353]/20 backdrop-blur-sm border border-[#FFB353]/30">
            <Heart className="w-4 h-4 text-[#FFB353] fill-[#FFB353]" />
            <span className="font-bold text-sm text-[#FFB353]">{localVotes.toLocaleString()}</span>
            <span className="text-white/60 text-xs">votes</span>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="p-4 bg-[#132842]">
        <h3 className="font-bold text-white text-base sm:text-lg mb-3 break-words leading-snug min-h-[3.5rem]">{candidate.name}</h3>
        
        {/* Vote button - Full width */}
        {canVote && (
          <button
            onClick={handleVote}
            disabled={!canVote}
            className="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 active:scale-95 bg-gradient-to-r from-[#FFB353] to-[#FF8C00] hover:from-[#FFC77D] hover:to-[#FFB353] text-[#1A3553] shadow-lg flex items-center justify-center gap-2"
          >
            {isVoting ? (
              <div className="w-5 h-5 border-2 border-[#1A3553]/30 border-t-[#1A3553] rounded-full animate-spin" />
            ) : (
              <>
                <Heart className="w-5 h-5" />
                BÌNH CHỌN
              </>
            )}
          </button>
        )}
        
        {hasVoted && (
          <div className="w-full px-4 py-3 rounded-xl text-sm font-bold bg-green-500/20 text-green-400 flex items-center justify-center gap-2 border border-green-500/30">
            <Check className="w-5 h-5" />
            ĐÃ BÌNH CHỌN
          </div>
        )}
        
        {isDisabled && !hasVoted && (
          <div className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-gray-500/20 text-gray-400 flex items-center justify-center gap-2 border border-gray-500/30">
            Bạn đã vote người khác
          </div>
        )}
      </div>
    </div>
  );
}
