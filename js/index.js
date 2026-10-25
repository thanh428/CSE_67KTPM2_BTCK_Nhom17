// Ô tìm kiếm chuyển sang trang Tìm nhà kèm từ khóa (?q=)
document.querySelector("#form-tim").addEventListener("submit", function (event) {
  event.preventDefault();
  const q = document.querySelector("#o-tim").value.trim();
  window.location.href = "login.html?next=" + encodeURIComponent("seeker-property-search.html?q=" + q);
});
