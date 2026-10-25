// Hàm dùng chung cho form đăng tin và sửa tin
const SO_ANH_TOI_DA = 3;
let dsAnh = []; // các ảnh dạng chuỗi data:image/jpeg;base64,... sẽ được lưu cùng tin

function datLoi(id, chu) { document.querySelector("#loi-" + id).textContent = chu; }

// Nạp loại BĐS từ danh mục admin (resource categories), bỏ loại đã vô hiệu hóa
async function napLoaiBDS() {
  const o = document.querySelector("#f-loai");
  try {
    const ds = await getAll("categories");
    ds.filter(function (c) { return c.type === "loai" && c.status !== "Vô hiệu hóa"; }).forEach(function (c) {
      o.innerHTML += "<option>" + c.name + "</option>";
    });
  } catch (loi) {
    ["Căn hộ / Chung cư", "Nhà phố / Nhà riêng", "Studio", "Villa / Biệt thự"].forEach(function (t) { o.innerHTML += "<option>" + t + "</option>"; });
  }
}

// Thu nhỏ ảnh (cạnh dài tối đa 600px) và đổi sang JPEG để nhẹ khi lưu
function thuNhoAnh(file) {
  return new Promise(function (xong, loi) {
    const doc = new FileReader();
    doc.onerror = function () { loi(new Error("Không đọc được ảnh")); };
    doc.onload = function () {
      const img = new Image();
      img.onerror = function () { loi(new Error("Không đọc được ảnh")); };
      img.onload = function () {
        const ti = Math.min(1, 600 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ti);
        canvas.height = Math.round(img.height * ti);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff"; // nền trắng cho ảnh PNG trong suốt
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        xong(canvas.toDataURL("image/jpeg", 0.65));
      };
      img.src = doc.result;
    };
    doc.readAsDataURL(file);
  });
}

function veXemTruoc() {
  const v = document.querySelector("#xem-truoc");
  v.innerHTML = "";
  dsAnh.forEach(function (anh, i) {
    v.innerHTML += '<div><img src="' + anh + '" width="90" height="68" style="object-fit:cover"><br><button type="button" class="btn btn-sm btn-outline-danger nut-xoa-anh" data-i="' + i + '">Xóa</button></div>';
  });
  document.querySelectorAll(".nut-xoa-anh").forEach(function (n) {
    n.addEventListener("click", function () { dsAnh.splice(Number(n.dataset.i), 1); veXemTruoc(); });
  });
}

async function chonAnh() {
  datLoi("anh", "");
  const files = Array.from(document.querySelector("#f-anh").files);
  document.querySelector("#f-anh").value = "";
  for (const f of files) {
    if (f.type !== "image/jpeg" && f.type !== "image/png") { datLoi("anh", "Chỉ nhận ảnh JPG hoặc PNG."); continue; }
    if (dsAnh.length >= SO_ANH_TOI_DA) { datLoi("anh", "Tối đa " + SO_ANH_TOI_DA + " ảnh."); break; }
    try { dsAnh.push(await thuNhoAnh(f)); } catch (loi) { datLoi("anh", loi.message); }
  }
  veXemTruoc();
}

function docForm() {
  return {
    name: document.querySelector("#f-ten").value.trim(), type: document.querySelector("#f-loai").value,
    price: Number(document.querySelector("#f-gia").value), area: Number(document.querySelector("#f-dt").value),
    district: document.querySelector("#f-quan").value.trim(), distanceSchool: Number(document.querySelector("#f-kc").value),
    bedrooms: Number(document.querySelector("#f-pn").value), bathrooms: Number(document.querySelector("#f-pt").value),
    quiet: document.querySelector("#f-yen").value, hasWorkspace: document.querySelector("#f-lamviec").checked,
    familyFriendly: document.querySelector("#f-giadinh").checked, description: document.querySelector("#f-mota").value.trim(),
    images: dsAnh.slice(), agentEmail: "b.tran@email.com"
  };
}

function ghiForm(p) {
  document.querySelector("#f-ten").value = p.name || ""; document.querySelector("#f-loai").value = p.type || "";
  document.querySelector("#f-gia").value = p.price || ""; document.querySelector("#f-dt").value = p.area || "";
  document.querySelector("#f-quan").value = p.district || ""; document.querySelector("#f-kc").value = p.distanceSchool || "";
  document.querySelector("#f-pn").value = p.bedrooms || 1; document.querySelector("#f-pt").value = p.bathrooms || 1;
  document.querySelector("#f-yen").value = p.quiet || "Trung bình"; document.querySelector("#f-lamviec").checked = !!p.hasWorkspace;
  document.querySelector("#f-giadinh").checked = !!p.familyFriendly; document.querySelector("#f-mota").value = p.description || "";
  dsAnh = (p.images || []).filter(function (a) { return typeof a === "string" && a.startsWith("data:"); });
  veXemTruoc();
}

function kiemTraListing(d) {
  let ok = true;
  ["ten", "gia", "dt", "quan"].forEach(function (k) { datLoi(k, ""); });
  if (d.name === "") { datLoi("ten", "Nhập tên tin."); ok = false; }
  if (!(d.price > 0)) { datLoi("gia", "Giá phải lớn hơn 0."); ok = false; }
  if (!(d.area > 0)) { datLoi("dt", "Diện tích phải lớn hơn 0."); ok = false; }
  if (d.district === "") { datLoi("quan", "Nhập quận / địa chỉ."); ok = false; }
  return ok;
}
document.querySelector("#f-anh").addEventListener("change", chonAnh);
napLoaiBDS();
