import React, { useState } from "react";
import "@styles/payment-history.css";
import ConfirmDialog from "@components/modals/ConfirmDialog";
import PaymentItem from "@components/payments/PaymentItem.jsx";

const PaymentHistory = ({
  payments,
  milkTransactions,
  selectedMonth,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [confirmData, setConfirmData] = useState(null);
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
      <div className="payment-history-header">
        <h3>Payment History</h3>
        <button
          className="btn-add-payment"
          onClick={onAdd}
          title="Add new payment"
        >
          + Add Payment
        </button>
      </div>

      <div className="monthly-consumption">
        <div className="consumption-card">
          <span className="consumption-label">Summary</span>
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
