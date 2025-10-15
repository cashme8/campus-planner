const KEY = 'planner:data';
export const load = () => JSON.parse(localStorage.getItem(KEY) || '[]');
export const save = data => localStorage.setItem(KEY, JSON.stringify(data));
