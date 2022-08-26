export default function debounce(callback, limit = 100) {
  let inDebounce;
  return function(...args) {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => {
      callback.apply(this, args);
    }, limit);
  }
}