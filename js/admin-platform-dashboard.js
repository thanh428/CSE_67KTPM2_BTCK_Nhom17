kiemTraVaiTro("admin");
document.querySelector("#ten-user").textContent = "Quản trị · Quản trị viên";
document.querySelector("#state-empty").textContent = "Chưa có dữ liệu.";
let nha = [], users = [], reports = [], aiEvents = [];
let soNgay = 7;

function trongKhoang(p) {
  if (!p.createdAt) return true; // tin chưa có ngày tạo thì vẫn tính
  const han = Date.now() - soNgay * 24 * 3600 * 1000;
  return new Date(p.createdAt).getTime() >= han;
}

function veKPI() {
  const trongKy = nha.filter(trongKhoang);
  document.querySelector("#kpi-hd").textContent = trongKy.filter(function (p) { return p.status === "Đã duyệt"; }).length;
  document.querySelector("#kpi-cd").textContent = trongKy.filter(function (p) { return p.status === "Chờ duyệt"; }).length;
  document.querySelector("#kpi-tk").textContent = users.length;
  document.querySelector("#kpi-bc").textContent = reports.filter(function (r) { return r.status !== "Hoàn thành"; }).length;
}

// Biểu đồ cột bằng SVG: số listing tạo mới của 6 tháng gần nhất
function veBieuDo() {
  const homNay = new Date();
  const dem = [], nhan = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(homNay.getFullYear(), homNay.getMonth() - i, 1);
    nhan.push("T" + (d.getMonth() + 1));
    dem.push(nha.filter(function (p) {
      if (!p.createdAt) return false;
      const t = new Date(p.createdAt);
      return t.getMonth() === d.getMonth() && t.getFullYear() === d.getFullYear();
    }).length);
  }
  const max = Math.max(1, Math.max.apply(null, dem));
  let svg = "";
  dem.forEach(function (so, i) {
    const cao = so / max * 100;
    svg += '<rect x="' + (20 + i * 62) + '" y="' + (120 - cao) + '" width="40" height="' + cao + '" fill="#1f5c4d"></rect>';
    svg += '<text x="' + (40 + i * 62) + '" y="136" text-anchor="middle" font-size="12">' + nhan[i] + "</text>";
    svg += '<text x="' + (40 + i * 62) + '" y="' + (114 - cao) + '" text-anchor="middle" font-size="12">' + so + "</text>";
  });
  document.querySelector("#bieu-do").innerHTML = svg;
}

// Thẻ AI: đếm sự kiện chấp nhận / từ chối / lỗi từ resource aiEvents
function veTheAI() {
  const v = document.querySelector("#the-ai");
  if (aiEvents.length === 0) { v.textContent = "Chưa có sự kiện AI nào."; return; }
  v.innerHTML = "";
  ["Lifestyle Matcher", "Listing Summary", "Comparison Assistant"].forEach(function (ten) {
    const ds = aiEvents.filter(function (e) { return e.ai === ten; });
    const dem = function (kq) { return ds.filter(function (e) { return e.result === kq; }).length; };
    v.innerHTML += "<p><b>" + ten + "</b><br>" + dem("accept") + " · " + dem("reject") + " · " + dem("error") + "</p>";
  });
}

async function taiDuLieu() {
  showState("loading");
  try {
    nha = await getAll("properties");
    users = await getAll("users");
    reports = await getAll("reports");
    try { aiEvents = await getAll("aiEvents"); } catch (e) { aiEvents = []; } // resource tùy chọn
    veKPI(); veBieuDo(); veTheAI();
    showState("content");
  } catch (loi) { showState("error", loi.message); }
}

document.querySelectorAll(".nut-loc").forEach(function (n) {
  n.addEventListener("click", function () {
    document.querySelectorAll(".nut-loc").forEach(function (x) { x.classList.remove("active"); });
    n.classList.add("active");
    soNgay = Number(n.dataset.ngay);
    veKPI();
  });
});
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
taiDuLieu();
