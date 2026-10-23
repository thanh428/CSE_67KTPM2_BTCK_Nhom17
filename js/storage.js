/* Các hàm đọc/ghi dữ liệu demo trong localStorage. */
(function () {
  const DB_KEY = 'homefit_db';

  function readDatabase() {
    try {
      const saved = localStorage.getItem(DB_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Không đọc được dữ liệu HomeFit:', error);
      return null;
    }
  }

  function saveDatabase(database) {
    localStorage.setItem(DB_KEY, JSON.stringify(database));
    return database;
  }

  function ensureDatabase() {
    const database = readDatabase();
    if (database && database.tables && database.version === window.HOMEFIT_SEED.version) return database;
    return saveDatabase(JSON.parse(JSON.stringify(window.HOMEFIT_SEED)));
  }

  function getAll(tableName) {
    const database = ensureDatabase();
    return database.tables[tableName] || [];
  }

  function getById(tableName, id) {
    return getAll(tableName).find((item) => String(item.id) === String(id)) || null;
  }

  function add(tableName, item) {
    const database = ensureDatabase();
    if (!database.tables[tableName]) database.tables[tableName] = [];
    const newItem = { ...item, id: item.id || nextId(tableName) };
    database.tables[tableName].push(newItem);
    saveDatabase(database);
    return newItem;
  }

  function update(tableName, id, changes) {
    const database = ensureDatabase();
    const rows = database.tables[tableName] || [];
    const index = rows.findIndex((item) => String(item.id) === String(id));
    if (index < 0) return null;
    rows[index] = { ...rows[index], ...changes, id: rows[index].id };
    saveDatabase(database);
    return rows[index];
  }

  function remove(tableName, id) {
    const database = ensureDatabase();
    const rows = database.tables[tableName] || [];
    const keptRows = rows.filter((item) => String(item.id) !== String(id));
    if (keptRows.length === rows.length) return false;
    database.tables[tableName] = keptRows;
    saveDatabase(database);
    return true;
  }

  function nextId(tableName) {
    const rows = getAll(tableName);
    return `${tableName}_${Date.now()}_${rows.length + 1}`;
  }

  function resetDatabase() {
    localStorage.removeItem(DB_KEY);
    return ensureDatabase();
  }

  window.HomeFitStorage = { DB_KEY, readDatabase, saveDatabase, ensureDatabase, getAll, getById, add, update, remove, nextId, resetDatabase };
  // Công cụ dành cho người phát triển, chỉ gọi trong Console trình duyệt.
  window.resetData = function () {
    resetDatabase();
    window.location.reload();
  };
})();
