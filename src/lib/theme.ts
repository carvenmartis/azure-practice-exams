/**
 * Browser UI colours (theme-color meta, iOS status bar) for each theme. They
 * match the solid header background in src/components/layout/course-header.tsx.
 */
export const themeColors = { light: '#ffffff', dark: '#000000' };

/**
 * Runs in <head> before the first paint (see src/pages/_document.tsx). It applies
 * the saved theme, or the OS setting for 'system', to <html> and the
 * theme-color meta, so Safari colours the status bar correctly from the start
 * instead of locking in the light server render.
 */
export const themeInitScript = `(function () {
  var theme;
  try { theme = localStorage.getItem('theme'); } catch (e) {}
  var dark = theme === 'dark' ||
    (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var root = document.documentElement;
  if (dark) root.classList.add('dark');
  root.style.colorScheme = dark ? 'dark' : 'light';
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '${themeColors.dark}' : '${themeColors.light}');
})();`;
