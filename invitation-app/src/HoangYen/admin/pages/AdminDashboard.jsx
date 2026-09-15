import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import StatCard from "../components/StatCard";
import RsvpTable from "../components/RsvpTable";
import InviteLinkGenerator from "../components/InviteLinkGenerator";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token_hoangyen");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        const checkRes = await fetch(`${API_URL}/admin/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const checkData = await checkRes.json();
        if (!checkData.success) {
          localStorage.removeItem("admin_token_hoangyen");
          navigate("/admin/login");
          return;
        }

        // Lấy danh sách lời chúc từ bảng hoang_yen
        const rsvpRes = await fetch(`${API_URL}/hoang-yen`);
        const rsvpData = await rsvpRes.json();

        if (rsvpData.success) {
          setMessages(rsvpData.data);
        } else {
          setErrorMsg(rsvpData.error || "Không thể tải danh sách lời chúc.");
        }
      } catch (err) {
        setErrorMsg("Lỗi kết nối máy chủ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("admin_token_hoangyen");
    try {
      const res = await fetch(`${API_URL}/hoang-yen/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setSuccessMsg("✓ Đã chuyển lời chúc vào thùng rác thành công.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(`✗ ${data.error}`);
        setTimeout(() => setErrorMsg(""), 3000);
      }
    } catch (err) {
      setErrorMsg("✗ Lỗi kết nối khi xóa");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream font-sans text-muted p-4 text-center text-sm sm:text-base">
        Đang tải dữ liệu bảng hoang_yen...
      </div>
    );
  }

  const total = messages.length;
  const latestDate =
    total > 0
      ? new Date((messages[0].created_at || "").replace(" ", "T")).toLocaleDateString("vi-VN")
      : "—";

  const todayCount = messages.filter((m) => {
    const d = new Date((m.created_at || "").replace(" ", "T"));
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="bg-cream text-text-admin min-h-screen flex w-full font-sans">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="admin-main flex-1 flex flex-col min-h-screen w-full min-w-0">
        <AdminTopbar
          title="Quản Lý Lời Chúc · Hoàng Yến"
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <div className="flex-1 py-5 px-4 sm:py-6 sm:px-6 md:py-8 md:px-9 max-w-7xl w-full mx-auto">
          {successMsg && (
            <div className="flex items-center gap-3 py-3 px-4 sm:py-3.5 sm:px-5 rounded-lg bg-[#f0fff4] border border-[#c6f6d5] text-[#276749] text-xs sm:text-sm mb-5 sm:mb-7 animate-[fadeUp_0.3s_ease_both]">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="flex items-center gap-3 py-3 px-4 sm:py-3.5 sm:px-5 rounded-lg bg-red-light border border-[#fed7d7] text-red text-xs sm:text-sm mb-5 sm:mb-7 animate-[fadeUp_0.3s_ease_both]">
              {errorMsg}
            </div>
          )}

          {/* Chức năng tạo link thiệp mời cá nhân hóa */}
          <InviteLinkGenerator basePath="/HoangYen/" gradName="Hoàng Yến" />

          {/* Thống kê nhanh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 mb-6 sm:mb-8">
            <StatCard icon="💌" label="Tổng Lời Chúc (hoang_yen)" value={total} />
            <StatCard icon="📅" label="Hôm Nay" value={todayCount} />
            <StatCard icon="🕐" label="Mới Nhất" value={latestDate} isDate />
          </div>

          {/* Bảng danh sách lời chúc */}
          <RsvpTable messages={messages} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
}
