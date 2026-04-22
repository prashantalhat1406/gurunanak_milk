import React from 'react';

const CustomerCard = ({ customerID, name, mobile, totalMilk, totalAmount, onEdit, onClick }) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        margin: '10px 0',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick ? () => onClick({ customerID, name, mobile, totalMilk, totalAmount }) : undefined}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        {name} - {mobile}
      </div>
      <div style={{ fontSize: '0.9em', color: '#666' }}>
        ID: {customerID} | Milk: {totalMilk}L | Amount: ₹{totalAmount}
      </div>
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit({ customerID, name, mobile, totalMilk, totalAmount });
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '5px 10px',
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

export default CustomerCard;
