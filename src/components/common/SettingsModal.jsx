import React, { useState, useEffect } from "react";
import "@styles/settings-modal.css";
import { getMilkRate, updateMilkRate } from "@utils/dataService";

const SettingsModal = ({ onClose }) => {
  const [milkRate, setMilkRate] = useState(82);
  const [tempRate, setTempRate] = useState(82);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const rate = await getMilkRate();
        setMilkRate(rate);
        setTempRate(rate);
      } catch (err) {
        setError("Failed to load milk rate");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, []);

  const handleSave = async () => {
    if (!tempRate || tempRate <= 0) {
      setError("Please enter a valid milk rate");
      return;
    }

    try {
      setError("");
      setSuccess("");
      await updateMilkRate(tempRate);
      setMilkRate(tempRate);
      setSuccess("Milk rate updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError("Failed to update milk rate");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setTempRate(milkRate);
    setError("");
    setSuccess("");
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-content">
          {loading ? (
            <p>Loading settings...</p>
          ) : (
            <>
              <div className="settings-section">
                <label htmlFor="milk-rate-input">Milk Rate (₹/Liter)</label>
                <input
                  id="milk-rate-input"
                  type="number"
                  className="settings-input"
                  value={tempRate}
                  onChange={(e) => setTempRate(parseFloat(e.target.value) || 0)}
                  step="0.50"
                  min="0"
                />
                <p className="settings-description">
                  Current rate: ₹{milkRate}/L
                </p>
              </div>

              {error && <div className="settings-error">{error}</div>}
              {success && <div className="settings-success">{success}</div>}
            </>
          )}
        </div>

        <div className="settings-footer">
          <button
            className="settings-btn settings-btn-cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="settings-btn settings-btn-save"
            onClick={handleSave}
            disabled={loading || tempRate === milkRate}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
