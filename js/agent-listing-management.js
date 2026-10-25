kiemTraVaiTro("agent");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Môi giới";
document.querySelector("#state-empty").innerHTML = "Bạn chưa có listing nào. Đăng tin đầu tiên để bắt đầu nhận lead.";
let danhSach = [];

function veBang() {
  const tuKhoa = document.querySelector("#o-tim").value.toLowerCase();
  const tt = document.querySelector("#loc-tt").value;
  const ketQua = danhSach.filter(function (p) {
    if (tt !== "" && p.status !== tt) return false;
    return p.name.toLowerCase().includes(tuKhoa);
  });
  if (ketQua.length === 0) { showState("empty"); return; }
  const tbody = document.querySelector("#bang");
  tbody.innerHTML = "";
  ketQua.forEach(function (p) {
    let nut = "";
    if (p.status !== "Lưu trữ") {
      nut = '<a class="btn btn-sm btn-outline-dark me-1" href="agent-listing-edit.html?id=' + p.id + '">Sửa</a><button class="btn btn-sm btn-outline-secondary nut-lt" data-id="' + p.id + '">Lưu trữ</button>';
    }
    tbody.innerHTML += "<tr><td>P" + p.id + "</td><td>" + p.name + "</td><td>" + p.district + "</td><td>" + p.price +
      "</td><td>" + p.area + '</td><td><span class="badge-tt">' + p.status + "</span></td><td>" + nut + "</td></tr>";
  });
  document.querySelectorAll(".nut-lt").forEach(function (n) {
    n.addEventListener("click", function () { luuTru(n.dataset.id); });
  });
  showState("content");
}

async function luuTru(id) {
  if (!confirm("Lưu trữ listing này? Tin sẽ ẩn khỏi tìm kiếm.")) return; // hộp xác nhận
  try {
    const p = danhSach.find(function (x) { return x.id === id; });
    p.status = "Lưu trữ";
    await update("properties", id, p); // U: đổi trạng thái
    veBang();
  } catch (loi) {
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

async function taiDuLieu() {
  showState("loading");
  try {
    danhSach = await getAll("properties");
    veBang();
  } catch (loi) {
    showState("error", loi.message);
  }
}

document.querySelector("#o-tim").addEventListener("input", veBang);
document.querySelector("#loc-tt").addEventListener("change", veBang);
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
taiDuLieu();
