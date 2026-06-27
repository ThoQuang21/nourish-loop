// Mock data for Food Life prototype
export type ProviderLevel = "verified" | "community";

export interface Provider {
  id: string;
  name: string;
  org: string;
  level: ProviderLevel;
  trustScore: number;
  totalKg: number;
  totalDeals: number;
  avatar: string;
  address: string;
}

export interface FoodPost {
  id: string;
  title: string;
  category: string;
  weightKg: number;
  description: string;
  image: string;
  address: string;
  district: string;
  pickupWindow: string;
  expiresInHours: number;
  providerId: string;
  status: "open" | "matched" | "completed" | "expired";
  // Map coords (percentage on mock map)
  x: number;
  y: number;
}

export interface Request {
  id: string;
  postId: string;
  receiverName: string;
  receiverOrg: string;
  distanceKm: number;
  trustScore: number;
  verified: boolean;
  status: "pending" | "accepted" | "completed" | "rejected" | "cancelled";
  createdAt: string;
}

export interface Story {
  id: string;
  author: string;
  org: string;
  avatar: string;
  image: string;
  text: string;
  thanksTo: string;
  daysAgo: number;
  likes: number;
}

export interface AppNotification {
  id: string;
  type: "request" | "accepted" | "reminder" | "expiring";
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=800&q=70`;

export const providers: Provider[] = [
  {
    id: "p1",
    name: "Nguyễn Minh Anh",
    org: "Khách sạn Lotus Saigon",
    level: "verified",
    trustScore: 4.9,
    totalKg: 1840,
    totalDeals: 124,
    avatar: "https://i.pravatar.cc/120?img=11",
    address: "12 Lê Lợi, Quận 1, TP.HCM",
  },
  {
    id: "p2",
    name: "Trần Văn Bình",
    org: "Bakery Hương Việt",
    level: "verified",
    trustScore: 4.8,
    totalKg: 720,
    totalDeals: 86,
    avatar: "https://i.pravatar.cc/120?img=12",
    address: "45 Nguyễn Trãi, Quận 5, TP.HCM",
  },
  {
    id: "p3",
    name: "Lê Thị Hồng",
    org: "Siêu thị Xanh Mart",
    level: "verified",
    trustScore: 4.7,
    totalKg: 3210,
    totalDeals: 198,
    avatar: "https://i.pravatar.cc/120?img=5",
    address: "88 Cách Mạng Tháng 8, Quận 3, TP.HCM",
  },
  {
    id: "p4",
    name: "Phạm Quốc Huy",
    org: "Cá nhân",
    level: "community",
    trustScore: 4.2,
    totalKg: 32,
    totalDeals: 9,
    avatar: "https://i.pravatar.cc/120?img=15",
    address: "Phú Nhuận, TP.HCM",
  },
  {
    id: "p5",
    name: "Đỗ Mai Lan",
    org: "Nhà hàng Cơm Niêu",
    level: "verified",
    trustScore: 4.9,
    totalKg: 980,
    totalDeals: 112,
    avatar: "https://i.pravatar.cc/120?img=9",
    address: "27 Pasteur, Quận 1, TP.HCM",
  },
];

export const foodPosts: FoodPost[] = [
  {
    id: "f1",
    title: "Bánh mì tươi cuối ngày",
    category: "Bánh mì & ngũ cốc",
    weightKg: 12,
    description:
      "Bánh mì baguette và bánh ngọt làm trong ngày, còn nguyên bao bì. Cần được lấy trước 21:00 tối nay.",
    image: img("photo-1509440159596-0249088772ff"),
    address: "45 Nguyễn Trãi, Quận 5",
    district: "Quận 5",
    pickupWindow: "18:00 – 21:00 hôm nay",
    expiresInHours: 4,
    providerId: "p2",
    status: "open",
    x: 38,
    y: 52,
  },
  {
    id: "f2",
    title: "Buffet trưa khách sạn (suất ăn)",
    category: "Bữa ăn nấu sẵn",
    weightKg: 28,
    description:
      "Khoảng 60 suất ăn từ buffet trưa, gồm cơm, thịt gà, rau xào. Đóng hộp sẵn, bảo quản lạnh.",
    image: img("photo-1546069901-ba9599a7e63c"),
    address: "12 Lê Lợi, Quận 1",
    district: "Quận 1",
    pickupWindow: "14:30 – 16:00 hôm nay",
    expiresInHours: 2,
    providerId: "p1",
    status: "open",
    x: 52,
    y: 44,
  },
  {
    id: "f3",
    title: "Rau củ tươi cận hạn",
    category: "Rau củ quả",
    weightKg: 45,
    description:
      "Cà rốt, bắp cải, cà chua còn tươi, cận date 1-2 ngày. Thích hợp nấu bếp ăn từ thiện.",
    image: img("photo-1540420773420-3366772f4999"),
    address: "88 Cách Mạng Tháng 8, Quận 3",
    district: "Quận 3",
    pickupWindow: "Cả ngày mai",
    expiresInHours: 18,
    providerId: "p3",
    status: "open",
    x: 46,
    y: 30,
  },
  {
    id: "f4",
    title: "Cơm hộp dư từ căn-tin",
    category: "Bữa ăn nấu sẵn",
    weightKg: 8,
    description: "20 hộp cơm trưa văn phòng, còn nóng, chưa mở.",
    image: img("photo-1546833999-b9f581a1996d"),
    address: "27 Pasteur, Quận 1",
    district: "Quận 1",
    pickupWindow: "13:00 – 14:00 hôm nay",
    expiresInHours: 1,
    providerId: "p5",
    status: "matched",
    x: 58,
    y: 50,
  },
  {
    id: "f5",
    title: "Trái cây nhập khẩu",
    category: "Trái cây",
    weightKg: 22,
    description: "Táo, lê, nho còn tốt nhưng cận hạn trưng bày. Thích hợp cho trẻ em.",
    image: img("photo-1610832958506-aa56368176cf"),
    address: "88 Cách Mạng Tháng 8, Quận 3",
    district: "Quận 3",
    pickupWindow: "9:00 – 11:00 ngày mai",
    expiresInHours: 22,
    providerId: "p3",
    status: "open",
    x: 64,
    y: 36,
  },
  {
    id: "f6",
    title: "Sữa tươi cận date",
    category: "Sữa & sản phẩm",
    weightKg: 18,
    description: "30 hộp sữa tươi 1L còn hạn 3 ngày. Đã bảo quản lạnh liên tục.",
    image: img("photo-1563636619-e9143da7973b"),
    address: "Phú Nhuận",
    district: "Phú Nhuận",
    pickupWindow: "Linh hoạt 2 ngày tới",
    expiresInHours: 36,
    providerId: "p4",
    status: "open",
    x: 30,
    y: 64,
  },
  {
    id: "f7",
    title: "Bánh ngọt và pastry",
    category: "Bánh mì & ngũ cốc",
    weightKg: 6,
    description: "Croissant, bánh kem nhỏ cuối ngày của tiệm bánh.",
    image: img("photo-1555507036-ab1f4038808a"),
    address: "45 Nguyễn Trãi, Quận 5",
    district: "Quận 5",
    pickupWindow: "20:00 – 21:30 hôm nay",
    expiresInHours: 5,
    providerId: "p2",
    status: "completed",
    x: 42,
    y: 58,
  },
  {
    id: "f8",
    title: "Gạo và mì gói",
    category: "Lương thực khô",
    weightKg: 60,
    description: "Hàng tồn kho cận hạn, đóng bao kỹ. Dành cho tổ chức từ thiện.",
    image: img("photo-1586201375761-83865001e31c"),
    address: "88 Cách Mạng Tháng 8, Quận 3",
    district: "Quận 3",
    pickupWindow: "Tuần này",
    expiresInHours: 72,
    providerId: "p3",
    status: "open",
    x: 70,
    y: 26,
  },
];

export const requests: Request[] = [
  {
    id: "r1",
    postId: "f2",
    receiverName: "Bếp ăn Tình Thương",
    receiverOrg: "NGO Hạt Mầm",
    distanceKm: 2.4,
    trustScore: 4.9,
    verified: true,
    status: "pending",
    createdAt: "10 phút trước",
  },
  {
    id: "r2",
    postId: "f2",
    receiverName: "Trại cứu hộ Sài Gòn Time",
    receiverOrg: "Animal Rescue",
    distanceKm: 6.1,
    trustScore: 4.7,
    verified: true,
    status: "pending",
    createdAt: "22 phút trước",
  },
  {
    id: "r3",
    postId: "f4",
    receiverName: "Mái ấm Hoa Hồng Nhỏ",
    receiverOrg: "Tổ chức xã hội",
    distanceKm: 3.8,
    trustScore: 4.8,
    verified: true,
    status: "accepted",
    createdAt: "1 giờ trước",
  },
];

export const stories: Story[] = [
  {
    id: "s1",
    author: "Chị Hương",
    org: "Bếp ăn Tình Thương",
    avatar: "https://i.pravatar.cc/120?img=32",
    image: img("photo-1488521787991-ed7bbaae773c"),
    text:
      "Hôm nay chúng tôi nhận được 28kg suất ăn từ Khách sạn Lotus Saigon. 60 phần cơm đã được trao tận tay các em nhỏ tại mái ấm. Cảm ơn Food Life đã kết nối!",
    thanksTo: "Khách sạn Lotus Saigon",
    daysAgo: 1,
    likes: 142,
  },
  {
    id: "s2",
    author: "Anh Tuấn",
    org: "Trại cứu hộ Sài Gòn Time",
    avatar: "https://i.pravatar.cc/120?img=24",
    image: img("photo-1601758228041-f3b2795255f1"),
    text:
      "45kg rau củ tươi đã trở thành bữa ăn cho hơn 80 bé chó mèo được cứu hộ. Một ngày tử tế bắt đầu từ những điều nhỏ.",
    thanksTo: "Siêu thị Xanh Mart",
    daysAgo: 3,
    likes: 287,
  },
  {
    id: "s3",
    author: "Cô Lan",
    org: "Mái ấm Hoa Hồng Nhỏ",
    avatar: "https://i.pravatar.cc/120?img=44",
    image: img("photo-1593113598332-cd288d649433"),
    text:
      "Cảm ơn tiệm bánh Hương Việt mỗi tối đều chia sẻ bánh mì cho các em. Niềm vui rất đơn giản ❤️",
    thanksTo: "Bakery Hương Việt",
    daysAgo: 5,
    likes: 96,
  },
];

export const notifications: AppNotification[] = [
  {
    id: "n1",
    type: "request",
    title: "Có người đăng ký nhận",
    body: "NGO Hạt Mầm muốn nhận bài đăng 'Buffet trưa khách sạn'.",
    time: "10 phút trước",
    unread: true,
  },
  {
    id: "n2",
    type: "accepted",
    title: "Yêu cầu được chấp nhận",
    body: "Nhà hàng Cơm Niêu đã chấp nhận yêu cầu nhận 'Cơm hộp dư từ căn-tin'.",
    time: "1 giờ trước",
    unread: true,
  },
  {
    id: "n3",
    type: "reminder",
    title: "Nhắc thời gian nhận",
    body: "Bạn có buổi nhận thực phẩm lúc 14:30 hôm nay tại Quận 1.",
    time: "2 giờ trước",
    unread: false,
  },
  {
    id: "n4",
    type: "expiring",
    title: "Bài đăng sắp hết hạn",
    body: "Bài 'Bánh mì tươi cuối ngày' sẽ hết hạn trong 4 giờ.",
    time: "3 giờ trước",
    unread: false,
  },
];

export const impactStats = {
  totalKg: 10000,
  partners: 500,
  deals: 2000,
  co2Tons: 30,
};

export const esgWeekly = [
  { day: "T2", kg: 120, deals: 8 },
  { day: "T3", kg: 180, deals: 12 },
  { day: "T4", kg: 240, deals: 15 },
  { day: "T5", kg: 200, deals: 14 },
  { day: "T6", kg: 320, deals: 22 },
  { day: "T7", kg: 410, deals: 28 },
  { day: "CN", kg: 280, deals: 18 },
];

export function getProvider(id: string) {
  return providers.find((p) => p.id === id) ?? providers[0];
}
export function getPost(id: string) {
  return foodPosts.find((f) => f.id === id);
}
