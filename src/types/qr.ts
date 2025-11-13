export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type MaskPattern = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | "auto";

export type ModuleStyle = "square" | "rounded" | "dots" | "rounded-dots";

export type QRVersion = "auto" | number; // 1-40 or 'auto'

export type EncodingMode = "auto" | "numeric" | "alphanumeric" | "byte";

// QR Code instance type
export interface QRCodeInstance {
  addData(data: string, mode?: string): void;
  make(): void;
  getModuleCount(): number;
  isDark(row: number, col: number): boolean;
  createDataURL(cellSize?: number, margin?: number): string;
  createImgTag(cellSize?: number, margin?: number): string;
  createSvgTag(cellSize?: number, margin?: number): string;
  createTableTag(cellSize?: number, margin?: number): string;
}

export interface QRConfig {
  content: string;
  version: QRVersion;
  errorCorrectionLevel: ErrorCorrectionLevel;
  maskPattern: MaskPattern;
  encodingMode: EncodingMode;
  quietZone: number;
  moduleStyle: ModuleStyle;
  foregroundColor: string;
  backgroundColor: string;
}

export interface QRInfo {
  version: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  maskPattern: number;
  capacity: number;
  usedCapacity: number;
  capacityPercentage: number;
}

export interface QRExportOptions {
  format: "png" | "svg";
  size: number;
  includeMargin: boolean;
}
