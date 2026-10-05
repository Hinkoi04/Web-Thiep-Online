export interface WeddingInfo {
  groomName: string;
  groomFullName: string;
  groomParents: {
    father: string;
    mother: string;
    hometown?: string;
  };
  brideName: string;
  brideFullName: string;
  brideParents: {
    father: string;
    mother: string;
    hometown?: string;
  };
  weddingDate: string; // e.g. "2026-07-29"
  solarDateText: string; // "29 · 07 · 2026"
  lunarDateText: string; // "Tức ngày 16 tháng 06 âm Bính Ngọ"
  badgeDate: string; // "29.07"
  guestName: string; // "Anh/ Chị & Người thương"
}

export interface WeddingEvent {
  id: string;
  title: string; // e.g. "TIỆC MỪNG LỄ THÀNH HÔN"
  time: string; // e.g. "11:00"
  timePrefix?: string; // e.g. "VÀO LÚC 11:00 THỨ TƯ"
  day: string; // e.g. "29"
  monthText: string; // e.g. "THÁNG 07"
  yearText: string; // e.g. "NĂM 2026"
  lunarText: string; // e.g. "(Tức ngày 16 tháng 06 âm Bính Ngọ)"
  date: string;
  locationName: string;
  address: string;
  mapUrl: string;
  mapEmbedUrl?: string;
  calendarTitle: string;
  type: 'groom_house' | 'bride_house' | 'reception';
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  url: string;
  caption: string;
}

export interface GuestWish {
  id: string;
  senderName: string;
  relation: string;
  message: string;
  likes: number;
  timestamp: string;
}

