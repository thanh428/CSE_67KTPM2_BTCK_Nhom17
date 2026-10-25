kiemTraVaiTro("agent");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Môi giới";
document.querySelector("#state-empty").textContent = "Chưa có lead nào.";
let danhSach = [];
let leadDangSua = null;

function veBang() {
  const tt = document.querySelector("#loc-tt").value;
  const ketQua = danhSach.filter(function (l) { return tt === "" || l.status === tt; });
  if (ketQua.length === 0) { showState("empty"); return; }
  const tbody = document.querySelector("#bang");
  tbody.innerHTML = "";
  ketQua.forEach(function (l) {
    tbody.innerHTML += "<tr><td>" + l.name + "</td><td>" + l.need + "</td><td>" + l.source + "</td><td>" + l.status +
      '</td><td><button class="btn btn-sm btn-outline-dark nut-xem" data-id="' + l.id + '">Chi tiết</button> <a class="btn btn-sm btn-warning" href="agent-viewing-schedule.html?leadId=' + l.id + '">Đặt lịch xem</a></td></tr>';
  });
  document.querySelectorAll(".nut-xem").forEach(function (n) {
    n.addEventListener("click", function () { moChiTiet(n.dataset.id); });
  });
  showState("content");
}

function moChiTiet(id) {
  leadDangSua = danhSach.find(function (l) { return l.id === id; });
  document.querySelector("#m-ten").textContent = leadDangSua.name;
  document.querySelector("#m-nhucau").textContent = "Nhu cầu: " + leadDangSua.need;
  document.querySelector("#m-tt").value = leadDangSua.status;
  document.querySelector("#m-ghichu").value = leadDangSua.note || "";
  new bootstrap.Modal(document.querySelector("#modal-lead")).show();
}

async function luuLead() {
  try {
    leadDangSua.status = document.querySelector("#m-tt").value;
    leadDangSua.note = document.querySelector("#m-ghichu").value;
    await update("leads", leadDangSua.id, leadDangSua);
    bootstrap.Modal.getInstance(document.querySelector("#modal-lead")).hide();
    veBang();
  } catch (loi) {
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

async function themLead() {
  const ten = document.querySelector("#l-ten").value.trim();
  const sdt = document.querySelector("#l-sdt").value.trim();
  const nhuCau = document.querySelector("#l-nhucau").value.trim();
  const o = document.querySelector("#loi-lead");
  o.textContent = "";
  if (ten === "" || nhuCau === "") { o.textContent = "Nhập tên khách và nhu cầu."; return; }
  if (sdt.length !== 10 || isNaN(Number(sdt))) { o.textContent = "Số điện thoại gồm 10 chữ số."; return; }
  try {
    const moi = await create("leads", { name: ten, phone: sdt, need: nhuCau, source: "Nhập tay", status: "Mới" });
    danhSach.push(moi);
    veBang();
  } catch (loi) {
    o.textContent = loi.message;
  }
}

async function taiDuLieu() {
  showState("loading");
  try {
    danhSach = await getAll("leads");
    veBang();
  } catch (loi) {
    showState("error", loi.message);
  }
}
document.querySelector("#loc-tt").addEventListener("change", veBang);
document.querySelector("#nut-them").addEventListener("click", themLead);
document.querySelector("#nut-luu-lead").addEventListener("click", luuLead);
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
taiDuLieu();
