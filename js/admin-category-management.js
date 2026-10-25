kiemTraVaiTro("admin");
document.querySelector("#ten-user").textContent = "Quản trị · Quản trị viên";
document.querySelector("#state-empty").textContent = "Chưa có mục nào. Bấm «Thêm mới» để tạo.";
let loaiHienTai = "loai";   // "loai" hoặc "nhan"
let dsDanhMuc = [], dsNha = [];
let dangSua = null;         // null = đang thêm mới

// Quy tắc dùng để đếm listing khớp (cũng là quy tắc AI1 dùng để chấm)
const quyTac = {
  "gan-truong": function (p) { return p.distanceSchool <= 500; },
  "yen-tinh": function (p) { return p.quiet === "Cao" || p.quiet === "Rất cao"; },
  "lam-viec": function (p) { return p.hasWorkspace === true; },
  "gia-dinh": function (p) { return p.bedrooms >= 2 && (p.quiet === "Cao" || p.quiet === "Rất cao"); }
};

function demListingKhop(muc) {
  if (loaiHienTai === "loai") return dsNha.filter(function (p) { return p.type === muc.name; }).length;
  const f = quyTac[muc.rule];
  return f ? dsNha.filter(f).length : 0;
}

function veBang() {
  const tuKhoa = document.querySelector("#o-tim").value.toLowerCase();
  const kq = dsDanhMuc.filter(function (c) { return c.type === loaiHienTai && c.name.toLowerCase().includes(tuKhoa); });
  document.querySelector("#bang-dau").innerHTML = loaiHienTai === "loai"
    ? "<tr><th>Tên</th><th>Listing khớp</th><th>Trạng thái</th><th>Thao tác</th></tr>"
    : "<tr><th>Nhãn</th><th>Từ khóa AI</th><th>Quy tắc</th><th>Listing khớp</th><th>Trạng thái</th><th>Thao tác</th></tr>";
  if (kq.length === 0) { showState("empty"); return; }
  const tbody = document.querySelector("#bang");
  tbody.innerHTML = "";
  kq.forEach(function (c) {
    const tat = c.status === "Vô hiệu hóa";
    const nutTat = '<button class="btn btn-sm btn-outline-dark nut-tat" data-id="' + c.id + '">' + (tat ? "Kích hoạt" : "Vô hiệu hóa") + "</button>";
    const nutSua = '<button class="btn btn-sm btn-outline-dark me-1 nut-sua" data-id="' + c.id + '">Sửa</button>';
    let dong = '<tr class="' + (tat ? "tat" : "") + '"><td>' + c.name + "</td>";
    if (loaiHienTai === "nhan") dong += "<td>" + (c.keywords || "") + "</td><td>" + (c.rule || "") + "</td>";
    dong += "<td>" + demListingKhop(c) + "</td><td>" + c.status + "</td><td>" + nutSua + nutTat + "</td></tr>";
    tbody.innerHTML += dong;
  });
  document.querySelectorAll(".nut-sua").forEach(function (n) { n.addEventListener("click", function () { moModal(n.dataset.id); }); });
  document.querySelectorAll(".nut-tat").forEach(function (n) { n.addEventListener("click", function () { doiTrangThai(n.dataset.id); }); });
  showState("content");
}

function moModal(id) {
  dangSua = id ? dsDanhMuc.find(function (c) { return c.id === id; }) : null;
  document.querySelector("#m-tieude").textContent = dangSua ? "Sửa" : "Thêm mới";
  document.querySelector("#m-ten").value = dangSua ? dangSua.name : "";
  document.querySelector("#m-tukhoa").value = dangSua ? (dangSua.keywords || "") : "";
  document.querySelector("#m-quytac").value = dangSua && dangSua.rule ? dangSua.rule : "gan-truong";
  document.querySelector("#khu-nhan").classList.toggle("d-none", loaiHienTai === "loai");
  document.querySelector("#loi-modal").textContent = "";
  new bootstrap.Modal(document.querySelector("#modal-dm")).show();
}

async function luuDanhMuc() {
  const ten = document.querySelector("#m-ten").value.trim();
  const o = document.querySelector("#loi-modal");
  o.textContent = "";
  if (ten === "") { o.textContent = "Tên không được rỗng."; return; }
  const trung = dsDanhMuc.some(function (c) { return c.type === loaiHienTai && c.name.toLowerCase() === ten.toLowerCase() && c !== dangSua; });
  if (trung) { o.textContent = "Tên đã tồn tại."; return; }
  const du = { type: loaiHienTai, name: ten, keywords: document.querySelector("#m-tukhoa").value.trim(), rule: document.querySelector("#m-quytac").value, status: "Hoạt động" };
  try {
    if (dangSua) {
      du.status = dangSua.status;
      Object.assign(dangSua, du);
      await update("categories", dangSua.id, dangSua);
    } else {
      dsDanhMuc.push(await create("categories", du));
    }
    bootstrap.Modal.getInstance(document.querySelector("#modal-dm")).hide();
    veBang();
  } catch (loi) { o.textContent = loi.message; }
}

// D = vô hiệu hóa, không xóa cứng
async function doiTrangThai(id) {
  const c = dsDanhMuc.find(function (x) { return x.id === id; });
  const dangDung = demListingKhop(c);
  const moi = c.status === "Vô hiệu hóa" ? "Hoạt động" : "Vô hiệu hóa";
  if (moi === "Vô hiệu hóa" && dangDung > 0 && !confirm("Mục này đang khớp " + dangDung + " listing. Vẫn vô hiệu hóa?")) return;
  try {
    c.status = moi;
    await update("categories", id, c);
    veBang();
  } catch (loi) {
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

function doiTab(loai) {
  loaiHienTai = loai;
  document.querySelector("#tab-loai").classList.toggle("active", loai === "loai");
  document.querySelector("#tab-nhan").classList.toggle("active", loai === "nhan");
  veBang();
}

async function taiDuLieu() {
  showState("loading");
  try {
    dsDanhMuc = await getAll("categories");
    dsNha = await getAll("properties");
    veBang();
  } catch (loi) { showState("error", loi.message); }
}
document.querySelector("#tab-loai").addEventListener("click", function () { doiTab("loai"); });
document.querySelector("#tab-nhan").addEventListener("click", function () { doiTab("nhan"); });
document.querySelector("#nut-them").addEventListener("click", function () { moModal(null); });
document.querySelector("#nut-luu").addEventListener("click", luuDanhMuc);
document.querySelector("#o-tim").addEventListener("input", veBang);
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
taiDuLieu();
