import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../hooks/useFamily';
import { AddMemberModal } from '../components/AddMemberModal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function MembersScreen() {
  const { members, addMember, removeMember } = useFamily();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

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
    </div>
  );
}
