// ==============================================================================
// KOBIRUL SOFTWARES - SECURITY UTILITIES & XSS SANITIZATION
// ==============================================================================

/**
 * Escapes unsafe HTML characters to prevent XSS vulnerability
 * @param {string} str - Raw user input or string
 * @returns {string} - Escaped safe HTML string
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validates email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Mask sensitive string (e.g. passwords/license keys)
 * @param {string} text
 * @returns {string}
 */
export function maskText(text) {
  if (!text) return '••••••••';
  return '•'.repeat(Math.min(text.length, 12));
}

window.escapeHtml = escapeHtml;
