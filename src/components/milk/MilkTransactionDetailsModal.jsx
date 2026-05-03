import React from "react";
import "@styles/transaction-details-modal.css";
import { FiEdit2 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

const TransactionDetailsModal = ({
  date,
  transactions,
  onClose,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const dayName = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalMilk = transactions.reduce((sum, t) => sum + t.quantity, 0);
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="tdm-overlay" onClick={onClose}>
      <div className="tdm-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tdm-header">
          <h3 className="tdm-title">{dayName}</h3>
          <button
            className="tdm-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="tdm-body">
          {/* Summary */}
          <div className="tdm-summary">
            <div>
              Total Milk: <strong>{totalMilk}L</strong>
            </div>
            <div>
              Total Amount: <strong>₹{totalAmount}</strong>
            </div>
          </div>

          {/* Transactions */}
          <div className="tdm-transactions">
            <h4 className="tdm-section-title">Transactions</h4>

            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`tdm-transaction-item tdm-transaction-${transaction.milkType || "cow"}`}
                >
                  <div className="tdm-transaction-info">
                    <div className="tdm-milk-type-badge">
                      {transaction.milkType === "buffalo" ? "🐃 Buffalo" : "🐄 Cow"}
                    </div>
                    {transaction.quantity === 0 ? (
                      <div className="tdm-no-milk">No Milk Day</div>
                    ) : (
                      <div>
                        Qty: {transaction.quantity}L @ ₹{transaction.rate}/L ={" "}
                        <strong>₹{transaction.amount}</strong>
                      </div>
                    )}
                  </div>

                  <div className="tdm-actions-inline">
                    <button
                      className="tdm-btn tdm-btn-edit"
                      onClick={() => onEditTransaction(transaction)}
                    >
                      
                      <FiEdit2 />
                    </button>
                    
                    <button
                      className="tdm-btn tdm-btn-delete"
                      onClick={() => onDeleteTransaction(transaction)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="tdm-empty">No transactions for this day</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="tdm-footer">
          <button className="tdm-btn tdm-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="tdm-btn tdm-btn-primary"
            onClick={onAddTransaction}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
