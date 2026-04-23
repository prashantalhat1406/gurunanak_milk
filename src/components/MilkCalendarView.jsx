import React, { useState } from "react";
import TransactionDetailsModal from "./TransactionDetailsModal";
import "../styles/milk-calendar.css";

import { getMonthMeta, buildCalendarDays } from "../utils/calandar-utils";

const MilkCalendarView = ({
  transactions,
  selectedMonth,
  onNextMonth,
  onPrevMonth,
  onMonthChange,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const { year, month, firstDay, daysInMonth } = getMonthMeta(selectedMonth);
  const calendarDays = buildCalendarDays(firstDay, daysInMonth);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = monthNames[month - 1];

  // Map for fast lookup (important)
  const transactionsMap = React.useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return map;
  }, [transactions]);

  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDayClick = (day) => {
    if (!day) return;

    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
  };

  const selectedTransactions = selectedDate
    ? transactionsMap[selectedDate] || []
    : [];

  const handleAddTransactionForDay = () => {
    if (!selectedDate) return;

    onAddTransaction(selectedDate);

    // ✅ THIS is what closes modal
    setSelectedDate(null);
  };

  return (
    <div className="mcal-container">
      {/* NAVIGATION */}
      <div className="mcal-nav">
        <button onClick={onPrevMonth} className="nav-button">
          ←
        </button>

        <h2
          className="mcal-month-title"
          onClick={() => setShowMonthPicker((s) => !s)}
        >
          {monthName} {year}
        </h2>

        <button onClick={onNextMonth} className="nav-button">
          →
        </button>

        {/* Month Picker */}
        {showMonthPicker && (
          <div className="mcal-month-picker">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                onMonthChange?.(e.target.value);
                setShowMonthPicker(false);
              }}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* CALENDAR GRID */}
      <div className="mcal-grid">
        {/* headers */}
        {dayHeaders.map((d) => (
          <div key={d} className="mcal-header">
            {d}
          </div>
        ))}

        {/* days */}
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="mcal-cell mcal-cell-empty" />;
          }

          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayTx = transactionsMap[dateStr] || [];

          const today = new Date();
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

          const hasMilk = dayTx.some((t) => t.quantity > 0);
          const hasNoMilk = dayTx.some((t) => t.quantity === 0);

          const isToday = dateStr === todayStr;

          let cellClass = "mcal-cell";
          if (isToday) cellClass += " mcal-today";

          if (hasNoMilk && !hasMilk) {
            cellClass += " mcal-cell-no-milk";
          } else if (hasMilk) {
            cellClass += " mcal-cell-milk";
          }

          const milk = dayTx.reduce((s, t) => s + t.quantity, 0);
          const amount = dayTx.reduce((s, t) => s + t.amount, 0);

          return (
            <div
              key={dateStr}
              className={cellClass}
              onClick={() => handleDayClick(day)}
            >
              <div className="mcal-day">{day}</div>

              {isToday && <div className="mcal-today-badge">Today</div>}

              <div className="mcal-data">
                {dayTx.length === 0 ? null : hasNoMilk && !hasMilk ? (
                  <span className="mcal-no-milk">No Milk</span>
                ) : (
                  <>
                    <div className="mcal-qty">{milk}L</div>
                    <div className="mcal-amount">₹{amount}</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedDate && (
        <TransactionDetailsModal
          date={selectedDate}
          transactions={selectedTransactions}
          onClose={() => setSelectedDate(null)}
          onAddTransaction={handleAddTransactionForDay}
          onEditTransaction={(t) => {
            onEditTransaction(t);
            setSelectedDate(null);
          }}
          onDeleteTransaction={(t) => {
            onDeleteTransaction(t);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
};

export default MilkCalendarView;
