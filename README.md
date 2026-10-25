# HomeFit AI - Bản demo giao diện v4.1
Công nghệ: HTML, CSS, JavaScript thuần, Bootstrap 5 (CDN), MockAPI.io. AI là AI mô phỏng bằng điều kiện JavaScript.

## Cách chạy
Mở thư mục bằng VS Code, chuột phải `pages/login.html`, chọn Open with Live Server.
Tài khoản demo (mật khẩu chung `123456`): a.nguyen@email.com (người tìm nhà), b.tran@email.com (môi giới), c.le@email.com (kiểm duyệt), admin@homefit.vn (quản trị).

## Cấu hình MockAPI
1. Vào mockapi.io, tạo project, tạo các resource: properties, briefs, savedProperties, leads, viewings, reports, users, categories, notifications, aiEvents (tùy chọn).
2. Dán URL project vào `js/api-config.js`.
3. Nhập dữ liệu mẫu. Mỗi nhà trong `properties` cần: name, district, price, area, bedrooms, distanceSchool, quiet, hasWorkspace, status, createdAt, agentEmail ("b.tran@email.com"), type, images (mảng, có thể rỗng).
   Ví dụ P01: {"name":"Căn hộ Cầu Giấy","district":"Cầu Giấy","price":12.5,"area":45,"bedrooms":2,"distanceSchool":400,"quiet":"Cao","hasWorkspace":false,"status":"Đã duyệt","agentEmail":"b.tran@email.com","type":"Căn hộ / Chung cư","images":["x"]}
   Các nhà còn lại lấy từ PDF: P02 Chung cư Hà Đông 9,8 triệu · P03 Nhà Tây Hồ 14 · P04 Nhà phố Long Biên 11 · P05 Căn hộ Mỹ Đình 8,5 · P06 Căn hộ Cầu Giấy 2 13,2.
4. `categories`: type "loai" (name, status) hoặc type "nhan" (name, keywords, rule, status). rule là một trong gan-truong, yen-tinh, lam-viec, gia-dinh.
5. `users`: 4 tài khoản trên với trường name, email, role (seeker/agent/moderator/admin), status ("Hoạt động"/"Khóa").
6. `viewings` cần: propertyId, propertyName, date, time, status, seekerEmail, seekerName. `reports` cần: code, propertyId, propertyName, reason, status, reporterEmail. `leads` cần: name, need, source, status. `notifications` cần: userEmail, text, read, createdAt.

## API chạy sẵn bằng json-server (không cần tài khoản, không giới hạn resource)
MockAPI bản miễn phí chỉ cho vài resource (khoảng 2-4) và 100 bản ghi mỗi resource, trong khi dự án dùng 10 resource. Vì vậy dự án có sẵn `db.json` đã nhập đủ dữ liệu mẫu (P01-P10, 4 tài khoản, lead, lịch xem, báo cáo, thông báo...).
1. Cài Node.js (nodejs.org).
2. Mở terminal trong thư mục dự án, chạy: `npx json-server@0.17.4 --watch db.json --port 3000`
3. Giữ terminal chạy, mở `pages/login.html` bằng Live Server. `js/api-config.js` đã trỏ sẵn tới `http://localhost:3000`.
Muốn đặt lại dữ liệu: copy lại file `db.json` gốc từ bản zip. Ngày giờ trong db.json được tính từ lúc tạo file, nên lịch xem có thể thành quá khứ sau vài ngày.
