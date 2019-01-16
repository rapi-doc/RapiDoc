let color={
    bg:"#fff", 
    fg:"#333",
    lightFg:"#999",
    veryLightFg:"#bbb",
    codeFg:"#ccc",
    codeBg:"#263238",
    reverseBg:"#333", 
    reverseFg:"#ccc",
    primaryBg:"#FF791A",
    primaryFg:"#fff",
    plainBg:"#fff",
    plainFg:"#333",
    plainBtnBorder:"#333",
    inputFg:"#333",
    inputBg:"#fff",
    tableFg:"#565656",
    tableHeaderBg:"#fafafa",
    tableTitleFg:"#999",
    inputBorder:"#C5D9E8",
    inputReverseFg:"#fff",
    inputReverseBg:"#333",
    inputReverseBorder:"#cd5500",
    inputReverseBorderFocus:"#FF791A",
    link:'#47AFE8',
    border:"#ccc",
    lightBorder:"#eee",
    red:"#CC0000",
    softRed:"#ED4337",
    green:"#99CC00",
    blue:"#47AFE8",
    orange:"#FF9900",
    get:"#47AFE8",
    put:"#FF9900",
    post:"#99CC00",
    delete:"#CC0000",
    patch:"#fc0",
    head:"",
    lightGet:"#eff8fd",
    lightPut:"#fff5e6",
    lightPost:"#fbfff0",
    lightDelete:"#fff0f0",
    lightPatch:"#fff5cc",
    lightHead:"",
    headerBg:"#444",
    hoverBg:"#f7f7f7",
    placeHolder:"#ccc",
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
        console.log(`#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`)
        return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`
    }
};

let border={
    "radius":"2px",
    "style":"1px solid gray",
};

let font={
    path:"/public",
    regular:'rapidoc, "Times New Roman", Helvetica, Arial',
    mono:"Monaco, 'Andale Mono', 'Roboto Mono', Consolas",
    size:'14px',
    small:'12px',
    titleSize:'16px',
    tableTitleSize:"12px"
}

export default {
    color,
    font,
    border
}