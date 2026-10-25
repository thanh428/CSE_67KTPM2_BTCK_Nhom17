// Hàm dùng chung: kiểm tra vai trò, đăng xuất, đổi trạng thái vùng hiển thị
function kiemTraVaiTro(vaiTroChoPhep) {
  if (sessionStorage.getItem("role") !== vaiTroChoPhep) {
    window.location.href = "403.html";
  }
}
function dangXuat() {
  sessionStorage.clear();
  window.location.href = "login.html";
}
// trangThai: "loading" | "empty" | "error" | "content"
function showState(trangThai, thongDiep) {
  document.querySelector("#state-loading").classList.toggle("d-none", trangThai !== "loading");
  document.querySelector("#state-empty").classList.toggle("d-none", trangThai !== "empty");
  document.querySelector("#state-error").classList.toggle("d-none", trangThai !== "error");
  document.querySelector("#list").classList.toggle("d-none", trangThai !== "content");
  if (trangThai === "error") {
    document.querySelector("#error-text").textContent = thongDiep;
  }
}

// Trang chủ theo vai trò + điền tên người dùng + nút đăng xuất (dùng cho các trang dùng chung)
const TRANG_CHU = { seeker: "seeker-property-search.html", agent: "agent-dashboard.html", moderator: "moderator-listing-review.html", admin: "admin-platform-dashboard.html" };
function chuanBiMenuChung() {
  const role = sessionStorage.getItem("role");
  if (role === null) { window.location.href = "login.html"; return; } // chưa đăng nhập
  document.querySelector("#link-chu").href = TRANG_CHU[role];
  document.querySelector("#logo-ve").href = TRANG_CHU[role];
  document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten");
  document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
}

// Lấy các ảnh dùng được của một nhà (bỏ đường dẫn ảnh mẫu không tồn tại)
function layAnhHopLe(nha) {
  return (nha.images || []).filter(function (a) { return typeof a === "string" && (a.startsWith("data:") || a.startsWith("http")); });
}
