export const STORAGE_KEY = 'still:favourites';

export function readFavourites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? [...new Set(saved.filter(id => typeof id === 'string'))] : [];
  } catch {
    return [];
  }
}

export function favouritesReducer(state, action) {
  switch (action.type) {
    case 'toggle':
      return state.includes(action.id)
        ? state.filter(id => id !== action.id)
        : [...state, action.id];
    default:
      return state;
  }
}
