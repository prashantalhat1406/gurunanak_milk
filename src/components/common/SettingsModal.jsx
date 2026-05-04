import React, { useState, useEffect } from "react";
import "@styles/settings-modal.css";
import { getMilkRate, updateMilkRate, getHomeDeliveryCharges, updateHomeDeliveryCharges } from "@utils/dataService";

const SettingsModal = ({ onClose }) => {
  const [rates, setRates] = useState({ cow: 82, buffalo: 95 });
  const [tempRates, setTempRates] = useState({ cow: 82, buffalo: 95 });
  const [homeDeliveryCharges, setHomeDeliveryCharges] = useState(0);
  const [tempHomeDeliveryCharges, setTempHomeDeliveryCharges] = useState(0);
  const [selectedType, setSelectedType] = useState("cow");
  const [settingsTab, setSettingsTab] = useState("milk"); // "milk" or "delivery"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const rates = await getMilkRate();
        const charges = await getHomeDeliveryCharges();
        setRates(rates);
        setTempRates(rates);
        setHomeDeliveryCharges(charges);
        setTempHomeDeliveryCharges(charges);
      } catch (err) {
        setError("Failed to load settings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (settingsTab === "milk") {
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
    } else if (settingsTab === "delivery") {
      if (tempHomeDeliveryCharges < 0) {
        setError("Home delivery charges cannot be negative");
        return;
      }

      try {
        setError("");
        setSuccess("");
        await updateHomeDeliveryCharges(tempHomeDeliveryCharges);
        setHomeDeliveryCharges(tempHomeDeliveryCharges);
        setSuccess("Home delivery charges updated successfully!");
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (err) {
        setError("Failed to update home delivery charges");
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setTempRates(rates);
    setTempHomeDeliveryCharges(homeDeliveryCharges);
    setError("");
    setSuccess("");
    onClose();
  };

  const handleRateChange = (type, value) => {
    setTempRates({
      ...tempRates,
      [type]: parseFloat(value) || 0,
    });
  };

  const handleHomeDeliveryChange = (value) => {
    setTempHomeDeliveryCharges(parseFloat(value) || 0);
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

        {/* Settings Tabs */}
        <div className="settings-tabs">
          <button 
            className={`settings-tab ${settingsTab === "milk" ? "active" : ""}`}
            onClick={() => setSettingsTab("milk")}
          >
            🥛 Milk Rates
          </button>
          <button 
            className={`settings-tab ${settingsTab === "delivery" ? "active" : ""}`}
            onClick={() => setSettingsTab("delivery")}
          >
            🏠 Home Delivery
          </button>
        </div>

        <div className="settings-content">
          {loading ? (
            <p>Loading settings...</p>
          ) : (
            <>
              {/* MILK RATES TAB */}
              {settingsTab === "milk" && (
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
                </>
              )}

              {/* HOME DELIVERY TAB */}
              {settingsTab === "delivery" && (
                <>
                  <div className="settings-section">
                    <label htmlFor="home-delivery-input">
                      Home Delivery Charges (₹/Month)
                    </label>
                    <input
                      id="home-delivery-input"
                      type="number"
                      className="settings-input"
                      value={tempHomeDeliveryCharges}
                      onChange={(e) => handleHomeDeliveryChange(e.target.value)}
                      step="10"
                      min="0"
                      placeholder="Enter delivery charges"
                    />
                  </div>

                  {/* Delivery Summary */}
                  <div className="settings-section settings-summary">
                    <p className="summary-title">Current Charges:</p>
                    <p className="summary-item">
                      <strong>Home Delivery:</strong> ₹{homeDeliveryCharges}/Month
                    </p>
                  </div>
                </>
              )}

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
            disabled={
              loading || 
              (settingsTab === "milk" && tempRates[selectedType] === rates[selectedType]) ||
              (settingsTab === "delivery" && tempHomeDeliveryCharges === homeDeliveryCharges)
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
