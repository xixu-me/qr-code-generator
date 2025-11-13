import { Theme } from '../hooks/useTheme';
import './Header.css';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="header fade-in">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">QR Code Generator</h1>
          <p className="header-subtitle">Advanced technical parameter control</p>
        </div>
        <button
          className="theme-toggle button-secondary"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
