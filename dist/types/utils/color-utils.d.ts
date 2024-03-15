declare const _default: {
    color: {
        inputReverseFg: string;
        inputReverseBg: string;
        headerBg: string;
        getRgb(hex: string): {
            r: number;
            g: number;
            b: number;
        };
        luminanace(hexColorCode: string): number;
        invert(hexColorCode: string): "#fff" | "#000";
        opacity(hex: string, opacity: number): string;
        brightness(hex: string, amt: number): string;
        hasGoodContrast(hexColorCode1: string, hexColorCode2: string): number;
    };
};
export default _default;
export declare function isValidHexColor(colorCode?: string): boolean;
//# sourceMappingURL=color-utils.d.ts.map