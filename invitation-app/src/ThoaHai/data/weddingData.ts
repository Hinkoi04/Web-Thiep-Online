import type { WeddingInfo, WeddingEvent, GalleryPhoto, GuestWish } from '../types';

export const initialWeddingInfo: WeddingInfo = {
  groomName: 'Hoàng Hải',
  groomFullName: 'Hoàng Hải',
  groomParents: {
    father: '',
    mother: 'Đinh Thị Thanh (Bưởi)',
    hometown: '',
  },
  brideName: 'Yến Thoa',
  brideFullName: 'Yến Thoa',
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
    calendarTitle: 'Lễ Thành Hôn: Hoàng Hải & Yến Thoa',
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
  coverPhoto: 'https://res.cloudinary.com/dlxbhq8pw/image/upload/v1792145070/M%E1%BA%ABu_thi%E1%BB%87p_c%C6%B0%E1%BB%9Bi_%E1%BA%A3nh_thay_th%E1%BA%BF_%C4%91%C6%B0%E1%BB%A3c_rprcvy.png?auto=format&fit=crop&w=1200&q=85',
  // 3 ảnh dải số 29 · 10 · 26
  stripPhotos: [
    'https://res.cloudinary.com/dlxbhq8pw/image/upload/v1791993596/11_kwzotz.png?auto=format&fit=crop&w=600&q=80',
    'https://res.cloudinary.com/dlxbhq8pw/image/upload/v1791993600/12_yuzozf.png?auto=format&fit=crop&w=600&q=80',
    'https://res.cloudinary.com/dlxbhq8pw/image/upload/v1791993598/13_sxcbvf.png?auto=format&fit=crop&w=600&q=80',
  ],
  // Ảnh cuối trang
  closingPhoto: 'https://res.cloudinary.com/dlxbhq8pw/image/upload/v1791994981/Thanks_tpe90y.png?auto=format&fit=crop&w=800&q=85',
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: 'g1',
    title: '',
    category: 'Chân dung',
    url: 'https://res.cloudinary.com/dlxbhq8pw/image/upload/v1791994343/IMG_20261010140537339-2_sdpmgq.png?auto=format&fit=crop&w=800&q=80',
    caption: 'Bên nhau trong ánh nắng ngập tràn hạnh phúc',
  },
  {
    id: 'g2',
    title: '',
    category: 'Phóng sự',
    url: 'https://res.cloudinary.com/dlxbhq8pw/image/upload/v1791994335/IMG_20261010151301799-4_ykk19b.png?auto=format&fit=crop&w=800&q=80',
    caption: 'Từng ánh mắt và nụ cười trao nhau',
  },
  {
    id: 'g3',
    title: '',
    category: 'Chi tiết',
    url: 'https://res.cloudinary.com/dlxbhq8pw/image/upload/v1791994332/IMG_20261010144144746-1_exeibl.png?auto=format&fit=crop&w=800&q=80',
    caption: 'Hương hoa ngọt ngào ngày chung đôi',
  },
  {
    id: 'g4',
    title: '',
    category: 'Ngoại cảnh',
    url: 'https://res.cloudinary.com/dlxbhq8pw/image/upload/v1791994345/IMG_20261010143523995-2_pbcrt5.png?auto=format&fit=crop&w=800&q=80',
    caption: 'Hành trình cùng nhau đi qua mọi nẻo đường',
  },
  {
    id: 'g5',
    title: '',
    category: 'Chân dung',
    url: 'https://res.cloudinary.com/dlxbhq8pw/image/upload/v1791994352/IMG_20261010140537339-6_jsc22i.png?auto=format&fit=crop&w=800&q=80',
    caption: 'Khoảnh khắc đẹp nhất khi nhìn thấy nụ cười của em',
  },
  {
    id: 'g6',
    title: '',
    category: 'Lễ nghi',
    url: 'https://res.cloudinary.com/dlxbhq8pw/image/upload/v1791994312/IMG_20261010140537339-7_bfzn9l.png?auto=format&fit=crop&w=800&q=80',
    caption: 'Từ hôm nay, ta có nhau trọn kiếp này',
  },
];

export const initialWishes: GuestWish[] = [
  {
    id: 'w1',
    senderName: 'Văn Toàn & Mỹ Linh',
    relation: 'Bạn thân Chú Rể',
    message: 'Chúc mừng Hoàng Hải & Yến Thoa trăm năm hạnh phúc, sớm đón thiên thần nhỏ nhé! Luôn yêu thương và nắm chặt tay nhau.',
    likes: 24,
    timestamp: 'Vừa xong',
  },
  {
    id: 'w2',
    senderName: 'Chị Phương Mai',
    relation: 'Đồng nghiệp Cô Dâu',
    message: 'Cô dâu Yến Thoa xinh đẹp rạng ngời! Chúc em gái và chú rể Hoàng Hải bước vào cuộc sống hôn nhân ngập tràn tiếng cười, hạnh phúc viên mãn!',
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
