kiemTraVaiTro("moderator");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Kiểm duyệt viên";
document.querySelector("#state-empty").textContent = "Không có báo cáo nào ở trạng thái này.";
let dsReport = [], dsNha = [], dangXuLy = null;

function veBang() {
  const tt = document.querySelector("#loc-tt").value;
  const kq = dsReport.filter(function (r) { return tt === "" || r.status === tt; });
  if (kq.length === 0) { showState("empty"); return; }
  const tbody = document.querySelector("#bang");
  tbody.innerHTML = "";
  kq.forEach(function (r) {
    let nut = "";
    if (r.status === "Mới") nut = '<button class="btn btn-sm btn-outline-dark nut-nhan" data-id="' + r.id + '">Nhận xử lý</button>';
    if (r.status === "Đang xử lý") nut = '<button class="btn btn-sm btn-xanh nut-xl" data-id="' + r.id + '">Xử lý</button>';
    tbody.innerHTML += "<tr><td>" + r.code + "</td><td>" + r.propertyName + "</td><td>" + r.reason + "</td><td>" + r.reporterEmail + "</td><td>" + r.status + (r.conclusion ? " · " + r.conclusion : "") + "</td><td>" + nut + "</td></tr>";
  });
  document.querySelectorAll(".nut-nhan").forEach(function (n) { n.addEventListener("click", function () { nhanXuLy(n.dataset.id); }); });
  document.querySelectorAll(".nut-xl").forEach(function (n) { n.addEventListener("click", function () { moModal(n.dataset.id); }); });
  showState("content");
}

function baoLoi(loi) { document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>"; }

async function nhanXuLy(id) {
  try {
    const r = dsReport.find(function (x) { return x.id === id; });
    r.status = "Đang xử lý";
    await update("reports", id, r);
    veBang();
  } catch (loi) { baoLoi(loi); }
}

function moModal(id) {
  dangXuLy = dsReport.find(function (x) { return x.id === id; });
  document.querySelector("#m-tieude").textContent = "Xử lý " + dangXuLy.code + " · " + dangXuLy.propertyName;
  document.querySelector("#m-lydo").textContent = "Lý do: " + dangXuLy.reason + " · Người báo cáo: " + dangXuLy.reporterEmail;
  document.querySelector("#m-ghichu").value = "";
  document.querySelector("#loi-modal").textContent = "";
  new bootstrap.Modal(document.querySelector("#modal-xl")).show();
}

async function xacNhan() {
  const ghiChu = document.querySelector("#m-ghichu").value.trim();
  const kl = document.querySelector("input[name=kl]:checked").value;
  if (ghiChu === "") { document.querySelector("#loi-modal").textContent = "Ghi chú xử lý là bắt buộc."; return; }
  try {
    dangXuLy.status = "Hoàn thành";
    dangXuLy.conclusion = kl;
    dangXuLy.note = ghiChu;
    await update("reports", dangXuLy.id, dangXuLy);
    if (kl === "Hợp lệ") { // ẩn listing bị báo cáo
      const nha = dsNha.find(function (p) { return p.id === dangXuLy.propertyId; });
      if (nha) { nha.status = "Đã ẩn"; await update("properties", nha.id, nha); }
    }
    bootstrap.Modal.getInstance(document.querySelector("#modal-xl")).hide();
    veBang();
  } catch (loi) { baoLoi(loi); }
}

async function taoReport() {
  const o = document.querySelector("#loi-tao");
  const nhaId = document.querySelector("#r-nha").value;
  const lyDo = document.querySelector("#r-lydo").value.trim();
  o.textContent = "";
  if (lyDo === "") { o.textContent = "Nhập lý do."; return; }
  try {
    const nha = dsNha.find(function (p) { return p.id === nhaId; });
    const moi = await create("reports", { code: "RP" + Date.now().toString().slice(-4), propertyId: nhaId, propertyName: nha.name, reason: lyDo, status: "Mới", reporterEmail: "c.le@email.com" });
    dsReport.push(moi);
    veBang();
  } catch (loi) { o.textContent = loi.message; }
}

async function taiDuLieu() {
  showState("loading");
  try {
    dsReport = await getAll("reports");
    dsNha = await getAll("properties");
    document.querySelector("#r-nha").innerHTML = dsNha.map(function (p) { return '<option value="' + p.id + '">' + p.name + "</option>"; }).join("");
    veBang();
  } catch (loi) { showState("error", loi.message); }
}
document.querySelector("#loc-tt").addEventListener("change", veBang);
document.querySelector("#nut-tao").addEventListener("click", taoReport);
document.querySelector("#nut-xacnhan").addEventListener("click", xacNhan);
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
taiDuLieu();
