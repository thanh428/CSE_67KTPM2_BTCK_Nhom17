chuanBiMenuChung();
const tenVaiTro = { seeker: "Người tìm nhà", agent: "Môi giới", moderator: "Kiểm duyệt viên", admin: "Quản trị viên" };
document.querySelector("#vai-tro").textContent = tenVaiTro[sessionStorage.getItem("role")];
document.querySelector("#state-empty").textContent = "Không tìm thấy hồ sơ của bạn trên hệ thống.";
let user = null;

function datLoi(id, chu) { document.querySelector("#loi-" + id).textContent = chu; }
function thongBao(loai, chu) { document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-' + loai + '">' + chu + "</div>"; }

async function taiDuLieu() {
  showState("loading");
  try {
    const ds = await getAll("users");
    user = ds.find(function (u) { return u.email === sessionStorage.getItem("email"); });
    if (!user) { showState("empty"); return; }
    document.querySelector("#p-ten").value = user.name;
    document.querySelector("#p-email").value = user.email;
    document.querySelector("#p-sdt").value = user.phone || "";
    showState("content");
  } catch (loi) { showState("error", loi.message); }
}

async function luuThongTin() {
  const ten = document.querySelector("#p-ten").value.trim(), sdt = document.querySelector("#p-sdt").value.trim();
  let ok = true;
  datLoi("ten", ""); datLoi("sdt", "");
  if (ten === "") { datLoi("ten", "Nhập họ tên."); ok = false; }
  if (sdt !== "" && (sdt.length !== 10 || isNaN(Number(sdt)))) { datLoi("sdt", "Số điện thoại gồm 10 chữ số."); ok = false; }
  if (!ok) return;
  try {
    user.name = ten; user.phone = sdt;
    await update("users", user.id, user);
    sessionStorage.setItem("ten", ten);
    document.querySelector("#ten-user").textContent = ten;
    thongBao("success", "Đã lưu thay đổi.");
  } catch (loi) { thongBao("danger", loi.message); }
}

async function doiMatKhau() {
  const cu = document.querySelector("#mk-cu").value, moi = document.querySelector("#mk-moi").value;
  let ok = true;
  datLoi("mkcu", ""); datLoi("mkmoi", "");
  if (cu !== (user.password || "123456")) { datLoi("mkcu", "Mật khẩu hiện tại chưa đúng."); ok = false; }
  if (moi.length < 6) { datLoi("mkmoi", "Mật khẩu mới tối thiểu 6 ký tự."); ok = false; }
  if (!ok) return;
  try {
    user.password = moi;
    await update("users", user.id, user);
    thongBao("success", "Đã đổi mật khẩu.");
  } catch (loi) { thongBao("danger", loi.message); }
}
document.querySelector("#nut-luu").addEventListener("click", luuThongTin);
document.querySelector("#nut-doimk").addEventListener("click", doiMatKhau);
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
taiDuLieu();
