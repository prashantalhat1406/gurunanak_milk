import React, { useState } from "react";
import TransactionDetailsModal from "./TransactionDetailsModal";
import "../styles/buttons.css";

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

  // Get transactions for a specific date
  const getTransactionsForDate = (day) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return transactions.filter((t) => t.date === dateStr);
  };

  // Calculate totals for a day
  const getDayTotals = (day) => {
    const dayTransactions = getTransactionsForDate(day);
    const milk = dayTransactions.reduce((sum, t) => sum + t.quantity, 0);
    const amount = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
    return { milk, amount, count: dayTransactions.length };
  };

  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDate(day);
    }
  };

  const handleAddTransactionForDay = () => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
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

  const dayTransactions = selectedDate
    ? getTransactionsForDate(selectedDate)
    : [];

  return (
    <div
      style={{
        padding: "10px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onPrevMonth}
          className="nav-button"
          title="Previous month"
        >
          ←
        </button>
        <div style={{ position: "relative" }}>
          <h2
            onClick={() => setShowMonthPicker(!showMonthPicker)}
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "4px",
              backgroundColor: "#f0f0f0",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
          >
            {monthName} {year}
          </h2>

          {/* Month Picker */}
          {showMonthPicker && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "12px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                zIndex: 100,
                marginTop: "4px",
                minWidth: "200px",
              }}
            >
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  if (onMonthChange) {
                    onMonthChange(e.target.value);
                  }
                  setShowMonthPicker(false);
                }}
                autoFocus
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}
        </div>
        <button onClick={onNextMonth} className="nav-button" title="Next month">
          →
        </button>
      </div>

      {/* Calendar Container - Fixed 6 weeks */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "3px",
          backgroundColor: "#f0f0f0",
          padding: "6px",
          borderRadius: "6px",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Day Headers - Fixed Height */}
        {dayHeaders.map((day) => (
          <div
            key={`header-${day}`}
            style={{
              padding: "4px 2px",
              textAlign: "center",
              fontWeight: "bold",
              backgroundColor: "#333",
              color: "white",
              borderRadius: "3px",
              fontSize: "11px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {day}
          </div>
        ))}

        {/* Calendar Days - 6 weeks (42 days) */}
        {calendarDays.map((day, index) => {
          const totals = day ? getDayTotals(day) : {};
          const dayTransactionsForCell = day ? getTransactionsForDate(day) : [];
          const hasNoMilkDay = dayTransactionsForCell.some(
            (t) => t.quantity === 0,
          );
          const hasMilk = dayTransactionsForCell.some((t) => t.quantity > 0);
          const hasTransactions = dayTransactionsForCell.length > 0;

          // Default colors
          let bgColor = "#fff";
          let hoverColor = "#f9f9f9";
          let textColor = "#999";
          let dayNumberColor = "#999";

          // Apply colors only if there are transactions
          if (hasTransactions) {
            if (hasNoMilkDay && !hasMilk) {
              bgColor = "#fff3e0"; // Orange/amber for no milk day
              hoverColor = "#ffe0b2";
              textColor = "#ff9800";
              dayNumberColor = "#ff9800";
            } else if (hasMilk) {
              bgColor = "#e8f5e9"; // Green for milk transactions
              hoverColor = "#c8e6c9";
              textColor = "#4CAF50";
              dayNumberColor = "#2e7d32";
            }
          }

          // Unique key that includes month information to force complete re-render on month change
          const cellKey = `${year}-${month}-${index}-${day || "empty"}`;

          return (
            <div
              key={cellKey}
              onClick={() => handleDayClick(day)}
              style={{
                padding: "3px",
                backgroundColor: day ? bgColor : "#f5f5f5",
                border: day ? "1px solid #e0e0e0" : "none",
                borderRadius: "3px",
                cursor: day ? "pointer" : "default",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                transition: "background-color 0.2s",
                minHeight: "35px",
                fontSize: "12px",
                color: "inherit",
              }}
              onMouseEnter={(e) => {
                if (day && hasTransactions)
                  e.target.style.backgroundColor = hoverColor;
              }}
              onMouseLeave={(e) => {
                if (day) e.target.style.backgroundColor = bgColor;
              }}
            >
              {day && (
                <>
                  {/* Day Number - Left */}
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "13px",
                      color: dayNumberColor,
                    }}
                  >
                    {day}
                  </div>

                  {/* Qty and Amount - Right */}
                  {hasNoMilkDay && !hasMilk ? (
                    <div
                      style={{
                        fontSize: "9px",
                        color: "#ff9800",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      No Milk
                    </div>
                  ) : (
                    hasMilk && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          textAlign: "right",
                          fontSize: "10px",
                          color: textColor,
                          lineHeight: "1.1",
                          gap: "1px",
                        }}
                      >
                        <div style={{ fontWeight: "600" }}>{totals.milk}L</div>
                        <div style={{ fontWeight: "600" }}>
                          ₹{totals.amount}
                        </div>
                      </div>
                    )
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
          date={`${year}-${String(month).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`}
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
