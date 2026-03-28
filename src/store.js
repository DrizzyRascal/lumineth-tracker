const store = {
  get: (key) => {
    try {
      const v = localStorage.getItem(key);
      return v ? { value: v } : null;
    } catch { return null; }
  },
  set: (key, val) => {
    try { localStorage.setItem(key, val); } catch {}
  },
  del: (key) => {
    try { localStorage.removeItem(key); } catch {}
  },
};

export default store;
