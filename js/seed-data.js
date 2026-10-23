/* Dữ liệu mẫu tập trung tại một nơi để mọi trang dùng chung. */
(function () {
  const now = new Date();
  const dateOnly = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };
  const atTime = (daysAhead, time) => {
    const date = new Date(now);
    date.setDate(date.getDate() + daysAhead);
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  };
  const nextWeekday = (weekday, time) => {
    const date = new Date(now);
    let days = (weekday - date.getDay() + 7) % 7;
    if (days === 0) days = 7;
    date.setDate(date.getDate() + days);
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  };

  const users = [
    { id: 'user_a1', name: 'Nguyễn Văn A', email: 'seeker@homefit.vn', password: '123456', role: 'seeker', status: 'Hoạt động', phone: '0900000001' },
    { id: 'user_b1', name: 'Trần Thị B', email: 'agent@homefit.vn', password: '123456', role: 'agent', status: 'Hoạt động', phone: '0900000002' },
    { id: 'user_c1', name: 'Lê Văn C', email: 'moderator@homefit.vn', password: '123456', role: 'moderator', status: 'Hoạt động', phone: '0900000003' },
    { id: 'user_admin', name: 'Quản trị', email: 'admin@homefit.vn', password: '123456', role: 'admin', status: 'Hoạt động', phone: '0900000004' }
  ];
  const agentId = 'user_b1';
  const properties = [
    { id: 'P01', name: 'Căn hộ Cầu Giấy', district: 'Cầu Giấy', price: 12.5, bedrooms: 2, area: 45, schoolDistance: 400, quietness: 'Cao', workspace: false, matchScores: { brief_1: 92 }, status: 'Đã duyệt', type: 'Căn hộ / Chung cư', agentId, address: 'Cầu Giấy, Hà Nội', bathrooms: 1, floor: 8, amenities: ['Thang máy', 'Điều hòa'], description: 'Căn hộ sáng, tiện đi lại và gần trường đại học.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
    { id: 'P02', name: 'Chung cư Hà Đông', district: 'Hà Đông', price: 9.8, bedrooms: 1, area: 35, schoolDistance: 1200, quietness: 'Rất cao', workspace: true, matchScores: { brief_1: 88 }, status: 'Đã duyệt', type: 'Căn hộ / Chung cư', agentId, address: 'Hà Đông, Hà Nội', bathrooms: 1, floor: 12, amenities: ['Thang máy', 'Ban công'], description: 'Không gian yên tĩnh, có góc làm việc.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80' },
    { id: 'P03', name: 'Nhà Tây Hồ', district: 'Tây Hồ', price: 14, bedrooms: 2, area: 55, schoolDistance: 1500, quietness: 'Trung bình', workspace: true, matchScores: { brief_1: 85 }, status: 'Đã duyệt', type: 'Nhà phố / Nhà riêng', agentId, address: 'Tây Hồ, Hà Nội', bathrooms: 2, floor: 3, amenities: ['Ban công', 'Chỗ để xe'], description: 'Nhà riêng thoáng, gần các tiện ích khu vực.', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80' },
    { id: 'P04', name: 'Nhà phố Long Biên', district: 'Long Biên', price: 11, bedrooms: 2, area: 48, schoolDistance: 2100, quietness: 'Thấp', workspace: false, matchScores: { brief_1: 81 }, status: 'Đã duyệt', type: 'Nhà phố / Nhà riêng', agentId, address: 'Long Biên, Hà Nội', bathrooms: 1, floor: 2, amenities: ['Chỗ để xe'], description: 'Nhà phố có diện tích sử dụng hợp lý.', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80' },
    { id: 'P05', name: 'Căn hộ Mỹ Đình', district: 'Nam Từ Liêm', price: 8.5, bedrooms: 1, area: 32, schoolDistance: 2100, quietness: 'Thấp', workspace: false, matchScores: { brief_1: 78 }, status: 'Đã duyệt', type: 'Căn hộ / Chung cư', agentId, address: 'Nam Từ Liêm, Hà Nội', bathrooms: 1, floor: 5, amenities: ['Thang máy'], description: 'Căn hộ gọn gàng, mức thuê vừa phải.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80' },
    { id: 'P06', name: 'Căn hộ Cầu Giấy 2', district: 'Cầu Giấy', price: 13.2, bedrooms: 2, area: 50, schoolDistance: 2100, quietness: 'Thấp', workspace: false, matchScores: { brief_1: 74 }, status: 'Đã duyệt', type: 'Căn hộ / Chung cư', agentId, address: 'Cầu Giấy, Hà Nội', bathrooms: 1, floor: 10, amenities: ['Thang máy'], description: 'Căn hộ hai phòng ngủ tại Cầu Giấy.', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80' },
    { id: 'P07', name: 'Căn hộ Mỹ Đình 68m²', district: 'Nam Từ Liêm', price: 12.5, bedrooms: 2, area: 68, schoolDistance: 400, quietness: 'Cao', workspace: true, status: 'Chờ duyệt', type: 'Căn hộ / Chung cư', agentId, address: 'Nam Từ Liêm, Hà Nội', bathrooms: 2, floor: 9, amenities: ['Thang máy', 'Ban công'], description: 'Căn hộ rộng, có góc làm việc.', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80' },
    { id: 'P08', name: 'Nhà phố Thanh Xuân', district: 'Thanh Xuân', price: 10, bedrooms: 2, area: 40, schoolDistance: 800, quietness: 'Trung bình', workspace: false, status: 'Cần bổ sung', type: 'Nhà phố / Nhà riêng', agentId, address: 'Thanh Xuân, Hà Nội', bathrooms: 1, floor: 3, amenities: [], description: 'Tin cần bổ sung ảnh nội thất.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80' },
    { id: 'P09', name: 'Studio Đống Đa', district: 'Đống Đa', price: 7, bedrooms: 1, area: 28, schoolDistance: 600, quietness: 'Cao', workspace: true, status: 'Nháp', type: 'Studio', agentId, address: 'Đống Đa, Hà Nội', bathrooms: 1, floor: 4, amenities: ['Điều hòa'], description: 'Studio phù hợp người ở một mình.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80' },
    { id: 'P10', name: 'Villa Tây Hồ', district: 'Tây Hồ', price: 30, bedrooms: 4, area: 180, schoolDistance: 1500, quietness: 'Rất cao', workspace: true, status: 'Từ chối', type: 'Villa / Biệt thự', agentId, address: 'Tây Hồ, Hà Nội', bathrooms: 3, floor: 2, amenities: ['Sân vườn', 'Chỗ để xe'], description: 'Biệt thự rộng tại Tây Hồ.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' }
  ];
  const briefs = [
    { id: 'brief_1', ownerId: 'user_a1', name: 'Brief #1', district: 'Cầu Giấy', budget: 14, bedrooms: 2, importantPlace: 'Trường đại học', description: 'Cần nhà gần trường, yên tĩnh cho gia đình.', priorities: { nearSchool: 'Bắt buộc', quiet: 'Bắt buộc', workspace: 'Nên có', family: 'Nên có' }, shareWithAgent: true, status: 'Đang dùng', keywords: ['gần trường', 'yên tĩnh', 'gia đình'] },
    { id: 'brief_2', ownerId: 'user_a1', name: 'Brief #2', district: 'Hà Đông', budget: 10, bedrooms: 1, importantPlace: 'Trường đại học', description: 'Tìm căn hộ nhỏ, ngân sách hợp lý.', priorities: { nearSchool: 'Nên có', quiet: 'Nên có', workspace: 'Nên có', family: 'Nên có' }, shareWithAgent: false, status: 'Lưu trữ', keywords: ['Hà Đông'] }
  ];
  const leads = [
    { id: 'lead_1', name: 'Hoàng Minh', phone: '0910000001', source: 'Home Brief', score: 92, propertyId: 'P01', briefId: 'brief_1', status: 'Mới', agentId, notes: 'Quan tâm căn hộ gần trường.' },
    { id: 'lead_2', name: 'Lê Thu', phone: '0910000002', source: 'Tìm kiếm', score: 88, propertyId: 'P02', briefId: 'brief_2', status: 'Đang liên hệ', agentId, notes: 'Đã trao đổi lần đầu.' },
    { id: 'lead_3', name: 'Phạm Quang', phone: '0910000003', source: 'Nhập tay', score: 78, propertyId: 'P05', briefId: '', status: 'Đã chốt', agentId, notes: 'Khách đã chốt thuê.' }
  ];
  const viewings = [
    { id: 'view_1', customerId: 'user_a1', customerName: 'Nguyễn Văn A', propertyId: 'P01', leadId: '', scheduledAt: atTime(1, '14:00'), status: 'Đã xác nhận', note: '' },
    { id: 'view_2', customerId: 'user_a1', customerName: 'Nguyễn Văn A', propertyId: 'P02', leadId: '', scheduledAt: nextWeekday(5, '09:30'), status: 'Chờ xác nhận', note: '' },
    { id: 'view_3', customerId: '', customerName: 'Hoàng Minh', propertyId: 'P01', leadId: 'lead_1', scheduledAt: atTime(2, '10:00'), status: 'Chờ xác nhận', note: '' },
    { id: 'view_4', customerId: '', customerName: 'Lê Thu', propertyId: 'P02', leadId: 'lead_2', scheduledAt: atTime(-2, '15:00'), status: 'Hoàn thành', note: '' },
    { id: 'view_5', customerId: '', customerName: 'Phạm Quang', propertyId: 'P05', leadId: 'lead_3', scheduledAt: atTime(-4, '16:00'), status: 'Đã hủy', note: '' }
  ];
  const reports = [
    { id: 'RP001', propertyId: 'P01', reason: 'Sai thông tin giá', reporterId: 'user_a1', status: 'Đang xử lý', conclusion: '', note: '' },
    { id: 'RP002', propertyId: 'P03', reason: 'Ảnh không đúng thực tế', reporterId: 'user_a2', status: 'Hoàn thành', conclusion: 'Cần thêm thông tin', note: '' },
    { id: 'RP003', propertyId: 'P04', reason: 'Nghi trùng lặp', reporterId: 'user_a3', status: 'Mới', conclusion: '', note: '' },
    { id: 'RP004', propertyId: 'P05', reason: 'Sai thông tin giá', reporterId: 'user_a1', status: 'Hoàn thành', conclusion: 'Không hợp lệ', note: '' }
  ];
  const notifications = users.flatMap((user) => [
    { id: `${user.id}_n1`, userId: user.id, title: 'Chào mừng đến HomeFit AI', message: 'Bắt đầu khám phá các tính năng phù hợp với vai trò của bạn.', read: false, createdAt: atTime(0, '09:00') },
    { id: `${user.id}_n2`, userId: user.id, title: 'Có cập nhật mới', message: 'Dữ liệu demo đã sẵn sàng để bạn trải nghiệm.', read: false, createdAt: atTime(-1, '09:00') },
    { id: `${user.id}_n3`, userId: user.id, title: 'Gợi ý dành cho bạn', message: 'Hoàn thiện hồ sơ để sử dụng HomeFit thuận tiện hơn.', read: false, createdAt: atTime(-2, '09:00') },
    { id: `${user.id}_n4`, userId: user.id, title: 'Tài khoản đã được tạo', message: 'Bạn có thể đăng nhập bằng tài khoản demo.', read: true, createdAt: atTime(-3, '09:00') }
  ]);
  const categories = ['Căn hộ / Chung cư', 'Nhà phố / Nhà riêng', 'Studio', 'Villa / Biệt thự'].map((name, index) => ({ id: `category_${index + 1}`, name, active: true }));
  const needLabels = [
    { id: 'nearSchool', name: 'Gần trường', active: true, rule: 'Cách trường ≤ 500m' },
    { id: 'quiet', name: 'Yên tĩnh', active: true, rule: 'Mức yên tĩnh Cao hoặc Rất cao' },
    { id: 'workspace', name: 'Có chỗ làm việc', active: true, rule: 'Chỗ làm việc = Có' },
    { id: 'family', name: 'Phù hợp gia đình', active: true, rule: 'Từ 2 phòng ngủ và yên tĩnh Cao trở lên' }
  ];

  window.HOMEFIT_SEED = {
    version: 3,
    generatedAt: dateOnly(now),
    tables: { users, properties, briefs, leads, viewings, reports, notifications, savedProperties: [
      { id: 'saved_1', userId: 'user_a1', propertyId: 'P01', note: 'Gần trường, phù hợp nhu cầu.' },
      { id: 'saved_2', userId: 'user_a1', propertyId: 'P02', note: 'Yên tĩnh, có góc làm việc.' },
      { id: 'saved_3', userId: 'user_a1', propertyId: 'P03', note: 'Cân nhắc thêm về vị trí.' }
    ], categories, needLabels, aiEvents: [] },
    settings: { simulateAiErrors: false }
  };
})();
