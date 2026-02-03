'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Crown, Trophy, ArrowLeft, Heart, TrendingUp, Menu, X } from 'lucide-react';

interface Candidate {
  _id: string;
  name: string;
  image: string;
  votes: number;
  lastVotedAt?: string;
  category: 'queen' | 'king';
}

export default function QueenLeaderboardPage() {
  const pathname = usePathname();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchCandidates = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/candidates?category=queen', {
        cache: 'no-store',
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        data.sort((a: Candidate, b: Candidate) => {
          if (b.votes !== a.votes) return b.votes - a.votes;
          if (!a.lastVotedAt) return 1;
          if (!b.lastVotedAt) return -1;
          return new Date(a.lastVotedAt).getTime() - new Date(b.lastVotedAt).getTime();
        });
        setCandidates(data);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchCandidates();
    const interval = setInterval(fetchCandidates, 3000);
    return () => clearInterval(interval);
  }, [fetchCandidates]);

  // Đóng menu khi route thay đổi
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A3553] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FFB353]/30 border-t-[#FFB353] rounded-full animate-spin" />
          <p className="text-white/60">Đang tải bảng xếp hạng...</p>
        </div>
      </div>
    );
  }

  const topThree = candidates.slice(0, 3);
  const rest = candidates.slice(3, 13);

  return (
    <div className="min-h-screen bg-[#1A3553] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A3553]/95 backdrop-blur-xl border-b border-[#FFB353]/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFB353] to-[#FF8C00] rounded-xl flex items-center justify-center">
                <span className="text-[#1A3553] font-bold text-lg">G</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-[#FFB353] text-sm">GREENYELLOW</p>
                <p className="text-[10px] text-white/60">Year End Party 2026</p>
              </div>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#FFB353]/10 transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>

            <div className="hidden md:flex items-center gap-2">
              <Link href="/queen">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-[#FFB353] hover:bg-[#FFB353]/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Bình chọn Queen
                </Button>
              </Link>
              <Link href="/king/leaderboard">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-[#FFB353] hover:bg-[#FFB353]/10">
                  <Crown className="w-4 h-4 mr-2 text-[#FFB353]" />
                  King Leaderboard
                </Button>
              </Link>
            </div>
          </nav>

          {menuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-[#1A3553] border-b border-[#FFB353]/20 p-4 space-y-2">
              <Link href="/queen" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFB353]/10 transition-colors">
                <Heart className="w-5 h-5 text-[#FFB353]" />
                <span className="font-medium text-white">Bình chọn Queen</span>
              </Link>
              <Link href="/king" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFB353]/10 transition-colors">
                <Crown className="w-5 h-5 text-[#FFB353]" />
                <span className="font-medium text-white">Bình chọn King</span>
              </Link>
              <Link href="/king/leaderboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFB353]/10 transition-colors">
                <Trophy className="w-5 h-5 text-[#FFB353]" />
                <span className="font-medium text-white">King Leaderboard</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className={`pt-24 pb-6 px-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ overflow: 'visible' }}>
        <div className="max-w-4xl mx-auto text-center" style={{ overflow: 'visible' }}>
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#FFB353] to-[#FF8C00] rounded-2xl shadow-lg mb-4">
            <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-[#1A3553]" />
          </div>

          <h1 className="font-black leading-[1.08] pb-2 overflow-visible">
            <span
              className="
                inline-block whitespace-nowrap italic drop-shadow-lg
                text-6xl sm:text-7xl md:text-[9rem] lg:text-[11rem] xl:text-[14rem]
                bg-gradient-to-r from-[#FFB353] via-[#FFC77D] to-[#FF8C00]
                bg-clip-text text-transparent
                px-[0.3em] -mx-[0.2em]
              "
              style={{
                fontFamily: "'Imperial Script', cursive",
                display: 'inline-block',
                whiteSpace: 'nowrap',
                paddingBottom: '0.12em',
                lineHeight: 1.05,
              }}
            >
              Leaderboard
            </span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg font-medium">Queen - Year End Party 2026</p>
          <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-[#FFB353] mx-auto mt-4" />
        </div>
      </section>

      {/* Top 3 Section */}
      {topThree.length >= 3 && (
        <section className={`max-w-5xl mx-auto px-2 sm:px-4 mb-8 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6">
            {/* 2nd Place */}
            <div className="flex flex-col items-center w-[30%] max-w-[140px] sm:max-w-[160px] md:max-w-[180px]">
              <div className="relative w-full">
                {/* Card */}
                <div className="relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-gray-400/50 shadow-xl bg-[#132842]">
                  <Image
                    src={topThree[1]?.image || '/placeholder.svg'}
                    alt={topThree[1]?.name || ''}
                    fill
                    className="object-cover"
                  />
                  {/* Rank Badge */}
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg flex items-center justify-center text-gray-900 font-bold text-xs sm:text-sm shadow-lg">
                    #2
                  </div>
                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 sm:p-3 text-center">
                    <p className="mx-auto max-w-[90%] text-white font-bold text-xs sm:text-sm break-words line-clamp-2 text-center">
                      {topThree[1]?.name}
                    </p>
                  </div>

                </div>
              </div>
              {/* Votes */}
              <div className="mt-2 sm:mt-3 text-center">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{topThree[1]?.votes?.toLocaleString()}</p>
                <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider">Lượt bình chọn</p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center w-[36%] max-w-[160px] sm:max-w-[200px] md:max-w-[220px] -mt-4 sm:-mt-6">
              <div className="relative w-full">
                {/* Card */}
                <div className="relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-[#FFB353] shadow-2xl bg-[#132842]">
                  <Image
                    src={topThree[0]?.image || '/placeholder.svg'}
                    alt={topThree[0]?.name || ''}
                    fill
                    className="object-cover"
                  />
                  {/* Name & Winner Badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-2 sm:p-4 text-center">
                    <p className="mx-auto max-w-[90%] text-white font-bold text-xs sm:text-sm md:text-base break-words line-clamp-2 text-center">{topThree[0]?.name}</p>
                    <div className="flex items-center justify-center mt-1">
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-[#FFB353] to-[#FF8C00] rounded-full text-[10px] sm:text-xs font-bold text-[#1A3553]">WINNER</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Votes */}
              <div className="mt-2 sm:mt-3 text-center">
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFB353]" />
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#FFB353]">{topThree[0]?.votes?.toLocaleString()}</p>
                </div>
                <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider">Lượt bình chọn</p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center w-[30%] max-w-[140px] sm:max-w-[160px] md:max-w-[180px]">
              <div className="relative w-full">
                {/* Card */}
                <div className="relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-amber-600/50 shadow-xl bg-[#132842]">
                  <Image
                    src={topThree[2]?.image || '/placeholder.svg'}
                    alt={topThree[2]?.name || ''}
                    fill
                    className="object-cover"
                  />
                  {/* Rank Badge */}
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                    #3
                  </div>
                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 sm:p-3 text-center">
                    <p className="mx-auto max-w-[90%] text-white font-bold text-xs sm:text-sm break-words line-clamp-2 text-center">{topThree[2]?.name}</p>
                  </div>
                </div>
              </div>
              {/* Votes */}
              <div className="mt-2 sm:mt-3 text-center">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{topThree[2]?.votes?.toLocaleString()}</p>
                <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider">Lượt bình chọn</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rest of Rankings */}
      {rest.length > 0 && (
        <section className={`max-w-3xl mx-auto px-4 pb-12 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-2">
            {rest.map((candidate, index) => (
              <div
                key={candidate._id}
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-300 ${index % 2 === 0 ? 'bg-[#132842]' : 'bg-[#1A3553]/50'
                  } hover:bg-[#1e3a5f]`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1A3553] rounded-full flex items-center justify-center font-bold text-white/60 text-xs sm:text-sm border border-[#FFB353]/20">
                  #{index + 4}
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 border-[#FFB353]/20 flex-shrink-0 bg-[#132842]">
                  <Image
                    src={candidate.image || '/placeholder.svg'}
                    alt={candidate.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm sm:text-base break-words">{candidate.name}</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 bg-[#FFB353]/10 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full">
                  <p className="text-[#FFB353] font-bold text-sm sm:text-base">{candidate.votes?.toLocaleString()}</p>
                  <span className="text-[#FFB353]/60 text-[10px] sm:text-xs hidden sm:inline">votes</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {candidates.length === 0 && (
        <div className="text-center py-20">
          <Crown className="w-16 h-16 mx-auto mb-4 text-[#FFB353]/30" />
          <p className="text-white/40">Chưa có ứng viên nào</p>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#132842] text-white border-t border-[#FFB353]/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFB353] to-[#FF8C00] rounded-xl flex items-center justify-center">
                <span className="text-[#1A3553] font-bold">G</span>
              </div>
              <div>
                <p className="font-bold text-[#FFB353]">GREENYELLOW</p>
                <p className="text-white/60 text-xs">Year End Party 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/queen" className="text-white/60 hover:text-[#FFB353] transition-colors text-sm">Vote Queen</Link>
              <Link href="/king" className="text-white/60 hover:text-[#FFB353] transition-colors text-sm">Vote King</Link>
            </div>
          </div>
          <div className="border-t border-[#FFB353]/10 mt-6 pt-6 text-center">
            <p className="text-white/40 text-sm">© 2026 GreenYellow Vietnam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
