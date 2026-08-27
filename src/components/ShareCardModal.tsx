import { useState } from 'react';
import { Modal } from './Modal';
import { QrCodeDisplay } from './QrCodeDisplay';
import { buildShareUrl } from '../shareLink';
import type { LibraryCard } from '../types';

interface ShareCardModalProps {
  memberName: string;
  card: LibraryCard;
  onClose: () => void;
}

export function ShareCardModal({ memberName, card, onClose }: ShareCardModalProps) {
  const shareUrl = buildShareUrl(memberName, card);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Modal title={`Share ${card.libraryName}`} onClose={onClose}>
      <div className="share-qr-wrap">
        <QrCodeDisplay value={shareUrl} />
      </div>
      <p className="share-url">{shareUrl}</p>
      <button type="button" className="btn-secondary" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </Modal>
  );
}
