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
  weddingDate: string;
  solarDateText: string;
  lunarDateText: string;
  badgeDate: string;
  guestName: string;
}

export interface WeddingEvent {
  id: string;
  title: string;
  time: string;
  timePrefix?: string;
  day: string;
  monthText: string;
  yearText: string;
  lunarText: string;
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
