import React, { useState } from "react";

export default function InviteLinkGenerator({ basePath = "/Tam/", gradName = "Thanh Tâm" }) {
  const [guestName, setGuestName] = useState("");
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://web-thiep-online.vercel.app";
  const cleanPath = basePath.startsWith("/") ? basePath : `/${basePath}`;
  const normalizedPath = cleanPath.endsWith("/") ? cleanPath : `${cleanPath}/`;

  const inviteUrl = guestName.trim()
    ? `${origin}${normalizedPath}?to=${encodeURIComponent(guestName.trim())}`
    : `${origin}${normalizedPath}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = inviteUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Thư mời tốt nghiệp của ${gradName}`,
          text: `Thân mời ${guestName.trim() || "bạn"} đến tham dự lễ tốt nghiệp của ${gradName}!`,
          url: inviteUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-pink-200/80 p-5 sm:p-6 mb-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 pb-3 border-b border-pink-100">
        <div className="flex items-center gap-2.5">
          <span className="text-xl sm:text-2xl">🔗</span>
          <div>
            <h2 className="font-serif text-base sm:text-lg font-bold text-[#4a2e3b] leading-tight">
              Tạo Link Thiệp Mời Cá Nhân Hóa
            </h2>
            <p className="text-xs text-gray-500 font-sans">
              Nhập tên khách để tự động tạo link thiệp có gắn tên người nhận
            </p>
          </div>
        </div>
        {guestName.trim() && (
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold font-sans self-start sm:self-auto">
            ✓ Đã tạo link cho "{guestName.trim()}"
          </span>
        )}
      </div>

      {/* Input tên khách */}
      <div className="mb-3.5">
        <label className="block text-[0.7rem] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-sans">
          Tên người nhận (Khách mời)
        </label>
        <div className="relative">
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Ví dụ: Bạn Lan, Anh Tuấn & Gia Đình, Cô Thảo..."
            className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 font-sans focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
          />
          {guestName && (
            <button
              onClick={() => setGuestName("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs px-1.5 py-0.5 rounded cursor-pointer"
              title="Xóa tên"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Ô hiển thị Link */}
      <div className="mb-4">
        <label className="block text-[0.7rem] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-sans">
          Đường dẫn thiệp mời
        </label>
        <div className="flex items-center gap-2 bg-[#fdf8fa] border border-pink-200 rounded-lg p-2 sm:p-2.5">
          <span className="text-sm sm:text-base select-none pl-1">🌐</span>
          <div className="flex-1 font-mono text-xs text-gray-800 select-all overflow-x-auto whitespace-nowrap py-0.5">
            {inviteUrl}
          </div>
        </div>
      </div>

      {/* Đúng 3 nút hành động theo yêu cầu */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-sans">
        <button
          type="button"
          onClick={handleCopyLink}
          className={`cursor-pointer flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
            copied
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-sm"
          }`}
        >
          {copied ? "✓ Đã sao chép link" : "📋 Sao chép link"}
        </button>

        <a
          href={inviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-800 transition-all"
        >
          👁️ Xem trước thiệp
        </a>

        <button
          type="button"
          onClick={handleShare}
          className="cursor-pointer flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-800 transition-all"
        >
          📤 Chia sẻ
        </button>
      </div>
    </div>
  );
}


