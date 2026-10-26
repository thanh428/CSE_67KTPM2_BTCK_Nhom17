kiemTraVaiTro("agent");
document.querySelector("#ten-user").textContent = sessionStorage.getItem("ten") + " · Môi giới";
document.querySelector("#state-empty").textContent = "Chưa có hoạt động nào.";

// Đếm số liệu từ dữ liệu, không viết cứng
function dem(mang, dieuKien) { return mang.filter(dieuKien).length; }

async function taiDuLieu() {
  showState("loading");
  try {
    const nha = await getAll("properties");
    const leads = await getAll("leads");
    const lich = await getAll("viewings");
    document.querySelector("#kpi-hd").textContent = dem(nha, function (p) { return p.status === "Đã duyệt"; });
    document.querySelector("#kpi-cd").textContent = dem(nha, function (p) { return p.status === "Chờ duyệt"; });
    document.querySelector("#kpi-lead").textContent = dem(leads, function (l) { return l.status === "Mới"; });
    document.querySelector("#kpi-lich").textContent = dem(lich, function (v) { return v.status === "Chờ xác nhận" || v.status === "Đã xác nhận"; });
    showState("content");
  } catch (loi) {
    showState("error", loi.message);
  }
}
document.querySelector("#nut-thulai").addEventListener("click", taiDuLieu);
document.querySelector("#nut-dangxuat").addEventListener("click", dangXuat);
taiDuLieu();
