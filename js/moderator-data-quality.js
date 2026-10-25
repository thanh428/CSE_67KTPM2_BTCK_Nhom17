kiemTraVaiTro("moderator");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Kiểm duyệt viên";
document.querySelector("#state-empty").textContent = "Chưa có vấn đề nào. Bấm «Chạy kiểm tra» để quét lại dữ liệu.";
let dsVanDe = [];

// Quy tắc kiểm tra đơn giản, quét từ dữ liệu properties
function quetVanDe(nha) {
  const kq = [];
  nha.forEach(function (p, i) {
    if (!p.images || p.images.length === 0) kq.push({ loai: "anh", nha: p, text: "Chưa có ảnh", mucDo: "Thấp", trangThai: "Đang chờ" });
    if (p.price > 25) kq.push({ loai: "gia", nha: p, text: "Giá " + p.price + " triệu/tháng cao bất thường", mucDo: "Cao", trangThai: "Đang chờ" });
    for (let j = 0; j < i; j++) {
      if (nha[j].name === p.name && nha[j].district === p.district) {
        kq.push({ loai: "trung", nha: p, text: "Nghi trùng với " + nha[j].name, mucDo: "Trung bình", trangThai: "Đang chờ" });
      }
    }
  });
  return kq;
}

function demLoai(loai) { return dsVanDe.filter(function (v) { return v.loai === loai; }).length; }

function veBang() {
  document.querySelector("#kpi-anh").textContent = demLoai("anh");
  document.querySelector("#kpi-gia").textContent = demLoai("gia");
  document.querySelector("#kpi-trung").textContent = demLoai("trung");
  const tuKhoa = document.querySelector("#o-tim").value.toLowerCase();
  const kq = dsVanDe.filter(function (v) { return (v.nha.name + " " + v.text).toLowerCase().includes(tuKhoa); });
  if (kq.length === 0) { showState("empty"); return; }
  const tbody = document.querySelector("#bang");
  tbody.innerHTML = "";
  kq.forEach(function (v) {
    const idx = dsVanDe.indexOf(v);
    const nut = v.trangThai === "Đang chờ" ? '<button class="btn btn-sm btn-outline-dark nut-bao" data-i="' + idx + '">Báo môi giới</button>' : "";
    tbody.innerHTML += "<tr><td>" + v.nha.name + "</td><td>" + v.text + "</td><td>" + v.mucDo + "</td><td>" + v.trangThai + "</td><td>" + nut + "</td></tr>";
  });
  document.querySelectorAll(".nut-bao").forEach(function (n) { n.addEventListener("click", function () { baoMoiGioi(Number(n.dataset.i)); }); });
  showState("content");
}

async function baoMoiGioi(i) {
  const v = dsVanDe[i];
  try {
    await create("notifications", { userEmail: v.nha.agentEmail || "b.tran@email.com", text: "Kiểm duyệt báo vấn đề với «" + v.nha.name + "»: " + v.text, read: false });
    v.trangThai = "Hoàn thành";
    veBang();
  } catch (loi) {
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

async function chayKiemTra() {
  showState("loading");
  try {
    const nha = await getAll("properties");
    dsVanDe = quetVanDe(nha);
    veBang();
  } catch (loi) { showState("error", loi.message); }
}
document.querySelector("#o-tim").addEventListener("input", veBang);
document.querySelector("#nut-chay").addEventListener("click", chayKiemTra);
document.querySelector("#nut-thulai").addEventListener("click", chayKiemTra);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
chayKiemTra();
