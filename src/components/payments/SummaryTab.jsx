import React, { useMemo } from "react";
import "@styles/summary-tab.css";

const SummaryTab = ({ customer }) => {
  const summaryData = useMemo(() => {
    const transactions = customer?.milkTransactions || [];
    const payments = customer?.payments || [];

    // Group transactions and payments by month
    const monthMap = {};

    // Process transactions
    transactions.forEach((tx) => {
      const monthKey = tx.date.substring(0, 7); // YYYY-MM format
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          month: monthKey,
          cowMilk: 0,
          cowAmount: 0,
          buffaloMilk: 0,
          buffaloAmount: 0,
          totalAmount: 0,
          payments: [],
          totalPaid: 0,
        };
      }

      if (tx.milkType === "buffalo") {
        monthMap[monthKey].buffaloMilk += tx.quantity;
        monthMap[monthKey].buffaloAmount += tx.amount;
      } else {
        monthMap[monthKey].cowMilk += tx.quantity;
        monthMap[monthKey].cowAmount += tx.amount;
      }
      monthMap[monthKey].totalAmount += tx.amount;
    });

    // Process payments
    payments.forEach((payment) => {
      const monthKey = payment.date.substring(0, 7);
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          month: monthKey,
          cowMilk: 0,
          cowAmount: 0,
          buffaloMilk: 0,
          buffaloAmount: 0,
          totalAmount: 0,
          payments: [],
          totalPaid: 0,
        };
      }
      monthMap[monthKey].payments.push(payment);
      monthMap[monthKey].totalPaid += payment.amount;
    });

    // Sort by month descending
    const sorted = Object.values(monthMap).sort(
      (a, b) => new Date(b.month) - new Date(a.month)
    );

    return sorted;
  }, [customer]);

  const calculateTotalPending = () => {
    return summaryData.reduce(
      (total, month) => total + (month.totalAmount - month.totalPaid),
      0
    );
  };

  const formatMonthName = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
  };

  const totalPending = calculateTotalPending();

  return (
    <div className="summary-tab-container">
      {/* Total Pending Summary */}
      <div className={`summary-pending-box ${totalPending <= 0 ? "advance-mode" : "pending-mode"}`}>
        <h3 className="summary-pending-title">
          {totalPending <= 0 ? "Total Advance Amount" : "Total Pending Amount"}
        </h3>
        <p className="summary-pending-amount">₹{Math.abs(totalPending).toFixed(2)}</p>
      </div>

      {/* Monthly Summary Table */}
      <div className="summary-table-wrapper">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Cow Milk</th>
              <th>Buffalo Milk</th>
              <th>Total Amount</th>
              <th>Payment Received</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.length > 0 ? (
              summaryData.map((month) => {
                const pending = month.totalAmount - month.totalPaid;
                return (
                  <tr key={month.month} className={pending > 0 ? "pending-row" : "settled-row"}>
                    <td className="month-cell">{formatMonthName(month.month)}</td>
                    <td>
                      <div className="milk-detail">
                        <span className="milk-badge cow-badge">🐄</span>
                        <span>{month.cowMilk}L</span>
                      </div>
                      <span className="milk-amount">₹{month.cowAmount.toFixed(2)}</span>
                    </td>
                    <td>
                      <div className="milk-detail">
                        <span className="milk-badge buffalo-badge">🐃</span>
                        <span>{month.buffaloMilk}L</span>
                      </div>
                      <span className="milk-amount">₹{month.buffaloAmount.toFixed(2)}</span>
                    </td>
                    <td className="amount-cell">₹{month.totalAmount.toFixed(2)}</td>
                    <td className="payment-cell">
                      {month.totalPaid > 0 ? (
                        <div className="payment-details">
                          <strong>₹{month.totalPaid.toFixed(2)}</strong>
                          {/* {month.payments.length > 0 && (
                            <div className="payment-list">
                              {month.payments.map((payment, idx) => (
                                <div key={idx} className="payment-item">
                                  <span className="payment-date">{payment.date}</span>
                                  <span className="payment-amount">₹{payment.amount}</span>
                                  {payment.method && (
                                    <span className="payment-method">({payment.method})</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )} */}
                        </div>
                      ) : (
                        <span className="no-payment">No payments</span>
                      )}
                    </td>
                    <td className={pending > 0 ? "pending-amount" : "settled-amount"}>
                      ₹{pending.toFixed(2)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="empty-message">
                  No transactions or payments yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTab;
