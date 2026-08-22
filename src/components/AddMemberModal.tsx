import { useState } from 'react';
import { Modal } from './Modal';

interface AddMemberModalProps {
  onAdd: (name: string) => void;
  onClose: () => void;
}

export function AddMemberModal({ onAdd, onClose }: AddMemberModalProps) {
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    onClose();
  }

  return (
    <Modal title="Add family member" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="member-name">
          Name
        </label>
        <input
          id="member-name"
          className="text-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Olivier"
          autoFocus
        />
        <button type="submit" className="btn-primary" disabled={!name.trim()}>
          Add member
        </button>
      </form>
    </Modal>
  );
}
