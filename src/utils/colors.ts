/**
 * Generates a random color in hex format
 * @returns {string} A random hex color
 */
export function randomColor(): string {
  // Generate bright, distinct colors for better visibility
  const hue = Math.floor(Math.random() * 360); // Random hue (0-359)
  const saturation = 70 + Math.floor(Math.random() * 30); // High saturation (70-99%)
  const lightness = 45 + Math.floor(Math.random() * 15); // Medium lightness (45-59%)
  
  // Convert HSL to hex
  return hslToHex(hue, saturation, lightness);
}

/**
 * Converts HSL values to a hex color string
 * @param {number} h - Hue (0-359)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} Hex color string
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  
  // Convert to hex
  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
