kiemTraVaiTro("seeker");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Người tìm nhà";

let danhSachNha = []; // dữ liệu lấy từ MockAPI

// AI1 mô phỏng: chấm điểm theo quy tắc đơn giản (không dùng số ngẫu nhiên)
function tinhDiem(nha) {
  let diem = 0;
  if (nha.distanceSchool <= 500) diem += 30;
  if (nha.quiet === "Cao" || nha.quiet === "Rất cao") diem += 25;
  if (nha.hasWorkspace) diem += 20;
  if (nha.price <= 14) diem += 25;
  return diem;
}

// Tạo các dòng đạt / chưa đạt từ dữ liệu
function taoDong(nha) {
  const dong = [];
  dong.push(nha.distanceSchool <= 500
    ? { dat: true, chu: "Gần trường " + nha.distanceSchool + "m" }
    : { dat: false, chu: "Xa trường " + nha.distanceSchool + "m" });
  dong.push(nha.quiet === "Cao" || nha.quiet === "Rất cao"
    ? { dat: true, chu: "Khu yên tĩnh" }
    : { dat: false, chu: "Khu khá ồn" });
  dong.push(nha.hasWorkspace
    ? { dat: true, chu: "Có chỗ làm việc" }
    : { dat: false, chu: "Chưa có chỗ làm việc" });
  return dong;
}

function veDanhSach(mang) {
  const vung = document.querySelector("#list");
  vung.innerHTML = "";
  mang.forEach(function (nha) {
    let html = '<div class="col-md-6 col-xl-4"><div class="the-nha">';
    const anh = layAnhHopLe(nha);
    html += anh.length > 0 ? '<img class="anh-nha" src="' + anh[0] + '" alt="Ảnh nhà">' : '<div class="anh-nha khong-anh">Chưa có ảnh</div>';
    html += '<span class="diem">' + tinhDiem(nha) + "</span>";
    html += "<h5 class='mt-2'>" + nha.price + " triệu/tháng</h5>";
    html += "<p>" + nha.name + " · " + nha.bedrooms + "PN · " + nha.area + "m²</p>";
    taoDong(nha).forEach(function (d) {
      html += '<div class="' + (d.dat ? "dat" : "chua") + '">' + d.chu + "</div>";
    });
    html += '<a class="btn btn-warning btn-sm mt-3 me-1" href="seeker-property-detail.html?id=' + nha.id + '">Xem chi tiết</a> ';
    html += '<button class="btn btn-outline-success btn-sm mt-3 nut-luu" data-id="' + nha.id + '">Lưu</button>';
    html += "</div></div>";
    vung.innerHTML += html;
  });
  document.querySelectorAll(".nut-luu").forEach(function (nut) {
    nut.addEventListener("click", function () { luuNha(nut.dataset.id); });
  });
}

function locNha() {
  const giaMax = Number(document.querySelector("#loc-gia").value);
  const dtMin = Number(document.querySelector("#loc-dientich").value);
  const canYenTinh = document.querySelector("#loc-yentinh").checked;
  const canLamViec = document.querySelector("#loc-lamviec").checked;
  const tuKhoa = document.querySelector("#o-tim").value.toLowerCase();
  const ketQua = danhSachNha.filter(function (nha) {
    if (nha.status !== "Đã duyệt") return false;
    if (nha.price > giaMax || nha.area < dtMin) return false;
    if (canYenTinh && nha.quiet !== "Cao" && nha.quiet !== "Rất cao") return false;
    if (canLamViec && !nha.hasWorkspace) return false;
    return (nha.name + " " + nha.district).toLowerCase().includes(tuKhoa);
  });
  ketQua.sort(function (a, b) { return tinhDiem(b) - tinhDiem(a); });
  if (ketQua.length === 0) { showState("empty"); return; }
  veDanhSach(ketQua);
  showState("content");
}

async function luuNha(id) {
  try {
    await create("savedProperties", { propertyId: id, userEmail: "a.nguyen@email.com", note: "" });
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-success">Đã lưu nhà.</div>';
  } catch (loi) {
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

async function taiDuLieu() {
  showState("loading");
  try {
    danhSachNha = await getAll("properties");
    document.querySelector("#o-tim").placeholder = "🔍 Tìm kiếm nhanh trong tổng số " + danhSachNha.length + " căn nhà...";
    locNha();
  } catch (loi) {
    showState("error", loi.message);
  }
}

document.querySelector("#nut-apdung").addEventListener("click", locNha);
document.querySelector("#o-tim").addEventListener("input", locNha);
document.querySelector("#nut-xoaloc").addEventListener("click", function () {
  document.querySelector("#loc-gia").value = 14;
  document.querySelector("#loc-dientich").value = 30;
  document.querySelector("#loc-yentinh").checked = false;
  document.querySelector("#loc-lamviec").checked = false;
  document.querySelector("#o-tim").value = "";
  locNha();
});
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
const tuKhoaUrl = new URLSearchParams(window.location.search).get("q");
if (tuKhoaUrl) document.querySelector("#o-tim").value = tuKhoaUrl;
taiDuLieu();
