// 5 hàm gọi API. Các trang khác chỉ gọi getAll("users"), create("leads", ...)...
// Khi API_GOP = true: nhà nằm ở /properties, các loại còn lại gộp vào /records và phân biệt bằng trường "kind".
const KIND = {
  users: "user", categories: "category", leads: "lead", viewings: "viewing", reports: "report",
  notifications: "notification", savedProperties: "savedProperty", briefs: "brief", aiEvents: "aiEvent"
};

function kiemTraUrl() {
  if (API_BASE_URL.includes("DAN_") || API_BASE_URL === "") {
    throw new Error("Chưa cấu hình API");
  }
}
// Trả về tên resource thật trên server
function tenResource(resource) {
  if (API_GOP && KIND[resource]) return "records";
  return resource;
}
function laDuLieuGop(resource) {
  return API_GOP && KIND[resource] !== undefined;
}

async function getAll(resource) {
  kiemTraUrl();
  const res = await fetch(API_BASE_URL + "/" + tenResource(resource));
  if (res.status === 404 && laDuLieuGop(resource)) return []; // resource rỗng
  if (!res.ok) throw new Error("Không tải được dữ liệu");
  const ds = await res.json();
  if (!laDuLieuGop(resource)) return ds;
  return ds.filter(function (r) { return r.kind === KIND[resource]; });
}
async function getById(resource, id) {
  kiemTraUrl();
  const res = await fetch(API_BASE_URL + "/" + tenResource(resource) + "/" + id);
  if (!res.ok) throw new Error("Không tải được dữ liệu");
  return await res.json();
}
async function create(resource, data) {
  kiemTraUrl();
  const gui = laDuLieuGop(resource) ? Object.assign({}, data, { kind: KIND[resource] }) : data;
  const res = await fetch(API_BASE_URL + "/" + tenResource(resource), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gui)
  });
  if (!res.ok) throw new Error("Thêm dữ liệu thất bại");
  return await res.json();
}
async function update(resource, id, data) {
  kiemTraUrl();
  const gui = laDuLieuGop(resource) ? Object.assign({}, data, { kind: KIND[resource] }) : data;
  const res = await fetch(API_BASE_URL + "/" + tenResource(resource) + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gui)
  });
  if (!res.ok) throw new Error("Cập nhật thất bại");
  return await res.json();
}
async function remove(resource, id) {
  kiemTraUrl();
  const res = await fetch(API_BASE_URL + "/" + tenResource(resource) + "/" + id, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa thất bại");
  return await res.json();
}
