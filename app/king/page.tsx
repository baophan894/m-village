'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
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

export default function KingPage() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchCandidates = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/candidates?category=king', { cache: 'no-store' });
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

  // Đóng menu khi route thay đổi
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const topThree = candidates.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#1A3553] text-white overflow-x-hidden">
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
              <Link href="/king/leaderboard">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-[#FFB353] hover:bg-[#FFB353]/10">
                  <Trophy className="w-4 h-4 mr-2 text-[#FFB353]" />
                  Bảng xếp hạng
                </Button>
              </Link>
              <Link href="/queen">
                <Button size="sm" className="bg-gradient-to-r from-[#FFB353] to-[#FF8C00] hover:from-[#FFC77D] hover:to-[#FFB353] text-[#1A3553] font-semibold">
                  <Crown className="w-4 h-4 mr-2" />
                  Vote Queen
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-[#1A3553] border-b border-[#FFB353]/20 shadow-lg p-4 space-y-2">
              <Link href="/king/leaderboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFB353]/10 transition-colors">
                <Trophy className="w-5 h-5 text-[#FFB353]" />
                <span className="font-medium text-white" style={{ fontFamily: "'Quicksand', sans-serif" }}>Bảng xếp hạng King</span>
              </Link>
              <Link href="/queen" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFB353]/10 transition-colors">
                <Crown className="w-5 h-5 text-[#FFB353]" />
                <span className="font-medium text-white" style={{ fontFamily: "'Quicksand', sans-serif" }}>Bình chọn Queen</span>
              </Link>
              <div className="border-t border-[#FFB353]/20 pt-2 mt-2">
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFB353]/10 transition-colors">
                  <Users className="w-5 h-5 text-[#FFB353]" />
                  <span className="font-medium text-white/60" style={{ fontFamily: "'Quicksand', sans-serif" }}>Quản trị</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center mt-16 px-4 overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
          <Image
            src="/backdrop.jpg"
            alt="Year End Party 2026"
            fill
            className="object-cover object-center blur-[2px]"
            priority
          />
          {/* Sophisticated Gradient Overlay - more muted */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A3553]/80 via-[#1A3553]/70 to-[#132842]/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A3553]/50 via-transparent to-[#1A3553]/50" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB353]/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF8C00]/5 rounded-full blur-3xl -ml-40 -mb-40" />

        <div className="relative z-10 text-center w-full max-w-7xl mx-auto py-16 sm:py-20 px-4 sm:px-6">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-[#FFB353]/15 border border-[#FFB353]/40 rounded-full mb-8 backdrop-blur-sm transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="w-2 h-2 bg-[#FFB353] rounded-full animate-pulse" />
            <span className="text-[#FFB353] font-semibold text-xs sm:text-sm">YEAR END CELEBRATION</span>
          </div>

          {/* Main Heading */}
          <div className={`mb-6 transition-all duration-700 [text-shadow:_0_4px_24px_rgba(0,0,0,0.4)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="font-black leading-tight text-center">
              <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white block mb-2 drop-shadow-lg italic" style={{ fontFamily: "'Gloock', serif" }}>Vote For</span>
            </h1>
            <div className="flex justify-center w-full">
              <h2 className="font-black leading-none pb-2 text-center">
                <span
                  className="
                    inline-block whitespace-nowrap italic drop-shadow-lg
                    text-8xl xs:text-9xl sm:text-10xl md:text-[11rem] lg:text-[13rem] xl:text-[15rem]
                   bg-gradient-to-r from-[#FFFFCC] via-[#f5dbae] to-[#FFCC66]
                    bg-clip-text text-transparent
                    px-[0.15em]
                    translate-x-[-0.08em]
                  "
                  style={{
                    fontFamily: "'Imperial Script', cursive",
                    paddingBottom: '0.12em',
                    lineHeight: 1.05,
                  }}
                >
                  Your King
                </span>
              </h2>
            </div>
          </div>

          {/* Subtitle */}
          <p className={`text-lg sm:text-xl md:text-2xl text-white font-semibold mb-8 transition-all duration-700 delay-100 drop-shadow-md ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            GreenYellow Year End Party 2026
          </p>

          {/* Date */}
          <div className={`flex items-center justify-center gap-2 text-[#FFB353]/90 font-semibold text-sm sm:text-base transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-1 h-1 bg-[#FFB353] rounded-full" />
            <span>FEBRUARY 6TH, 2026</span>
            <div className="w-1 h-1 bg-[#FFB353] rounded-full" />
          </div>

          <div className={`mt-12 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a href="#voting" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFB353] to-[#FF8C00] hover:from-[#FFC77D] hover:to-[#FFB353] text-white rounded-full font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Crown className="w-4 h-4" />
              START VOTING
              <span className="ml-1">→</span>
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
                <p className="text-center font-semibold text-white text-sm sm:text-base max-w-[120px] sm:max-w-[160px] mt-2 break-words leading-snug">{topThree[1]?.name}</p>
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
                <p className="text-center font-bold text-white text-base sm:text-lg max-w-[140px] sm:max-w-[200px] mt-2 break-words leading-snug">{topThree[0]?.name}</p>
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
                <p className="text-center font-semibold text-white text-sm sm:text-base max-w-[120px] sm:max-w-[160px] mt-2 break-words leading-snug">{topThree[2]?.name}</p>
                <p className="text-[#FFB353] font-bold text-lg">{topThree[2]?.votes?.toLocaleString()}</p>
                <span className="text-white/50 text-xs">votes</span>
              </div>
            </div>

            {/* View full leaderboard */}
            <div className="text-center mt-10">
              <Link href="/king/leaderboard">
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

          <VotingGrid category="king" />
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
              <Link href="/queen" className="text-white/60 hover:text-[#FFB353] transition-colors text-sm">Vote Queen</Link>
              <Link href="/king/leaderboard" className="text-white/60 hover:text-[#FFB353] transition-colors text-sm">Leaderboard</Link>
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
