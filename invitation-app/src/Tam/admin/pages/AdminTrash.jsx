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
    const token = localStorage.getItem("admin_token_tam");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/thanh-tam/trash`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setMessages(data.data);
        } else {
          setErrorMsg(data.error || "Không thể tải danh sách thùng rác.");
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
    const token = localStorage.getItem("admin_token_tam");
    try {
      const res = await fetch(`${API_URL}/thanh-tam/restore/${id}`, {
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
      setErrorMsg("✗ Lỗi kết nối khi khôi phục");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleForceDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn lời chúc này khỏi cơ sở dữ liệu?")) return;
    const token = localStorage.getItem("admin_token_tam");
    try {
      const res = await fetch(`${API_URL}/thanh-tam/force/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setSuccessMsg("✓ Đã xóa vĩnh viễn lời chúc khỏi cơ sở dữ liệu.");
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
      <div className="min-h-screen flex items-center justify-center bg-[#fcf8f9] font-sans text-pink-900 p-4 text-center">
        Đang tải dữ liệu thùng rác...
      </div>
    );
  }

  return (
    <div className="bg-[#fcf8f9] text-gray-800 min-h-screen flex w-full font-sans">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col min-h-screen w-full min-w-0 md:pl-[250px]">
        <AdminTopbar
          title="Thùng Rác · Lời Chúc Đã Xóa (Thanh Tâm)"
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <div className="flex-1 py-5 px-4 sm:py-6 sm:px-6 md:py-8 md:px-9 max-w-7xl w-full mx-auto">
          {successMsg && (
            <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm mb-5 shadow-xs">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm mb-5 shadow-xs">
              {errorMsg}
            </div>
          )}

          <div className="mb-4">
            <button
              onClick={() => navigate("/admin")}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-pink-700 hover:text-pink-900 bg-pink-50 border border-pink-200 px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors"
            >
              ← Quay lại Bảng Lời Chúc
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
