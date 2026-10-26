kiemTraVaiTro("agent");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Môi giới";
document.querySelector("#state-empty").textContent = "Không tìm thấy listing. Quay lại danh sách để chọn tin cần sửa.";
const id = new URLSearchParams(window.location.search).get("id"); // ví dụ ?id=8
let goc = null; // bản đã lưu, dùng cho Hoàn tác

async function taiDuLieu() {
  showState("loading");
  try {
    goc = await getById("properties", id);
    if (goc.agentEmail && goc.agentEmail !== "b.tran@email.com") { window.location.href = "403.html"; return; } // không phải tin của mình
    await new Promise(function (xong) { setTimeout(xong, 300); }); // chờ danh mục nạp xong
    ghiForm(goc);
    document.querySelector("#lich-su").textContent = (goc.history || [goc.status]).join(" > ") + (goc.reviewNote ? " · «" + goc.reviewNote + "»" : "");
    showState("content");
  } catch (loi) {
    showState("error", loi.message);
  }
}

async function luuTin(trangThai) {
  const d = docForm();
  if (!kiemTraListing(d)) return;
  const ketQua = Object.assign({}, goc, d);
  ketQua.status = trangThai;
  // Đổi giá / diện tích / địa chỉ của tin đã duyệt thì quay lại Chờ duyệt
  const doiQuanTrong = d.price !== goc.price || d.area !== goc.area || d.district !== goc.district;
  if (goc.status === "Đã duyệt" && doiQuanTrong) ketQua.status = "Chờ duyệt";
  ketQua.history = (goc.history || []).concat(ketQua.status);
  try {
    await update("properties", id, ketQua); // U
    goc = ketQua;
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-success">Đã cập nhật. Trạng thái: ' + ketQua.status + "</div>";
  } catch (loi) {
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

document.querySelector("#nut-hoantac").addEventListener("click", function () { ghiForm(goc); });
document.querySelector("#nut-nhap").addEventListener("click", function () { luuTin("Nháp"); });
document.querySelector("#nut-gui").addEventListener("click", function () { luuTin("Chờ duyệt"); });
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
if (id === null) { showState("empty"); } else { taiDuLieu(); }
