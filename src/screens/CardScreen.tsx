import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFamily } from '../hooks/useFamily';
import { BarcodeDisplay } from '../components/BarcodeDisplay';

export function CardScreen() {
  const { memberId, cardId } = useParams<{ memberId: string; cardId: string }>();
  const { getCard } = useFamily();
  const navigate = useNavigate();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activePane, setActivePane] = useState(0);

  const card = memberId && cardId ? getCard(memberId, cardId) : undefined;

  if (!card) {
    return (
      <div className="screen">
        <p className="empty-state">Card not found.</p>
        <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const pane = Math.round(el.scrollLeft / el.clientWidth);
    setActivePane(pane);
  }

  return (
    <div className="card-screen">
      <header className="screen-header card-screen-header">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(`/member/${memberId}`)}
          aria-label="Back"
        >
          ←
        </button>
        <h1>{card.libraryName}</h1>
      </header>

      <div className="barcode-scroller" ref={scrollerRef} onScroll={handleScroll}>
        <div className="barcode-pane">
          <span className="barcode-pane-label">Card number</span>
          <BarcodeDisplay value={card.cardNumber} />
        </div>
        <div className="barcode-pane">
          <span className="barcode-pane-label">Password</span>
          <BarcodeDisplay value={card.password} />
        </div>
      </div>

      <div className="pane-dots">
        <span className={`pane-dot ${activePane === 0 ? 'active' : ''}`} />
        <span className={`pane-dot ${activePane === 1 ? 'active' : ''}`} />
      </div>
      <p className="swipe-hint">Swipe to switch between card number and password</p>
    </div>
  );
}
