import qrcode from "qrcode-generator";
import {
  ErrorCorrectionLevel,
  QRCodeInstance,
  QRConfig,
  QRInfo,
} from "../types/qr";

type QRCodeVersion = Parameters<typeof qrcode>[0];

// Map error correction levels to library constants
const EC_LEVEL_MAP: Record<ErrorCorrectionLevel, ErrorCorrectionLevel> = {
  L: "L",
  M: "M",
  Q: "Q",
  H: "H",
};

// QR Code capacity table (approximate, for byte mode)
const CAPACITY_TABLE: Record<ErrorCorrectionLevel, number[]> = {
  L: [
    17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425, 458, 520, 586,
    644, 718, 792, 858, 929, 1003, 1091, 1171, 1273, 1367, 1465, 1528, 1628,
    1732, 1840, 1952, 2068, 2188, 2303, 2431, 2563, 2699, 2809, 2953,
  ],
  M: [
    14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450,
    504, 560, 624, 666, 711, 779, 857, 911, 997, 1059, 1125, 1190, 1264, 1370,
    1452, 1538, 1628, 1722, 1809, 1911, 1989, 2099, 2213, 2331,
  ],
  Q: [
    11, 20, 32, 46, 60, 74, 86, 108, 130, 151, 177, 203, 241, 258, 292, 322,
    364, 394, 442, 482, 509, 565, 611, 661, 715, 751, 805, 868, 908, 982, 1030,
    1112, 1168, 1228, 1283, 1351, 1423, 1499, 1579, 1663,
  ],
  H: [
    7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177, 194, 220, 250, 280,
    310, 338, 382, 403, 439, 461, 511, 535, 593, 625, 658, 698, 742, 790, 842,
    898, 958, 983, 1051, 1093, 1139, 1219, 1273,
  ],
};

export function determineOptimalVersion(
  content: string,
  errorCorrectionLevel: ErrorCorrectionLevel
): number {
  const dataLength = new TextEncoder().encode(content).length;
  const capacities = CAPACITY_TABLE[errorCorrectionLevel];

  for (let version = 1; version <= 40; version++) {
    if (dataLength <= capacities[version - 1]) {
      return version;
    }
  }

  return 40; // Maximum version
}

export function getCapacity(
  version: number,
  errorCorrectionLevel: ErrorCorrectionLevel
): number {
  return CAPACITY_TABLE[errorCorrectionLevel][version - 1] || 0;
}

export function generateQRCode(config: QRConfig): {
  qr: QRCodeInstance;
  info: QRInfo;
} {
  const ecLevel = EC_LEVEL_MAP[config.errorCorrectionLevel];

  // Determine version
  let version: number;
  if (config.version === "auto") {
    version = determineOptimalVersion(
      config.content,
      config.errorCorrectionLevel
    );
  } else {
    version = config.version as number;
  }

  // Create QR code
  const qr = qrcode(version as QRCodeVersion, ecLevel);
  qr.addData(config.content);
  qr.make();

  // If mask pattern is specified (not auto), we need to regenerate with specific mask
  // Note: qrcode-generator library doesn't expose direct mask control in the public API
  // We'll document this limitation and focus on other parameters

  // Calculate capacity info
  const dataLength = new TextEncoder().encode(config.content).length;
  const capacity = getCapacity(version, config.errorCorrectionLevel);
  const capacityPercentage = Math.min((dataLength / capacity) * 100, 100);

  const info: QRInfo = {
    version,
    errorCorrectionLevel: config.errorCorrectionLevel,
    maskPattern: config.maskPattern === "auto" ? -1 : config.maskPattern,
    capacity,
    usedCapacity: dataLength,
    capacityPercentage,
  };

  return { qr, info };
}

export function renderQRToSVG(
  qr: QRCodeInstance,
  config: QRConfig,
  size: number = 512
): string {
  const moduleCount = qr.getModuleCount();
  const quietZone = config.quietZone;
  const totalModules = moduleCount + quietZone * 2;
  const moduleSize = size / totalModules;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`;
  svg += `<rect width="${size}" height="${size}" fill="${config.backgroundColor}"/>`;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        const x = (col + quietZone) * moduleSize;
        const y = (row + quietZone) * moduleSize;

        switch (config.moduleStyle) {
          case "square":
            svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${config.foregroundColor}"/>`;
            break;
          case "rounded":
            svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" rx="${
              moduleSize * 0.3
            }" fill="${config.foregroundColor}"/>`;
            break;
          case "dots":
            svg += `<circle cx="${x + moduleSize / 2}" cy="${
              y + moduleSize / 2
            }" r="${moduleSize / 2}" fill="${config.foregroundColor}"/>`;
            break;
          case "rounded-dots":
            svg += `<circle cx="${x + moduleSize / 2}" cy="${
              y + moduleSize / 2
            }" r="${moduleSize * 0.4}" fill="${config.foregroundColor}"/>`;
            break;
        }
      }
    }
  }

  svg += "</svg>";
  return svg;
}

export function renderQRToCanvas(
  qr: QRCodeInstance,
  config: QRConfig,
  size: number = 512
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const moduleCount = qr.getModuleCount();
  const quietZone = config.quietZone;
  const totalModules = moduleCount + quietZone * 2;
  const moduleSize = size / totalModules;

  canvas.width = size;
  canvas.height = size;

  // Background
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Modules
  ctx.fillStyle = config.foregroundColor;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        const x = (col + quietZone) * moduleSize;
        const y = (row + quietZone) * moduleSize;

        switch (config.moduleStyle) {
          case "square":
            ctx.fillRect(x, y, moduleSize, moduleSize);
            break;
          case "rounded": {
            ctx.beginPath();
            const radius = moduleSize * 0.3;
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + moduleSize - radius, y);
            ctx.quadraticCurveTo(x + moduleSize, y, x + moduleSize, y + radius);
            ctx.lineTo(x + moduleSize, y + moduleSize - radius);
            ctx.quadraticCurveTo(
              x + moduleSize,
              y + moduleSize,
              x + moduleSize - radius,
              y + moduleSize
            );
            ctx.lineTo(x + radius, y + moduleSize);
            ctx.quadraticCurveTo(x, y + moduleSize, x, y + moduleSize - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
            break;
          }
          case "dots":
            ctx.beginPath();
            ctx.arc(
              x + moduleSize / 2,
              y + moduleSize / 2,
              moduleSize / 2,
              0,
              2 * Math.PI
            );
            ctx.fill();
            break;
          case "rounded-dots":
            ctx.beginPath();
            ctx.arc(
              x + moduleSize / 2,
              y + moduleSize / 2,
              moduleSize * 0.4,
              0,
              2 * Math.PI
            );
            ctx.fill();
            break;
        }
      }
    }
  }

  return canvas;
}

export function checkContrast(foreground: string, background: string): number {
  // Simple contrast ratio calculation
  const getLuminance = (color: string): number => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}
