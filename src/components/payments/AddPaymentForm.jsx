import React, { useState } from "react";
import "@styles/add-payment-form.css";

const AddPaymentForm = ({
  selectedMonth,
  monthlyTotal,
  onSubmit,
  onCancel,
  isEditing,
  initialData,
}) => {
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split("T")[0],
  );
  const [amount, setAmount] = useState(initialData?.amount || "");
  const [mode, setMode] = useState(initialData?.mode || "cash");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState("");

  // Get the first and last day of the month for validation
  const [year, month] = selectedMonth.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1).toISOString().split("T")[0];
  const lastDay = new Date(year, month, 0).toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!date || !amount || !mode) {
      setError("Please fill in all required fields");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Amount must be a valid positive number");
      return;
    }

    if (amountNum > monthlyTotal) {
      const response = window.confirm(
        `Warning: Payment amount (₹${amountNum}) exceeds monthly consumption total (₹${monthlyTotal}). Continue?`,
      );
      if (!response) return;
    }

    const paymentData = {
      date,
      amount: amountNum,
      mode,
      notes: notes.trim() || "",
    };

    onSubmit(paymentData);
    resetForm();
  };

  const resetForm = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setAmount("");
    setMode("cash");
    setNotes("");
    setError("");
  };

  const paymentModes = [
    { value: "cash", icon: "💵", label: "Cash" },
    { value: "card", icon: "💳", label: "Card" },
    { value: "upi", icon: "📱", label: "UPI" },
    { value: "online", icon: "🌐", label: "Online" },
  ];

  return (
    <div className="add-payment-modal">
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-content payment-form">
        <div className="modal-header">
          <h2>{isEditing ? "Edit Payment" : "Add Payment"}</h2>
          <button className="close-btn" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="form-info">
          <p>
            Month:{" "}
            <strong>
              {new Date(year, month - 1).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </strong>
          </p>
          <p>
            Monthly Milk Total: <strong>₹{monthlyTotal}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">
                Payment Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={firstDay}
                max={lastDay}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">
                Amount (₹) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                step="10.00"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Payment Mode <span className="required">*</span>
            </label>

            <div className="radio-group">
              {paymentModes.map((option) => (
                <label
                  key={option.value}
                  className={`radio-card ${mode === option.value ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={option.value}
                    checked={mode === option.value}
                    onChange={(e) => setMode(e.target.value)}
                  />

                  <span className="radio-content">
                    <span className="radio-icon">{option.icon}</span>
                    <span className="radio-text">{option.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or reference number..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? "Update Payment" : "Add Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentForm;
