export default { color:{
    tableFg:"#565656",
    tableHeaderBg:"#fafafa",
    tableTitleFg:"#999",
    inputReverseFg:"#fff",
    inputReverseBg:"#333",
    headerBg:"#444",
    getRgb:function(hex){
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
        return{
           'r' :parseInt(hex.slice(0, 2), 16),
           'g' :parseInt(hex.slice(2, 4), 16),
           'b' :parseInt(hex.slice(4, 6), 16),
        }

    },
    invert:function(hex){
        let rgb = this.getRgb(hex);
        return (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > 186 ? '#333': '#fff';
    },
    opacity:function(hex, opacity){
        let rgb = this.getRgb(hex);
        return `rgba(${rgb.r}, ${rgb.r}, ${rgb.r}, ${opacity})`;
    },
    brightness(hex, amt){
        let rgb = this.getRgb(hex);
        rgb.r = rgb.r + amt;
        rgb.g = rgb.g + amt;
        rgb.b = rgb.b + amt;
        if (rgb.r > 255) rgb.r = 255;
        else if (rgb.r < 0) rgb.r = 0;

        if (rgb.g > 255) rgb.g = 255;
        else if (rgb.g < 0) rgb.g = 0;

        if (rgb.b > 255) rgb.b = 255;
        else if (rgb.b < 0) rgb.b = 0;
        return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`
    }
}
};