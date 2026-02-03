'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadCandidates from '@/components/admin/UploadCandidates';
import UploadEmployees from '@/components/admin/UploadEmployees';
import CandidateCard from '@/components/admin/CandidateCard';
import { Button } from '@/components/ui/button';
import { LogOut, Power, Crown, Users, TrendingUp, Home, Sparkles, Menu, X, Upload, List, ChevronLeft, ChevronRight, Trash2, FileSpreadsheet, Gift } from 'lucide-react';
import { toast } from 'sonner';

interface Candidate {
  _id: string;
  name: string;
  image: string;
  votes: number;
  category: 'queen' | 'king';
}

type SidebarView = 'upload' | 'list' | 'employees';

export default function AdminDashboard() {
  const [queenCandidates, setQueenCandidates] = useState<Candidate[]>([]);
  const [kingCandidates, setKingCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingActive, setVotingActive] = useState({ queen: true, king: true });
  const [mounted, setMounted] = useState(false);
  const [sidebarView, setSidebarView] = useState<SidebarView>('upload');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [listCategory, setListCategory] = useState<'queen' | 'king'>('queen');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [deletingBulk, setDeletingBulk] = useState(false);
  const [employeeCount, setEmployeeCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const adminPassword = sessionStorage.getItem('adminPassword');
    if (!adminPassword) {
      router.push('/admin');
      return;
    }

    fetchCandidates();
    fetchVotingStatus();
    fetchEmployeeCount();
  }, [router]);

  const fetchCandidates = async () => {
    try {
      const [queenRes, kingRes] = await Promise.all([
        fetch('/api/admin/candidates?category=queen'),
        fetch('/api/admin/candidates?category=king'),
      ]);

      const queens = await queenRes.json();
      const kings = await kingRes.json();

      setQueenCandidates(Array.isArray(queens) ? queens : []);
      setKingCandidates(Array.isArray(kings) ? kings : []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVotingStatus = async () => {
    try {
      const response = await fetch('/api/admin/voting');
      const data = await response.json();
      setVotingActive({
        queen: data.queen ?? true,
        king: data.king ?? true,
      });
    } catch (error) {
      console.error('Error fetching voting status:', error);
    }
  };

  const fetchEmployeeCount = async () => {
    try {
      const response = await fetch('/api/admin/employees');
      const data = await response.json();
      setEmployeeCount(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error('Error fetching employee count:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminPassword');
    sessionStorage.removeItem('adminEmail');
    router.push('/admin');
  };

  const toggleVoting = async (category: 'queen' | 'king') => {
    try {
      const adminPassword = sessionStorage.getItem('adminPassword');
      const response = await fetch('/api/admin/voting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword || '',
        },
        body: JSON.stringify({
          category,
          isActive: !votingActive[category],
        }),
      });

      if (response.ok) {
        setVotingActive((prev) => ({
          ...prev,
          [category]: !prev[category],
        }));
        toast.success(`Bình chọn ${category} đã ${!votingActive[category] ? 'mở' : 'đóng'}`);
      }
    } catch (error) {
      console.error('Error toggling voting:', error);
      toast.error('Không thể thay đổi trạng thái bình chọn');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCandidates.length === 0) return;
    
    if (!confirm(`Bạn có chắc muốn xóa ${selectedCandidates.length} ứng viên?`)) return;

    setDeletingBulk(true);
    try {
      const adminPassword = sessionStorage.getItem('adminPassword');
      const response = await fetch('/api/admin/candidates/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword || '',
        },
        body: JSON.stringify({ ids: selectedCandidates }),
      });

      if (response.ok) {
        toast.success(`Đã xóa ${selectedCandidates.length} ứng viên`);
        setSelectedCandidates([]);
        fetchCandidates();
      } else {
        toast.error('Không thể xóa ứng viên');
      }
    } catch (error) {
      console.error('Error bulk deleting candidates:', error);
      toast.error('Không thể xóa ứng viên');
    } finally {
      setDeletingBulk(false);
    }
  };

  const toggleSelectCandidate = (id: string) => {
    setSelectedCandidates(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCandidates.length === currentCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(currentCandidates.map(c => c._id));
    }
  };

  const totalVotes = [...queenCandidates, ...kingCandidates].reduce((acc, c) => acc + c.votes, 0);
  const currentCandidates = listCategory === 'queen' ? queenCandidates : kingCandidates;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
          <p className="text-slate-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] text-white flex">
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col bg-slate-900/80 border-r border-slate-700/50 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                  Admin
                </h1>
                <p className="text-xs text-slate-400">Year End Party 2026</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setSidebarView('upload')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              sidebarView === 'upload'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Upload className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Upload</span>}
          </button>

          <button
            onClick={() => setSidebarView('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              sidebarView === 'list'
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <List className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Danh sách</span>}
          </button>

          <div className="my-4 border-t border-slate-700/50" />

          <button
            onClick={() => setSidebarView('employees')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              sidebarView === 'employees'
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Nhân viên</span>}
          </button>

      
        </nav>

  
        

        {/* Collapse Button */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!sidebarCollapsed && <span className="text-sm">Thu gọn</span>}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="block">
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              <Home className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm">Xem trang</span>}
            </button>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Admin</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="p-4 space-y-2 border-t border-slate-700/50 animate-in slide-in-from-top">
            <button
              onClick={() => { setSidebarView('upload'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                sidebarView === 'upload' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => { setSidebarView('list'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                sidebarView === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400'
              }`}
            >
              <List className="w-5 h-5" />
              <span>Danh sách</span>
            </button>
            <button
              onClick={() => { setSidebarView('employees'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                sidebarView === 'employees' ? 'bg-yellow-500/20 text-yellow-400' : 'text-slate-400'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span>Nhân viên</span>
            </button>
        
            <a href="/" target="_blank" rel="noopener noreferrer" className="block">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400">
                <Home className="w-5 h-5" />
                <span>Xem trang</span>
              </button>
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="md:p-6 p-4 pt-20 md:pt-6 space-y-6">
        
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {(['queen', 'king'] as const).map((category) => (
              <div 
                key={category} 
                className={`rounded-2xl p-4 border ${
                  category === 'queen' 
                    ? 'bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20' 
                    : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      category === 'queen' ? 'bg-pink-500/20' : 'bg-blue-500/20'
                    }`}>
                      <Crown className={`w-5 h-5 ${category === 'queen' ? 'text-pink-400' : 'text-blue-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold capitalize">{category} Voting</h3>
                      <p className="text-xs text-slate-400">
                        {category === 'queen' ? queenCandidates.length : kingCandidates.length} ứng viên
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => toggleVoting(category)}
                    className={`rounded-xl transition-all ${
                      votingActive[category]
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
                    }`}
                  >
                    <Power className="w-4 h-4 mr-1" />
                    {votingActive[category] ? 'Mở' : 'Đóng'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Content based on sidebar view */}
          {sidebarView === 'upload' && (
            <div className={`transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-400" />
                  Upload Ứng viên
                </h2>
                <UploadCandidates onCandidateAdded={fetchCandidates} />
              </div>
            </div>
          )}

          {sidebarView === 'list' && (
            <div className={`transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <List className="w-5 h-5 text-blue-400" />
                    Danh sách ứng viên
                  </h2>
                  
                  {/* Category Toggle */}
                  <div className="flex bg-slate-700/50 p-1 rounded-xl">
                    <button
                      onClick={() => { setListCategory('queen'); setSelectedCandidates([]); }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        listCategory === 'queen'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Queen ({queenCandidates.length})
                    </button>
                    <button
                      onClick={() => { setListCategory('king'); setSelectedCandidates([]); }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        listCategory === 'king'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      King ({kingCandidates.length})
                    </button>
                  </div>
                </div>

                {/* Bulk Actions Toolbar */}
                {currentCandidates.length > 0 && (
                  <div className="flex items-center justify-between gap-4 mb-4 p-3 bg-slate-700/30 rounded-xl border border-slate-600/50">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.length === currentCandidates.length && currentCandidates.length > 0}
                        onChange={toggleSelectAll}
                        className="w-5 h-5 rounded-md border-2 border-slate-400 bg-slate-500 accent-cyan-400 checked:bg-cyan-400 checked:border-cyan-500 focus:ring-2 focus:ring-cyan-300 focus:ring-offset-0 cursor-pointer shadow-lg"
                      />
                      <span className="text-sm text-slate-300">
                        {selectedCandidates.length > 0 ? `Đã chọn ${selectedCandidates.length}` : 'Chọn tất cả'}
                      </span>
                    </div>
                    {selectedCandidates.length > 0 && (
                      <Button
                        size="sm"
                        onClick={handleBulkDelete}
                        disabled={deletingBulk}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        {deletingBulk ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Đang xóa...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa ({selectedCandidates.length})
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}

                {currentCandidates.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Crown className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Chưa có ứng viên {listCategory === 'queen' ? 'Queen' : 'King'} nào</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    {currentCandidates.map((candidate) => (
                      <CandidateCard
                        key={candidate._id}
                        candidate={candidate}
                        onDelete={fetchCandidates}
                        isSelected={selectedCandidates.includes(candidate._id)}
                        onToggleSelect={() => toggleSelectCandidate(candidate._id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {sidebarView === 'employees' && (
            <div className={`transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-yellow-400" />
                    Quản lý Nhân viên
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300">{employeeCount} nhân viên</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/50">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      Upload danh sách nhân viên
                    </h3>
                    <UploadEmployees onUploadComplete={fetchEmployeeCount} />
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <a href="/lucky-spin">
                      <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg">
                        <Gift className="w-4 h-4 mr-2" />
                        Mở Vòng quay may mắn
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
