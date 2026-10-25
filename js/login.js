// Đăng nhập demo: 4 tài khoản cố định, mật khẩu chung 123456
const taiKhoan = [
  { email: "a.nguyen@email.com", ten: "Nguyễn Văn A", role: "seeker", trang: "seeker-property-search.html" },
  { email: "b.tran@email.com", ten: "Trần Thị B", role: "agent", trang: "agent-dashboard.html" },
  { email: "c.le@email.com", ten: "Lê Văn C", role: "moderator", trang: "moderator-listing-review.html" },
  { email: "admin@homefit.vn", ten: "Quản trị", role: "admin", trang: "admin-platform-dashboard.html" }
];
const MAT_KHAU_DEMO = "123456";

function hienLoi(noiDung) {
  const o = document.querySelector("#loi");
  o.textContent = noiDung;
  o.classList.remove("d-none");
}

function dangNhap(event) {
  event.preventDefault();
  const email = document.querySelector("#email").value.trim();
  const matKhau = document.querySelector("#matkhau").value;
  if (email === "" || matKhau === "") {
    hienLoi("Vui lòng nhập email và mật khẩu.");
    return;
  }
  let user = null;
  taiKhoan.forEach(function (tk) {
    if (tk.email === email) user = tk;
  });
  if (user === null || matKhau !== MAT_KHAU_DEMO) {
    hienLoi("Email hoặc mật khẩu chưa đúng. Kiểm tra lại hoặc chọn Quên mật khẩu.");
    return;
  }
  sessionStorage.setItem("role", user.role);
  sessionStorage.setItem("ten", user.ten);
  sessionStorage.setItem("email", user.email);
  const tiepTheo = new URLSearchParams(window.location.search).get("next");
  window.location.href = (tiepTheo && user.role === "seeker") ? tiepTheo : user.trang; // chuyển đúng trang chủ vai trò
}

document.querySelector("#form-login").addEventListener("submit", dangNhap);
document.querySelectorAll(".nhanh").forEach(function (nut) {
  nut.addEventListener("click", function () {
    document.querySelector("#email").value = nut.dataset.email;
    document.querySelector("#matkhau").value = MAT_KHAU_DEMO;
  });
});
