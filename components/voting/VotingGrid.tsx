'use client';

  import { useEffect, useState, useCallback } from 'react';
  import VotingCard from './VotingCard';
  import ImageModal from './ImageModal';
  import { Card } from '@/components/ui/card';
  import { Trash2, AlertCircle, Loader2 } from 'lucide-react';

  interface Candidate {
    _id: string;
    name: string;
    image: string;
    votes: number;
    category: 'queen' | 'king';
  }

  interface VotingGridProps {
    category: 'queen' | 'king';
  }

  export default function VotingGrid({ category }: VotingGridProps) {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [votedCandidateId, setVotedCandidateId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [votingActive, setVotingActive] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [selectedRank, setSelectedRank] = useState<number | undefined>(undefined);
    const [mounted, setMounted] = useState(false);

    const fetchCandidates = useCallback(async () => {
      try {
        const response = await fetch(`/api/admin/candidates?category=${category}`, { cache: 'no-store' });
        const data = await response.json();
        if (Array.isArray(data)) {
          data.sort((a: Candidate, b: Candidate) => b.votes - a.votes);
          setCandidates(data);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    }, [category]);

    // Check localStorage for vote status
    useEffect(() => {
      const storageKey = `voted_${category}`;
      const votedId = localStorage.getItem(storageKey);
      if (votedId) {
        setVotedCandidateId(votedId);
      }
    }, [category]);

    const fetchVotingStatus = useCallback(async () => {
      try {
        const response = await fetch('/api/admin/voting');
        const data = await response.json();
        setVotingActive(data[category] ?? true);
      } catch (error) {
        console.error('Error fetching voting status:', error);
      }
    }, [category]);

    useEffect(() => {
      fetchCandidates();
      fetchVotingStatus();
      // Delay to ensure animation triggers on all devices
      const mountTimer = setTimeout(() => setMounted(true), 50);
      
      // Reduce polling frequency - only update every 30 seconds for vote counts
      const candidatesInterval = setInterval(fetchCandidates, 30000);
      const votingStatusInterval = setInterval(fetchVotingStatus, 30000);
      
      // Pause polling when tab is not visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          fetchCandidates();
          fetchVotingStatus();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        clearTimeout(mountTimer);
        clearInterval(candidatesInterval);
        clearInterval(votingStatusInterval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, [fetchCandidates, fetchVotingStatus]);

    const handleVote = (candidateId: string) => {
      const storageKey = `voted_${category}`;
      localStorage.setItem(storageKey, candidateId);
      // Set voted state immediately to disable other buttons
      setVotedCandidateId(candidateId);
      // Optimistic update - increment vote count locally
      setCandidates(prev => 
        prev.map(c => 
          c._id === candidateId 
            ? { ...c, votes: c.votes + 1 } 
            : c
        ).sort((a, b) => b.votes - a.votes)
      );
    };

    const handleClearVote = async () => {
      if (!votedCandidateId) return;
      
      try {
        // Call API to decrement the vote
        const response = await fetch('/api/vote', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            candidateId: votedCandidateId,
          }),
        });

        if (response.ok) {
          // Only clear localStorage after successful API call
          const storageKey = `voted_${category}`;
          localStorage.removeItem(storageKey);
          setVotedCandidateId(null);
          
          // Update local state to decrement vote count
          setCandidates(prev => 
            prev.map(c => 
              c._id === votedCandidateId 
                ? { ...c, votes: Math.max(0, c.votes - 1) } 
                : c
            ).sort((a, b) => b.votes - a.votes)
          );
          
          // Refresh from server to ensure accuracy
          fetchCandidates();
        }
      } catch (error) {
        console.error('Error clearing vote:', error);
      }
    };

    const openModal = (candidate: Candidate, rank: number) => {
      setSelectedCandidate(candidate);
      setSelectedRank(rank);
    };

    const closeModal = () => {
      setSelectedCandidate(null);
      setSelectedRank(undefined);
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#FFB353]/30 border-t-[#FFB353] rounded-full animate-spin" />
            <p className="text-white/60">Đang tải ứng viên...</p>
          </div>
        </div>
      );
    }

    if (!votingActive) {
      return (
        <Card className="p-8 text-center border-amber-500/30 bg-amber-500/10 rounded-2xl backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-12 h-12 text-amber-400" />
            <h3 className="text-xl font-bold text-amber-300">Tạm dừng bình chọn</h3>
            <p className="text-amber-200/60 max-w-md">Bình chọn cho hạng mục này đang tạm dừng. Vui lòng quay lại sau!</p>
          </div>
        </Card>
      );
    }

    if (candidates.length === 0) {
      return (
        <Card className="p-8 text-center rounded-2xl bg-[#132842] border-[#FFB353]/20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[#FFB353] animate-pulse" />
            <p className="text-white/60">Chưa có ứng viên nào.</p>
          </div>
        </Card>
      );
    }

    const hasVotedInCategory = votedCandidateId !== null;

    return (
      <>
        {/* Clear vote button - for testing */}
        {hasVotedInCategory && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={handleClearVote}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 transition-all hover:scale-105"
            >
              <Trash2 className="w-4 h-4" />
              Xóa lựa chọn 
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {candidates.map((candidate, index) => (
            <div
              key={candidate._id}
              className={`transition-all duration-700 ease-out ${
                mounted 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{
                transitionDelay: `${index * 80}ms`
              }}
            >
              <VotingCard
                candidate={candidate}
                hasVoted={votedCandidateId === candidate._id}
                hasVotedInCategory={hasVotedInCategory}
                onVote={handleVote}
                onImageClick={() => openModal(candidate, index + 1)}
                voting={!votingActive}
                rank={index + 1}
              />
            </div>
          ))}
        </div>

        <ImageModal
          isOpen={selectedCandidate !== null}
          onClose={closeModal}
          candidate={selectedCandidate}
          rank={selectedRank}
        />
      </>
    );
  }
