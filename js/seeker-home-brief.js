kiemTraVaiTro("seeker");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Người tìm nhà";
let timer = null;      // setTimeout giả lập AI đang xử lý
let ketQuaAI = null;   // kết quả để lưu khi bấm Chấp nhận
const vung = document.querySelector("#ai-noidung");

function datLoi(id, chu) { document.querySelector("#loi-" + id).textContent = chu; }

function kiemTraForm(khuVuc, ngansach, mota) {
  let ok = true;
  datLoi("khuvuc", ""); datLoi("ngansach", ""); datLoi("mota", "");
  if (khuVuc === "") { datLoi("khuvuc", "Nhập khu vực."); ok = false; }
  if (!(ngansach > 0)) { datLoi("ngansach", "Ngân sách phải là số lớn hơn 0."); ok = false; }
  if (mota.length < 15) { datLoi("mota", "Mô tả cần ít nhất 15 ký tự."); ok = false; }
  return ok;
}

// Tìm từ khóa đơn giản trong mô tả
function timTuKhoa(mota) {
  const ds = ["gần trường", "yên tĩnh", "làm việc tại nhà", "gia đình"];
  return ds.filter(function (t) { return mota.toLowerCase().includes(t); });
}

function tinhDiem(nha, tuKhoa) {
  let diem = 50;
  if (tuKhoa.includes("gần trường") && nha.distanceSchool <= 500) diem += 20;
  if (tuKhoa.includes("yên tĩnh") && (nha.quiet === "Cao" || nha.quiet === "Rất cao")) diem += 15;
  if (tuKhoa.includes("làm việc tại nhà") && nha.hasWorkspace) diem += 15;
  return diem;
}

function hienKetQua(brief, nhaPhuHop, tuKhoa) {
  if (nhaPhuHop.length === 0) {
    vung.innerHTML = "<p>Chưa có nhà phù hợp. Thử tăng ngân sách.</p>";
    return;
  }
  const tot = nhaPhuHop[0];
  ketQuaAI = brief;
  vung.innerHTML = "<p><b>" + nhaPhuHop.length + " nhà phù hợp</b> (điểm cao nhất " + tot.diem + ")</p>" +
    "<p>Cao nhất: " + tot.name + "</p><p><b>Vì sao?</b> Khớp các từ khóa: " + tuKhoa.join(", ") + ". Giá " + tot.price + " triệu, trong ngân sách.</p>" +
    '<button id="nut-chapnhan" class="btn btn-xanh btn-sm">Chấp nhận</button> <button id="nut-sua" class="btn btn-outline-dark btn-sm">Sửa</button> ' +
    '<button id="nut-tuchoi" class="btn btn-outline-dark btn-sm">Từ chối</button> <button id="nut-taolai" class="btn btn-outline-dark btn-sm">Tạo lại</button> ' +
    '<button id="nut-luu" class="btn btn-outline-dark btn-sm">Lưu</button><div id="kq-luu" class="mt-2"></div>';
  document.querySelector("#nut-chapnhan").addEventListener("click", luuBrief);
  document.querySelector("#nut-luu").addEventListener("click", luuBrief);
  document.querySelector("#nut-sua").addEventListener("click", function () { document.querySelector("#mota").focus(); });
  document.querySelector("#nut-tuchoi").addEventListener("click", function () { vung.innerHTML = "Đã từ chối kết quả. Bạn có thể sửa brief và chạy lại."; });
  document.querySelector("#nut-taolai").addEventListener("click", chayAI);
}

async function luuBrief() {
  try {
    await create("briefs", ketQuaAI);
    document.querySelector("#kq-luu").innerHTML = '<div class="alert alert-success">Đã lưu brief.' + (ketQuaAI.share ? " Đã gửi lead cho môi giới." : "") + "</div>";
    if (ketQuaAI.share) {
      await create("leads", { name: sessionStorage.getItem("ten"), need: ketQuaAI.description, source: "Home Brief", status: "Mới" });
    }
  } catch (loi) {
    document.querySelector("#kq-luu").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

async function chayAI(event) {
  if (event && event.preventDefault) event.preventDefault();
  const khuVuc = document.querySelector("#khuvuc").value.trim();
  const ngansach = Number(document.querySelector("#ngansach").value);
  const mota = document.querySelector("#mota").value.trim();
  if (!kiemTraForm(khuVuc, ngansach, mota)) return;
  const tuKhoa = timTuKhoa(mota);
  const brief = { area: khuVuc, budget: ngansach, bedrooms: Number(document.querySelector("#phongngu").value),
    description: mota, share: document.querySelector("#chiase").checked, status: "Hoạt động", userEmail: "a.nguyen@email.com" };
  vung.innerHTML = 'AI đang xử lý... <button id="nut-huy" class="btn btn-sm btn-outline-dark">Hủy</button>';
  document.querySelector("#nut-huy").addEventListener("click", function () {
    clearTimeout(timer);
    vung.innerHTML = "Đã hủy.";
  });
  timer = setTimeout(async function () {
    if (document.querySelector("#gia-loi").checked) {
      vung.innerHTML = 'Không thể xử lý yêu cầu lúc này. <button id="nut-thu" class="btn btn-sm btn-outline-dark">Thử lại</button>';
      document.querySelector("#nut-thu").addEventListener("click", chayAI);
      return;
    }
    if (tuKhoa.length === 0) {
      vung.innerHTML = "<b>AI chưa chắc chắn.</b> Không nhận ra từ khóa nào. Hãy thêm nhu cầu của bạn.";
      return;
    }
    try {
      const nha = (await getAll("properties")).filter(function (n) { return n.status === "Đã duyệt" && n.price <= ngansach; });
      nha.forEach(function (n) { n.diem = tinhDiem(n, tuKhoa); });
      nha.sort(function (a, b) { return b.diem - a.diem; });
      hienKetQua(brief, nha, tuKhoa);
    } catch (loi) {
      vung.innerHTML = '<div class="text-danger">' + loi.message + "</div>";
    }
  }, 1500);
}

document.querySelector("#form-brief").addEventListener("submit", chayAI);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
