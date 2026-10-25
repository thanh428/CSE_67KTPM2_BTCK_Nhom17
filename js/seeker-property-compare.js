kiemTraVaiTro("seeker");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Người tìm nhà";
document.querySelector("#state-empty").innerHTML = "Bạn chưa lưu nhà nào. <a href='seeker-property-search.html'>Đi tìm nhà</a> và bấm Lưu.";
const EMAIL = "a.nguyen@email.com";
const vung = document.querySelector("#ai-noidung");
const mucYenTinh = { "Rất cao": 3, "Cao": 2, "Trung bình": 1, "Thấp": 0 };
const tieuChi = [
  { key: "price", ten: "Giá (triệu/tháng)", tot: "min" },
  { key: "area", ten: "Diện tích (m²)", tot: "max" },
  { key: "distanceSchool", ten: "Cách trường (m)", tot: "min" },
  { key: "quietNum", ten: "Mức yên tĩnh (0-3)", tot: "max" },
  { key: "workNum", ten: "Chỗ làm việc (0/1)", tot: "max" }
];
let tatCaNha = [];   // nhà đã lưu
let daChon = [];     // tối đa 3
let timer = null;
let ketQua = null;

function veChonNha() {
  const vungChon = document.querySelector("#chon-nha");
  vungChon.innerHTML = "";
  tatCaNha.forEach(function (n) {
    const tick = daChon.includes(n.id) ? "checked" : "";
    vungChon.innerHTML += '<label class="me-3"><input type="checkbox" class="o-chon" value="' + n.id + '" ' + tick + "> " + n.name + "</label>";
  });
  document.querySelectorAll(".o-chon").forEach(function (o) {
    o.addEventListener("change", function () {
      if (o.checked && daChon.length >= 3) { o.checked = false; alert("Tối đa 3 nhà."); return; }
      if (o.checked) daChon.push(o.value); else daChon = daChon.filter(function (x) { return x !== o.value; });
      veBang();
    });
  });
}

function giaTriNha(n, key) {
  if (key === "quietNum") return mucYenTinh[n.quiet] || 0;
  if (key === "workNum") return n.hasWorkspace ? 1 : 0;
  return n[key];
}

function veBang() {
  const nhaChon = tatCaNha.filter(function (n) { return daChon.includes(n.id); });
  document.querySelector("#bang-dau").innerHTML = "<tr><th>Tiêu chí</th>" + nhaChon.map(function (n) { return "<th>" + n.name + "</th>"; }).join("") + "</tr>";
  const tbody = document.querySelector("#bang");
  tbody.innerHTML = "";
  tieuChi.forEach(function (tc) {
    const giaTri = nhaChon.map(function (n) { return giaTriNha(n, tc.key); });
    const tot = tc.tot === "min" ? Math.min.apply(null, giaTri) : Math.max.apply(null, giaTri);
    let dong = "<tr><td>" + tc.ten + "</td>";
    giaTri.forEach(function (g) { dong += '<td class="' + (g === tot && nhaChon.length > 1 ? "tot" : "") + '">' + g + (g === tot && nhaChon.length > 1 ? " (tốt nhất)" : "") + "</td>"; });
    tbody.innerHTML += dong + "</tr>";
  });
  const nut = document.querySelector("#nut-xephang");
  nut.disabled = nhaChon.length < 2;
  document.querySelector("#giai-thich").textContent = nhaChon.length < 2 ? "Cần chọn ít nhất 2 nhà để xếp hạng." : "";
}

// Trọng số mặc định: chia đều (hoặc lấy từ brief nếu có)
function veTrongSo(tr) {
  const v = document.querySelector("#trong-so");
  v.innerHTML = "";
  tieuChi.forEach(function (tc, i) {
    v.innerHTML += '<div class="col-6 col-md"><label class="small">' + tc.ten + '</label><input type="number" min="0" class="form-control o-ts" value="' + tr[i] + '"></div>';
  });
}

function layTrongSo() {
  return Array.from(document.querySelectorAll(".o-ts")).map(function (o) { return Number(o.value); });
}

function tinhXepHang(nhaChon, ts) {
  const tong = ts.reduce(function (a, b) { return a + b; }, 0);
  return nhaChon.map(function (n) {
    let diem = 0;
    tieuChi.forEach(function (tc, i) {
      const tatCa = nhaChon.map(function (x) { return giaTriNha(x, tc.key); });
      const min = Math.min.apply(null, tatCa), max = Math.max.apply(null, tatCa);
      let chuanHoa = max === min ? 1 : (giaTriNha(n, tc.key) - min) / (max - min);
      if (tc.tot === "min") chuanHoa = 1 - chuanHoa;
      diem += chuanHoa * ts[i];
    });
    return { name: n.name, diem: Math.round(diem / tong * 100) };
  }).sort(function (a, b) { return b.diem - a.diem; });
}

function chayAI() {
  const nhaChon = tatCaNha.filter(function (n) { return daChon.includes(n.id); });
  const ts = layTrongSo();
  const tong = ts.reduce(function (a, b) { return a + b; }, 0);
  if (nhaChon.length < 2) return;
  if (tong <= 0) { vung.innerHTML = '<b>AI chưa chắc chắn.</b> Tổng trọng số phải lớn hơn 0.'; return; }
  vung.innerHTML = 'AI đang xử lý... <button id="nut-huy" class="btn btn-sm btn-outline-dark">Hủy</button>';
  document.querySelector("#nut-huy").addEventListener("click", function () { clearTimeout(timer); vung.innerHTML = "Đã hủy."; });
  timer = setTimeout(function () {
    if (document.querySelector("#gia-loi").checked) {
      vung.innerHTML = 'Không thể xử lý yêu cầu lúc này. <button id="nut-thu" class="btn btn-sm btn-outline-dark">Thử lại</button>';
      document.querySelector("#nut-thu").addEventListener("click", chayAI);
      return;
    }
    ketQua = { ranking: tinhXepHang(nhaChon, ts), weights: ts };
    let html = "<ol>";
    ketQua.ranking.forEach(function (r) { html += "<li>" + r.name + ": <b>" + r.diem + "</b>/100</li>"; });
    html += "</ol><p><b>Vì sao?</b> Điểm = tổng (mức tốt/xấu từng tiêu chí x trọng số).</p>" +
      '<button id="nut-chapnhan" class="btn btn-xanh btn-sm">Chấp nhận</button> <button id="nut-sua" class="btn btn-outline-dark btn-sm">Sửa</button> ' +
      '<button id="nut-tuchoi" class="btn btn-outline-dark btn-sm">Từ chối</button> <button id="nut-taolai" class="btn btn-outline-dark btn-sm">Tạo lại</button> ' +
      '<button id="nut-luu" class="btn btn-outline-dark btn-sm">Lưu</button><div id="kq" class="mt-2"></div>';
    vung.innerHTML = html;
    document.querySelector("#nut-chapnhan").addEventListener("click", luuXepHang);
    document.querySelector("#nut-luu").addEventListener("click", luuXepHang);
    document.querySelector("#nut-sua").addEventListener("click", function () { document.querySelector(".o-ts").focus(); });
    document.querySelector("#nut-tuchoi").addEventListener("click", function () { vung.innerHTML = "Đã từ chối kết quả."; });
    document.querySelector("#nut-taolai").addEventListener("click", chayAI);
  }, 1500);
}

// Lưu kết quả xếp hạng + trọng số (lưu vào resource notifications để xem lại)
async function luuXepHang() {
  try {
    const chu = ketQua.ranking.map(function (r) { return r.name + " " + r.diem; }).join(", ");
    await create("notifications", { userEmail: EMAIL, text: "Xếp hạng so sánh: " + chu + " | Trọng số: " + ketQua.weights.join("/"), read: false });
    document.querySelector("#kq").innerHTML = '<div class="alert alert-success">Đã lưu kết quả xếp hạng.</div>';
  } catch (loi) {
    document.querySelector("#kq").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

async function taiDuLieu() {
  showState("loading");
  try {
    const luu = (await getAll("savedProperties")).filter(function (s) { return s.userEmail === EMAIL; });
    const nha = await getAll("properties");
    tatCaNha = nha.filter(function (n) { return luu.some(function (s) { return s.propertyId === n.id; }); });
    if (tatCaNha.length === 0) { showState("empty"); return; }
    veChonNha(); veTrongSo([20, 20, 20, 20, 20]); veBang();
    showState("content");
  } catch (loi) {
    showState("error", loi.message);
  }
}

document.querySelector("#nut-xephang").addEventListener("click", chayAI);
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
taiDuLieu();
