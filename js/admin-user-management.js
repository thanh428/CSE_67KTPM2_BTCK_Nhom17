kiemTraVaiTro("admin");
document.querySelector("#ten-user").textContent = "Quản trị · Quản trị viên";
document.querySelector("#state-empty").innerHTML = "Không có người dùng phù hợp.";
const tenVaiTro = { seeker: "Người tìm nhà", agent: "Môi giới", moderator: "Kiểm duyệt viên", admin: "Quản trị viên" };
let danhSach = [];

function veBang() {
  const tuKhoa = document.querySelector("#o-tim").value.toLowerCase();
  const ketQua = danhSach.filter(function (u) {
    return (u.name + " " + u.email).toLowerCase().includes(tuKhoa);
  });
  if (ketQua.length === 0) { showState("empty"); return; }
  const tbody = document.querySelector("#bang");
  tbody.innerHTML = "";
  ketQua.forEach(function (u) {
    const dangKhoa = u.status === "Khóa";
    const nhan = dangKhoa ? "Mở khóa" : "Khóa";
    let nut = '<button class="btn btn-sm btn-outline-dark nut-khoa" data-id="' + u.id + '">' + nhan + "</button>";
    if (u.email === "admin@homefit.vn") nut = "(tài khoản của bạn)"; // không cho tự khóa mình
    tbody.innerHTML += "<tr><td>" + u.name + "<br><small>" + u.email + "</small></td><td>" + (tenVaiTro[u.role] || u.role) +
      '</td><td class="' + (dangKhoa ? "khoa" : "") + '">' + u.status + "</td><td>" + nut + "</td></tr>";
  });
  document.querySelectorAll(".nut-khoa").forEach(function (n) {
    n.addEventListener("click", function () { doiTrangThai(n.dataset.id); });
  });
  showState("content");
}

async function doiTrangThai(id) {
  const u = danhSach.find(function (x) { return x.id === id; });
  const moi = u.status === "Khóa" ? "Hoạt động" : "Khóa";
  if (!confirm(moi + " tài khoản " + u.name + "?")) return;
  try {
    u.status = moi;
    await update("users", id, u); // khóa/mở khóa, không xóa hẳn
    veBang();
  } catch (loi) {
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

async function taiDuLieu() {
  showState("loading");
  try {
    danhSach = await getAll("users");
    veBang();
  } catch (loi) {
    showState("error", loi.message);
  }
}

document.querySelector("#o-tim").addEventListener("input", veBang);
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
taiDuLieu();
