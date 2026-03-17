import { useCallback, useMemo, useState } from "react";
import { generateQRCode } from "../lib/qrGenerator";
import { QRCodeInstance, QRConfig, QRInfo } from "../types/qr";

const DEFAULT_CONFIG: QRConfig = {
  content: "",
  version: "auto",
  errorCorrectionLevel: "M",
  maskPattern: "auto",
  encodingMode: "auto",
  quietZone: 2,
  moduleStyle: "square",
  foregroundColor: "#000000",
  backgroundColor: "#ffffff",
};

export function useQRCode() {
  const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG);

  const updateConfig = useCallback((updates: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  const { qr, info, error } = useMemo<{
    qr: QRCodeInstance | null;
    info: QRInfo | null;
    error: string | null;
  }>(() => {
    if (!config.content) {
      return {
        qr: null,
        info: null,
        error: null,
      };
    }

    try {
      const result = generateQRCode(config);
      return {
        qr: result.qr,
        info: result.info,
        error: null,
      };
    } catch (err) {
      return {
        qr: null,
        info: null,
        error: err instanceof Error ? err.message : "Failed to generate QR code",
      };
    }
  }, [config]);

  return {
    config,
    qr,
    info,
    error,
    updateConfig,
    resetConfig,
  };
}
