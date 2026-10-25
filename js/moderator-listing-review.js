kiemTraVaiTro("moderator");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Kiểm duyệt viên";
document.querySelector("#state-empty").textContent = "Đã duyệt hết, không còn tin chờ.";
const vungAI = document.querySelector("#ai-noidung");
let hangCho = [];   // các listing cần xem
let dangChon = null;
let dsReport = [];        // tất cả báo cáo
let idBiBaoCao = [];     // id các tin đang có báo cáo chưa xong
let timer = null;
let tomTat = "";

// Hàng chờ = tin Chờ duyệt + tin có report chưa xong
async function taiDuLieu() {
  showState("loading");
  try {
    const nha = await getAll("properties");
    const bc = await getAll("reports");
    dsReport = bc;
    idBiBaoCao = bc.filter(function (r) { return r.status !== "Hoàn thành"; }).map(function (r) { return r.propertyId; });
    hangCho = nha.filter(function (p) {
      const biBaoCao = bc.some(function (r) { return r.propertyId === p.id && r.status !== "Hoàn thành"; });
      return p.status === "Chờ duyệt" || biBaoCao;
    });
    veHangCho();
  } catch (loi) {
    showState("error", loi.message);
  }
}

function veHangCho() {
  document.querySelector("#so-hang").textContent = hangCho.length;
  if (hangCho.length === 0) { showState("empty"); return; }
  const v = document.querySelector("#hang-cho");
  v.innerHTML = "";
  hangCho.forEach(function (p) {
    v.innerHTML += '<button class="btn btn-outline-dark btn-sm muc nut-muc" data-id="' + p.id + '">' + p.name + " · " + (p.status === "Chờ duyệt" ? "Chờ duyệt" : "Bị báo cáo") + "</button>";
  });
  document.querySelectorAll(".nut-muc").forEach(function (n) {
    n.addEventListener("click", function () { chonTin(n.dataset.id); });
  });
  showState("content");
  chonTin(hangCho[0].id);
}

function chonTin(id) {
  dangChon = hangCho.find(function (p) { return p.id === id; });
  document.querySelector("#ten-nha").textContent = dangChon.name + " · " + dangChon.price + " triệu/tháng";
  document.querySelector("#thong-tin").textContent = dangChon.district + " · " + dangChon.bedrooms + "PN · " + dangChon.area + "m² · cách trường " + dangChon.distanceSchool + "m · yên tĩnh " + dangChon.quiet;
  document.querySelector("#ghichu").value = "";
  chayAI();
}

function demThieu(p) {
  let thieu = 0;
  if (p.distanceSchool === undefined || p.distanceSchool === null) thieu++;
  if (!p.quiet) thieu++;
  if (!p.price) thieu++;
  if (!p.description) thieu++;
  return thieu;
}

function chayAI() {
  vungAI.innerHTML = 'AI đang xử lý... <button id="nut-huy" class="btn btn-sm btn-outline-dark">Hủy</button>';
  document.querySelector("#nut-huy").addEventListener("click", function () { clearTimeout(timer); vungAI.innerHTML = "Đã hủy."; });
  timer = setTimeout(function () {
    if ((document.querySelector("#gia-loi") !== null && document.querySelector("#gia-loi").checked) || demThieu(dangChon) >= 2) {
      vungAI.innerHTML = 'Chưa đủ dữ liệu để tóm tắt. <button id="nut-thu" class="btn btn-sm btn-outline-dark">Thử lại</button> <button id="nut-thucong" class="btn btn-sm btn-outline-dark">Dùng thủ công</button>';
      document.querySelector("#nut-thu").addEventListener("click", chayAI);
      document.querySelector("#nut-thucong").addEventListener("click", function () { vungAI.innerHTML = "Bạn tự xem xét tin và ghi quyết định bên dưới."; });
      return;
    }
    const uu = [], nhuoc = [];
    if (dangChon.distanceSchool <= 500) uu.push("gần trường " + dangChon.distanceSchool + "m"); else nhuoc.push("xa trường");
    if (dangChon.quiet === "Cao" || dangChon.quiet === "Rất cao") uu.push("yên tĩnh"); else nhuoc.push("khu khá ồn");
    if (dangChon.hasWorkspace) uu.push("có chỗ làm việc"); else nhuoc.push("chưa có chỗ làm việc");
    tomTat = "Ưu: " + uu.join(", ") + ". Nhược: " + nhuoc.join(", ") + ".";
    vungAI.innerHTML = "<p>Ưu: " + (uu.join(", ") || "chưa có") + "</p><p>Nhược: " + (nhuoc.join(", ") || "chưa có") + "</p><p><b>Vì sao?</b> Đủ các trường bắt buộc.</p>" +
      '<button id="nut-chapnhan" class="btn btn-xanh btn-sm">Chấp nhận</button> <button id="nut-sua" class="btn btn-outline-dark btn-sm">Sửa</button> <button id="nut-bo" class="btn btn-outline-dark btn-sm">Từ chối</button> <button id="nut-taolai" class="btn btn-outline-dark btn-sm">Tạo lại</button> <button id="nut-luu" class="btn btn-outline-dark btn-sm">Lưu</button>';
    // Chấp nhận / Lưu: điền sẵn ghi chú quyết định (người kiểm duyệt vẫn là người quyết định)
    document.querySelector("#nut-chapnhan").addEventListener("click", function () { document.querySelector("#ghichu").value = tomTat; });
    document.querySelector("#nut-luu").addEventListener("click", function () { document.querySelector("#ghichu").value = tomTat; });
    document.querySelector("#nut-sua").addEventListener("click", function () { document.querySelector("#ghichu").focus(); });
    document.querySelector("#nut-bo").addEventListener("click", function () { vungAI.innerHTML = "Đã từ chối gợi ý của AI."; });
    document.querySelector("#nut-taolai").addEventListener("click", chayAI);
  }, 1500);
}

async function quyetDinh(trangThaiMoi, canGhiChu) {
  const ghiChu = document.querySelector("#ghichu").value.trim();
  document.querySelector("#loi-ghichu").textContent = "";
  if (canGhiChu && ghiChu === "") { document.querySelector("#loi-ghichu").textContent = "Cần nhập ghi chú quyết định."; return; }
  try {
    dangChon.status = trangThaiMoi;
    dangChon.reviewNote = ghiChu;
    dangChon.history = (dangChon.history || []).concat(trangThaiMoi);
    await update("properties", dangChon.id, dangChon);
    // Đóng các báo cáo đang mở của tin này để tin không quay lại hàng chờ
    const baoCaoMo = dsReport.filter(function (r) { return r.propertyId === dangChon.id && r.status !== "Hoàn thành"; });
    for (const r of baoCaoMo) {
      r.status = "Hoàn thành";
      r.conclusion = trangThaiMoi === "Đã duyệt" ? "Không hợp lệ" : "Hợp lệ";
      r.note = ghiChu;
      await update("reports", r.id, r);
    }
    await create("notifications", { userEmail: dangChon.agentEmail || "b.tran@email.com", text: "Tin «" + dangChon.name + "»: " + trangThaiMoi + (ghiChu ? " · " + ghiChu : ""), read: false });
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-success">Đã cập nhật «' + dangChon.name + "»: " + trangThaiMoi + ". Đã thông báo cho môi giới.</div>";
    hangCho = hangCho.filter(function (p) { return p.id !== dangChon.id; });
    veHangCho();
  } catch (loi) {
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

document.querySelector("#nut-duyet").addEventListener("click", function () { quyetDinh("Đã duyệt", false); });
document.querySelector("#nut-tuchoi").addEventListener("click", function () { quyetDinh("Từ chối", true); });
document.querySelector("#nut-bosung").addEventListener("click", function () { quyetDinh("Cần bổ sung", true); });
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
taiDuLieu();