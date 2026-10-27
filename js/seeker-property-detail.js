kiemTraVaiTro("seeker");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Người tìm nhà";
const id = new URLSearchParams(window.location.search).get("id"); // ví dụ ?id=1
let nha = null;
let timer = null;
let tomTat = "";
const vung = document.querySelector("#ai-noidung");

// Đếm số trường bắt buộc bị thiếu
function demTruongThieu(n) {
  let thieu = 0;
  if (n.distanceSchool === undefined || n.distanceSchool === null) thieu++;
  if (!n.quiet) thieu++;
  if (!n.price) thieu++;
  return thieu;
}

function taoUuNhuoc(n) {
  const uu = [], nhuoc = [];
  if (n.distanceSchool <= 500) uu.push("gần trường " + n.distanceSchool + "m"); else nhuoc.push("xa trường " + n.distanceSchool + "m");
  if (n.quiet === "Cao" || n.quiet === "Rất cao") uu.push("yên tĩnh (" + n.quiet + ")"); else nhuoc.push("khu khá ồn");
  if (n.hasWorkspace) uu.push("có chỗ làm việc"); else nhuoc.push("chưa có chỗ làm việc");
  return { uu: uu, nhuoc: nhuoc };
}

function veNha() {
  veThuVien();
  document.querySelector("#ten-nha").textContent = nha.name + " · " + nha.price + " triệu/tháng";
  document.querySelector("#thong-tin").textContent = nha.district + " · " + nha.bedrooms + "PN · " + nha.area + "m² · " + nha.status;
  const r = taoUuNhuoc(nha);
  let html = "";
  r.uu.forEach(function (t) { html += '<div class="dat">' + t + "</div>"; });
  r.nhuoc.forEach(function (t) { html += '<div class="chua">' + t + "</div>"; });
  document.querySelector("#dong-hop").innerHTML = html;
}

function chayAI() {
  vung.innerHTML = 'AI đang xử lý... <button id="nut-huy" class="btn btn-sm btn-outline-dark">Hủy</button>';
  document.querySelector("#nut-huy").addEventListener("click", function () { clearTimeout(timer); vung.innerHTML = "Đã hủy."; });
  timer = setTimeout(function () {
    if ((document.querySelector("#gia-loi") !== null && document.querySelector("#gia-loi").checked) || demTruongThieu(nha) >= 2) {
      vung.innerHTML = 'Chưa đủ dữ liệu để tóm tắt. <button id="nut-thu" class="btn btn-sm btn-outline-dark">Thử lại</button>';
      document.querySelector("#nut-thu").addEventListener("click", chayAI);
      return;
    }
    const r = taoUuNhuoc(nha);
    tomTat = "Ưu: " + r.uu.join(", ") + ". Nhược: " + r.nhuoc.join(", ") + ".";
    vung.innerHTML = "<p>Ưu: " + (r.uu.join(", ") || "chưa có") + "</p><p>Nhược: " + (r.nhuoc.join(", ") || "chưa có") +
      "</p><p><b>Vì sao?</b> Đạt " + r.uu.length + "/3 tiêu chí.</p>" +
      '<button id="nut-chapnhan" class="btn btn-xanh btn-sm">Chấp nhận</button> <button id="nut-tuchoi" class="btn btn-outline-dark btn-sm">Từ chối</button> ' +
      '<button id="nut-taolai" class="btn btn-outline-dark btn-sm">Tạo lại</button><div id="kq" class="mt-2"></div>';
    document.querySelector("#nut-chapnhan").addEventListener("click", ghimTomTat);
    document.querySelector("#nut-tuchoi").addEventListener("click", function () { vung.innerHTML = "Đã từ chối tóm tắt."; });
    document.querySelector("#nut-taolai").addEventListener("click", chayAI);
  }, 1500);
}

// Chấp nhận: ghim tóm tắt vào ghi chú nhà đã lưu
async function ghimTomTat() {
  try {
    await create("savedProperties", { propertyId: nha.id, userEmail: "a.nguyen@email.com", note: "AI: " + tomTat });
    document.querySelector("#kq").innerHTML = '<div class="alert alert-success">Đã ghim tóm tắt vào ghi chú nhà đã lưu.</div>';
  } catch (loi) {
    document.querySelector("#kq").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

async function luuNha() {
  try {
    await create("savedProperties", { propertyId: nha.id, userEmail: "a.nguyen@email.com", note: "" });
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-success">Đã lưu nhà.</div>';
    const nutLuu = document.querySelector("#nut-luu");
    nutLuu.textContent = "✓ Đã lưu";
    nutLuu.classList.remove("btn-outline-success");
    nutLuu.classList.add("btn-success");
    nutLuu.disabled = true;
  } catch (loi) {
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

async function taiDuLieu() {
  showState("loading");
  try {
    nha = await getById("properties", id);
    veNha();
    showState("content");
    chayAI();
  } catch (loi) {
    showState("error", loi.message);
  }
}

document.querySelector("#nut-luu").addEventListener("click", luuNha);
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
if (id === null) { showState("empty"); } else { taiDuLieu(); }

// ===== 3 modal: đặt lịch, gửi tin nhắn, báo cáo =====
function datLoi(id, chu) { document.querySelector("#loi-" + id).textContent = chu; }
function giaTri(id) { return document.querySelector("#" + id).value.trim(); }

function dongModal(idModal) {
  bootstrap.Modal.getInstance(document.querySelector("#" + idModal)).hide();
}
function baoThanhCong(chu) {
  document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-success">' + chu + "</div>";
}
function baoLoi(loi) {
  document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
}

async function guiLich() {
  const ngay = giaTri("lich-ngay"), gio = giaTri("lich-gio");
  let ok = true;
  datLoi("lich-ngay", ""); datLoi("lich-gio", "");
  const homNay = new Date().toISOString().slice(0, 10);
  if (ngay === "" || ngay < homNay) { datLoi("lich-ngay", "Chọn ngày từ hôm nay trở đi."); ok = false; }
  if (gio < "08:00" || gio > "20:00") { datLoi("lich-gio", "Giờ xem từ 08:00 đến 20:00."); ok = false; }
  if (!ok) return;
  try {
    await create("viewings", { propertyId: nha.id, propertyName: nha.name, date: ngay, time: gio,
      note: giaTri("lich-nhan"), status: "Chờ xác nhận", seekerEmail: "a.nguyen@email.com", seekerName: sessionStorage.getItem("ten") });
    dongModal("modal-lich");
    baoThanhCong("Đã gửi yêu cầu đặt lịch xem nhà.");
  } catch (loi) { dongModal("modal-lich"); baoLoi(loi); }
}

async function guiTin() {
  const ten = giaTri("tin-ten"), sdt = giaTri("tin-sdt"), nd = giaTri("tin-nd");
  let ok = true;
  datLoi("tin-ten", ""); datLoi("tin-sdt", ""); datLoi("tin-nd", "");
  if (ten === "") { datLoi("tin-ten", "Nhập họ tên."); ok = false; }
  if (sdt.length !== 10 || isNaN(Number(sdt))) { datLoi("tin-sdt", "Số điện thoại gồm 10 chữ số."); ok = false; }
  if (nd.length < 10) { datLoi("tin-nd", "Nội dung ít nhất 10 ký tự."); ok = false; }
  if (!ok) return;
  try {
    await create("leads", { name: ten, phone: sdt, need: nd, source: "Tìm kiếm", status: "Mới", propertyId: nha.id });
    dongModal("modal-tin");
    baoThanhCong("Đã gửi tin nhắn. Hệ thống tạo lead mới cho môi giới.");
  } catch (loi) { dongModal("modal-tin"); baoLoi(loi); }
}

async function guiBaoCao() {
  const lyDo = giaTri("bc-lydo"), moTa = giaTri("bc-mota");
  let ok = true;
  datLoi("bc-lydo", ""); datLoi("bc-mota", "");
  if (lyDo === "") { datLoi("bc-lydo", "Chọn lý do."); ok = false; }
  if (moTa.length < 10) { datLoi("bc-mota", "Mô tả ít nhất 10 ký tự."); ok = false; }
  if (!ok) return;
  try {
    await create("reports", { code: "RP" + Date.now().toString().slice(-4), propertyId: nha.id, propertyName: nha.name,
      reason: lyDo, description: moTa, status: "Mới", reporterEmail: "a.nguyen@email.com" });
    dongModal("modal-bc");
    baoThanhCong("Đã gửi báo cáo. Xem trạng thái ở Của tôi, mục Báo cáo.");
  } catch (loi) { dongModal("modal-bc"); baoLoi(loi); }
}

document.querySelector("#gui-lich").addEventListener("click", guiLich);
document.querySelector("#gui-tin").addEventListener("click", guiTin);
document.querySelector("#gui-bc").addEventListener("click", guiBaoCao);

// Thư viện ảnh: ảnh lớn ở trên, bấm ảnh nhỏ để đổi ảnh lớn
function veThuVien() {
  const tv = document.querySelector("#thu-vien");
  const anh = layAnhHopLe(nha);
  if (anh.length === 0) { tv.innerHTML = '<div class="anh-lon khong-anh">Chưa có ảnh</div>'; return; }
  let html = '<img id="anh-lon" class="anh-lon" src="' + anh[0] + '" alt="Ảnh nhà">';
  if (anh.length > 1) {
    html += '<div class="d-flex gap-2 mt-2">';
    anh.forEach(function (a, i) { html += '<img class="anh-nho" data-i="' + i + '" src="' + a + '" alt="Ảnh ' + (i + 1) + '">'; });
    html += "</div>";
  }
  tv.innerHTML = html;
  document.querySelectorAll(".anh-nho").forEach(function (n) {
    n.addEventListener("click", function () { document.querySelector("#anh-lon").src = anh[Number(n.dataset.i)]; });
  });
}
