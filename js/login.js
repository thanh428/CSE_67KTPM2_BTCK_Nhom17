// Đăng nhập: ưu tiên đọc tài khoản từ MockAPI (gồm cả tài khoản đăng ký mới).
// Nếu không gọi được API thì dùng 4 tài khoản demo cố định (mật khẩu 123456).
const taiKhoanDemo = [
  { email: "a.nguyen@email.com", name: "Nguyễn Văn A", role: "seeker" },
  { email: "b.tran@email.com", name: "Trần Thị B", role: "agent" },
  { email: "c.le@email.com", name: "Lê Văn C", role: "moderator" },
  { email: "admin@homefit.vn", name: "Quản trị", role: "admin" }
];
const MAT_KHAU_DEMO = "123456";
const TRANG_THEO_VAI_TRO = {
  seeker: "seeker-property-search.html",
  agent: "agent-dashboard.html",
  moderator: "moderator-listing-review.html",
  admin: "admin-platform-dashboard.html"
};

function hienLoi(noiDung) {
  const o = document.querySelector("#loi");
  o.textContent = noiDung;
  o.classList.remove("d-none");
}

async function timTaiKhoan(email) {
  try {
    const ds = await getAll("users");
    const u = ds.find(function (x) { return x.email === email; });
    if (u) return { user: u, tuApi: true };
  } catch (loi) {
    // không gọi được API: dùng tài khoản demo bên dưới
  }
  const demo = taiKhoanDemo.find(function (x) { return x.email === email; });
  return { user: demo || null, tuApi: false };
}

async function dangNhap(event) {
  event.preventDefault();
  document.querySelector("#loi").classList.add("d-none");
  const email = document.querySelector("#email").value.trim();
  const matKhau = document.querySelector("#matkhau").value;
  if (email === "" || matKhau === "") {
    hienLoi("Vui lòng nhập email và mật khẩu.");
    return;
  }
  const nut = document.querySelector("#form-login button:not([type=button])");
  nut.disabled = true;
  nut.textContent = "Đang xử lý...";
  const kq = await timTaiKhoan(email);
  nut.disabled = false;
  nut.textContent = "Đăng nhập";
  const user = kq.user;
  const matKhauDung = (user && kq.tuApi && user.password) ? user.password : MAT_KHAU_DEMO;
  if (user === null || matKhau !== matKhauDung) {
    hienLoi("Email hoặc mật khẩu chưa đúng. Kiểm tra lại hoặc chọn Quên mật khẩu.");
    return;
  }
  if (user.status === "Khóa") {
    hienLoi("Tài khoản đã bị khóa.");
    return;
  }
  sessionStorage.setItem("role", user.role);
  sessionStorage.setItem("ten", user.name);
  sessionStorage.setItem("email", user.email);
  const tiepTheo = new URLSearchParams(window.location.search).get("next");
  window.location.href = (tiepTheo && user.role === "seeker") ? tiepTheo : TRANG_THEO_VAI_TRO[user.role];
}

document.querySelector("#form-login").addEventListener("submit", dangNhap);
document.querySelectorAll(".nhanh").forEach(function (nut) {
  nut.addEventListener("click", function () {
    document.querySelector("#email").value = nut.dataset.email;
    document.querySelector("#matkhau").value = MAT_KHAU_DEMO;
  });
});
