import React from "react";

const SummaryItem = ({ month, formatMonthName, hasHomeDelivery }) => {
  const pending = month.totalAmount - month.totalPaid;

  return (
    <tr className={pending > 0 ? "pending-row" : "settled-row"}>
      <td className="month-cell">{formatMonthName(month.month)}</td>

      <td>
        <div className="milk-detail">
          <span className="milk-quantity">{month.cowMilk}L</span>
          <span className="milk-amount">₹{month.cowAmount.toFixed(2)}</span>
        </div>
      </td>

      <td>
        <div className="milk-detail">
          <span className="milk-quantity">{month.buffaloMilk}L</span>
          <span className="milk-amount">₹{month.buffaloAmount.toFixed(2)}</span>
        </div>
      </td>

      <td className="amount-cell">₹{month.milkTotal.toFixed(2)}</td>

      {hasHomeDelivery && (
        <td className="amount-cell">₹{month.homeDeliveryCharges.toFixed(2)}</td>
      )}

      <td className="amount-cell">₹{month.totalAmount.toFixed(2)}</td>

      <td className="payment-cell">
        {month.totalPaid > 0 ? (
          <div className="payment-details">
            <strong>₹{month.totalPaid.toFixed(2)}</strong>
          </div>
        ) : (
          <span className="no-payment">No payments</span>
        )}
      </td>

      <td className={pending > 0 ? "pending-amount" : "settled-amount"}>
        ₹{pending.toFixed(2)}
      </td>
    </tr>
  );
};

export default SummaryItem;