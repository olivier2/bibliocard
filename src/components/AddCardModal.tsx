import { Suspense, lazy, useState } from 'react';
import { Modal } from './Modal';
import type { LibraryCard } from '../types';

const BarcodeScanner = lazy(() =>
  import('./BarcodeScanner').then((m) => ({ default: m.BarcodeScanner })),
);

interface AddCardModalProps {
  onAdd: (card: Omit<LibraryCard, 'id'>) => void;
  onClose: () => void;
}

export function AddCardModal({ onAdd, onClose }: AddCardModalProps) {
  const [libraryName, setLibraryName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [password, setPassword] = useState('');
  const [scanning, setScanning] = useState(false);

  const canSave = libraryName.trim() && cardNumber.trim() && password.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    onAdd({
      libraryName: libraryName.trim(),
      cardNumber: cardNumber.trim(),
      password: password.trim(),
    });
    onClose();
  }

  if (scanning) {
    return (
      <Modal title="Scan card barcode" onClose={onClose}>
        <Suspense fallback={<p className="empty-state">Loading camera…</p>}>
          <BarcodeScanner
            onDetected={(text) => {
              setCardNumber(text);
              setScanning(false);
            }}
            onCancel={() => setScanning(false)}
          />
        </Suspense>
      </Modal>
    );
  }

  return (
    <Modal title="Add library card" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="library-name">
          Library name
        </label>
        <input
          id="library-name"
          className="text-input"
          value={libraryName}
          onChange={(e) => setLibraryName(e.target.value)}
          placeholder="e.g. Central Library"
          autoFocus
        />

        <label className="field-label" htmlFor="card-number">
          Card number
        </label>
        <div className="input-with-button">
          <input
            id="card-number"
            className="text-input"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Scan or type the number"
            inputMode="numeric"
          />
          <button type="button" className="btn-secondary" onClick={() => setScanning(true)}>
            Scan
          </button>
        </div>

        <label className="field-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="text-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Alphanumeric password"
          autoCapitalize="off"
          autoCorrect="off"
        />

        <button type="submit" className="btn-primary" disabled={!canSave}>
          Save card
        </button>
      </form>
    </Modal>
  );
}
