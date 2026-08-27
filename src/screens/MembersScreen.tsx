import { Suspense, lazy, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../hooks/useFamily';
import { useIsStandalone } from '../hooks/useIsStandalone';
import { AddMemberModal } from '../components/AddMemberModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Modal } from '../components/Modal';
import { parseShareUrl } from '../shareLink';

const BarcodeScanner = lazy(() =>
  import('../components/BarcodeScanner').then((m) => ({ default: m.BarcodeScanner })),
);

export function MembersScreen() {
  const { members, addMember, removeMember } = useFamily();
  const navigate = useNavigate();
  const isStandalone = useIsStandalone();
  const [adding, setAdding] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [scanningQr, setScanningQr] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  function closeQrScanner() {
    setScanningQr(false);
    setScanError(null);
  }

  function handleQrDetected(text: string) {
    const path = parseShareUrl(text);
    if (!path) {
      setScanError("That QR code isn't a BiblioCard share link.");
      return;
    }
    closeQrScanner();
    navigate(path);
  }

  return (
    <div className="screen">
      <header className="screen-header">
        <h1>BiblioCard</h1>
      </header>

      {members.length === 0 ? (
        <p className="empty-state">No family members yet. Add one to get started.</p>
      ) : (
        <ul className="list">
          {members.map((member) => (
            <li key={member.id} className="list-row" onClick={() => navigate(`/member/${member.id}`)}>
              <div className="list-row-main">
                <span className="list-row-title">{member.name}</span>
                <span className="list-row-subtitle">
                  {member.cards.length} {member.cards.length === 1 ? 'card' : 'cards'}
                </span>
              </div>
              <button
                type="button"
                className="row-delete"
                aria-label={`Delete ${member.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingDelete(member.id);
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {isStandalone && (
        <button
          type="button"
          className="fab fab-secondary"
          onClick={() => setScanningQr(true)}
          aria-label="Scan a shared card QR code"
        >
          📷
        </button>
      )}

      <button type="button" className="fab" onClick={() => setAdding(true)} aria-label="Add member">
        +
      </button>

      {adding && <AddMemberModal onAdd={addMember} onClose={() => setAdding(false)} />}

      {pendingDelete && (
        <ConfirmDialog
          message="Delete this family member and all of their cards?"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            removeMember(pendingDelete);
            setPendingDelete(null);
          }}
        />
      )}

      {scanningQr && (
        <Modal title="Scan QR code" onClose={closeQrScanner}>
          <Suspense fallback={<p className="empty-state">Loading camera…</p>}>
            <BarcodeScanner mode="qr" onDetected={handleQrDetected} onCancel={closeQrScanner} />
          </Suspense>
          {scanError && <p className="scanner-error">{scanError}</p>}
        </Modal>
      )}
    </div>
  );
}
