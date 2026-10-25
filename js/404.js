// Nút về trang chủ theo vai trò đang đăng nhập
const trangChu = { seeker: "seeker-property-search.html", agent: "agent-listing-management.html", moderator: "moderator-listing-review.html", admin: "admin-user-management.html" };
const role = sessionStorage.getItem("role");
if (role && trangChu[role]) {
  document.querySelector("#ve-trang-chu").href = trangChu[role];
}
