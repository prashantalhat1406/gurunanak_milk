import React, { useState, useEffect } from "react";
import "../styles/add-customer-modal.css";

const AddCustomerModal = ({
  onSubmit,
  onCancel,
  initialName = "",
  initialPhone = "",
  isEditing = false,
}) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);

  useEffect(() => {
    setName(initialName);
    setPhone(initialPhone);
  }, [initialName, initialPhone]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      onSubmit({ name: name.trim(), mobile: phone.trim() });
      if (!isEditing) {
        setName("");
        setPhone("");
      }
    }
  };

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("91")) {
      digits = digits.slice(2);
    }

    digits = digits.slice(0, 10);

    if (digits.length <= 5) return digits;
    return digits.replace(/(\d{5})(\d{0,5})/, "$1 $2");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👤 {isEditing ? "Edit Customer" : "Add Customer"}</h2>
          <button className="close-btn" onClick={onCancel}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="floating-field">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Name</label>
          </div>

          <div className="floating-field">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              required
            />
            <label>Phone</label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onCancel}>
              Cancel
            </button>

            <button type="submit" className="btn primary">
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
