import type { WeddingInfo, WeddingEvent, GalleryPhoto, GuestWish } from '../types';

export const initialWeddingInfo: WeddingInfo = {
  groomName: 'Tên Chú Rể',
  groomFullName: 'Tên Chú Rể',
  groomParents: {
    father: 'Tên ba chú rể',
    mother: 'Tên mẹ chú rể',
    hometown: 'Tỉnh Quảng Ngãi',
  },
  brideName: 'Tên Cô Dâu',
  brideFullName: 'Tên Cô Dâu',
  brideParents: {
    father: 'Tên ba cô dâu',
    mother: 'Tên mẹ cô dâu',
    hometown: 'Tỉnh Quảng Ngãi',
  },
  weddingDate: '2026-07-29T11:00:00',
  solarDateText: '29 · 07 · 2026',
  lunarDateText: 'Tức ngày 16 tháng 06 âm Bính Ngọ',
  badgeDate: '29.07',
  guestName: 'Anh/ Chị & Người thương',
};

export const weddingEvents: WeddingEvent[] = [
  {
    id: 'thanh-hon',
    title: 'TIỆC MỪNG LỄ THÀNH HÔN',
    time: '11:00',
    timePrefix: 'VÀO LÚC 11:00 THỨ TƯ',
    day: '29',
    monthText: 'THÁNG 07',
    yearText: 'NĂM 2026',
    lunarText: '(Tức ngày 16 tháng 06 âm Bính Ngọ)',
    date: 'Thứ Tư, 29/07/2026',
    locationName: 'ĐỊA ĐIỂM TỔ CHỨC',
    address: 'Xã An Phú, Tỉnh Quảng Ngãi',
    // Link mở Google Maps khi bấm nút "Maps ↗" hoặc "Chỉ đường":
    mapUrl: 'https://maps.google.com/?q=Xã+An+Phú+Quảng+Ngãi',
    // Link iframe nhúng bản đồ Google Maps:
    mapEmbedUrl: 'https://maps.google.com/maps?q=An%20Ph%C3%BA,%20Qu%E1%BA%A3ng%20Ng%C3%A3i&t=&z=14&ie=UTF8&iwloc=&output=embed',
    calendarTitle: 'Tiệc Cưới: Tên Chú Rể & Tên Cô Dâu',
    type: 'reception',
  },
];

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
    message: 'Chúc mừng hai bạn trăm năm hạnh phúc, sớm đón thiên thần nhỏ nhé! Luôn yêu thương và nắm chặt tay nhau như ngày đầu.',
    likes: 18,
    timestamp: 'Vừa xong',
  },
  {
    id: 'w2',
    senderName: 'Chị Phương Mai',
    relation: 'Đồng nghiệp Cô Dâu',
    message: 'Cô dâu xinh đẹp rạng ngời! Chúc em gái bước vào cuộc sống hôn nhân ngập tràn tiếng cười, hạnh phúc viên mãn suốt đời!',
    likes: 12,
    timestamp: '15 phút trước',
  },
  {
    id: 'w3',
    senderName: 'Gia đình Bác Đức',
    relation: 'Nhà Trai',
    message: 'Bác chúc hai cháu luôn thuận hòa, yêu thương tôn trọng lẫn nhau, cùng vun đắp một tổ ấm thật hạnh phúc và bền vững.',
    likes: 24,
    timestamp: '1 giờ trước',
  },
];
