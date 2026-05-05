import React from "react";
import "@styles/milk-month-summary.css";

const MilkMonthSummary = ({ transactions }) => {
  const summary = React.useMemo(() => {
    let totalMilk = 0;
    let cowMilk = 0;
    let buffaloMilk = 0;
    let noMilkDays = 0;

    transactions.forEach((tx) => {
      if (tx.quantity === 0) {
        noMilkDays++;
      } else {
        totalMilk += tx.quantity;
        if (tx.milkType === "buffalo") {
          buffaloMilk += tx.quantity;
        } else {
          cowMilk += tx.quantity;
        }
      }
    });

    return { totalMilk, cowMilk, buffaloMilk, noMilkDays };
  }, [transactions]);

  return (
    <div className="milk-month-summary">
      <div className="consumption-card">
        <div className="consumption-details">
          <div className="detail-item">
            <span className="detail-label">Total:</span>
            <span className="detail-value">{summary.totalMilk} L</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">🐄 Cow:</span>
            <span className="detail-value">{summary.cowMilk} L</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">🐃 Buffalo:</span>
            <span className="detail-value">{summary.buffaloMilk} L</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">No Milk Days:</span>
            <span className="detail-value">{summary.noMilkDays}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkMonthSummary;
