import React from 'react';

const MilkCard = ({ date, quantity, rate, amount, onEdit }) => {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '6px',
        padding: '12px',
        margin: '8px 0',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative',
        cursor: onEdit ? 'pointer' : 'default'
      }}
      onClick={onEdit ? () => onEdit({ date, quantity, rate, amount }) : undefined}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>{new Date(date).toLocaleDateString()}</strong>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>Qty: {quantity}L</div>
          <div>Rate: ₹{rate}/L</div>
          <div><strong>Amount: ₹{amount}</strong></div>
        </div>
      </div>
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit({ date, quantity, rate, amount });
          }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '4px 8px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default MilkCard;
