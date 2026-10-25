// Một file, hai bước. Không gửi email thật: dùng setTimeout giả lập.
let emailDangDat = "";

function datLoi(id, chu) { document.querySelector("#loi-" + id).textContent = chu; }

function guiLienKet() {
  const email = document.querySelector("#email").value.trim();
  datLoi("email", "");
  if (!email.includes("@")) { datLoi("email", "Email không đúng định dạng."); return; }
  const tb = document.querySelector("#tb-buoc1");
  tb.textContent = "Đang gửi...";
  setTimeout(function () {
    emailDangDat = email;
    // Luôn báo trung tính, dù email có tồn tại hay không
    tb.innerHTML = '<div class="alert alert-success">Nếu email đã đăng ký, liên kết khôi phục đã được gửi. (Giả lập: bấm nút bên dưới để sang bước 2.) <button id="nut-mo" class="btn btn-sm btn-outline-dark">Mở liên kết</button></div>';
    document.querySelector("#nut-mo").addEventListener("click", function () {
      document.querySelector("#buoc2").classList.remove("d-none");
    });
  }, 1000);
}

async function luuMatKhau() {
  const mk1 = document.querySelector("#mk1").value, mk2 = document.querySelector("#mk2").value;
  let ok = true;
  datLoi("mk1", ""); datLoi("mk2", "");
  if (mk1.length < 6) { datLoi("mk1", "Mật khẩu tối thiểu 6 ký tự."); ok = false; }
  if (mk1 !== mk2) { datLoi("mk2", "Hai mật khẩu chưa khớp. Nhập lại cho giống nhau."); ok = false; }
  if (!ok) return;
  const tb = document.querySelector("#tb-buoc2");
  try {
    const users = await getAll("users");
    const u = users.find(function (x) { return x.email === emailDangDat; });
    if (u) { u.password = mk1; await update("users", u.id, u); }
    tb.innerHTML = '<div class="alert alert-success">Đã đổi mật khẩu. Đang chuyển về đăng nhập...</div>';
    setTimeout(function () { window.location.href = "login.html"; }, 1200);
  } catch (loi) {
    tb.innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}
document.querySelector("#nut-gui").addEventListener("click", guiLienKet);
document.querySelector("#nut-luu").addEventListener("click", luuMatKhau);
