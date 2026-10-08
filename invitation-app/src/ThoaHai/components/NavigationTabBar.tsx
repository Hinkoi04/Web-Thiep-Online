import React from 'react';
import { Heart, Calendar, Image, MessageSquareHeart, Home, Clock } from 'lucide-react';

export type ScreenId = 'cover' | 'invitation' | 'schedule' | 'countdown' | 'gallery' | 'guestbook';

interface NavigationTabBarProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

export const NavigationTabBar: React.FC<NavigationTabBarProps> = ({
  activeScreen,
  onSelectScreen,
}) => {
  const tabs: Array<{ id: ScreenId; label: string; icon: React.ReactNode }> = [
    { id: 'cover', label: 'Bìa Thiệp', icon: <Home className="w-4 h-4" /> },
    { id: 'invitation', label: 'Lời Mời', icon: <Heart className="w-4 h-4" /> },
    { id: 'schedule', label: 'Lịch Trình', icon: <Calendar className="w-4 h-4" /> },
    { id: 'countdown', label: 'Đếm Ngược', icon: <Clock className="w-4 h-4" /> },
    { id: 'gallery', label: 'Kỷ Niệm', icon: <Image className="w-4 h-4" /> },
    { id: 'guestbook', label: 'Xác Nhận', icon: <MessageSquareHeart className="w-4 h-4" /> },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-[450px] mx-auto z-40 backdrop-blur-md border-t border-x px-2 py-1"
      style={{
        background: 'rgba(250,245,238,0.96)',
        borderColor: 'rgba(178,148,110,0.3)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}
      aria-label="Điều hướng thiệp cưới"
    >
      <div className="grid gap-0.5 max-w-md mx-auto" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {tabs.map((tab) => {
          const isActive = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectScreen(tab.id)}
              className="flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer"
              style={{ color: isActive ? '#1a1a1a' : '#8d7560' }}
            >
              <div
                className="p-1.5 rounded-full transition-all"
                style={
                  isActive
                    ? { background: 'rgba(225,203,180,0.5)', color: '#1a1a1a', transform: 'scale(1.08)' }
                    : { color: '#8d7560' }
                }
              >
                {tab.icon}
              </div>
              <span
                className="text-[9px] tracking-tight mt-0.5 truncate w-full text-center"
                style={{ fontWeight: isActive ? 700 : 500 }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
