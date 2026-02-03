'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import VotingGrid from '@/components/voting/VotingGrid';
import { Button } from '@/components/ui/button';
import { Crown, Trophy, Menu, X, Users, Award, TrendingUp } from 'lucide-react';

interface Candidate {
  _id: string;
  name: string;
  image: string;
  votes: number;
  category: 'queen' | 'king';
}

export default function QueenPage() {
  const [mounted, setMounted] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchCandidates = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/candidates?category=queen', { cache: 'no-store' });
      const data = await response.json();
      if (Array.isArray(data)) {
        data.sort((a: Candidate, b: Candidate) => b.votes - a.votes);
        setCandidates(data);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchCandidates();
    const interval = setInterval(fetchCandidates, 3000);
    return () => clearInterval(interval);
  }, [fetchCandidates]);

  const topThree = candidates.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#1A3553] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A3553]/95 backdrop-blur-xl border-b border-[#FFB353]/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFB353] to-[#FF8C00] rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-5 h-5 text-[#1A3553]" />
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-[#FFB353] text-sm">GREENYELLOW</p>
                <p className="text-[10px] text-white/70">Year End Party 2026</p>
              </div>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#FFB353]/10 transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/queen/leaderboard">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-[#FFB353] hover:bg-[#FFB353]/10">
                  <Trophy className="w-4 h-4 mr-2 text-[#FFB353]" />
                  Bảng xếp hạng
                </Button>
              </Link>
              <Link href="/king">
                <Button size="sm" className="bg-gradient-to-r from-[#FFB353] to-[#FF8C00] hover:from-[#FFC77D] hover:to-[#FFB353] text-[#1A3553] font-semibold">
                  <Crown className="w-4 h-4 mr-2" />
                  Vote King
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-[#1A3553] border-b border-[#FFB353]/20 shadow-lg p-4 space-y-2">
              <Link href="/queen/leaderboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFB353]/10 transition-colors">
                <Trophy className="w-5 h-5 text-[#FFB353]" />
                <span className="font-medium text-white">Bảng xếp hạng Queen</span>
              </Link>
              <Link href="/king" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFB353]/10 transition-colors">
                <Crown className="w-5 h-5 text-[#FFB353]" />
                <span className="font-medium text-white">Bình chọn King</span>
              </Link>
              <div className="border-t border-[#FFB353]/20 pt-2 mt-2">
                <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFB353]/10 transition-colors">
                  <Users className="w-5 h-5 text-[#FFB353]" />
                  <span className="font-medium text-white/60">Quản trị</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[100vh] flex items-center justify-center overflow-hidden mt-16">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <Image 
            src="/backdrop.jpg"
            alt="Year End Party 2026"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Sophisticated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A3553]/60 via-[#1A3553]/55 to-[#132842]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A3553]/40 via-transparent to-[#1A3553]/40" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB353]/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF8C00]/5 rounded-full blur-3xl -ml-40 -mb-40" />

        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto py-16 sm:py-20">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-[#FFB353]/15 border border-[#FFB353]/40 rounded-full mb-8 backdrop-blur-sm transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="w-2 h-2 bg-[#FFB353] rounded-full animate-pulse" />
            <span className="text-[#FFB353] font-semibold text-xs sm:text-sm">YEAR END CELEBRATION</span>
          </div>

          {/* Main Heading */}
          <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight transition-all duration-700 [text-shadow:_0_4px_24px_rgba(0,0,0,0.4)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="text-white block mb-2 drop-shadow-lg" style={{ fontFamily: "'Gloock', serif" }}>Vote for</span>
            <span className="bg-gradient-to-r from-[#FFB353] via-[#FFC77D] to-[#FF8C00] bg-clip-text text-transparent drop-shadow-lg italic" style={{ fontFamily: "'Imperial Script', cursive", fontWeight: 700 }}>Your Queen</span>
          </h1>

          {/* Subtitle */}
          <p className={`text-base sm:text-lg md:text-xl text-white/85 font-medium mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            GreenYellow Year End Party 2026
          </p>

          {/* Date */}
          <div className={`flex items-center justify-center gap-2 text-[#FFB353]/90 font-semibold text-sm sm:text-base transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-1 h-1 bg-[#FFB353] rounded-full" />
            <span>FEBRUARY 6TH, 2026</span>
            <div className="w-1 h-1 bg-[#FFB353] rounded-full" />
          </div>

          {/* CTA Button */}
          <div className={`mt-12 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a href="#voting" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFB353] to-[#FF8C00] hover:from-[#FFC77D] hover:to-[#FFB353] text-[#1A3553] rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Crown className="w-5 h-5" />
              START VOTING
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Top 3 Ranking Section */}
      {topThree.length >= 3 && (
        <section className="py-8 sm:py-12 px-4 bg-[#132842]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFB353]/10 border border-[#FFB353]/30 rounded-full mb-4">
                <Award className="w-5 h-5 text-[#FFB353]" />
                <span className="text-[#FFB353] font-semibold text-sm">RANKING</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Top 3 Hiện Tại</h2>
            </div>

            {/* Top 3 podium */}
            <div className="flex items-end justify-center gap-3 sm:gap-6">
              {/* 2nd Place */}
              <div className={`flex flex-col items-center transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="relative mb-3">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-gray-400/50 shadow-xl bg-[#1A3553]">
                    <Image src={topThree[1]?.image || '/placeholder.svg'} alt={topThree[1]?.name || ''} fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-gray-800 font-bold text-lg shadow-lg">2</div>
                </div>
                <p className="text-center font-semibold text-white text-sm sm:text-base truncate max-w-[100px] sm:max-w-[140px] mt-2">{topThree[1]?.name}</p>
                <p className="text-[#FFB353] font-bold text-lg">{topThree[1]?.votes?.toLocaleString()}</p>
                <span className="text-white/50 text-xs">votes</span>
              </div>

              {/* 1st Place */}
              <div className={`flex flex-col items-center -mt-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Crown className="w-10 h-10 text-[#FFB353] mb-2" />
                <div className="relative mb-3">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-[#FFB353] shadow-xl bg-[#1A3553]">
                    <Image src={topThree[0]?.image || '/placeholder.svg'} alt={topThree[0]?.name || ''} fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-[#FFB353] to-[#FF8C00] rounded-full flex items-center justify-center text-[#1A3553] font-bold text-xl shadow-lg">1</div>
                </div>
                <p className="text-center font-bold text-white text-base sm:text-lg truncate max-w-[120px] sm:max-w-[160px] mt-2">{topThree[0]?.name}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-[#FFB353] font-bold text-xl">{topThree[0]?.votes?.toLocaleString()}</span>
                </div>
                <span className="text-white/50 text-xs">votes</span>
              </div>

              {/* 3rd Place */}
              <div className={`flex flex-col items-center transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="relative mb-3">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-amber-600/50 shadow-xl bg-[#1A3553]">
                    <Image src={topThree[2]?.image || '/placeholder.svg'} alt={topThree[2]?.name || ''} fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">3</div>
                </div>
                <p className="text-center font-semibold text-white text-sm sm:text-base truncate max-w-[100px] sm:max-w-[140px] mt-2">{topThree[2]?.name}</p>
                <p className="text-[#FFB353] font-bold text-lg">{topThree[2]?.votes?.toLocaleString()}</p>
                <span className="text-white/50 text-xs">votes</span>
              </div>
            </div>

            {/* View full leaderboard */}
            <div className="text-center mt-10">
              <Link href="/queen/leaderboard">
                <Button className="bg-gradient-to-r from-[#FFB353] to-[#FF8C00] hover:from-[#FFC77D] hover:to-[#FFB353] text-[#1A3553] px-8 py-3 rounded-full font-bold">
                  <Trophy className="w-4 h-4 mr-2" />
                  Xem Bảng Xếp Hạng Đầy Đủ
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Voting Section */}
      <section id="voting" className="py-12 px-4 bg-[#1A3553]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Tất Cả Ứng Viên</h2>
            <p className="text-white/60 text-sm sm:text-base">
              Nhấn vào ảnh để xem chi tiết • Mỗi thiết bị được vote <span className="text-[#FFB353] font-semibold">1 lần</span>
            </p>
          </div>
          
          <VotingGrid category="queen" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#132842] text-white border-t border-[#FFB353]/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFB353] to-[#FF8C00] rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#1A3553]" />
              </div>
              <div>
                <p className="font-bold text-[#FFB353]">GREENYELLOW</p>
                <p className="text-white/60 text-xs">Year End Party 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/king" className="text-white/60 hover:text-[#FFB353] transition-colors text-sm">Vote King</Link>
              <Link href="/queen/leaderboard" className="text-white/60 hover:text-[#FFB353] transition-colors text-sm">Leaderboard</Link>
              <Link href="/admin" className="text-white/60 hover:text-[#FFB353] transition-colors text-sm">Admin</Link>
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
