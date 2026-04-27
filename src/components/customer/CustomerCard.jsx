import React from "react";
import "@styles/customer-card.css";

const CustomerCard = ({
  customerID,
  name,
  mobile,
  totalMilk,
  totalAmount,
  onEdit,
  onClick,
  onAddMilk,
}) => {
  const customerData = { id: customerID, name, mobile, totalMilk, totalAmount };

  return (
    <div
      className={`customer-row-card ${onClick ? "clickable" : ""}`}
      onClick={onClick ? () => onClick(customerData) : undefined}
    >
      <div className="row-top">
        <div className="name">{name}</div>
        <div className="right">
          {/* <span className="amount">₹{totalAmount}</span> */}

          {onAddMilk && (
            <button
              className="add-milk-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAddMilk(customerData);
              }}
              title="Add milk transaction"
            >
              🥛
            </button>
          )}

          {onEdit && (
            <button
              className="edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(customerData);
              }}
            >
              ✏️
            </button>
          )}
        </div>
      </div>

      <div className="row-bottom">
        <span>{mobile}</span>
        {/* <span>ID: {customerID}</span> */}
        {/* <span>{totalMilk}L</span> */}
      </div>
    </div>
  );
};

export default CustomerCard;
