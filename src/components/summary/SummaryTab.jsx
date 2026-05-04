import React, { useMemo, useState, useEffect } from "react";
import "@styles/summary-tab.css";
import SummaryItem from "@components/summary/SummaryItem.jsx";
import { getHomeDeliveryCharges } from "@utils/dataService";

const SummaryTab = ({ customer }) => {
  const [homeDeliveryCharges, setHomeDeliveryCharges] = useState(0);

  useEffect(() => {
    const loadHomeDeliveryCharges = async () => {
      try {
        const charges = await getHomeDeliveryCharges();
        setHomeDeliveryCharges(charges);
      } catch (err) {
        console.error("Error loading home delivery charges:", err);
      }
    };
    loadHomeDeliveryCharges();
  }, []);

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
          milkTotal: 0,
          homeDeliveryCharges: customer?.homeDelivery ? homeDeliveryCharges : 0,
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
      monthMap[monthKey].milkTotal += tx.amount;
      monthMap[monthKey].totalAmount = monthMap[monthKey].milkTotal + monthMap[monthKey].homeDeliveryCharges;
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
          milkTotal: 0,
          homeDeliveryCharges: customer?.homeDelivery ? homeDeliveryCharges : 0,
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
      (a, b) => new Date(b.month) - new Date(a.month),
    );

    return sorted;
  }, [customer, homeDeliveryCharges]);

  const calculateTotalPending = () => {
    return summaryData.reduce(
      (total, month) => total + (month.totalAmount - month.totalPaid),
      0,
    );
  };

  const formatMonthName = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date
      .toLocaleDateString("en-US", { month: "short", year: "numeric" })
      .toUpperCase();
  };

  const totalPending = calculateTotalPending();

  return (
    <div className="summary-tab-container">
      {/* Total Pending Summary */}
      <div
        className={`summary-pending-box ${totalPending <= 0 ? "advance-mode" : "pending-mode"}`}
      >
        <h3 className="summary-pending-title">
          {totalPending <= 0 ? "Total Advance Amount" : "Total Pending Amount"}
        </h3>
        <p className="summary-pending-amount">
          ₹{Math.abs(totalPending).toFixed(2)}
        </p>
      </div>

      {/* Monthly Summary Table */}
      <div className="summary-table-wrapper">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Cow Milk</th>
              <th>Buffalo Milk</th>
              <th>Milk Total</th>
              {customer?.homeDelivery && <th>Home Delivery</th>}
              <th>Total Amount</th>
              <th>Payment Received</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.length > 0 ? (
              summaryData.map((month) => (
                <SummaryItem
                  key={month.month}
                  month={month}
                  formatMonthName={formatMonthName}
                  hasHomeDelivery={customer?.homeDelivery}
                />
              ))
            ) : (
              <tr>
                <td colSpan={customer?.homeDelivery ? 8 : 7} className="empty-message">
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
