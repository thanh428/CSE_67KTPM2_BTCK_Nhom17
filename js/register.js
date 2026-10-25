// Đăng ký: kiểm tra form rồi tạo user trên MockAPI
function datLoi(id, noiDung) {
  document.querySelector("#loi-" + id).textContent = noiDung;
}

function kiemTraForm(ten, email, mk, mk2) {
  let hopLe = true;
  datLoi("ten", ""); datLoi("email", ""); datLoi("mk", ""); datLoi("mk2", "");
  if (ten === "") { datLoi("ten", "Nhập họ tên."); hopLe = false; }
  if (!email.includes("@") || !email.includes(".")) { datLoi("email", "Email không đúng định dạng."); hopLe = false; }
  if (mk.length < 6) { datLoi("mk", "Mật khẩu tối thiểu 6 ký tự."); hopLe = false; }
  if (mk !== mk2) { datLoi("mk2", "Hai mật khẩu chưa khớp."); hopLe = false; }
  return hopLe;
}

async function dangKy(event) {
  event.preventDefault();
  const ten = document.querySelector("#ten").value.trim();
  const email = document.querySelector("#email").value.trim();
  const mk = document.querySelector("#mk").value;
  const mk2 = document.querySelector("#mk2").value;
  const vaiTro = document.querySelector("#vaitro").value;
  if (!kiemTraForm(ten, email, mk, mk2)) return;
  const tb = document.querySelector("#thong-bao");
  tb.innerHTML = "Đang xử lý...";
  try {
    const users = await getAll("users");
    const daCo = users.some(function (u) { return u.email === email; });
    if (daCo) { tb.innerHTML = ""; datLoi("email", "Email đã tồn tại."); return; }
    await create("users", { name: ten, email: email, password: mk, role: vaiTro, status: "Hoạt động", createdAt: new Date().toISOString() });
    tb.innerHTML = '<div class="alert alert-success">Đã tạo tài khoản. Đang chuyển về đăng nhập...</div>';
    setTimeout(function () { window.location.href = "login.html"; }, 1200);
  } catch (loi) {
    tb.innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}
document.querySelector("#form-dk").addEventListener("submit", dangKy);
