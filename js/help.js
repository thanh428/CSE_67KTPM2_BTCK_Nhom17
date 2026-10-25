chuanBiMenuChung();

// Lọc FAQ theo từ khóa
function locFaq() {
  const tuKhoa = document.querySelector("#o-tim").value.toLowerCase();
  let soHienThi = 0;
  document.querySelectorAll(".faq").forEach(function (muc) {
    const khop = muc.textContent.toLowerCase().includes(tuKhoa);
    muc.classList.toggle("d-none", !khop);
    if (khop) soHienThi++;
  });
  document.querySelector("#khong-co").classList.toggle("d-none", soHienThi > 0);
}

// AI Help: tìm mục FAQ có nhiều từ trùng với câu hỏi nhất
function hoiAI() {
  const cauHoi = document.querySelector("#o-hoi").value.toLowerCase().trim();
  const o = document.querySelector("#tra-loi");
  if (cauHoi === "") { o.textContent = "Hãy nhập câu hỏi."; return; }
  const tu = cauHoi.split(" ").filter(function (t) { return t.length >= 3; });
  let tot = null, diemTot = 0;
  document.querySelectorAll(".faq").forEach(function (muc) {
    const chu = muc.textContent.toLowerCase();
    const diem = tu.filter(function (t) { return chu.includes(t); }).length;
    if (diem > diemTot) { diemTot = diem; tot = muc; }
  });
  if (tot === null) {
    o.innerHTML = 'Mình chỉ trả lời về cách dùng HomeFit. Để tìm nhà theo nhu cầu, hãy dùng Home Brief. <a class="btn btn-sm btn-xanh" href="seeker-home-brief.html">Mở Home Brief</a>';
    return;
  }
  const tieuDe = tot.querySelector(".accordion-button").textContent;
  o.innerHTML = tot.querySelector(".accordion-body").textContent + "<br><small><b>Vì sao?</b> Lấy từ mục FAQ «" + tieuDe + "».</small>";
}
document.querySelector("#o-tim").addEventListener("input", locFaq);
document.querySelector("#nut-hoi").addEventListener("click", hoiAI);
