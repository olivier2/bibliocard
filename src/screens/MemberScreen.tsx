import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFamily } from '../hooks/useFamily';
import { AddCardModal } from '../components/AddCardModal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function MemberScreen() {
  const { memberId } = useParams<{ memberId: string }>();
  const { getMember, addCard, removeCard } = useFamily();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const member = memberId ? getMember(memberId) : undefined;

  if (!member) {
    return (
      <div className="screen">
        <p className="empty-state">Member not found.</p>
        <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <header className="screen-header">
        <button type="button" className="back-button" onClick={() => navigate('/')} aria-label="Back">
          ←
        </button>
        <h1>{member.name}</h1>
      </header>

      {member.cards.length === 0 ? (
        <p className="empty-state">No library cards yet. Add one to get started.</p>
      ) : (
        <ul className="list">
          {member.cards.map((card) => (
            <li
              key={card.id}
              className="list-row"
              onClick={() => navigate(`/member/${member.id}/card/${card.id}`)}
            >
              <div className="list-row-main">
                <span className="list-row-title">{card.libraryName}</span>
                <span className="list-row-subtitle">{card.cardNumber}</span>
              </div>
              <button
                type="button"
                className="row-delete"
                aria-label={`Delete ${card.libraryName} card`}
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingDelete(card.id);
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="fab" onClick={() => setAdding(true)} aria-label="Add card">
        +
      </button>

      {adding && (
        <AddCardModal onAdd={(card) => addCard(member.id, card)} onClose={() => setAdding(false)} />
      )}

      {pendingDelete && (
        <ConfirmDialog
          message="Delete this library card?"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            removeCard(member.id, pendingDelete);
            setPendingDelete(null);
          }}
        />
      )}
    </div>
  );
}
