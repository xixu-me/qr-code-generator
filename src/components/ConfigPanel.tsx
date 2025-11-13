import { checkContrast } from '../lib/qrGenerator';
import { ErrorCorrectionLevel, MaskPattern, ModuleStyle, QRConfig } from '../types/qr';
import './ConfigPanel.css';

interface ConfigPanelProps {
  config: QRConfig;
  onUpdate: (updates: Partial<QRConfig>) => void;
}

export function ConfigPanel({ config, onUpdate }: ConfigPanelProps) {
  const contrast = checkContrast(config.foregroundColor, config.backgroundColor);
  const lowContrast = contrast < 3;

  return (
    <div className="config-panel glass-card fade-in">
      <h2 className="panel-title">Configuration</h2>

      {/* Content Input */}
      <div className="config-section">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={config.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter text, URL, or any data..."
          rows={4}
          className="content-input"
        />
      </div>

      {/* QR Version */}
      <div className="config-section">
        <label htmlFor="version">
          QR Version
          <span className="label-hint">
            {config.version === 'auto' ? '(Auto-selected)' : `(${config.version})`}
          </span>
        </label>
        <select
          id="version"
          value={config.version}
          onChange={(e) => onUpdate({ version: e.target.value === 'auto' ? 'auto' : parseInt(e.target.value) })}
        >
          <option value="auto">Auto</option>
          {Array.from({ length: 40 }, (_, i) => i + 1).map(v => (
            <option key={v} value={v}>Version {v}</option>
          ))}
        </select>
      </div>

      {/* Error Correction Level */}
      <div className="config-section">
        <label htmlFor="errorCorrection">Error Correction Level</label>
        <div className="radio-group">
          {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map(level => (
            <label key={level} className="radio-label">
              <input
                type="radio"
                name="errorCorrection"
                value={level}
                checked={config.errorCorrectionLevel === level}
                onChange={(e) => onUpdate({ errorCorrectionLevel: e.target.value as ErrorCorrectionLevel })}
              />
              <span className="radio-text">{level}</span>
              <span className="radio-hint">
                {level === 'L' && '~7%'}
                {level === 'M' && '~15%'}
                {level === 'Q' && '~25%'}
                {level === 'H' && '~30%'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Mask Pattern */}
      <div className="config-section">
        <label htmlFor="maskPattern">Mask Pattern</label>
        <select
          id="maskPattern"
          value={config.maskPattern}
          onChange={(e) => onUpdate({ maskPattern: e.target.value === 'auto' ? 'auto' : parseInt(e.target.value) as MaskPattern })}
        >
          <option value="auto">Auto (Best)</option>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(pattern => (
            <option key={pattern} value={pattern}>Pattern {pattern}</option>
          ))}
        </select>
      </div>

      {/* Quiet Zone */}
      <div className="config-section">
        <label htmlFor="quietZone">
          Quiet Zone (Margin)
          <span className="label-hint">{config.quietZone} modules</span>
        </label>
        <input
          type="range"
          id="quietZone"
          min="0"
          max="10"
          value={config.quietZone}
          onChange={(e) => onUpdate({ quietZone: parseInt(e.target.value) })}
        />
      </div>

      {/* Module Style */}
      <div className="config-section">
        <label htmlFor="moduleStyle">Module Style</label>
        <div className="style-grid">
          {(['square', 'rounded', 'dots', 'rounded-dots'] as ModuleStyle[]).map(style => (
            <button
              key={style}
              className={`style-button ${config.moduleStyle === style ? 'active' : ''}`}
              onClick={() => onUpdate({ moduleStyle: style })}
            >
              <div className={`style-preview style-${style}`}></div>
              <span>{style.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="config-section">
        <div className="color-row">
          <div className="color-input-group">
            <label htmlFor="foreground">Foreground</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                id="foreground"
                value={config.foregroundColor}
                onChange={(e) => onUpdate({ foregroundColor: e.target.value })}
              />
              <input
                type="text"
                value={config.foregroundColor}
                onChange={(e) => onUpdate({ foregroundColor: e.target.value })}
                className="color-text-input"
                placeholder="#000000"
              />
            </div>
          </div>
          <div className="color-input-group">
            <label htmlFor="background">Background</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                id="background"
                value={config.backgroundColor}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              />
              <input
                type="text"
                value={config.backgroundColor}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="color-text-input"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>
        {lowContrast && (
          <div className="warning-message">
            ⚠️ Low contrast ratio ({contrast.toFixed(1)}:1). Recommended: 3:1 minimum
          </div>
        )}
      </div>
    </div>
  );
}
