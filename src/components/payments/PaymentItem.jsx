import React from "react";
const PaymentItem = ({
  payment,
  onEdit,
  onDelete,
  getModeIcon,
  getModeName,
}) => {
  return (
    <div className="payment-item">
      <div className="payment-date-badge">
        {`${new Date(payment.date).getDate()}${new Date(
          payment.date,
        ).toLocaleString("en-US", { month: "short" })}`}
      </div>

      <div className="payment-details">
        <div className="payment-row payment-row--inline">
          <div className="payment-col">
            {/* <span className="label">Amount:</span> */}
            <span className="value amount">₹{payment.amount}</span>
          </div>

          <div className="payment-col">
            <span className="value mode-badge">
              {/* ({getModeIcon(payment.mode)} {getModeName(payment.mode)}) */}
              {getModeName(payment.mode)}
            </span>
          </div>
        </div>

        {/* {payment.notes && (
          <div className="payment-row">            
            <span className="value notes">{payment.notes}</span>
          </div>
        )} */}
      </div>

      <div className="transaction-actions">
        <button
          className="btn-edit"
          onClick={() => onEdit(payment.id)}
          title="Edit payment"
        >
          ✎
        </button>

        <button
          className="btn-delete"
          onClick={() => onDelete(payment)}
          title="Delete payment"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default React.memo(PaymentItem);
