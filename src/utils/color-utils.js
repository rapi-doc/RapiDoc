export default {
  color: {
    inputReverseFg: '#fff',
    inputReverseBg: '#333',
    headerBg: '#444',
    getRgb(hex) {
      if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
      }
      // convert 3-digit hex to 6-digits.
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
      }
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    },
    invert(hex) {
      const rgb = this.getRgb(hex);
      return (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) >= 135 ? '#000' : '#fff'; // compare with `>=128`, but giving little more preference to white over black
    },
    opacity(hex, opacity) {
      const rgb = this.getRgb(hex);
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    },
    brightness(hex, amt) {
      const rgb = this.getRgb(hex);
      rgb.r += amt;
      rgb.g += amt;
      rgb.b += amt;
      if (rgb.r > 255) rgb.r = 255;
      else if (rgb.r < 0) rgb.r = 0;

      if (rgb.g > 255) rgb.g = 255;
      else if (rgb.g < 0) rgb.g = 0;

      if (rgb.b > 255) rgb.b = 255;
      else if (rgb.b < 0) rgb.b = 0;
      return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
    },
  },
};

export function isValidHexColor(colorCode) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(colorCode);
}
