import React from 'react';
import { Heart, Calendar, Image, MessageSquareHeart, Home } from 'lucide-react';

export type ScreenId = 'cover' | 'invitation' | 'schedule' | 'story' | 'gallery' | 'guestbook';

interface NavigationTabBarProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

export const NavigationTabBar: React.FC<NavigationTabBarProps> = ({
  activeScreen,
  onSelectScreen,
}) => {
  const tabs: Array<{ id: ScreenId; label: string; icon: React.ReactNode }> = [
    {
      id: 'cover',
      label: 'Bìa Thiệp',
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'invitation',
      label: 'Lời Ngỏ',
      icon: <Heart className="w-4 h-4" />,
    },
    {
      id: 'schedule',
      label: 'Lịch Trình',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'gallery',
      label: 'Album Ảnh',
      icon: <Image className="w-4 h-4" />,
    },
    {
      id: 'guestbook',
      label: 'Lưu Bút',
      icon: <MessageSquareHeart className="w-4 h-4" />,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-[450px] mx-auto z-40 bg-white/95 backdrop-blur-md border-t border-x border-[#3b1554]/15 px-2 py-1 shadow-[0_-4px_20px_rgba(107,33,168,0.08)]"
      aria-label="Điều hướng thiệp cưới"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectScreen(tab.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#3b1554] font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`p-1.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-[#4a1d6d] text-amber-200 shadow-2xs scale-105'
                    : 'text-slate-500'
                }`}
              >
                {tab.icon}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 truncate w-full text-center ${
                isActive ? 'text-[#3b1554] font-semibold' : 'text-slate-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
