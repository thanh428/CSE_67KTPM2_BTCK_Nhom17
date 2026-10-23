/* Ba hàm AI giả lập, chạy bằng quy tắc trên dữ liệu cục bộ. */
(function () {
  function matchScore(brief, property) {
    // Điểm mẫu được đặt trong seed-data để demo luôn khớp Brief #1.
    if (brief.id === 'brief_1' && property.matchScores?.brief_1) return property.matchScores.brief_1;
    const checks = [
      { matches: property.district === brief.district, priority: 1 },
      { matches: property.price <= brief.budget, priority: 1 },
      { matches: property.bedrooms >= brief.bedrooms, priority: 1 },
      { matches: property.schoolDistance <= 500, priority: brief.priorities?.nearSchool === 'Bắt buộc' ? 2 : 1 },
      { matches: ['Cao', 'Rất cao'].includes(property.quietness), priority: brief.priorities?.quiet === 'Bắt buộc' ? 2 : 1 },
      { matches: property.workspace, priority: brief.priorities?.workspace === 'Bắt buộc' ? 2 : 1 }
    ];
    const possible = checks.reduce((sum, check) => sum + check.priority, 0);
    const earned = checks.reduce((sum, check) => sum + (check.matches ? check.priority : 0), 0);
    return Math.round((earned / possible) * 100);
  }

  function listingSummary(property) {
    const missing = ['price', 'schoolDistance', 'quietness'].filter((field) => property[field] === undefined || property[field] === null || property[field] === '');
    if (missing.length) return { status: 'uncertain', reason: `Thiếu dữ liệu: ${missing.join(', ')}.`, summary: '' };
    return {
      status: 'result',
      reason: 'Tóm tắt dựa trên giá, vị trí, diện tích và tiện ích đã nhập.',
      summary: `${property.name}: ${property.bedrooms} phòng ngủ, ${property.area} m² tại ${property.district}; giá ${property.price} triệu/tháng.`
    };
  }

  function compareProperties(properties, weights = {}) {
    if (properties.length < 2) return { status: 'uncertain', reason: 'Cần ít nhất 2 nhà để so sánh.', rankings: [] };
    const criteria = ['price', 'area', 'schoolDistance', 'quietness', 'workspace'];
    const totalWeight = criteria.reduce((sum, key) => sum + Number(weights[key] ?? 1), 0);
    if (!totalWeight) return { status: 'uncertain', reason: 'Tổng trọng số đang bằng 0.', rankings: [] };
    const bounds = Object.fromEntries(criteria.map((key) => {
      const values = properties.map((property) => key === 'quietness' ? ({ Thấp: 1, 'Trung bình': 2, Cao: 3, 'Rất cao': 4 }[property[key]] || 0) : key === 'workspace' ? Number(property[key]) : Number(property[key]));
      return [key, { min: Math.min(...values), max: Math.max(...values) }];
    }));
    const rankings = properties.map((property) => {
      let score = 0;
      criteria.forEach((key) => {
        const value = key === 'quietness' ? ({ Thấp: 1, 'Trung bình': 2, Cao: 3, 'Rất cao': 4 }[property[key]] || 0) : key === 'workspace' ? Number(property[key]) : Number(property[key]);
        const { min, max } = bounds[key];
        let normalized = max === min ? 1 : (value - min) / (max - min);
        if (key === 'price' || key === 'schoolDistance') normalized = 1 - normalized;
        score += normalized * Number(weights[key] ?? 1);
      });
      return { propertyId: property.id, score: Math.round((score / totalWeight) * 100) };
    }).sort((a, b) => b.score - a.score);
    return { status: 'result', reason: 'Điểm được tính từ các tiêu chí và trọng số đang chọn.', rankings };
  }

  function simulateError(value) {
    const database = HomeFitStorage.ensureDatabase();
    if (typeof value === 'boolean') {
      database.settings.simulateAiErrors = value;
      HomeFitStorage.saveDatabase(database);
    }
    return Boolean(database.settings?.simulateAiErrors);
  }

  function recordEvent(aiName, action) {
    HomeFitStorage.add('aiEvents', { aiName, action, createdAt: new Date().toISOString() });
  }

  window.HomeFitAI = { matchScore, listingSummary, compareProperties, simulateError, recordEvent };
  // Dùng Console khi cần kiểm tra tình huống lỗi, không hiển thị công tắc trên trang.
  window.simulateAiError = simulateError;
})();
