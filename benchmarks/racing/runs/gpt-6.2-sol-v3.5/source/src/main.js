if (import.meta.env.DEV && new URLSearchParams(location.search).has('p1')) {
  import('./p1.js');
} else {
  import('./game.js');
}
