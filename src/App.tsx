import { useCallback } from 'react';
import './App.css';
import { ConfigPanel } from './components/ConfigPanel';
import { Header } from './components/Header';
import { PreviewPanel } from './components/PreviewPanel';
import { useQRCode } from './hooks/useQRCode';
import { useTheme } from './hooks/useTheme';
import { renderQRToCanvas, renderQRToSVG } from './lib/qrGenerator';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { config, qr, info, updateConfig } = useQRCode();

  const handleExportPNG = useCallback(() => {
    if (!qr) return;

    try {
      const canvas = renderQRToCanvas(qr, config, 1024);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `qrcode-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Failed to export PNG. Please try again.');
    }
  }, [qr, config]);

  const handleExportSVG = useCallback(() => {
    if (!qr) return;

    try {
      const svg = renderQRToSVG(qr, config, 1024);
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${Date.now()}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting SVG:', error);
      alert('Failed to export SVG. Please try again.');
    }
  }, [qr, config]);

  const handleExportConfig = useCallback(() => {
    try {
      const configData = {
        config,
        info,
        exportedAt: new Date().toISOString(),
      };
      const json = JSON.stringify(configData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-config-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting config:', error);
      alert('Failed to export configuration. Please try again.');
    }
  }, [config, info]);

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="main-content">
        <div className="grid-container">
          <div className="grid-left">
            <ConfigPanel config={config} onUpdate={updateConfig} />
          </div>
          <div className="grid-right">
            <PreviewPanel
              qr={qr}
              config={config}
              info={info}
              onExportPNG={handleExportPNG}
              onExportSVG={handleExportSVG}
              onExportConfig={handleExportConfig}
            />
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>
          Built with React + TypeScript •{" "}
          <a
            href="https://github.com/xixu-me/QR-Code-Generator"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            View Source
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
