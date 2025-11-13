import { useCallback, useEffect, useState } from "react";
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
  const [qr, setQr] = useState<QRCodeInstance | null>(null);
  const [info, setInfo] = useState<QRInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateConfig = useCallback((updates: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  useEffect(() => {
    if (!config.content) {
      setQr(null);
      setInfo(null);
      setError(null);
      return;
    }

    try {
      const result = generateQRCode(config);
      setQr(result.qr);
      setInfo(result.info);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate QR code"
      );
      setQr(null);
      setInfo(null);
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
