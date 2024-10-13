export default {
  basePath: "/",

  get(key) {
    return localStorage.getItem(key) || null; // Use short-circuit evaluation for better readability
  },

  set(key, val) {
    localStorage.setItem(key, val);
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear(){
    localStorage.clear();
  },
  
  getPath(path) {
    return this.basePath + (path.startsWith('/') ? '' : '/') + path; // Ensure proper path concatenation
  },
};
