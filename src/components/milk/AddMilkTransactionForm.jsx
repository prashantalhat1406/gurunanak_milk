import React, { useState, useEffect } from "react";
import "@styles/milk-transaction-form.css";
import MilkSummary from "@components/milk/MilkSummary.jsx";

const MilkTransactionForm = ({
  onSubmit,
  onCancel,
  initialDate = "",
  initialQuantity = "",
  isEditing = false,
}) => {
  const [date, setDate] = useState(initialDate);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isNoMilkDay, setIsNoMilkDay] = useState(initialQuantity === 0);
  const [errors, setErrors] = useState({});

  const MILK_RATE = 50;

  useEffect(() => {
    setDate(initialDate);
    setQuantity(initialQuantity);
    setIsNoMilkDay(initialQuantity === 0);
    setErrors({});
  }, [initialDate, initialQuantity]);

  const handleNoMilkDayChange = (e) => {
    const checked = e.target.checked;
    setIsNoMilkDay(checked);
    if (checked) {
      setQuantity(0);
    } else {
      setQuantity("0.5");
    }
    if (errors.quantity) setErrors({ ...errors, quantity: "" });
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setQuantity(value);
    if (errors.quantity) setErrors({ ...errors, quantity: "" });
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    if (errors.date) setErrors({ ...errors, date: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!date) newErrors.date = "Date is required";

    const qty = isNoMilkDay ? 0 : parseFloat(quantity);
    if (!isNoMilkDay && (!quantity || qty < 0)) {
      newErrors.quantity = "Valid quantity is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const amount = qty * MILK_RATE;
    onSubmit({ date, quantity: qty, rate: MILK_RATE, amount });

    if (!isEditing) {
      setDate("");
      setQuantity("");
      setIsNoMilkDay(false);
    }
    setErrors({});
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const displayQuantity = isNoMilkDay ? 0 : quantity ? parseFloat(quantity) : 0;
  const displayAmount = (displayQuantity * MILK_RATE).toFixed(2);

  return (
    <div
      id="milk-transaction-modal-overlay"
      className="mtf-overlay"
      onClick={onCancel}
    >
      <div
        id="milk-transaction-modal-card"
        className="mtf-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {/* <div className="mtf-header"> */}
        <div className="mtf-title-section">
          <h2 id="mtf-title" className="mtf-title">
            {isEditing ? "Edit Milk" : "Add Milk"}
          </h2>
          <button
            id="mtf-close-btn"
            className="mtf-close-btn"
            onClick={onCancel}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        {/* </div> */}

        {/* Form */}
        <form
          id="milk-transaction-form"
          onSubmit={handleSubmit}
          className="mtf-form"
        >
          {/* Date Field */}
          <div className="mtf-row">
            <div className="mtf-form-group">
              <label htmlFor="mtf-date-input">Date</label>
              <div className="mtf-input-wrapper">
                <input
                  id="mtf-date-input"
                  type="date"
                  className={`mtf-input ${errors.date ? "mtf-input--error" : ""}`}
                  value={date}
                  onChange={handleDateChange}
                />
                {/* <span className="mtf-input-icon">📆</span> */}
              </div>
              {errors.date && (
                <span className="mtf-error-message">{errors.date}</span>
              )}
            </div>
            {!isNoMilkDay && (
              <div className="mtf-form-group">
                <label htmlFor="mtf-quantity-input">Quantity (Ltr)</label>
                <div className="mtf-input-wrapper">
                  <input
                    id="mtf-quantity-input"
                    type="number"
                    min="0"
                    step="0.5"
                    className={`mtf-input ${errors.quantity ? "mtf-input--error" : ""}`}
                    value={quantity}
                    onChange={handleQuantityChange}
                    placeholder="0.5"
                  />
                  {/* <span className="mtf-input-icon">⚖️</span> */}
                </div>
                {errors.quantity && (
                  <span className="mtf-error-message">{errors.quantity}</span>
                )}
              </div>
            )}
          </div>

          {/* No Milk Day Checkbox */}
          <div className="mtf-form-group">
            <label className="mtf-checkbox-group">
              <input
                id="mtf-no-milk-day-checkbox"
                type="checkbox"
                className="mtf-checkbox"
                checked={isNoMilkDay}
                onChange={handleNoMilkDayChange}
              />
              <span className="mtf-checkbox-label">No Milk Day</span>
            </label>
          </div>

          <MilkSummary
            rate={MILK_RATE}
            quantity={displayQuantity}
            amount={displayAmount}
          />

          {/* Actions */}
          <div className="mtf-actions">
            <button
              id="mtf-cancel-btn"
              type="button"
              className="mtf-btn mtf-btn--secondary"
              onClick={onCancel}
            >
              <span>Cancel</span>
            </button>

            <button
              id="mtf-submit-btn"
              type="submit"
              className={`mtf-btn mtf-btn--primary ${isEditing ? "mtf-btn--edit" : ""}`}
            >
              <span>{isEditing ? "Update" : "Add"} Milk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilkTransactionForm;
