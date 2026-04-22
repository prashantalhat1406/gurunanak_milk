import React, { useState, useEffect } from 'react';

const MilkTransactionForm = ({ onSubmit, onCancel, initialDate = '', initialQuantity = '', isEditing = false }) => {
  const [date, setDate] = useState(initialDate);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isNoMilkDay, setIsNoMilkDay] = useState(initialQuantity === 0);

  useEffect(() => {
    setDate(initialDate);
    setQuantity(initialQuantity);
    setIsNoMilkDay(initialQuantity === 0);
  }, [initialDate, initialQuantity]);

  const handleNoMilkDayChange = (e) => {
    const checked = e.target.checked;
    setIsNoMilkDay(checked);
    if (checked) {
      setQuantity(0);
    } else {
      setQuantity(0.5);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date) {
      const rate = 50; // Fixed rate
      const qty = isNoMilkDay ? 0 : parseFloat(quantity);
      if (qty >= 0) {
        const amount = qty * rate;
        onSubmit({ date, quantity: qty, rate, amount });
        if (!isEditing) {
          setDate('');
          setQuantity('');
          setIsNoMilkDay(false);
        }
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1001
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ marginTop: 0 }}>{isEditing ? 'Edit Milk Transaction' : 'Add Milk Transaction'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={isNoMilkDay}
                onChange={handleNoMilkDayChange}
                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 'bold', cursor: 'pointer' }}>No Milk Day</span>
            </label>
            {!isNoMilkDay && (
              <>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quantity (Liters):</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    fontSize: '16px'
                  }}
                />
              </>
            )}
          </div>
          <div style={{ marginBottom: '20px', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', color: '#333' }}>
            <div>Rate: ₹50/L</div>
            <div style={{ fontWeight: 'bold' }}>Amount: ₹{quantity ? (parseFloat(quantity) * 50).toFixed(2) : '0.00'}</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: isEditing ? '#ff9800' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              {isEditing ? 'Update Transaction' : 'Add Transaction'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilkTransactionForm;
