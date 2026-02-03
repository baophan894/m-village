'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Trophy, 
  Sparkles,
  Home,
  Users,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  Gift
} from 'lucide-react';
import { toast } from 'sonner';

interface Employee {
  _id: string;
  employeeCode: string;
  name: string;
  department: string;
}

interface Winner extends Employee {
  prizeType: string;
}

interface WinnersData {
  grouped: {
    special: Winner[];
    first: Winner[];
    second: Winner[];
    third: Winner[];
    consolation: Winner[];
    compensation: Winner[];
  };
  total: number;
}

type PrizeType = 'special' | 'first' | 'second' | 'third' | 'consolation' | 'compensation';

interface PrizeConfig {
  type: PrizeType;
  name: string;
  nameVi: string;
  totalWinners: number;
  winnersPerSpin: number;
  spinDuration: number; // Base spin duration in ms
  gradient: string;
  bgColor: string;
  borderColor: string;
}

const PRIZE_CONFIGS: PrizeConfig[] = [
  {
    type: 'consolation',
    name: 'Consolation',
    nameVi: 'Giải Khuyến Khích',
    totalWinners: 40,
    winnersPerSpin: 10,
    spinDuration: 1600, // 10 seconds total
    gradient: 'from-emerald-400 to-cyan-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  {
    type: 'third',
    name: 'Third Prize',
    nameVi: 'Giải Ba',
    totalWinners: 3,
    winnersPerSpin: 1,
    spinDuration: 1600, // 10 seconds total
    gradient: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  {
    type: 'second',
    name: 'Second Prize',
    nameVi: 'Giải Nhì',
    totalWinners: 3,
    winnersPerSpin: 1,
    spinDuration: 2200, // 14 seconds total
    gradient: 'from-slate-300 to-gray-400',
    bgColor: 'bg-slate-400/10',
    borderColor: 'border-slate-400/30',
  },
  {
    type: 'first',
    name: 'First Prize',
    nameVi: 'Giải Nhất',
    totalWinners: 2,
    winnersPerSpin: 1,
    spinDuration: 2200, // 14 seconds total
    gradient: 'from-yellow-300 to-amber-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
  },
  {
    type: 'special',
    name: 'Special Prize',
    nameVi: 'Giải Đặc Biệt',
    totalWinners: 1,
    winnersPerSpin: 1,
    spinDuration: 2200, // 14 seconds total
    gradient: 'from-purple-400 via-pink-500 to-rose-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  {
    type: 'compensation',
    name: 'Compensation',
    nameVi: 'Quay Bù',
    totalWinners: Infinity, // Không giới hạn
    winnersPerSpin: 1,
    spinDuration: 1600,
    gradient: 'from-sky-400 to-blue-500',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
  },
];

// Slot component for each character
interface SlotProps {
  finalValue: string;
  isSpinning: boolean;
  stopDelay: number;
  isLetter: boolean;
}

function Slot({ finalValue, isSpinning, stopDelay, isLetter }: SlotProps) {
  const [currentValue, setCurrentValue] = useState(finalValue);
  const [stopped, setStopped] = useState(!isSpinning);
  const [slowing, setSlowing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (isSpinning && !stopped) {
      const updateValue = () => {
        if (isLetter) {
          setCurrentValue(['M', 'V'][Math.floor(Math.random() * 2)]);
        } else {
          setCurrentValue(String(Math.floor(Math.random() * 10)));
        }
      };
      
      // Start fast
      intervalRef.current = setInterval(updateValue, 40);

      // Progressive slowdown - multiple stages
      const slowDown1 = stopDelay - 1200;
      const slowDown2 = stopDelay - 800;
      const slowDown3 = stopDelay - 400;
      const slowDown4 = stopDelay - 200;

      if (slowDown1 > 0) {
        timersRef.current.push(setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(updateValue, 60);
          }
        }, slowDown1));
      }

      if (slowDown2 > 0) {
        timersRef.current.push(setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(updateValue, 100);
            setSlowing(true);
          }
        }, slowDown2));
      }

      if (slowDown3 > 0) {
        timersRef.current.push(setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(updateValue, 180);
          }
        }, slowDown3));
      }

      if (slowDown4 > 0) {
        timersRef.current.push(setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(updateValue, 300);
          }
        }, slowDown4));
      }

      // Stop after delay
      timersRef.current.push(setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
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
  }, [isSpinning, stopDelay, finalValue, isLetter, stopped]);

  // Reset when spinning starts again
  useEffect(() => {
    if (isSpinning) {
      setStopped(false);
      setSlowing(false);
    }
  }, [isSpinning]);

  return (
    <div 
      className={`
        w-8 h-10 sm:w-9 sm:h-11 md:w-10 md:h-12 
        bg-gradient-to-b from-indigo-900/90 to-purple-900/90 
        backdrop-blur-sm rounded-md 
        flex items-center justify-center 
        text-lg sm:text-xl md:text-2xl font-bold 
        shadow-md border-2 transition-all duration-200
        ${stopped 
          ? 'border-amber-400 shadow-amber-400/50 text-amber-300 scale-105' 
          : slowing
            ? 'border-amber-400/50 text-amber-200 shadow-amber-400/30'
            : 'border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.6)]'
        }
      `}
    >
      <span className="transition-all duration-100">
        {currentValue}
      </span>
    </div>
  );
}

// Big Slot for single winner prizes
interface BigSlotProps {
  finalValue: string;
  isSpinning: boolean;
  stopDelay: number;
  isLetter: boolean;
}

function BigSlot({ finalValue, isSpinning, stopDelay, isLetter }: BigSlotProps) {
  const [currentValue, setCurrentValue] = useState(finalValue);
  const [stopped, setStopped] = useState(!isSpinning);
  const [slowing, setSlowing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (isSpinning && !stopped) {
      const updateValue = () => {
        if (isLetter) {
          setCurrentValue(['M', 'V'][Math.floor(Math.random() * 2)]);
        } else {
          setCurrentValue(String(Math.floor(Math.random() * 10)));
        }
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
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
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
  }, [isSpinning, stopDelay, finalValue, isLetter, stopped]);

  useEffect(() => {
    if (isSpinning) {
      setStopped(false);
      setSlowing(false);
    }
  }, [isSpinning]);

  return (
    <div 
      className={`
        w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 
        bg-gradient-to-b from-indigo-900/90 to-purple-900/90 
        backdrop-blur-sm rounded-xl 
        flex items-center justify-center 
        text-4xl sm:text-5xl md:text-6xl font-bold 
        shadow-xl border-3 transition-all duration-200
        ${stopped 
          ? 'border-amber-400 shadow-amber-400/60 shadow-2xl text-amber-300 scale-110' 
          : slowing
            ? 'border-amber-400/50 text-amber-200 shadow-amber-400/30'
            : 'border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.7)]'
        }
      `}
    >
      <span className="transition-all duration-100">
        {currentValue}
      </span>
    </div>
  );
}

// Single employee code display with slot animation
interface EmployeeSlotProps {
  employeeCode: string;
  isSpinning: boolean;
  baseDelay: number;
  delayPerChar: number;
  isSingle?: boolean;
}

function EmployeeSlot({ employeeCode, isSpinning, baseDelay, delayPerChar, isSingle = false }: EmployeeSlotProps) {
  const chars = employeeCode.padEnd(6, '0').substring(0, 6).split('');
  
  if (isSingle) {
    return (
      <div className="flex gap-2 sm:gap-3 justify-center">
        {chars.map((char, idx) => (
          <BigSlot
            key={idx}
            finalValue={char}
            isSpinning={isSpinning}
            stopDelay={baseDelay + idx * delayPerChar}
            isLetter={idx < 2}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex gap-1 sm:gap-1.5 justify-center">
      {chars.map((char, idx) => (
        <Slot
          key={idx}
          finalValue={char}
          isSpinning={isSpinning}
          stopDelay={baseDelay + idx * delayPerChar}
          isLetter={idx < 2}
        />
      ))}
    </div>
  );
}

// Floating particles component - optimized
const FloatingParticles = React.memo(function FloatingParticles() {
  const particles = React.useMemo(() => 
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
    })), []
  );
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-amber-400/60 rounded-full animate-float"
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

export default function LuckyDrawPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [winners, setWinners] = useState<WinnersData | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Prevent double clicks
  const [currentSpinResult, setCurrentSpinResult] = useState<Winner[]>([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectedPrizeType, setSelectedPrizeType] = useState<PrizeType>('consolation');
  const [preSelectedWinners, setPreSelectedWinners] = useState<Winner[]>([]);
  const [expandedPrizes, setExpandedPrizes] = useState<Set<PrizeType>>(new Set());
  const [loading, setLoading] = useState(true);
  const [viewingPrize, setViewingPrize] = useState<PrizeType | null>(null);

  // Audio refs for sound effects
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winnerSoundRef = useRef<HTMLAudioElement | null>(null);

  const selectedPrize = PRIZE_CONFIGS.find(p => p.type === selectedPrizeType)!;
  const viewingPrizeConfig = viewingPrize ? PRIZE_CONFIGS.find(p => p.type === viewingPrize) : null;;

  // Initialize audio on mount
  useEffect(() => {
    spinSoundRef.current = new Audio('/assets/sounds/spin.mp3');
    winnerSoundRef.current = new Audio('/assets/sounds/winner.mp3');
    spinSoundRef.current.loop = true;
    spinSoundRef.current.volume = 0.3; // 50% volume for spin
    winnerSoundRef.current.volume = 1.0; // 100% volume for winner (max)
    
    return () => {
      spinSoundRef.current?.pause();
      winnerSoundRef.current?.pause();
    };
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchEmployees(), fetchWinners()]);
    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/admin/employees?hasWonPrize=false');
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchWinners = async () => {
    try {
      const res = await fetch('/api/admin/spin');
      const data = await res.json();
      setWinners(data);
    } catch (error) {
      console.error('Error fetching winners:', error);
    }
  };

  const getPrizeWinners = (prizeType: PrizeType): Winner[] => {
    return winners?.grouped?.[prizeType] || [];
  };

  const handleSpin = async () => {
    if (spinning || isProcessing) return;

    const config = selectedPrize;

    if (employees.length < config.winnersPerSpin) {
      toast.error(`Không đủ nhân viên để quay! Cần ${config.winnersPerSpin} người.`);
      return;
    }

    // Disable button immediately
    setIsProcessing(true);

    try {
      const response = await fetch('/api/admin/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prizeType: config.type,
          count: config.winnersPerSpin,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Lỗi khi quay số');
        setIsProcessing(false);
        return;
      }

      setPreSelectedWinners(result.winners);
      setSpinning(true);
      setCurrentSpinResult([]);

      // Play spin sound
      if (spinSoundRef.current) {
        spinSoundRef.current.currentTime = 0;
        spinSoundRef.current.play().catch(() => {});
      }

      // Calculate animation time based on slot stopping
      // 6 characters, each stops with delayPerChar interval
      const charsPerCode = 6;
      const delayPerChar = config.spinDuration;
      const baseDelay = config.winnersPerSpin === 1 ? 1000 : 500;
      const lastCharStopTime = baseDelay + (charsPerCode - 1) * delayPerChar;
      const totalAnimationTime = lastCharStopTime + 500; // Add buffer for final stop

      setTimeout(() => {
        setSpinning(false);
        setIsProcessing(false); // Re-enable button
        setCurrentSpinResult(result.winners);
        setShowWinnerModal(true);
        fetchEmployees();
        fetchWinners();
        
        // Stop spin sound and play winner sound
        if (spinSoundRef.current) {
          spinSoundRef.current.pause();
          spinSoundRef.current.currentTime = 0;
        }
        if (winnerSoundRef.current) {
          winnerSoundRef.current.currentTime = 0;
          winnerSoundRef.current.play().catch(() => {});
        }
      }, totalAnimationTime);

    } catch (error) {
      console.error('Error spinning:', error);
      toast.error('Lỗi khi quay số');
      setIsProcessing(false); // Re-enable button on error
    }
  };

  const handleReset = async () => {
    if (!confirm('Bạn có chắc muốn reset tất cả kết quả quay số?')) return;

    try {
      const response = await fetch('/api/admin/employees/reset', { method: 'POST' });
      if (response.ok) {
        toast.success('Đã reset tất cả kết quả');
        setPreSelectedWinners([]);
        setCurrentSpinResult([]);
        fetchData();
      } else {
        toast.error('Lỗi khi reset');
      }
    } catch (error) {
      toast.error('Lỗi khi reset');
    }
  };

  const toggleExpanded = (prizeType: PrizeType) => {
    setExpandedPrizes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(prizeType)) newSet.delete(prizeType);
      else newSet.add(prizeType);
      return newSet;
    });
  };

  const isSpinDisabled = () => {
    return spinning || isProcessing;
  };

  const getRemainingSpins = () => {
    const currentWinners = getPrizeWinners(selectedPrize.type);
    if (selectedPrize.totalWinners === Infinity) {
      return '∞'; // Không giới hạn
    }
    const remaining = selectedPrize.totalWinners - currentWinners.length;
    return selectedPrize.type === 'consolation' ? Math.ceil(remaining / 10) : remaining;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0b1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-purple-300 animate-pulse">Đang tải...</p>
        </div>
      </div>
    );
  }

  const displayCodes = spinning || preSelectedWinners.length > 0
    ? preSelectedWinners.map(w => w.employeeCode)
    : Array(selectedPrize.winnersPerSpin).fill('MV0000');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/assets/lucky-draw-bg.png')`,
          filter: 'blur(2px)',
        }}
      />
      {/* Gradient Overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0d0b1a]/80 via-[#1a0a2e]/70 to-[#0d0b1a]/80 z-0" />
      
      {/* Floating Particles */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 text-white">
        {/* Header */}
        <header className="border-b border-purple-500/20 bg-black/30 backdrop-blur-md sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                    LUCKY DRAW
                  </h1>
                  <p className="text-xs text-purple-300">Year End Party 2026</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-900/50 rounded-lg border border-purple-500/30">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-purple-200">{employees.length} chưa trúng</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/20 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <a href="/admin/dashboard">
                  <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 bg-transparent">
                    <Home className="w-4 h-4 mr-1" />
                    Dashboard
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          {/* Prize Selector */}
          <div className="max-w-md mx-auto mb-6">
            <label className="block text-sm text-purple-300 mb-2">Chọn giải thưởng</label>
            <Select value={selectedPrizeType} onValueChange={(v) => {
              setSelectedPrizeType(v as PrizeType);
              setPreSelectedWinners([]);
            }}>
              <SelectTrigger className="w-full bg-purple-900/50 border-purple-500/50 text-white backdrop-blur">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-purple-900/95 border-purple-500/50 backdrop-blur">
                {PRIZE_CONFIGS.map((config) => {
                  const prizeWinners = getPrizeWinners(config.type);
                  const totalDisplay = config.totalWinners === Infinity ? '∞' : config.totalWinners;
                  return (
                    <SelectItem 
                      key={config.type} 
                      value={config.type}
                      className="text-white hover:bg-purple-700/50 focus:bg-purple-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <span>{config.nameVi}</span>
                        <span className="text-xs text-purple-300">
                          ({prizeWinners.length}/{totalDisplay} đã trúng)
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Spin Display */}
          <div className="max-w-6xl mx-auto mb-6 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-purple-900/60 via-indigo-900/60 to-purple-900/60 border border-purple-500/30 backdrop-blur-md shadow-2xl shadow-purple-500/20">
            <h2 className={`text-2xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r ${selectedPrize.gradient} bg-clip-text text-transparent`}>
              {selectedPrize.nameVi}
            </h2>
            
            {/* Slot Machine Display */}
            {selectedPrize.winnersPerSpin === 1 ? (
              // Single winner - big centered display
              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-black/40 border-2 border-purple-500/40">
                  <EmployeeSlot
                    employeeCode={displayCodes[0]}
                    isSpinning={spinning}
                    baseDelay={1000}
                    delayPerChar={selectedPrize.spinDuration}
                    isSingle={true}
                  />
                </div>
              </div>
            ) : (
              // Multiple winners - responsive grid for consolation
              <div className="w-full overflow-x-hidden">
                <div className="flex flex-col gap-4 px-2 sm:px-4">
                  {/* First row: slots 1-5 */}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {displayCodes.slice(0, 5).map((code, idx) => (
                      <div 
                        key={idx} 
                        className="flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg bg-black/40 border border-amber-500/40 hover:border-amber-400/60 transition-colors min-w-fit"
                      >
                        <span className="text-xs sm:text-sm font-bold text-amber-400">#{idx + 1}</span>
                        <EmployeeSlot
                          employeeCode={code}
                          isSpinning={spinning}
                          baseDelay={500 + (idx * 120)}
                          delayPerChar={selectedPrize.spinDuration}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Second row: slots 6-10 */}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {displayCodes.slice(5, 10).map((code, idx) => (
                      <div 
                        key={idx + 5} 
                        className="flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg bg-black/40 border border-amber-500/40 hover:border-amber-400/60 transition-colors min-w-fit"
                      >
                        <span className="text-xs sm:text-sm font-bold text-amber-400">#{idx + 6}</span>
                        <EmployeeSlot
                          employeeCode={code}
                          isSpinning={spinning}
                          baseDelay={500 + ((idx + 5) * 120)}
                          delayPerChar={selectedPrize.spinDuration}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Spin Button */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleSpin}
                disabled={isSpinDisabled()}
                size="lg"
                className={`
                  px-12 py-6 text-xl font-bold rounded-2xl
                  bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500
                  text-purple-900 hover:from-amber-300 hover:to-amber-400
                  shadow-xl shadow-amber-500/30 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300 hover:scale-105
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

          {/* Winners Summary */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center text-amber-300">Danh sách người trúng giải</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRIZE_CONFIGS.map((config) => {
                const prizeWinners = getPrizeWinners(config.type);
                const isComplete = config.totalWinners !== Infinity && prizeWinners.length >= config.totalWinners;
                const totalDisplay = config.totalWinners === Infinity ? '∞' : config.totalWinners;

                return (
                  <button
                    key={config.type}
                    onClick={() => prizeWinners.length > 0 && setViewingPrize(config.type)}
                    disabled={prizeWinners.length === 0}
                    className={`
                      rounded-xl border border-purple-500/30 bg-purple-900/30 backdrop-blur 
                      p-3 flex items-center justify-between 
                      transition-colors text-left w-full
                      ${prizeWinners.length > 0 ? 'hover:bg-purple-800/30 cursor-pointer' : 'opacity-60 cursor-default'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                        {config.nameVi}
                      </span>
                      <span className="text-xs text-purple-300">
                        ({prizeWinners.length}/{totalDisplay})
                      </span>
                      {isComplete && <Trophy className="w-4 h-4 text-amber-400" />}
                    </div>
                    {prizeWinners.length > 0 && (
                      <span className="text-xs text-purple-400">Xem →</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Winner Modal - Overlay */}
      {showWinnerModal && currentSpinResult.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop - gray blur */}
          <div 
            className="absolute inset-0 backdrop-blur-md bg-gray-900/80"
            onClick={() => {
              setShowWinnerModal(false);
              setPreSelectedWinners([]);
            }}
          />
          
          {/* Celebration Effects - Reduced for performance */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-5%',
                  backgroundColor: ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#a78bfa', '#f97316'][i % 6],
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl max-h-[95vh] rounded-3xl border-2 border-purple-400/60 bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-violet-900/90 backdrop-blur-xl shadow-2xl shadow-purple-500/30 overflow-hidden">
            <div className="w-full p-6 md:p-10 flex flex-col items-center overflow-y-auto max-h-[95vh]">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowWinnerModal(false);
                  setPreSelectedWinners([]);
                }}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-purple-800/80 hover:bg-purple-700 transition-colors z-10 border-2 border-purple-400/50"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Content */}
              <div className="text-center w-full animate-in zoom-in-95 duration-500">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-2xl shadow-amber-500/50 animate-bounce">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-2">🎉 CHÚC MỪNG! 🎉</h2>
                  <p className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${selectedPrize.gradient} bg-clip-text text-transparent`}>
                    {selectedPrize.nameVi}
                  </p>
                </div>

                {/* Single winner - show BIG */}
                {currentSpinResult.length === 1 ? (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <p className="text-5xl md:text-7xl font-bold text-amber-400 animate-pulse">
                      {currentSpinResult[0].employeeCode}
                    </p>
                    <p className="text-3xl md:text-5xl text-white font-bold">
                      {currentSpinResult[0].name}
                    </p>
                    <p className="text-xl md:text-2xl text-purple-300">
                      {currentSpinResult[0].department}
                    </p>
                  </div>
                ) : (
                  /* Multiple winners - show grid */
                  <div className="flex justify-center">
                    <div className={`
                      max-h-[55vh] overflow-y-auto px-2 py-2
                      grid gap-3 justify-items-center
                      ${currentSpinResult.length > 6 
                        ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' 
                        : currentSpinResult.length > 3
                          ? 'grid-cols-2 md:grid-cols-3'
                          : 'grid-cols-1 md:grid-cols-2'
                      }
                    `}>
                      {currentSpinResult.map((winner, idx) => (
                        <div
                          key={winner._id}
                          className="p-4 rounded-xl bg-purple-800/60 border border-purple-500/50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-purple-700/60 animate-in slide-in-from-bottom w-full"
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <p className="text-xl md:text-2xl font-bold text-amber-400 mb-1">{winner.employeeCode}</p>
                          <p className="text-base text-white font-medium">{winner.name}</p>
                          <p className="text-sm text-purple-300">{winner.department}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => {
                    setShowWinnerModal(false);
                    setPreSelectedWinners([]);
                  }}
                  className="mt-6 px-10 py-3 text-lg bg-gradient-to-r from-amber-400 to-orange-500 text-purple-900 hover:from-amber-300 hover:to-orange-400 font-bold rounded-xl shadow-xl shadow-amber-500/30 border-2 border-amber-300"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Prize Winners Modal */}
      {viewingPrize && viewingPrizeConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop - gray blur */}
          <div 
            className="absolute inset-0 backdrop-blur-md bg-gray-900/80"
            onClick={() => setViewingPrize(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-5xl max-h-[95vh] rounded-3xl border-2 border-purple-400/60 bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-violet-900/90 backdrop-blur-xl shadow-2xl shadow-purple-500/30 overflow-hidden">
            <div className="w-full p-6 md:p-10 flex flex-col items-center overflow-y-auto max-h-[95vh]">
              {/* Close Button */}
              <button
                onClick={() => setViewingPrize(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-purple-800/80 hover:bg-purple-700 transition-colors z-10 border-2 border-purple-400/50"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Content */}
              <div className="text-center w-full">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-xl shadow-amber-500/40">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h2 className={`text-2xl md:text-4xl font-bold bg-gradient-to-r ${viewingPrizeConfig.gradient} bg-clip-text text-transparent`}>
                    {viewingPrizeConfig.nameVi}
                  </h2>
                  <p className="text-purple-300 mt-2">
                    {getPrizeWinners(viewingPrize).length} / {viewingPrizeConfig.totalWinners === Infinity ? '∞' : viewingPrizeConfig.totalWinners} người trúng giải
                  </p>
                </div>

                <div className="w-full flex justify-center">
                  <div className={`
                    max-h-[55vh] overflow-y-auto px-4 py-2 w-full
                    flex flex-wrap gap-3 justify-center
                  `}>
                    {getPrizeWinners(viewingPrize).map((winner) => (
                      <div
                        key={winner._id}
                        className="p-4 rounded-xl bg-purple-800/60 border border-purple-500/50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-purple-700/60 w-[180px]"
                      >
                        <p className="text-xl md:text-2xl font-bold text-amber-400 mb-1">{winner.employeeCode}</p>
                        <p className="text-base text-white font-medium">{winner.name}</p>
                        <p className="text-sm text-purple-300">{winner.department}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setViewingPrize(null)}
                  className="mt-6 px-10 py-3 text-lg bg-gradient-to-r from-amber-400 to-orange-500 text-purple-900 hover:from-amber-300 hover:to-orange-400 font-bold rounded-xl shadow-xl shadow-amber-500/30 border-2 border-amber-300"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
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
      `}</style>
    </div>
  );
}
