import type { WeddingInfo, WeddingEvent, GalleryPhoto, GuestWish } from '../types';

export const initialWeddingInfo: WeddingInfo = {
  groomName: 'Thanh Hải',
  groomFullName: 'Lưu Thanh Hải',
  groomParents: {
    father: '',
    mother: 'Đinh Thị Thanh (Bưởi)',
    hometown: '',
  },
  brideName: 'Yến Thoa',
  brideFullName: 'Lương Yến Thoa',
  brideParents: {
    father: 'Nguyễn Linh',
    mother: 'Lê Thị Nết',
    hometown: '',
  },
  weddingDate: '2026-10-29T10:30:00',
  solarDateText: '29 · 10 · 2026',
  lunarDateText: 'Tức ngày 20 tháng 09 năm Bính Ngọ',
  badgeDate: '29.10',
  guestName: 'Anh/ Chị & Người thương',
};

export const weddingEvents: WeddingEvent[] = [
  {
    id: 'le-thanh-hon',
    title: 'TIỆC MỪNG LỄ THÀNH HÔN',
    time: '10:30 - 11:00',
    timePrefix: 'VÀO LÚC 10:30 - 11:00 THỨ NĂM',
    day: '29',
    monthText: 'THÁNG 10',
    yearText: 'NĂM 2026',
    lunarText: '(Tức ngày 20 tháng 09 năm Bính Ngọ)',
    date: 'Thứ Năm, 29/10/2026',
    locationName: 'ĐỊA ĐIỂM TỔ CHỨC',
    address: 'Xã An Phú, Tỉnh Quảng Ngãi',
    mapUrl: 'https://maps.google.com/?q=15.13671811751521,108.89633230162609',
    mapEmbedUrl: 'https://maps.google.com/maps?q=15.13671811751521,108.89633230162609&t=&z=16&ie=UTF8&iwloc=&output=embed',
    calendarTitle: 'Lễ Thành Hôn: Thanh Hải & Yến Thoa',
    type: 'reception',
  },
];

export interface TimelineItem {
  time: string;
  title: string;
  desc?: string;
  icon: 'bouquet' | 'rings' | 'feast' | 'music';
}

export const timelineMilestones: TimelineItem[] = [
  { time: '09:00', title: 'RƯỚC DÂU', icon: 'bouquet' },
  { time: '10:30', title: 'LÀM LỄ', icon: 'rings' },
  { time: '11:00', title: 'KHAI TIỆC & GIAO LƯU', icon: 'feast' },
];

/**
 * Cấu hình ảnh và hoa văn trang trí cho thiệp Thoa & Hải
 */
export const weddingImages = {
  // Ảnh bìa chính
  coverPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  // 3 ảnh dải số 29 · 10 · 26
  stripPhotos: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
  ],
  // Ảnh cuối trang
  closingPhoto: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=85',
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: 'g1',
    title: 'Khoảnh khắc trao lời hẹn ước',
    category: 'Chân dung',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    caption: 'Bên nhau trong ánh nắng ngập tràn hạnh phúc',
  },
  {
    id: 'g2',
    title: 'Nắm tay qua năm tháng',
    category: 'Phóng sự',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    caption: 'Từng ánh mắt và nụ cười trao nhau',
  },
  {
    id: 'g3',
    title: 'Bó hoa trao gửi yêu thương',
    category: 'Chi tiết',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    caption: 'Hương hoa ngọt ngào ngày chung đôi',
  },
  {
    id: 'g4',
    title: 'Hoàng hôn bên người thương',
    category: 'Ngoại cảnh',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    caption: 'Hành trình cùng nhau đi qua mọi nẻo đường',
  },
  {
    id: 'g5',
    title: 'Nụ cười rạng rỡ của nàng',
    category: 'Chân dung',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    caption: 'Khoảnh khắc đẹp nhất khi nhìn thấy nụ cười của em',
  },
  {
    id: 'g6',
    title: 'Lời hứa trọn đời',
    category: 'Lễ nghi',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80',
    caption: 'Từ hôm nay, ta có nhau trọn kiếp này',
  },
];

export const initialWishes: GuestWish[] = [
  {
    id: 'w1',
    senderName: 'Văn Toàn & Mỹ Linh',
    relation: 'Bạn thân Chú Rể',
    message: 'Chúc mừng Thanh Hải & Yến Thoa trăm năm hạnh phúc, sớm đón thiên thần nhỏ nhé! Luôn yêu thương và nắm chặt tay nhau.',
    likes: 24,
    timestamp: 'Vừa xong',
  },
  {
    id: 'w2',
    senderName: 'Chị Phương Mai',
    relation: 'Đồng nghiệp Cô Dâu',
    message: 'Cô dâu Yến Thoa xinh đẹp rạng ngời! Chúc em gái và chú rể Thanh Hải bước vào cuộc sống hôn nhân ngập tràn tiếng cười, hạnh phúc viên mãn!',
    likes: 19,
    timestamp: '15 phút trước',
  },
  {
    id: 'w3',
    senderName: 'Gia đình Bác Đức',
    relation: 'Nhà Trai',
    message: 'Bác chúc hai cháu luôn thuận hòa, yêu thương tôn trọng lẫn nhau, cùng vun đắp tổ ấm vững bền.',
    likes: 31,
    timestamp: '1 giờ trước',
  },
];
