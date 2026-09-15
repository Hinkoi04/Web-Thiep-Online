import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import RsvpTable from "../components/RsvpTable";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function AdminTrash() {
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

        // Lấy danh sách thùng rác từ bảng hoang_yen
        const rsvpRes = await fetch(`${API_URL}/hoang-yen/trash`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rsvpData = await rsvpRes.json();

        if (rsvpData.success) {
          setMessages(rsvpData.data);
        } else {
          setErrorMsg(rsvpData.error || "Không thể tải thùng rác.");
        }
      } catch (err) {
        setErrorMsg("Lỗi kết nối máy chủ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleRestore = async (id) => {
    const token = localStorage.getItem("admin_token_hoangyen");
    try {
      const res = await fetch(`${API_URL}/hoang-yen/restore/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setSuccessMsg("✓ Đã khôi phục lời chúc thành công.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(`✗ ${data.error}`);
        setTimeout(() => setErrorMsg(""), 3000);
      }
    } catch (err) {
      setErrorMsg("✗ Lỗi kết nối");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleForceDelete = async (id) => {
    const token = localStorage.getItem("admin_token_hoangyen");
    try {
      const res = await fetch(`${API_URL}/hoang-yen/force/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setSuccessMsg("✓ Đã xóa vĩnh viễn lời chúc.");
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
        Đang tải thùng rác hoang_yen...
      </div>
    );
  }

  return (
    <div className="bg-cream text-text-admin min-h-screen flex w-full font-sans">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="admin-main flex-1 flex flex-col min-h-screen w-full min-w-0">
        <AdminTopbar
          title="Thùng Rác · Hoàng Yến"
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

          <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-cormorant font-semibold text-dark">
              Thùng Rác Lời Chúc
            </h1>
            <button
              onClick={() => navigate("/admin")}
              className="text-xs sm:text-sm border border-border-solid rounded-lg px-3.5 py-2 hover:bg-white transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
            >
              ← Quay lại danh sách
            </button>
          </div>

          <RsvpTable
            messages={messages}
            isTrash={true}
            onRestore={handleRestore}
            onForceDelete={handleForceDelete}
          />
        </div>
      </main>
    </div>
  );
}
