// Đẩy dữ liệu trong db.json lên MockAPI (2 resource: properties và records)
const KIND_SEED = { users: "user", categories: "category", leads: "lead", viewings: "viewing", reports: "report",
  notifications: "notification", savedProperties: "savedProperty", briefs: "brief", aiEvents: "aiEvent" };
document.querySelector("#dia-chi").textContent = API_BASE_URL;
const nhatKy = document.querySelector("#nhat-ky");
function ghi(chu) { nhatKy.textContent += chu + "\n"; }

async function guiMot(tenResource, data) {
  const res = await fetch(API_BASE_URL + "/" + tenResource, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Lỗi " + res.status + " khi gửi tới /" + tenResource + ". Kiểm tra tên resource và địa chỉ API.");
  return await res.json();
}

async function chay() {
  const nut = document.querySelector("#nut-chay");
  nut.disabled = true;
  nhatKy.textContent = "";
  try {
    if (API_BASE_URL.includes("DAN_")) throw new Error("Bạn chưa dán địa chỉ MockAPI vào js/api-config.js");
    const db = await (await fetch("../db.json")).json();
    // 1. Nhà: gửi lần lượt để có id mới, ghi nhớ id cũ -> id mới
    const mapId = {};
    for (const p of db.properties) {
      const idCu = p.id;
      const du = Object.assign({}, p); delete du.id;
      const moi = await guiMot("properties", du);
      mapId[idCu] = moi.id;
      ghi("Nhà " + du.name + " -> id " + moi.id);
    }
    // 2. Các loại còn lại: gộp vào records, đổi propertyId sang id mới
    for (const ten in KIND_SEED) {
      let ds = db[ten] || [];
      if (ten === "aiEvents") ds = ds.filter(function (e, i) { return i % 5 === 0; }); // lấy mẫu để đỡ tốn bản ghi
      for (const r of ds) {
        const du = Object.assign({}, r, { kind: KIND_SEED[ten] }); delete du.id;
        if (du.propertyId !== undefined && mapId[du.propertyId]) du.propertyId = mapId[du.propertyId];
        await guiMot("records", du);
      }
      ghi(ten + ": đã nhập " + ds.length + " bản ghi");
    }
    ghi("\nXONG. Bây giờ mở pages/login.html để dùng web.");
  } catch (loi) {
    ghi("LỖI: " + loi.message);
    nut.disabled = false;
  }
}
document.querySelector("#nut-chay").addEventListener("click", chay);
