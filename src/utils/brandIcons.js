// ==============================================================================
// KOBIRUL SOFTWARES - OFFICIAL BRAND ICONS MAPPING
// ==============================================================================

export const brandIcons = {
  "adobe-creative-cloud": "https://cdn.worldvectorlogo.com/logos/adobe-creative-cloud-2.svg",
  "canva-pro": "https://cdn.worldvectorlogo.com/logos/canva-1.svg",
  "chatgpt-plus": "https://cdn.worldvectorlogo.com/logos/chatgpt-6.svg",
  "chatgpt": "https://cdn.worldvectorlogo.com/logos/chatgpt-6.svg",
  "claude-pro": "https://cdn.worldvectorlogo.com/logos/claude-ai.svg",
  "midjourney": "https://cdn.worldvectorlogo.com/logos/midjourney-1.svg",
  "perplexity-pro": "https://cdn.worldvectorlogo.com/logos/perplexity-ai.svg",
  "perplexity": "https://cdn.worldvectorlogo.com/logos/perplexity-ai.svg",
  "capcut-pro": "https://cdn.worldvectorlogo.com/logos/capcut.svg",
  "grammarly-premium": "https://cdn.worldvectorlogo.com/logos/grammarly-1.svg",
  "grammarly": "https://cdn.worldvectorlogo.com/logos/grammarly-1.svg",
  "linkedin-premium": "https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg",
  "linkedin": "https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg",
  "semrush": "https://cdn.worldvectorlogo.com/logos/semrush-1.svg",
  "envato-elements": "https://cdn.worldvectorlogo.com/logos/envato-elements.svg",
  "freepik": "https://cdn.worldvectorlogo.com/logos/freepik-1.svg",
  "elevenlabs": "https://cdn.worldvectorlogo.com/logos/elevenlabs.svg",
  "github-copilot": "https://cdn.worldvectorlogo.com/logos/github-copilot.svg",
  "jetbrains-all-products": "https://cdn.worldvectorlogo.com/logos/jetbrains-1.svg",
  "windows-11-pro": "https://cdn.worldvectorlogo.com/logos/windows-11.svg",
  "office-2024-pro-plus": "https://cdn.worldvectorlogo.com/logos/microsoft-office-2019-present.svg",
  "ms-office": "https://cdn.worldvectorlogo.com/logos/microsoft-office-2019-present.svg",
  "nordvpn": "https://cdn.worldvectorlogo.com/logos/nordvpn-1.svg",
  "expressvpn": "https://cdn.worldvectorlogo.com/logos/expressvpn.svg",
  "surfshark": "https://cdn.worldvectorlogo.com/logos/surfshark-vpn.svg",
  "tradingview": "https://cdn.worldvectorlogo.com/logos/tradingview-1.svg",
  "coursera-plus": "https://cdn.worldvectorlogo.com/logos/coursera-2.svg",
  "cursor": "https://cdn.worldvectorlogo.com/logos/cursor-ai.svg",
  "gemini": "https://cdn.worldvectorlogo.com/logos/google-gemini-icon.svg",
  "youtube-premium": "https://cdn.worldvectorlogo.com/logos/youtube-icon-10.svg",
  "quillbot": "https://cdn.worldvectorlogo.com/logos/quillbot.svg"
};

/**
 * Gets brand image URL for a tool slug, with fallback to unsplash
 * @param {string} slug
 * @param {string} defaultImg
 * @returns {string}
 */
export function getToolBrandImage(slug, defaultImg) {
  if (brandIcons[slug]) {
    return brandIcons[slug];
  }
  return defaultImg || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";
}

window.getToolBrandImage = getToolBrandImage;
