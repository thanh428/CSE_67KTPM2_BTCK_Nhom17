kiemTraVaiTro("agent");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Môi giới";

async function luuTin(trangThai) {
  const d = docForm();
  if (!kiemTraListing(d)) return;
  d.status = trangThai;
  d.history = [trangThai];
  try {
    await create("properties", d); // C: tạo listing
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-success">Đã lưu tin với trạng thái «' + trangThai + '». <a href="agent-listing-management.html">Xem danh sách</a></div>';
  } catch (loi) {
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}
document.querySelector("#nut-nhap").addEventListener("click", function () { luuTin("Nháp"); });
document.querySelector("#nut-gui").addEventListener("click", function () { luuTin("Chờ duyệt"); });
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
