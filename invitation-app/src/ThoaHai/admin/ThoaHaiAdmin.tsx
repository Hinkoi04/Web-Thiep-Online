import React, { useState, useEffect } from 'react';
import { initialWishes } from '../data/weddingData';
import type { GuestWish } from '../types';
import {
  Lock,
  Eye,
  EyeOff,
  Copy,
  Share2,
  Trash2,
  RefreshCw,
  ExternalLink,
  LogOut,
  CheckCircle2,
  Heart,
  UserPlus,
  MessageSquareHeart,
  X,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  Inbox,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const ADMIN_PASSWORD = '29102026';
const STORAGE_KEY = 'thoahai_admin_auth';

type Tab = 'wishes' | 'trash';

export default function ThoaHaiAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Link generator state
  const [guestInput, setGuestInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Wishes state
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  const [trashWishes, setTrashWishes] = useState<GuestWish[]>([]);
  const [loadingWishes, setLoadingWishes] = useState(false);
  const [selectedWish, setSelectedWish] = useState<GuestWish | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [forceDeleteId, setForceDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('wishes');

  // Base URL for invite links
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/ThoaHai/`
    : 'https://web-thiep-online.vercel.app/ThoaHai/';

  // Constructed invite link
  const generatedLink = guestInput.trim()
    ? `${baseUrl}?to=${encodeURIComponent(guestInput.trim())}`
    : baseUrl;

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Mật khẩu không chính xác! Vui lòng thử lại.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Fetch wishes
  const fetchWishes = async () => {
    setLoadingWishes(true);
    try {
      const res = await fetch(`${API_BASE}/thoa-hai`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const apiWishes: GuestWish[] = json.data.map((item: any) => ({
            id: item.id || String(item._id || Math.random()),
            senderName: item.guest_name || item.senderName || 'Người thương',
            relation: item.relation || item.attendance_status || '',
            message: item.message || item.wish || '',
            likes: item.likes || 0,
            timestamp: item.created_at
              ? new Date(item.created_at).toLocaleDateString('vi-VN')
              : 'Vừa xong',
          }));
          setWishes(apiWishes);
          return;
        }
      }
    } catch (e) {
      console.warn('Cannot fetch from API, loading local data fallback:', e);
    } finally {
      setLoadingWishes(false);
    }
    setWishes(initialWishes);
  };

  // Fetch trash
  const fetchTrash = async () => {
    setLoadingWishes(true);
    try {
      const res = await fetch(`${API_BASE}/thoa-hai/trash`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const trashed: GuestWish[] = json.data.map((item: any) => ({
            id: item.id.toString(),
            senderName: item.guest_name || 'Khách quý',
            relation: item.attendance_status || '',
            message: item.message || '',
            likes: 0,
            timestamp: item.created_at
              ? new Date(item.created_at).toLocaleDateString('vi-VN')
              : '',
          }));
          setTrashWishes(trashed);
        }
      }
    } catch (e) {
      console.warn('Cannot fetch trash:', e);
    } finally {
      setLoadingWishes(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishes();
      fetchTrash();
    }
  }, [isAuthenticated]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'trash') fetchTrash();
    else fetchWishes();
  };

  // Copy link
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedLink);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = generatedLink;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Share link
  const handleShareLink = async () => {
    const title = 'Thiệp Cưới Hoàng Hải & Yến Thoa';
    const text = guestInput.trim()
      ? `Trân trọng kính mời ${guestInput.trim()} đến dự lễ thành hôn của Hoàng Hải & Yến Thoa!`
      : 'Trân trọng kính mời bạn đến dự lễ thành hôn của Hoàng Hải & Yến Thoa!';

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: generatedLink });
      } catch (err) {
        console.warn('Share cancelled or not supported:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Soft delete (move to trash)
  const handleSoftDelete = async (id: string) => {
    try {
      await fetch(`${API_BASE}/thoa-hai/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API soft-delete error:', err);
    }
    setWishes((prev) => prev.filter((w) => w.id !== id));
    setDeleteConfirmId(null);
    if (selectedWish?.id === id) setSelectedWish(null);
    // Refresh trash
    fetchTrash();
  };

  // Restore from trash
  const handleRestore = async (id: string) => {
    try {
      await fetch(`${API_BASE}/thoa-hai/restore/${id}`, { method: 'PUT' });
    } catch (err) {
      console.warn('API restore error:', err);
    }
    setTrashWishes((prev) => prev.filter((w) => w.id !== id));
    fetchWishes();
  };

  // Force delete from trash
  const handleForceDelete = async (id: string) => {
    try {
      await fetch(`${API_BASE}/thoa-hai/force/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API force-delete error:', err);
    }
    setTrashWishes((prev) => prev.filter((w) => w.id !== id));
    setForceDeleteId(null);
  };

  // ── 1. LOGIN SCREEN ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5eee6] flex items-center justify-center p-4 selection:bg-amber-100">
        <div className="w-full max-w-[420px] bg-[#faf5ee] border border-[#bda893]/40 rounded-3xl p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
          {/* Floral accent */}
          <img
            src="/thoahai/Hoa3.png"
            alt="hoa trang trí"
            className="w-10 h-auto mx-auto mb-3 opacity-80"
          />

          <h2
            className="text-2xl font-bold text-[#1a1a1a] tracking-wide"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Quản Trị Thiệp Cưới
          </h2>
          <p className="text-xs text-[#6d5a49] tracking-widest uppercase mt-1 mb-6">
            Hoàng Hải &amp; Yến Thoa
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4039] mb-1.5">
                Mật khẩu quản trị
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="Nhập mật khẩu..."
                  className="w-full px-4 py-3 pr-11 rounded-2xl border border-[#d8c7b3] bg-[#fdfbf7] text-sm text-[#1a1a1a] placeholder-[#8d7560] focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8d7560] hover:text-[#1a1a1a]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginError && (
                <p className="text-xs text-red-600 mt-2 font-medium">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full font-bold text-xs tracking-[0.2em] uppercase text-white bg-[#1a1a1a] hover:bg-[#333] active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <Lock className="w-4 h-4" />
              <span>ĐĂNG NHẬP</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#d8c7b3]/60 text-center">
            <a
              href="/ThoaHai/"
              className="text-xs text-[#6d5a49] hover:text-[#1a1a1a] inline-flex items-center gap-1 transition-colors"
            >
              <span>← Trở về trang thiệp cưới</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. ADMIN DASHBOARD SCREEN ──
  return (
    <div className="w-full min-h-screen flex justify-center bg-[#f5eee6] selection:bg-amber-100">
      <div className="w-full max-w-[450px] min-h-screen bg-[#faf5ee] border-x border-[#bda893]/30 shadow-2xl pb-16 relative flex flex-col">
        {/* ── HEADER ── */}
        <header className="sticky top-0 z-30 bg-[#faf5ee]/95 backdrop-blur-md border-b border-[#d8c7b3]/70 px-4 py-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e1cbb4]/50 flex items-center justify-center text-[#1a1a1a]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1
                className="text-sm font-bold text-[#1a1a1a] leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Quản Trị Thiệp Cưới
              </h1>
              <p className="text-[10px] text-[#6d5a49] tracking-wider uppercase font-medium">
                Hoàng Hải &amp; Yến Thoa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="/ThoaHai/"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-white/70 border border-[#d8c7b3] text-[#4a4039] hover:text-[#1a1a1a] hover:bg-white transition-all shadow-2xs"
              title="Xem trước thiệp cưới"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/70 border border-[#d8c7b3] text-red-700 hover:bg-red-50 transition-all shadow-2xs cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="p-4 space-y-5 flex-1">
          {/* ════ CARD 1: TẠO & SAO CHÉP LIÊN KẾT ════ */}
          <section className="bg-white/85 rounded-3xl p-5 border border-[#d8c7b3]/70 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#1a1a1a]" />
              <h2
                className="text-sm font-bold uppercase tracking-wider text-[#1a1a1a]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Tạo Link Mời Khách
              </h2>
            </div>

            {/* Input tên khách */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-[#4a4039] tracking-wider block">
                Tên khách mời
              </label>
              <input
                type="text"
                value={guestInput}
                onChange={(e) => setGuestInput(e.target.value)}
                placeholder="Ví dụ: Nhi +, Bạn Hoàng, Gia đình Bác Hùng..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-[#d8c7b3] bg-[#fdfbf7] text-xs sm:text-sm text-[#1a1a1a] placeholder-[#8d7560] focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
              />
            </div>

            {/* Box hiển thị link */}
            <div className="p-2.5 rounded-2xl bg-[#faf5ee] border border-[#d8c7b3]/60 text-xs text-[#6d5a49] break-all font-mono select-all">
              {generatedLink}
            </div>

            {/* 3 NÚT THAO TÁC: XEM TRƯỚC, SAO CHÉP & CHIA SẺ */}
            <div className="space-y-2 pt-1">
              {/* Nút Xem trước */}
              <a
                href={generatedLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-2xl font-bold text-xs tracking-wider uppercase border border-[#d8c7b3] bg-[#faf5ee] hover:bg-[#e1cbb4]/40 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 text-[#4a4039]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>XEM TRƯỚC THIỆP</span>
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Nút Sao chép */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-3 px-3 rounded-2xl font-bold text-xs tracking-wider uppercase border border-[#1a1a1a] bg-white hover:bg-[#1a1a1a] hover:text-white active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs text-[#1a1a1a]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>ĐÃ CHÉP!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>SAO CHÉP</span>
                    </>
                  )}
                </button>

                {/* Nút Chia sẻ */}
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="py-3 px-3 rounded-2xl font-bold text-xs tracking-wider uppercase bg-[#1a1a1a] text-white hover:bg-[#333] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <Share2 className="w-4 h-4" />
                  <span>CHIA SẺ</span>
                </button>
              </div>
            </div>
          </section>

          {/* ════ CARD 2: DANH SÁCH LỜI CHÚC ════ */}
          <section className="bg-white/85 rounded-3xl p-5 border border-[#d8c7b3]/70 shadow-sm space-y-4">
            {/* Tab bar: Lời chúc / Thùng rác */}
            <div className="flex items-center justify-between border-b border-[#d8c7b3]/60 pb-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleTabChange('wishes')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'wishes'
                      ? 'bg-[#1a1a1a] text-white'
                      : 'text-[#6d5a49] hover:bg-[#faf5ee]'
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <MessageSquareHeart className="w-3.5 h-3.5" />
                  <span>Lời Chúc ({wishes.length})</span>
                </button>
                <button
                  onClick={() => handleTabChange('trash')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'trash'
                      ? 'bg-red-600 text-white'
                      : 'text-[#8d7560] hover:bg-[#faf5ee]'
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Thùng Rác ({trashWishes.length})</span>
                </button>
              </div>
              <button
                onClick={() => activeTab === 'wishes' ? fetchWishes() : fetchTrash()}
                disabled={loadingWishes}
                className="p-1.5 rounded-full text-[#6d5a49] hover:text-[#1a1a1a] hover:bg-[#faf5ee] transition-colors cursor-pointer"
                title="Làm mới danh sách"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingWishes ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* ── TAB: LỜI CHÚC ── */}
            {activeTab === 'wishes' && (
              <>
                {wishes.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#8d7560] italic">
                    Chưa có lời chúc nào được gửi đến.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-0.5 th-no-scrollbar">
                    {wishes.map((wish, index) => (
                      <div
                        key={wish.id || index}
                        className="p-3 rounded-2xl border border-[#e1cbb4]/70 bg-[#faf5ee]/60 flex items-center justify-between gap-2 hover:bg-[#faf5ee] transition-all"
                      >
                        {/* Tên Người Chúc */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-[#1a1a1a] truncate">
                              {wish.senderName}
                            </span>
                            {wish.relation && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#e1cbb4]/50 text-[#6d5a49] font-medium shrink-0">
                                {wish.relation}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#8d7560] mt-0.5">
                            {wish.timestamp} · {wish.likes} ❤️
                          </div>
                        </div>

                        {/* Thao tác */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Xem nội dung */}
                          <button
                            onClick={() => setSelectedWish(wish)}
                            className="p-2 rounded-xl bg-white border border-[#d8c7b3] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all shadow-2xs cursor-pointer flex items-center gap-1 text-xs"
                            title="Xem lời chúc"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-semibold hidden sm:inline">Xem</span>
                          </button>

                          {/* Xóa mềm */}
                          {deleteConfirmId === wish.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleSoftDelete(wish.id)}
                                className="px-2 py-1.5 rounded-xl bg-red-600 text-white text-[10px] font-bold hover:bg-red-700 transition-colors cursor-pointer"
                              >
                                Xóa
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="p-1.5 rounded-xl bg-gray-200 text-gray-700 text-[10px] hover:bg-gray-300 transition-colors cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(wish.id)}
                              className="p-2 rounded-xl bg-white border border-[#d8c7b3] text-[#8d7560] hover:text-red-600 hover:border-red-300 transition-all shadow-2xs cursor-pointer"
                              title="Xóa lời chúc"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── TAB: THÙNG RÁC ── */}
            {activeTab === 'trash' && (
              <>
                {trashWishes.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <Inbox className="w-8 h-8 mx-auto text-[#bda893]" />
                    <p className="text-xs text-[#8d7560] italic">Thùng rác trống.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-0.5 th-no-scrollbar">
                    {trashWishes.map((wish, index) => (
                      <div
                        key={wish.id || index}
                        className="p-3 rounded-2xl border border-red-200/60 bg-red-50/30 flex items-center justify-between gap-2"
                      >
                        {/* Tên */}
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-xs text-[#4a4039] truncate block line-through opacity-70">
                            {wish.senderName}
                          </span>
                          <div className="text-[10px] text-[#8d7560] mt-0.5">{wish.timestamp}</div>
                        </div>

                        {/* Thao tác */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Xem */}
                          <button
                            onClick={() => setSelectedWish(wish)}
                            className="p-2 rounded-xl bg-white border border-[#d8c7b3] text-[#4a4039] hover:bg-[#faf5ee] transition-all shadow-2xs cursor-pointer"
                            title="Xem lời chúc"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Khôi phục */}
                          <button
                            onClick={() => handleRestore(wish.id)}
                            className="p-2 rounded-xl bg-white border border-green-300 text-green-600 hover:bg-green-50 transition-all shadow-2xs cursor-pointer"
                            title="Khôi phục"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          {/* Xóa vĩnh viễn */}
                          {forceDeleteId === wish.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleForceDelete(wish.id)}
                                className="px-2 py-1.5 rounded-xl bg-red-700 text-white text-[10px] font-bold hover:bg-red-800 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>Xóa!</span>
                              </button>
                              <button
                                onClick={() => setForceDeleteId(null)}
                                className="p-1.5 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setForceDeleteId(wish.id)}
                              className="p-2 rounded-xl bg-red-50 border border-red-300 text-red-600 hover:bg-red-100 transition-all shadow-2xs cursor-pointer"
                              title="Xóa vĩnh viễn"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </main>

        {/* ════ MODAL XEM CHI TIẾT LỜI CHÚC ════ */}
        {selectedWish && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setSelectedWish(null)}
          >
            <div
              className="w-full max-w-[380px] bg-[#faf5ee] border border-[#bda893]/70 rounded-3xl p-6 shadow-2xl relative space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Nút Đóng */}
              <button
                onClick={() => setSelectedWish(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 border border-[#d8c7b3] text-[#6d5a49] hover:text-[#1a1a1a] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="text-center pt-2">
                <img
                  src="/thoahai/Hoa3.png"
                  alt="hoa điểm"
                  className="w-8 h-auto mx-auto mb-2 opacity-80"
                />
                <h3
                  className="text-lg font-bold text-[#1a1a1a]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {selectedWish.senderName}
                </h3>
                {selectedWish.relation && (
                  <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#e1cbb4]/50 text-[11px] font-semibold text-[#6d5a49]">
                    {selectedWish.relation}
                  </span>
                )}
              </div>

              {/* Nội dung lời chúc */}
              <div className="p-4 rounded-2xl bg-white/80 border border-[#d8c7b3]/60 shadow-inner">
                <p className="text-xs sm:text-sm text-[#4a4039] italic leading-relaxed whitespace-pre-line text-center">
                  "{selectedWish.message}"
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-[#8d7560] pt-1">
                <span className="flex items-center gap-1 text-[#1a1a1a] font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-[#1a1a1a] text-[#1a1a1a]" />
                  {selectedWish.likes} lượt thích
                </span>
                <span>{selectedWish.timestamp}</span>
              </div>

              <button
                onClick={() => setSelectedWish(null)}
                className="w-full py-2.5 rounded-full font-bold text-xs uppercase tracking-wider bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors cursor-pointer"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                ĐÓNG
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
