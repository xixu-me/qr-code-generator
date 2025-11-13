// Type definitions for qrcode-generator
declare module "qrcode-generator" {
  type TypeNumber =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
    | 32
    | 33
    | 34
    | 35
    | 36
    | 37
    | 38
    | 39
    | 40;
  type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

  namespace qrcode {
    interface QRCode {
      addData(data: string, mode?: string): void;
      make(): void;
      getModuleCount(): number;
      isDark(row: number, col: number): boolean;
      createDataURL(cellSize?: number, margin?: number): string;
      createImgTag(cellSize?: number, margin?: number): string;
      createSvgTag(cellSize?: number, margin?: number): string;
      createTableTag(cellSize?: number, margin?: number): string;
    }

    const ErrorCorrectionLevel: {
      L: "L";
      M: "M";
      Q: "Q";
      H: "H";
    };
  }

  function qrcode(
    typeNumber: TypeNumber,
    errorCorrectionLevel: ErrorCorrectionLevel | string
  ): qrcode.QRCode;

  export = qrcode;
}
