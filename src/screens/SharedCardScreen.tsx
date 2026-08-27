import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFamily } from '../hooks/useFamily';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { useIsStandalone } from '../hooks/useIsStandalone';
import { isIOS, isSafari } from '../pwa';
import { Modal } from '../components/Modal';

const NEW_MEMBER = '__new__';

export function SharedCardScreen() {
  const [searchParams] = useSearchParams();
  const { members, addMember, addCard } = useFamily();
  const navigate = useNavigate();
  const isStandalone = useIsStandalone();
  const { canPromptNatively, promptInstall, supportsNativePrompt } = useInstallPrompt();
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  const showInstallButton = !isStandalone && (canPromptNatively || (!supportsNativePrompt && isSafari()));

  function handleInstallClick() {
    if (canPromptNatively) {
      promptInstall();
    } else {
      setShowInstallHelp(true);
    }
  }

  const memberName = searchParams.get('member') ?? '';
  const libraryName = searchParams.get('library') ?? '';
  const cardNumber = searchParams.get('cardNumber') ?? '';
  const password = searchParams.get('password') ?? '';
  const isValid = Boolean(memberName && libraryName && cardNumber && password);

  const existingMatch = members.find((m) => m.name.toLowerCase() === memberName.toLowerCase());
  const [targetMemberId, setTargetMemberId] = useState(existingMatch?.id ?? NEW_MEMBER);

  if (!isValid) {
    return (
      <div className="screen">
        <header className="screen-header">
          <h1>Shared card</h1>
        </header>
        <p className="empty-state">This link is missing card details.</p>
        <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
          Go to BiblioCard
        </button>
      </div>
    );
  }

  function handleImport() {
    const memberId = targetMemberId === NEW_MEMBER ? addMember(memberName) : targetMemberId;
    const cardId = addCard(memberId, { libraryName, cardNumber, password });
    navigate(`/member/${memberId}/card/${cardId}`, { replace: true });
  }

  return (
    <div className="screen">
      <header className="screen-header">
        <h1>Add shared card</h1>
      </header>

      {showInstallButton && (
        <div className="install-hint">
          <p>Install BiblioCard to keep this card handy next time.</p>
          <button type="button" className="btn-secondary" onClick={handleInstallClick}>
            Install app
          </button>
        </div>
      )}

      <div className="shared-card-preview">
        <p>
          <strong>Library:</strong> {libraryName}
        </p>
        <p>
          <strong>Card number:</strong> {cardNumber}
        </p>
        <p>
          <strong>Shared for:</strong> {memberName}
        </p>
      </div>

      <label className="field-label" htmlFor="target-member">
        Add to
      </label>
      <select
        id="target-member"
        className="text-input"
        value={targetMemberId}
        onChange={(e) => setTargetMemberId(e.target.value)}
      >
        <option value={NEW_MEMBER}>Add as new member "{memberName}"</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <div className="shared-card-actions">
        <button type="button" className="btn-primary" onClick={handleImport}>
          Add card
        </button>
        <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
          Cancel
        </button>
      </div>

      {showInstallHelp && (
        <Modal title="Install BiblioCard" onClose={() => setShowInstallHelp(false)}>
          <p>
            {isIOS()
              ? 'Tap the Share button in Safari’s toolbar, then choose "Add to Home Screen".'
              : 'Click the Share button in Safari’s toolbar, then choose "Add to Dock".'}
          </p>
        </Modal>
      )}
    </div>
  );
}
