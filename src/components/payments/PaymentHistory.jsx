import React, { useState } from "react";
import "@styles/payment-history.css";
import ConfirmDialog from "@components/modals/ConfirmDialog";
import PaymentItem from "@components/payments/PaymentItem.jsx";
import { getMonthMeta } from "../../utils/calandar-utils";

const PaymentHistory = ({
  payments,
  milkTransactions,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [confirmData, setConfirmData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Helper function to get current month in YYYY-MM format
  function getCurrentMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  // Get month metadata
  const { year, month } = getMonthMeta(selectedMonth);
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

  // Month navigation handlers
  const handlePrevMonth = () => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const prevDate = new Date(y, m - 2, 1);
    const newYear = prevDate.getFullYear();
    const newMonth = String(prevDate.getMonth() + 1).padStart(2, "0");
    setSelectedMonth(`${newYear}-${newMonth}`);
  };

  const handleNextMonth = () => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const nextDate = new Date(y, m, 1);
    const newYear = nextDate.getFullYear();
    const newMonth = String(nextDate.getMonth() + 1).padStart(2, "0");
    setSelectedMonth(`${newYear}-${newMonth}`);
  };

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
    setShowMonthPicker(false);
  };

  // Filter payments for the selected month
  const filteredPayments = payments.filter((p) =>
    p.date.startsWith(selectedMonth),
  );

  // Filter milk transactions for the selected month to calculate consumption
  const filteredMilkTransactions = milkTransactions.filter((t) =>
    t.date.startsWith(selectedMonth),
  );

  // Calculate milk consumption totals for the month
  const monthlyMilkQty = filteredMilkTransactions.reduce(
    (sum, t) => sum + (t.quantity || 0),
    0,
  );
  const monthlyMilkAmount = filteredMilkTransactions.reduce(
    (sum, t) => sum + (t.amount || 0),
    0,
  );

  // Sort payments by date (descending)
  const sortedPayments = [...filteredPayments].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  // Calculate total paid
  const totalPaid = sortedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Calculate balance
  const balance = monthlyMilkAmount - totalPaid;

  const handleDeleteClick = (payment) => {
    // if (window.confirm(`Delete payment for ${payment.date}?`)) {
    //   onDelete(payment.id);
    // }
    setConfirmData({
      title: "Delete Payment?",
      message: `Delete payment for ${payment.date}?`,
      onConfirm: () => {
        onDelete(payment.id);
        setConfirmData(null);
      },
    });
  };

  const getModeIcon = (mode) => {
    const icons = {
      cash: "💵",
      card: "💳",
      online: "🌐",
      upi: "📱",
      cheque: "✓",
    };
    return icons[mode] || "💰";
  };

  const getModeName = (mode) => {
    const names = {
      cash: "Cash",
      card: "Card",
      online: "Online",
      upi: "UPI",
      cheque: "Cheque",
    };
    return names[mode] || mode;
  };

  return (
    <div className="payment-history-container">
      <ConfirmDialog
        open={!!confirmData}
        title={confirmData?.title}
        message={confirmData?.message}
        onConfirm={confirmData?.onConfirm}
        onCancel={() => setConfirmData(null)}
      />

      {/* MONTH NAVIGATION */}
      <div className="payment-history-nav">
        <button onClick={handlePrevMonth} className="nav-button">
          ←
        </button>

        <h2
          className="payment-history-month-title"
          onClick={() => setShowMonthPicker((s) => !s)}
        >
          {monthName} {year}
        </h2>

        <button onClick={handleNextMonth} className="nav-button">
          →
        </button>

        {/* Month Picker */}
        {showMonthPicker && (
          <div className="payment-history-month-picker">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </div>

      <div className="payment-history-header">
        <div className="monthly-consumption">
          <div className="consumption-card">
            {/* <span className="consumption-label">Summary</span> */}
            <div className="consumption-details">
              <div className="detail-item">
                <span className="detail-label">Qty:</span>
                <span className="detail-value">{monthlyMilkQty} L</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Amount:</span>
                <span className="detail-value">₹{monthlyMilkAmount}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Paid:</span>
                <span className="detail-value">₹{totalPaid}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Outstanding:</span>
                <span
                  className={`detail-value ${balance > 0 ? "pending" : "clear"}`}
                >
                  ₹{balance > 0 ? balance : 0}
                </span>
              </div>
            </div>
          </div>
          <button
            className="btn-add-payment"
            onClick={onAdd}
            title="Add new payment"
          >
            + Add Payment
          </button>
        </div>
      </div>

      {sortedPayments.length === 0 ? (
        <div className="no-transactions">
          <p>No payments recorded for this month</p>
          {monthlyMilkAmount > 0 && (
            <p className="pending">Payment pending: ₹{monthlyMilkAmount}</p>
          )}
        </div>
      ) : (
        <>
          <div className="transactions-list">
            {sortedPayments.map((payment) => (
              <PaymentItem
                key={payment.id}
                payment={payment}
                onEdit={onEdit}
                onDelete={handleDeleteClick}
                getModeIcon={getModeIcon}
                getModeName={getModeName}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentHistory;
