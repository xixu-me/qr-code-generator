import { useEffect, useRef, useState } from 'react';
import { renderQRToCanvas } from '../lib/qrGenerator';
import { QRCodeInstance, QRConfig, QRInfo } from '../types/qr';
import './PreviewPanel.css';

interface PreviewPanelProps {
  qr: QRCodeInstance | null;
  config: QRConfig;
  info: QRInfo | null;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportConfig: () => void;
}

export function PreviewPanel({ qr, config, info, onExportPNG, onExportSVG, onExportConfig }: PreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!qr || !canvasRef.current) return;

    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);

    try {
      const canvas = renderQRToCanvas(qr, config, 512);
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = 512;
        canvasRef.current.height = 512;
        ctx.drawImage(canvas, 0, 0);
      }
    } catch (error) {
      console.error('Error rendering QR code:', error);
    }

    return () => clearTimeout(timer);
  }, [qr, config]);

  if (!qr || !info) {
    return (
      <div className="preview-panel glass-card fade-in">
        <h2 className="panel-title">Preview</h2>
        <div className="preview-empty">
          <div className="empty-icon">📱</div>
          <p className="empty-text">Enter content to generate QR code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-panel glass-card fade-in">
      <h2 className="panel-title">Preview</h2>

      <div className={`preview-container ${isAnimating ? 'animating' : ''}`}>
        <canvas ref={canvasRef} className="preview-canvas" />
      </div>

      {/* QR Info */}
      <div className="info-section">
        <h3 className="info-title">Technical Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Version</span>
            <span className="info-value">{info.version}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Error Correction</span>
            <span className="info-value">{info.errorCorrectionLevel}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Mask Pattern</span>
            <span className="info-value">{info.maskPattern === -1 ? 'Auto' : info.maskPattern}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Module Style</span>
            <span className="info-value">{config.moduleStyle}</span>
          </div>
        </div>

        <div className="capacity-section">
          <div className="capacity-header">
            <span className="capacity-label">Data Capacity Usage</span>
            <span className="capacity-value">{info.capacityPercentage.toFixed(1)}%</span>
          </div>
          <div className="capacity-bar">
            <div
              className="capacity-fill"
              style={{
                width: `${Math.min(info.capacityPercentage, 100)}%`,
                background: info.capacityPercentage > 90
                  ? 'linear-gradient(90deg, #f56565, #e53e3e)'
                  : 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))'
              }}
            />
          </div>
          <div className="capacity-details">
            <span>{info.usedCapacity} / {info.capacity} bytes</span>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="export-section">
        <h3 className="info-title">Export</h3>
        <div className="export-buttons">
          <button onClick={onExportPNG} className="export-button">
            <span className="button-icon">🖼️</span>
            <span>PNG</span>
          </button>
          <button onClick={onExportSVG} className="export-button">
            <span className="button-icon">📐</span>
            <span>SVG</span>
          </button>
          <button onClick={onExportConfig} className="export-button button-secondary">
            <span className="button-icon">⚙️</span>
            <span>Config</span>
          </button>
        </div>
      </div>
    </div>
  );
}
