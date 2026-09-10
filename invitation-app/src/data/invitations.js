/* ====== IMAGE IMPORTS ====== */
import imgAnhbia from "../Nhi/uploads/anhbia.jpg";
import imgAnh1 from "../Nhi/uploads/anh1.JPG";
import imgAnh7 from "../Nhi/uploads/anh7.JPG";
import imgAnh8 from "../Nhi/uploads/anh8.JPG";
import imgAnh4 from "../Nhi/uploads/anh4.JPG";
import imgAnh5 from "../Nhi/uploads/anh5.JPG";
import imgAnh6 from "../Nhi/uploads/anh6.jpg";
import imgAnh3 from "../Nhi/uploads/anh3.JPG";
import imgIntro from "../Nhi/uploads/IMG_5187.JPG";
import imgTassel from "../Nhi/uploads/daay.png";

export const invitationsData = {
  nhi: {
    info: {
      grad_name: "Trần Thị Tố Nhi",
      event_date: "2026-06-21",
      event_time: "07:30",
      location_name: "Trường Đại học Nguyễn Tất Thành",
      address: "331A - 331B Đỗ Mười, An Phú Đông, TP HCM",
      lat: 10.859858712011244,
      lng: 106.69462064035187,
      hero_image: imgAnhbia,
      quote: "Đây là ngày mình muốn lưu lại những khoảng khắc đẹp đẽ của thời sinh viên. Hy vọng những khoảnh khắc lưu lại cột mốc thời sinh viên này sẽ có sự tham gia của bạn.",
      photo_1: imgAnh1,
      photo_2: imgAnh7,
      photo_3: imgAnh8,
      intro_text: "Sau 3 năm nỗ lực không ngừng nghỉ, Tố Nhi đã sẵn sàng để chạm tay vào chiếc mũ cử nhân. Buổi lễ tốt nghiệp này sẽ kém phần trọn vẹn nếu thiếu đi sự hiện diện của những người đã luôn bên cạnh động viên và ủng hộ Nhi. Thân mời bạn/ anh/ chị/ gia đình đến tham dự buổi lễ để cùng Nhi lưu giữ những khung hình đẹp nhất của dấu mốc quan trọng này. 🎓✨",
      album_1: imgAnh4,
      album_2: imgAnh5,
      album_3: imgAnh6,
      album_4: imgAnh3,
      rsvp_text: "Sự hiện diện của bạn/ anh/ chị/ gia đình là niềm vinh hạnh cho buổi lễ tốt nghiệp của Tố Nhi. Dẫu khoảng cách địa lý hay công việc có ngăn chúng ta gặp gỡ, nhưng niềm vui ngày tốt nghiệp sẽ thêm trọn vẹn hơn nếu như mình nhận thêm chúc từ bạn.❤️",
      contact_1_name: "Nhi",
      contact_1_phone: "0334259765",
      contact_2_name: "Mi",
      contact_2_phone: "0397177038",
      intro_image: imgIntro,
      tassel_image: imgTassel,
      music: "/music/nhac.mp3",
    },
    timeline: [
      { id: 1, order_num: 1, time_str: "07:30", description: "Bắt đầu Lễ Trao Bằng Tốt Nghiệp" },
      { id: 2, order_num: 2, time_str: "09:45 - 12:00", description: "Đón khách, Chụp ảnh lưu niệm & Chung vui" },
    ]
  },
  hoa: {
    info: {
      grad_name: "Nguyễn Thị Hoa",
      event_date: "2026-07-15",
      event_time: "08:00",
      location_name: "Đại học ABC",
      address: "123 Đường XYZ",
      lat: 10.8, lng: 106.6,
      hero_image: imgAnhbia,
      quote: "Cảm ơn các bạn đã đến chung vui cùng Hoa.",
      photo_1: imgAnh1, photo_2: imgAnh7, photo_3: imgAnh8,
      intro_text: "Hoa xin trân trọng kính mời...",
      album_1: imgAnh4, album_2: imgAnh5, album_3: imgAnh6, album_4: imgAnh3,
      rsvp_text: "Sự hiện diện của bạn là niềm vinh hạnh.",
      contact_1_name: "Hoa", contact_1_phone: "0123456789",
      contact_2_name: "Mẹ", contact_2_phone: "0987654321",
      intro_image: imgIntro,
      tassel_image: imgTassel,
      music: "/music/nhac.mp3",
    },
    timeline: [
      { id: 1, order_num: 1, time_str: "08:00", description: "Bắt đầu" }
    ]
  }
};
