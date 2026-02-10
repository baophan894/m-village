'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, X, Play } from 'lucide-react';

// ─── Big Slot digit ────────────────────────────────────────────────
interface BigSlotProps {
  finalValue: string;
  isSpinning: boolean;
  stopDelay: number;
}

function BigSlot({ finalValue, isSpinning, stopDelay }: BigSlotProps) {
  const [currentValue, setCurrentValue] = useState(finalValue);
  const [stopped, setStopped] = useState(!isSpinning);
  const [slowing, setSlowing] = useState(false);
  const intervalRef = useRef<any | null>(null);
  const timersRef = useRef<any[]>([]);

  useEffect(() => {
    if (isSpinning && !stopped) {
      const updateValue = () => {
        setCurrentValue(String(Math.floor(Math.random() * 10)));
      };

      intervalRef.current = setInterval(updateValue, 40);

      const slowDown1 = stopDelay - 1500;
      const slowDown2 = stopDelay - 1000;
      const slowDown3 = stopDelay - 500;
      const slowDown4 = stopDelay - 200;

      if (slowDown1 > 0) {
        timersRef.current.push(setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(updateValue, 70);
          }
        }, slowDown1));
      }

      if (slowDown2 > 0) {
        timersRef.current.push(setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(updateValue, 120);
            setSlowing(true);
          }
        }, slowDown2));
      }

      if (slowDown3 > 0) {
        timersRef.current.push(setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(updateValue, 220);
          }
        }, slowDown3));
      }

      if (slowDown4 > 0) {
        timersRef.current.push(setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(updateValue, 400);
          }
        }, slowDown4));
      }

      timersRef.current.push(setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setCurrentValue(finalValue);
        setStopped(true);
        setSlowing(false);
      }, stopDelay));

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        timersRef.current.forEach(t => clearTimeout(t));
        timersRef.current = [];
      };
    } else if (!isSpinning) {
      setStopped(true);
      setSlowing(false);
      setCurrentValue(finalValue);
    }
  }, [isSpinning, stopDelay, finalValue, stopped]);

  useEffect(() => {
    if (isSpinning) {
      setStopped(false);
      setSlowing(false);
    }
  }, [isSpinning]);

  return (
    <div
      className={`
        w-28 h-36 sm:w-36 sm:h-44 md:w-44 md:h-52
        bg-gradient-to-b from-[#0a1628] to-[#112244]
        backdrop-blur-sm rounded-2xl
        flex items-center justify-center
        text-6xl sm:text-7xl md:text-8xl font-extrabold
        shadow-xl border-4 transition-all duration-200
        ${stopped
          ? 'border-[#c062d6] shadow-[0_0_30px_rgba(192,98,214,0.6)] text-white scale-110'
          : slowing
            ? 'border-[#c062d6]/50 text-[#c9a0dc] shadow-[0_0_20px_rgba(192,98,214,0.3)]'
            : 'border-[#005a94] text-[#7ec8f0] shadow-[0_0_25px_rgba(0,90,148,0.7)]'
        }
      `}
    >
      <span className="transition-all duration-100 drop-shadow-[0_0_12px_rgba(192,98,214,0.5)]">
        {currentValue}
      </span>
    </div>
  );
}

// ─── Floating particles ────────────────────────────────────────────
const FloatingParticles = React.memo(function FloatingParticles() {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 4}s`,
        color: i % 2 === 0 ? 'bg-[#c062d6]/50' : 'bg-[#005a94]/50',
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute w-1.5 h-1.5 ${p.color} rounded-full animate-float`}
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
});

// ─── Main Page ─────────────────────────────────────────────────────
export default function LuckyDrawPage() {
  const [spinning, setSpinning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [winnerNumber, setWinnerNumber] = useState<number | null>(null);
  const [displayNumber, setDisplayNumber] = useState('00');
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  // Audio refs
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winnerSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    spinSoundRef.current = new Audio('/assets/sounds/spin.mp3');
    winnerSoundRef.current = new Audio('/assets/sounds/winner.mp3');
    spinSoundRef.current.loop = true;
    spinSoundRef.current.volume = 0.3;
    winnerSoundRef.current.volume = 1.0;
    return () => {
      spinSoundRef.current?.pause();
      winnerSoundRef.current?.pause();
    };
  }, []);

  const handleSpin = useCallback(() => {
    if (spinning || isProcessing) return;
    setIsProcessing(true);

    // Pick a random number 1 – 80
    const num = Math.floor(Math.random() * 80) + 1;
    const padded = String(num).padStart(2, '0');
    setDisplayNumber(padded);
    setWinnerNumber(num);
    setSpinning(true);

    // Play spin sound
    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play().catch(() => {});
    }

    // 2 digits: tens stops at 2600ms, units stops at 4200ms
    const totalAnimationTime = 4700;

    setTimeout(() => {
      setSpinning(false);
      setIsProcessing(false);
      setShowWinnerModal(true);
      setHistory((prev) => [num, ...prev]);

      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
        spinSoundRef.current.currentTime = 0;
      }
      if (winnerSoundRef.current) {
        winnerSoundRef.current.currentTime = 0;
        winnerSoundRef.current.play().catch(() => {});
      }
    }, totalAnimationTime);
  }, [spinning, isProcessing]);

  const digits = displayNumber.split('');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/assets/lucky-draw-bg.png')`,
          filter: 'blur(3px) brightness(0.4)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#050d1a]/85 via-[#0a1a3a]/75 to-[#050d1a]/85 z-0" />

      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 text-white flex flex-col min-h-screen">
        {/* Logos Header */}
        <header className="pt-8 pb-4">
          <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c062d6] to-[#a855c8] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <img
                src="/assets/logo-tf.jpg"
                alt="TF Sound & Light"
                className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full border-4 border-[#c062d6]/30 shadow-2xl shadow-[#c062d6]/40 hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="text-center px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#c062d6] via-[#e0a0f0] to-[#005a94] bg-clip-text text-transparent tracking-wide drop-shadow-[0_2px_10px_rgba(192,98,214,0.3)]">
                VÒNG QUAY MAY MẮN
              </h1>
              <p className="text-sm sm:text-base text-[#7ec8f0]/90 mt-2 tracking-widest font-medium">
                Year End Party 2026
              </p>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#005a94] to-[#0070b8] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <img
                src="/assets/logo-bloom.jpg"
                alt="Bloom Event"
                className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full border-4 border-[#005a94]/30 shadow-2xl shadow-[#005a94]/40 hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </header>

        {/* Main Spin Area */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-4">
          {/* Spin Display Card */}
          <div className="w-full max-w-2xl p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0a1a3a]/70 via-[#112244]/60 to-[#1a0a2e]/70 border border-[#005a94]/40 backdrop-blur-md shadow-2xl shadow-[#005a94]/20">
            {/* 2-digit slot display */}
            <div className="flex justify-center gap-4 sm:gap-6 md:gap-8">
              <BigSlot
                finalValue={digits[0]}
                isSpinning={spinning}
                stopDelay={2600}
              />
              <BigSlot
                finalValue={digits[1]}
                isSpinning={spinning}
                stopDelay={4200}
              />
            </div>

            {/* Range hint */}
            <p className="text-center text-[#7ec8f0]/60 text-sm mt-4">
              Số từ 01 đến 80
            </p>

            {/* Spin Button */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleSpin}
                disabled={spinning || isProcessing}
                size="lg"
                className={`
                  px-14 py-7 text-xl font-bold rounded-2xl
                  bg-gradient-to-r from-[#c062d6] via-[#a855c8] to-[#005a94]
                  text-white hover:from-[#d07ae0] hover:to-[#0070b8]
                  shadow-xl shadow-[#c062d6]/30
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300 hover:scale-105
                  border border-white/10
                  ${spinning ? 'animate-pulse' : ''}
                `}
              >
                {spinning ? (
                  <>
                    <Sparkles className="w-6 h-6 mr-3 animate-spin" />
                    Đang quay...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-3" />
                    QUAY SỐ
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-6 w-full max-w-2xl">
              <p className="text-sm text-[#7ec8f0]/60 mb-2 text-center">Lịch sử quay</p>
              <div className="flex flex-wrap justify-center gap-2">
                {history.map((num, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-[#112244]/80 border border-[#005a94]/30 text-[#c9a0dc] font-bold text-sm"
                  >
                    {String(num).padStart(2, '0')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Winner Modal */}
      {showWinnerModal && winnerNumber !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div
            className="absolute inset-0 backdrop-blur-md bg-[#050d1a]/80"
            onClick={() => setShowWinnerModal(false)}
          />

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-5%',
                  backgroundColor: ['#c062d6', '#005a94', '#e0a0f0', '#7ec8f0', '#a855c8', '#0070b8'][i % 6],
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Modal */}
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-[#c062d6]/60 bg-gradient-to-br from-[#0a1a3a]/95 via-[#112244]/95 to-[#1a0a2e]/95 backdrop-blur-xl shadow-2xl shadow-[#c062d6]/30 overflow-hidden">
            <div className="w-full p-8 md:p-12 flex flex-col items-center">
              {/* Close */}
              <button
                onClick={() => setShowWinnerModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#112244]/80 hover:bg-[#1a2d5a] transition-colors z-10 border border-[#005a94]/50"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="text-center animate-in zoom-in-95 duration-500">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">CHUC MUNG!</h2>

                <div className="my-8">
                  <p
                    className="text-8xl md:text-9xl font-extrabold animate-pulse
                      bg-gradient-to-r from-[#c062d6] via-[#e0a0f0] to-[#005a94] bg-clip-text text-transparent
                      drop-shadow-[0_0_30px_rgba(192,98,214,0.5)]"
                  >
                    {String(winnerNumber).padStart(2, '0')}
                  </p>
                  <p className="text-lg text-[#7ec8f0] mt-4">Số may mắn</p>
                </div>

                <Button
                  onClick={() => setShowWinnerModal(false)}
                  className="px-10 py-3 text-lg bg-gradient-to-r from-[#c062d6] to-[#005a94] text-white hover:from-[#d07ae0] hover:to-[#0070b8] font-bold rounded-xl shadow-xl shadow-[#c062d6]/30 border border-white/10"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}} />
    </div>
  );
}