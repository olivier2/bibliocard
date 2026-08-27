import { useInstallPrompt } from '../hooks/useInstallPrompt';

export function InstallPrompt() {
  const { isVisible, promptInstall, dismiss } = useInstallPrompt();

  if (!isVisible) return null;

  return (
    <div className="install-banner" role="dialog" aria-label="Install BiblioCard">
      <div className="install-banner-text">
        <strong>Install BiblioCard</strong>
        <span>Add it to your home screen for quick, offline access.</span>
      </div>
      <div className="install-banner-actions">
        <button type="button" className="btn-secondary" onClick={dismiss}>
          Not now
        </button>
        <button type="button" className="btn-primary" onClick={promptInstall}>
          Install
        </button>
      </div>
    </div>
  );
}
