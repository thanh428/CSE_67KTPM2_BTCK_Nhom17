kiemTraVaiTro("agent");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Môi giới";
document.querySelector("#state-empty").textContent = "Chưa có lịch xem nào. Đặt lịch hẹn đầu tiên ở khung phía trên.";
let lichXem = [], dsNha = [], dsLead = [];

function veSelect() {
  document.querySelector("#v-nha").innerHTML = dsNha.map(function (n) { return '<option value="' + n.id + '">' + n.name + "</option>"; }).join("");
  document.querySelector("#v-lead").innerHTML = dsLead.map(function (l) { return '<option value="' + l.id + '">' + l.name + "</option>"; }).join("");
  const leadId = new URLSearchParams(window.location.search).get("leadId"); // chọn sẵn lead
  if (leadId !== null) document.querySelector("#v-lead").value = leadId;
}

function veBang() {
  if (lichXem.length === 0) { showState("empty"); return; }
  const tbody = document.querySelector("#bang");
  tbody.innerHTML = "";
  lichXem.forEach(function (v) {
    let nut = "";
    if (v.status === "Chờ xác nhận") nut = '<button class="btn btn-sm btn-xanh nut-doi" data-id="' + v.id + '" data-tt="Đã xác nhận">Xác nhận</button> ';
    if (v.status === "Đã xác nhận") nut = '<button class="btn btn-sm btn-outline-success nut-doi" data-id="' + v.id + '" data-tt="Hoàn thành">Hoàn thành</button> ';
    if (v.status === "Chờ xác nhận" || v.status === "Đã xác nhận") nut += '<button class="btn btn-sm btn-outline-danger nut-doi" data-id="' + v.id + '" data-tt="Đã hủy">Hủy</button>';
    tbody.innerHTML += "<tr><td>" + (v.seekerName || "") + "</td><td>" + v.propertyName + "</td><td>" + v.date + " " + v.time + "</td><td>" + v.status + "</td><td>" + nut + "</td></tr>";
  });
  document.querySelectorAll(".nut-doi").forEach(function (n) {
    n.addEventListener("click", function () { doiTrangThai(n.dataset.id, n.dataset.tt); });
  });
  showState("content");
}

async function doiTrangThai(id, trangThaiMoi) {
  if (trangThaiMoi === "Đã hủy" && !confirm("Hủy lịch xem này?")) return;
  try {
    const v = lichXem.find(function (x) { return x.id === id; });
    v.status = trangThaiMoi;
    await update("viewings", id, v); // đổi trạng thái, không xóa
    if (trangThaiMoi === "Đã xác nhận") {
      await create("notifications", { userEmail: v.seekerEmail, text: "Lịch xem " + v.propertyName + " (" + v.date + " " + v.time + ") đã được xác nhận", read: false });
    }
    veBang();
  } catch (loi) {
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

async function datLich() {
  const o = document.querySelector("#loi-lich");
  const ngay = document.querySelector("#v-ngay").value, gio = document.querySelector("#v-gio").value;
  const nhaId = document.querySelector("#v-nha").value, leadId = document.querySelector("#v-lead").value;
  o.textContent = "";
  if (ngay === "" || ngay < new Date().toISOString().slice(0, 10)) { o.textContent = "Chọn ngày từ hôm nay trở đi."; return; }
  if (gio < "08:00" || gio > "20:00") { o.textContent = "Giờ xem từ 08:00 đến 20:00."; return; }
  const nha = dsNha.find(function (n) { return n.id === nhaId; });
  const lead = dsLead.find(function (l) { return l.id === leadId; });
  // Kiểm tra trùng lịch: cùng nhà, cùng ngày, cùng giờ, chưa hủy
  const trung = lichXem.some(function (v) { return v.propertyId === nhaId && v.date === ngay && v.time === gio && v.status !== "Đã hủy"; });
  if (trung) { o.textContent = "Khung giờ này đã có lịch với " + nha.name + "."; return; }
  try {
    const moi = await create("viewings", { propertyId: nhaId, propertyName: nha.name, seekerName: lead.name, seekerEmail: lead.email || "", date: ngay, time: gio, status: "Chờ xác nhận" });
    lichXem.push(moi);
    veBang();
  } catch (loi) { o.textContent = loi.message; }
}

async function taiDuLieu() {
  showState("loading");
  try {
    lichXem = await getAll("viewings");
    dsNha = await getAll("properties");
    dsLead = await getAll("leads");
    veSelect();
    veBang();
  } catch (loi) {
    showState("error", loi.message);
  }
}
document.querySelector("#nut-dat").addEventListener("click", datLich);
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
taiDuLieu();
