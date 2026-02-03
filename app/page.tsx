'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Crown, Trophy, ChevronDown, Heart, Sparkles, Star } from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Hero Section with backdrop */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Starry Background */}
        <div className="absolute inset-0 -z-10">
          {/* Dark gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628]" />
          
          {/* Animated stars */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Big stars */}
            <div className="absolute w-2 h-2 bg-white rounded-full top-[10%] left-[15%] animate-pulse shadow-[0_0_10px_#fff]" />
            <div className="absolute w-3 h-3 bg-cyan-300 rounded-full top-[20%] left-[80%] animate-pulse shadow-[0_0_15px_#67e8f9]" />
            <div className="absolute w-2 h-2 bg-white rounded-full top-[35%] left-[25%] animate-pulse shadow-[0_0_10px_#fff]" />
            <div className="absolute w-2 h-2 bg-teal-300 rounded-full top-[15%] left-[60%] animate-pulse shadow-[0_0_12px_#5eead4]" />
            <div className="absolute w-3 h-3 bg-white rounded-full top-[45%] left-[90%] animate-pulse shadow-[0_0_15px_#fff]" />
            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-[60%] left-[10%] animate-pulse shadow-[0_0_10px_#22d3ee]" />
            <div className="absolute w-2 h-2 bg-white rounded-full top-[70%] left-[70%] animate-pulse shadow-[0_0_10px_#fff]" />
            <div className="absolute w-3 h-3 bg-teal-400 rounded-full top-[80%] left-[40%] animate-pulse shadow-[0_0_15px_#2dd4bf]" />
            
            {/* Small stars */}
            <div className="absolute w-1 h-1 bg-white/80 rounded-full top-[5%] left-[30%]" />
            <div className="absolute w-1 h-1 bg-white/60 rounded-full top-[12%] left-[45%]" />
            <div className="absolute w-1 h-1 bg-white/70 rounded-full top-[25%] left-[55%]" />
            <div className="absolute w-1 h-1 bg-white/50 rounded-full top-[30%] left-[85%]" />
            <div className="absolute w-1 h-1 bg-white/80 rounded-full top-[40%] left-[5%]" />
            <div className="absolute w-1 h-1 bg-white/60 rounded-full top-[50%] left-[35%]" />
            <div className="absolute w-1 h-1 bg-white/70 rounded-full top-[55%] left-[75%]" />
            <div className="absolute w-1 h-1 bg-white/50 rounded-full top-[65%] left-[50%]" />
            <div className="absolute w-1 h-1 bg-white/80 rounded-full top-[75%] left-[20%]" />
            <div className="absolute w-1 h-1 bg-white/60 rounded-full top-[85%] left-[65%]" />
            <div className="absolute w-1 h-1 bg-white/70 rounded-full top-[90%] left-[15%]" />
            <div className="absolute w-1 h-1 bg-white/50 rounded-full top-[95%] left-[88%]" />
          </div>
          
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between px-6 py-4 bg-[#0a1628]/80 backdrop-blur-xl border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-white">GREENYELLOW</span>
              <p className="text-[10px] text-cyan-300/70">Year End Party 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/queen">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-pink-400 hover:bg-pink-500/10">
                <Crown className="w-4 h-4 mr-1 sm:mr-2 text-pink-400" />
                <span className="hidden sm:inline">Queen</span>
              </Button>
            </Link>
            <Link href="/king">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-cyan-400 hover:bg-cyan-500/10">
                <Crown className="w-4 h-4 mr-1 sm:mr-2 text-cyan-400" />
                <span className="hidden sm:inline">King</span>
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400">
                Admin
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className={`relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-12 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 font-medium text-sm">Mã đáo Thành công 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">GreenYellow</span>
            <br />
            <span className="text-white">Year End Party</span>
          </h1>

          <p className="text-cyan-100/70 text-lg sm:text-xl mb-10 max-w-xl">
            Bình chọn cho King & Queen của đêm hội Year End Party 2026
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/queen">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/50 hover:-translate-y-1 transition-all text-lg">
                <Crown className="w-5 h-5 mr-2" />
                Vote Queen
              </Button>
            </Link>
            <Link href="/king">
              <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all text-lg">
                <Crown className="w-5 h-5 mr-2" />
                Vote King
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <ChevronDown className="w-8 h-8 text-cyan-400/50" />
          </div>
        </div>
      </section>

      {/* Voting Categories Section */}
      <section className="py-20 px-4 bg-[#0d1f3c] relative">
        {/* Stars decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-1 h-1 bg-white/40 rounded-full top-[10%] left-[20%]" />
          <div className="absolute w-1 h-1 bg-white/30 rounded-full top-[30%] left-[80%]" />
          <div className="absolute w-1 h-1 bg-white/50 rounded-full top-[70%] left-[15%]" />
          <div className="absolute w-1 h-1 bg-white/40 rounded-full top-[90%] left-[75%]" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300 font-semibold text-sm">Hạng mục bình chọn</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Chọn hạng mục & bình chọn
            </h2>
            <p className="text-cyan-200/60 max-w-md mx-auto">
              Bình chọn cho ứng viên yêu thích của bạn trong mỗi hạng mục
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Queen Card */}
            <Link href="/queen" className="group">
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2d4d] to-[#0d1f3c] border-2 border-pink-500/20 p-8 transition-all duration-700 hover:border-pink-400/50 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ transitionDelay: '200ms' }}>
            
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-bl-full" />
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-3 text-white">
                    Vote for Queen
                  </h3>
                  <p className="text-center text-cyan-200/60 mb-6">
                    Bình chọn cho Nữ hoàng của đêm hội
                  </p>
                  <div className="flex justify-center">
                    <span className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-white font-semibold group-hover:shadow-lg group-hover:shadow-pink-500/50 transition-all flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Bình chọn ngay
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* King Card */}
            <Link href="/king" className="group">
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2d4d] to-[#0d1f3c] border-2 border-cyan-500/20 p-8 transition-all duration-700 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ transitionDelay: '400ms' }}>
            
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full" />
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-3 text-white">
                    Vote for King
                  </h3>
                  <p className="text-center text-cyan-200/60 mb-6">
                    Bình chọn cho Nam vương của đêm hội
                  </p>
                  <div className="flex justify-center">
                    <span className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl text-white font-semibold group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Bình chọn ngay
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-[#0a1628] relative">
        {/* Stars decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-2 h-2 bg-cyan-400/30 rounded-full top-[15%] left-[10%] animate-pulse" />
          <div className="absolute w-1 h-1 bg-white/40 rounded-full top-[40%] left-[85%]" />
          <div className="absolute w-1 h-1 bg-white/30 rounded-full top-[60%] left-[25%]" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Cách thức bình chọn
            </h2>
            <p className="text-cyan-200/60">Đơn giản và nhanh chóng</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`text-center p-8 bg-gradient-to-br from-[#1a2d4d] to-[#0d1f3c] rounded-2xl border border-cyan-500/20 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '300ms' }}>
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-cyan-500/30">
                1
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Chọn hạng mục</h3>
              <p className="text-cyan-200/60 text-sm">Chọn Queen hoặc King để bắt đầu bình chọn</p>
            </div>

            <div className={`text-center p-8 bg-gradient-to-br from-[#1a2d4d] to-[#0d1f3c] rounded-2xl border border-pink-500/20 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '500ms' }}>
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-pink-500/30">
                2
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Bình chọn</h3>
              <p className="text-cyan-200/60 text-sm">Click vào nút Vote để bình chọn cho ứng viên yêu thích</p>
            </div>

            <div className={`text-center p-8 bg-gradient-to-br from-[#1a2d4d] to-[#0d1f3c] rounded-2xl border border-yellow-500/20 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '700ms' }}>
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-yellow-500/30">
                3
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Xem kết quả</h3>
              <p className="text-cyan-200/60 text-sm">Theo dõi bảng xếp hạng realtime</p>
            </div>
          </div>

          {/* View Leaderboard */}
          <div className="text-center mt-12">
            <Link href="/queen/leaderboard">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 font-bold px-8 py-6 text-lg rounded-2xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:-translate-y-1 transition-all"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Xem Bảng Xếp Hạng
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#061121] text-white py-12 px-4 border-t border-cyan-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div>
                  <p className="font-bold text-lg">GREENYELLOW</p>
                  <p className="text-cyan-300/60 text-sm">Year End Party 2026</p>
                </div>
              </div>
              <p className="text-cyan-200/50 text-sm">
                Mã đáo Thành công - Let&apos;s Grow!
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-cyan-300">Bình chọn</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/queen" className="text-cyan-200/60 hover:text-pink-400 transition-colors text-sm flex items-center gap-2">
                    <Crown className="w-4 h-4 text-pink-400" />
                    Vote Queen
                  </Link>
                </li>
                <li>
                  <Link href="/king" className="text-cyan-200/60 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2">
                    <Crown className="w-4 h-4 text-cyan-400" />
                    Vote King
                  </Link>
                </li>
              </ul>
            </div>

            {/* Leaderboards */}
            <div>
              <h4 className="font-semibold mb-4 text-cyan-300">Bảng xếp hạng</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/queen/leaderboard" className="text-cyan-200/60 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    Queen Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/king/leaderboard" className="text-cyan-200/60 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    King Leaderboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Event Info */}
            <div>
              <h4 className="font-semibold mb-4 text-cyan-300">Sự kiện</h4>
              <ul className="space-y-2 text-sm text-cyan-200/60">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Ngày 6 tháng 2, 2026
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-cyan-400" />
                  GreenYellow Vietnam
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-pink-400" />
                  Year End Party
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-cyan-500/10 pt-8 text-center">
            <p className="text-cyan-200/40 text-sm">
              © 2026 GreenYellow Vietnam. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
         