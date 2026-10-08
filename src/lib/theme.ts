/**
 * Browser UI colours (theme-color meta, iOS status bar) for each theme. They
 * match the solid header background (--header in src/styles/globals.css).
 */
export const themeColors = { light: '#fbfaf7', dark: '#0a0f19' };

/**
 * Runs in <head> before the first paint (see src/app/layout.tsx). It applies
 * the saved theme, or the OS setting for 'system', to <html> and adds the
 * theme-color meta, so Safari colours the status bar correctly from the start
 * instead of locking in the light server render. The meta is created here
 * rather than rendered by React: React would see its changed colour while
 * hydrating and add a second, light one. It also marks iPhones and
 * iPads (iPadOS reports itself as a Mac with touch) with the 'ios' class,
 * which gives them a taller header (--header-height in globals.css).
 */
export const themeInitScript = `(function () {
  var theme;
  try { theme = localStorage.getItem('theme'); } catch (e) {}
  var dark = theme === 'dark' ||
    (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var root = document.documentElement;
  if (/iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) root.classList.add('ios');
  if (dark) root.classList.add('dark');
  root.style.colorScheme = dark ? 'dark' : 'light';
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', dark ? '${themeColors.dark}' : '${themeColors.light}');
})();`;
