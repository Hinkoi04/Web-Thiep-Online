import React, { useState } from "react";

export default function InviteLinkGenerator({ basePath = "/HoangYen/", gradName = "Hoàng Yến" }) {
  const [guestName, setGuestName] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://web-thiep-online.vercel.app";
  const cleanPath = basePath.startsWith("/") ? basePath : `/${basePath}`;
  const normalizedPath = cleanPath.endsWith("/") ? cleanPath : `${cleanPath}/`;

  const inviteUrl = guestName.trim()
    ? `${origin}${normalizedPath}?to=${encodeURIComponent(guestName.trim())}`
    : `${origin}${normalizedPath}`;

  const sampleMessage = `🎓 Thân mời ${guestName.trim() || "bạn"} đến tham dự buổi lễ tốt nghiệp của ${gradName} nhé!\nXem chi tiết thiệp mời tại đây: ${inviteUrl}`;

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

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(sampleMessage);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = sampleMessage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
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
    <div className="bg-white border border-border-solid rounded-xl p-6 mb-8 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border-solid">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🔗</span>
          <div>
            <h2 className="font-cormorant text-xl font-bold text-dark leading-tight">
              Tạo Link Thiệp Mời Cá Nhân Hóa
            </h2>
            <p className="text-xs text-muted">
              Nhập tên khách để tự động tạo link thiệp có gắn tên người nhận
            </p>
          </div>
        </div>
        {guestName.trim() && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#f0fff4] text-[#276749] border border-[#c6f6d5] font-medium hidden sm:inline-block">
            ✓ Đã tạo link cho "{guestName.trim()}"
          </span>
        )}
      </div>

      {/* Input tên khách */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-text-admin uppercase tracking-wider mb-1.5">
          Tên người nhận (Khách mời)
        </label>
        <div className="relative">
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Ví dụ: Bạn Lan, Anh Tuấn & Gia Đình, Cô Thảo..."
            className="w-full px-4 py-2.5 bg-cream border border-border-admin rounded-lg text-sm text-dark placeholder-muted/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
          />
          {guestName && (
            <button
              onClick={() => setGuestName("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark text-xs px-1.5 py-0.5 rounded cursor-pointer"
              title="Xóa tên"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Ô hiển thị Link */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-text-admin uppercase tracking-wider mb-1.5">
          Đường dẫn thiệp mời
        </label>
        <div className="flex items-center gap-2 bg-[#fdfbf7] border border-border-admin/70 rounded-lg p-2.5">
          <span className="text-base select-none pl-1">🌐</span>
          <div className="flex-1 font-mono text-xs text-dark select-all overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
            {inviteUrl}
          </div>
        </div>
      </div>

      {/* Các nút hành động */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleCopyLink}
          className={`cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            copied
              ? "bg-[#276749] text-white shadow-sm"
              : "bg-gold hover:bg-gold-dark text-white shadow-sm hover:shadow"
          }`}
        >
          {copied ? "✓ Đã sao chép link" : "📋 Sao chép link"}
        </button>

        <a
          href={inviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-cream hover:bg-cream-dark border border-border-admin text-text-admin transition-all"
        >
          👁️ Xem trước thiệp
        </a>

        <button
          type="button"
          onClick={handleShare}
          className="cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-cream hover:bg-cream-dark border border-border-admin text-text-admin transition-all"
        >
          📤 Chia sẻ
        </button>

        <button
          type="button"
          onClick={handleCopyMessage}
          title="Sao chép lời mời soạn sẵn kèm link để gửi qua Zalo/Messenger"
          className={`cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
            copiedMsg
              ? "bg-[#276749] text-white border-[#276749]"
              : "bg-transparent hover:bg-cream border-dashed border-border-admin text-muted hover:text-dark"
          }`}
        >
          {copiedMsg ? "✓ Đã chép tin nhắn mẫu" : "💬 Chép tin nhắn gửi Zalo"}
        </button>
      </div>
    </div>
  );
}
