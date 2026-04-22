import React from "react";
import "../styles/customer-card.css";

const CustomerCard = ({
  customerID,
  name,
  mobile,
  totalMilk,
  totalAmount,
  onEdit,
  onClick,
}) => {
  return (
    <div
      className={`customer-row-card ${onClick ? "clickable" : ""}`}
      onClick={
        onClick
          ? () => onClick({ customerID, name, mobile, totalMilk, totalAmount })
          : undefined
      }
    >
      <div className="row-top">
        <div className="name">{name}</div>
        <div className="right">
          {/* <span className="amount">₹{totalAmount}</span> */}

          {onEdit && (
            <button
              className="edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEdit({ customerID, name, mobile, totalMilk, totalAmount });
              }}
            >
              ✏️
            </button>
          )}
        </div>
      </div>

      <div className="row-bottom">
        <span>{mobile}</span>
        {/* <span>ID: {customerID}</span>
    <span>{totalMilk}L</span> */}
      </div>
    </div>
  );
};

export default CustomerCard;
