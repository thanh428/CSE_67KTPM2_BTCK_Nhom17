kiemTraVaiTro("seeker");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Người tìm nhà";
const EMAIL = "a.nguyen@email.com";
document.querySelector("#state-empty").innerHTML = "Bạn chưa lưu nhà nào. <a href='seeker-property-search.html'>Đi tìm nhà</a>";

function veNhaLuu(mang, nha) {
  const vung = document.querySelector("#list");
  vung.innerHTML = "";
  mang.forEach(function (s) {
    let tenNha = "Nhà " + s.propertyId;
    nha.forEach(function (n) { if (n.id === s.propertyId) tenNha = n.name + " · " + n.price + " triệu/tháng"; });
    vung.innerHTML += '<div class="col-md-4"><div class="the-luu"><h6>' + tenNha + "</h6><p>" + (s.note || "Chưa có ghi chú") +
      '</p><button class="btn btn-outline-secondary btn-sm nut-bo" data-id="' + s.id + '">Bỏ lưu</button></div></div>';
  });
  document.querySelectorAll(".nut-bo").forEach(function (nut) {
    nut.addEventListener("click", function () { boLuu(nut.dataset.id); });
  });
}

async function boLuu(id) {
  try {
    await remove("savedProperties", id); // D: bỏ lưu
    taiNhaLuu();
  } catch (loi) {
    document.querySelector("#thong-bao").innerHTML = '<div class="alert alert-danger">' + loi.message + "</div>";
  }
}

async function taiNhaLuu() {
  showState("loading");
  try {
    const luu = (await getAll("savedProperties")).filter(function (s) { return s.userEmail === EMAIL; });
    const nha = await getAll("properties");
    if (luu.length === 0) { showState("empty"); return; }
    veNhaLuu(luu, nha);
    showState("content");
  } catch (loi) {
    showState("error", loi.message);
  }
}

function veBang(idBang, mang, laLich) {
  const tbody = document.querySelector(idBang);
  tbody.innerHTML = "";
  if (mang.length === 0) { tbody.innerHTML = '<tr><td colspan="4">Chưa có dữ liệu.</td></tr>'; return; }
  mang.forEach(function (d) {
    if (laLich) tbody.innerHTML += "<tr><td>" + d.propertyName + "</td><td>" + d.date + " " + d.time + "</td><td>" + d.status + "</td></tr>";
    else tbody.innerHTML += "<tr><td>" + d.code + "</td><td>" + d.propertyName + "</td><td>" + d.reason + "</td><td>" + d.status + "</td></tr>";
  });
}

async function taiLichVaBaoCao() {
  try {
    const lich = (await getAll("viewings")).filter(function (v) { return v.seekerEmail === EMAIL; });
    const bc = (await getAll("reports")).filter(function (r) { return r.reporterEmail === EMAIL; });
    veBang("#bang-lich", lich, true);
    veBang("#bang-bc", bc, false);
  } catch (loi) {
    document.querySelector("#bang-lich").innerHTML = '<tr><td colspan="4">' + loi.message + "</td></tr>";
  }
}

document.querySelector("#nut-thulai").addEventListener("click", taiNhaLuu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
taiNhaLuu();
taiLichVaBaoCao();
