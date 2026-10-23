// 1. Lấy phần tử
const homeApp = document.querySelector('#app');

// 2. Các hàm
function khoiTaoTrangChu() {
  HomeFitUI.initPage('index');
}

// 3. Gắn sự kiện + chạy khi tải trang
if (homeApp) khoiTaoTrangChu();
