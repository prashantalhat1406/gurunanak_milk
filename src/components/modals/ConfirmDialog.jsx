export default function ConfirmDialog ({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title danger">
          <span className="title-icon">⚠️</span>
          {title}
        </h3>

        <h4>{message}</h4>

        <div className="confirm-actions">
          <button className="btn secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};