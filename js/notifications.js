chuanBiMenuChung();
const EMAIL = sessionStorage.getItem("email");
let ds = [];

// Thời gian tương đối sinh bằng JS
function thoiGian(chuoi) {
  if (!chuoi) return "";
  const phut = Math.round((Date.now() - new Date(chuoi).getTime()) / 60000);
  if (phut < 60) return Math.max(phut, 1) + " phút trước";
  if (phut < 1440) return Math.round(phut / 60) + " giờ trước";
  return Math.round(phut / 1440) + " ngày trước";
}

function baoLoi(loi) { document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>"; }

function ve() {
  const loc = document.querySelector("#loc").value;
  const kq = ds.filter(function (n) { return loc === "all" || (loc === "unread" ? !n.read : n.read); });
  if (kq.length === 0) {
    document.querySelector("#state-empty").textContent = "Bạn chưa có thông báo nào. Khi có lịch xem hoặc kết quả AI, thông báo sẽ hiện ở đây.";
    showState("empty"); return;
  }
  const v = document.querySelector("#list");
  v.innerHTML = "";
  kq.forEach(function (n) {
    v.innerHTML += '<div class="tin ' + (n.read ? "" : "chua-doc") + '">' + n.text + ' <small class="text-muted">' + thoiGian(n.createdAt) + '</small><div class="mt-1">' +
      (n.read ? "" : '<button class="btn btn-sm btn-outline-dark nut-doc" data-id="' + n.id + '">Đã đọc</button> ') +
      '<button class="btn btn-sm btn-outline-danger nut-xoa" data-id="' + n.id + '">Xóa</button></div></div>';
  });
  document.querySelectorAll(".nut-doc").forEach(function (b) { b.addEventListener("click", function () { danhDauDoc(b.dataset.id); }); });
  document.querySelectorAll(".nut-xoa").forEach(function (b) { b.addEventListener("click", function () { xoa(b.dataset.id); }); });
  showState("content");
}

async function danhDauDoc(id) {
  try {
    const n = ds.find(function (x) { return x.id === id; });
    n.read = true;
    await update("notifications", id, n);
    ve();
  } catch (loi) { baoLoi(loi); }
}

async function danhDauDocHet() {
  try {
    for (const n of ds.filter(function (x) { return !x.read; })) { n.read = true; await update("notifications", n.id, n); }
    ve();
  } catch (loi) { baoLoi(loi); }
}

async function xoa(id) {
  try {
    await remove("notifications", id);
    ds = ds.filter(function (x) { return x.id !== id; });
    ve();
  } catch (loi) { baoLoi(loi); }
}

async function taiDuLieu() {
  showState("loading");
  try {
    ds = (await getAll("notifications")).filter(function (n) { return n.userEmail === EMAIL; });
    ve();
  } catch (loi) { showState("error", loi.message); }
}
document.querySelector("#loc").addEventListener("change", ve);
document.querySelector("#nut-doc-het").addEventListener("click", danhDauDocHet);
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
taiDuLieu();
