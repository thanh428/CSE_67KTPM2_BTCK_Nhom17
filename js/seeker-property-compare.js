// 1. Lấy phần tử
const app = document.querySelector('#app');

// 2. Các hàm
function khoiTaoTrang() {
  HomeFitUI.initPage('seeker-property-compare');
}

// 3. Gắn sự kiện + chạy khi tải trang
if (app) khoiTaoTrang();

