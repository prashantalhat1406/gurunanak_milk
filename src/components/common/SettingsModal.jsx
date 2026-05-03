import React, { useState, useEffect } from "react";
import "@styles/settings-modal.css";
import { getMilkRate, updateMilkRate } from "@utils/dataService";

const SettingsModal = ({ onClose }) => {
  const [rates, setRates] = useState({ cow: 82, buffalo: 95 });
  const [tempRates, setTempRates] = useState({ cow: 82, buffalo: 95 });
  const [selectedType, setSelectedType] = useState("cow");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const rates = await getMilkRate();
        setRates(rates);
        setTempRates(rates);
      } catch (err) {
        setError("Failed to load milk rates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const handleSave = async () => {
    const currentRate = tempRates[selectedType];
    
    if (!currentRate || currentRate <= 0) {
      setError(`Please enter a valid ${selectedType} milk rate`);
      return;
    }

    try {
      setError("");
      setSuccess("");
      await updateMilkRate(selectedType, currentRate);
      setRates(tempRates);
      setSuccess(`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} milk rate updated successfully!`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(`Failed to update ${selectedType} milk rate`);
      console.error(err);
    }
  };

  const handleCancel = () => {
    setTempRates(rates);
    setError("");
    setSuccess("");
  };

  const handleRateChange = (type, value) => {
    setTempRates({
      ...tempRates,
      [type]: parseFloat(value) || 0,
    });
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
              {/* Milk Type Selection */}
              <div className="settings-section">
                <label>Select Milk Type</label>
                <div className="milk-type-selector">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="milkType"
                      value="cow"
                      checked={selectedType === "cow"}
                      onChange={(e) => setSelectedType(e.target.value)}
                    />
                    <span>Cow Milk</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="milkType"
                      value="buffalo"
                      checked={selectedType === "buffalo"}
                      onChange={(e) => setSelectedType(e.target.value)}
                    />
                    <span>Buffalo Milk</span>
                  </label>
                </div>
              </div>

              {/* Rate Input */}
              <div className="settings-section">
                <label htmlFor="milk-rate-input">
                  {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Milk Rate (₹/Liter)
                </label>
                <input
                  id="milk-rate-input"
                  type="number"
                  className="settings-input"
                  value={tempRates[selectedType]}
                  onChange={(e) => handleRateChange(selectedType, e.target.value)}
                  step="0.50"
                  min="0"
                />
                <p className="settings-description">
                  Current {selectedType} rate: ₹{rates[selectedType]}/L
                </p>
              </div>

              {/* Rate Summary */}
              <div className="settings-section settings-summary">
                <p className="summary-title">Current Rates:</p>
                <p className="summary-item">
                  <strong>Cow:</strong> ₹{rates.cow}/L
                </p>
                <p className="summary-item">
                  <strong>Buffalo:</strong> ₹{rates.buffalo}/L
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
            disabled={loading || tempRates[selectedType] === rates[selectedType]}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
