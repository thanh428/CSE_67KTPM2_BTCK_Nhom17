/* Đăng nhập demo và kiểm tra vai trò ở phía trình duyệt. */
(function () {
  const USER_KEY = 'currentUser';

  function pageUrl(fileName) {
    const inPagesFolder = window.location.pathname.includes('/pages/');
    if (fileName === 'index.html') return inPagesFolder ? '../index.html' : 'index.html';
    return inPagesFolder ? fileName : `pages/${fileName}`;
  }

  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); }
    catch (error) { return null; }
  }

  function setCurrentUser(user) {
    if (!user) localStorage.removeItem(USER_KEY);
    else localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function login(email, password) {
    const user = HomeFitStorage.getAll('users').find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) return { ok: false, message: 'Email hoặc mật khẩu chưa đúng.' };
    if (user.status !== 'Hoạt động') return { ok: false, message: 'Tài khoản đang bị khóa.' };
    setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role });
    return { ok: true, user: getCurrentUser() };
  }

  function logout() {
    setCurrentUser(null);
    window.location.href = pageUrl('login.html');
  }

  function requireRole(allowedRoles) {
    const user = getCurrentUser();
    if (!user) { window.location.href = pageUrl('login.html'); return false; }
    const savedUser = HomeFitStorage.getById('users', user.id);
    if (!savedUser || savedUser.status !== 'Hoạt động') { setCurrentUser(null); window.location.href = pageUrl('login.html'); return false; }
    if (!allowedRoles.includes(user.role)) { window.location.href = pageUrl('403.html'); return false; }
    return user;
  }

  window.HomeFitAuth = { USER_KEY, getCurrentUser, setCurrentUser, login, logout, requireRole, pageUrl };
})();
