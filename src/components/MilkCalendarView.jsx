import React, { useState } from 'react';
import TransactionDetailsModal from './TransactionDetailsModal';

const MilkCalendarView = ({ 
  transactions, 
  selectedMonth, 
  onNextMonth, 
  onPrevMonth,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Parse the month (format: YYYY-MM)
  const [year, month] = selectedMonth.split('-').map(Number);
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[month - 1];

  // Get transactions for a specific date
  const getTransactionsForDate = (day) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return transactions.filter(t => t.date === dateStr);
  };

  // Calculate totals for a day
  const getDayTotals = (day) => {
    const dayTransactions = getTransactionsForDate(day);
    const milk = dayTransactions.reduce((sum, t) => sum + t.quantity, 0);
    const amount = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
    return { milk, amount, count: dayTransactions.length };
  };

  // Create calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null); // Empty cells before first day
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDate(day);
    }
  };

  const handleAddTransactionForDay = () => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    onAddTransaction(dateStr);
    setSelectedDate(null);
  };

  const handleDeleteTransaction = (transaction) => {
    onDeleteTransaction(transaction);
    setSelectedDate(null); // Close the modal after deleting
  };

  const handleEditTransactionAndClose = (transaction) => {
    onEditTransaction(transaction);
    setSelectedDate(null); // Close the modal
  };

  const dayTransactions = selectedDate ? getTransactionsForDate(selectedDate) : [];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={onPrevMonth}
          style={{
            padding: '8px 16px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Previous
        </button>
        <h2 style={{ margin: 0 }}>{monthName} {year}</h2>
        <button
          onClick={onNextMonth}
          style={{
            padding: '8px 16px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '5px',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderRadius: '8px'
      }}>
        {/* Day Headers */}
        {dayHeaders.map(day => (
          <div
            key={day}
            style={{
              padding: '10px',
              textAlign: 'center',
              fontWeight: 'bold',
              backgroundColor: '#333',
              color: 'white',
              borderRadius: '4px'
            }}
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => {
          const totals = day ? getDayTotals(day) : {};
          const dayTransactionsForCell = day ? getTransactionsForDate(day) : [];
          const hasNoMilkDay = dayTransactionsForCell.some(t => t.quantity === 0);
          const hasMilk = dayTransactionsForCell.some(t => t.quantity > 0);
          const hasTransactions = dayTransactionsForCell.length > 0;
          
          let bgColor = '#fff';
          let hoverColor = '#f9f9f9';
          let textColor = '#999';
          
          if (hasTransactions) {
            if (hasNoMilkDay && !hasMilk) {
              bgColor = '#fff3e0'; // Orange/amber for no milk day
              hoverColor = '#ffe0b2';
              textColor = '#ff9800';
            } else if (hasMilk) {
              bgColor = '#e8f5e9'; // Green for milk transactions
              hoverColor = '#c8e6c9';
              textColor = '#4CAF50';
            }
          }
          
          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              style={{
                padding: '10px',
                minHeight: '50px',
                backgroundColor: day ? bgColor : '#f5f5f5',
                border: day ? '1px solid #e0e0e0' : 'none',
                borderRadius: '4px',
                cursor: day ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (day && hasTransactions) e.target.style.backgroundColor = hoverColor;
              }}
              onMouseLeave={(e) => {
                if (day) e.target.style.backgroundColor = bgColor;
              }}
            >
              {day && (
                <>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: hasTransactions ? textColor : '#999' }}>{day}</div>
                  {hasNoMilkDay && !hasMilk ? (
                    <div style={{ fontSize: '12px', color: '#ff9800', fontWeight: 'bold' }}>No Milk</div>
                  ) : hasMilk && (
                    <div style={{ fontSize: '12px', color: '#4CAF50' }}>
                      <div>{totals.milk}L</div>
                      <div>₹{totals.amount}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for transaction details */}
      {selectedDate && (
        <TransactionDetailsModal
          date={`${year}-${String(month).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`}
          transactions={dayTransactions}
          onClose={() => setSelectedDate(null)}
          onAddTransaction={handleAddTransactionForDay}
          onEditTransaction={handleEditTransactionAndClose}
          onDeleteTransaction={handleDeleteTransaction}
        />
      )}
    </div>
  );
};

export default MilkCalendarView;
