import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFamily } from '../hooks/useFamily';
import { useBarcodeFormat } from '../hooks/useBarcodeFormat';
import { BarcodeDisplay } from '../components/BarcodeDisplay';
import { BARCODE_FORMATS, isBarcodeFormatValue } from '../barcodeFormats';

export function CardScreen() {
  const { memberId, cardId } = useParams<{ memberId: string; cardId: string }>();
  const { getCard } = useFamily();
  const { format, setFormat } = useBarcodeFormat();
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
          <BarcodeDisplay value={card.password} mask />
        </div>
      </div>

      <div className="pane-dots">
        <span className={`pane-dot ${activePane === 0 ? 'active' : ''}`} />
        <span className={`pane-dot ${activePane === 1 ? 'active' : ''}`} />
      </div>
      <p className="swipe-hint">Swipe to switch between card number and password</p>

      <div className="barcode-format-picker">
        <label htmlFor="barcode-format">Barcode type</label>
        <select
          id="barcode-format"
          value={format}
          onChange={(e) => {
            if (isBarcodeFormatValue(e.target.value)) setFormat(e.target.value);
          }}
        >
          {BARCODE_FORMATS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
