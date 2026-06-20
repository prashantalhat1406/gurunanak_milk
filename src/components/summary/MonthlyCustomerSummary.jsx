import React, { useMemo } from "react";
import "@styles/month-overview.css";
import { getMonthMeta, getDateString } from "../../utils/calandar-utils";

const formatDayCell = (transactions) => {
  const totalQty = transactions.reduce(
    (sum, tx) => sum + (Number(tx.quantity) || 0),
    0,
  );

  const hasNoMilk = transactions.some((tx) => Number(tx.quantity) === 0);
  const cowQty = transactions.reduce(
    (sum, tx) => sum + (tx.milkType === "cow" ? Number(tx.quantity) || 0 : 0),
    0,
  );
  const buffaloQty = transactions.reduce(
    (sum, tx) => sum + (tx.milkType === "buffalo" ? Number(tx.quantity) || 0 : 0),
    0,
  );

  if (totalQty === 0 && hasNoMilk) {
    return {
      topLabel: "No Milk",
      bottomLabel: "",
      cssClass: "no-milk",
    };
  }

  if (totalQty > 0) {
    const typeParts = [];
    if (cowQty > 0) typeParts.push(`${cowQty}C`);
    if (buffaloQty > 0) typeParts.push(`${buffaloQty}B`);

    return {
      topLabel: `${totalQty}L`,
      bottomLabel: typeParts.length > 0 ? typeParts.join("+") : "",
      cssClass: "has-milk",
    };
  }

  return {
    topLabel: "-",
    bottomLabel: "",
    cssClass: "empty-day",
  };
};

const MonthlyCustomerSummary = ({
  customers,
  transactions,
  selectedMonth,
  onPrevMonth,
  onNextMonth,
  onMonthChange,
  onBackToList,
}) => {
  const { year, month, daysInMonth } = getMonthMeta(selectedMonth);
  const dayNumbers = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const transactionsByCustomer = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      const customerId = tx.customerID || tx.customerId || tx.customer?.id || "unknown";
      const dateKey = tx.date;
      if (!acc[customerId]) acc[customerId] = {};
      if (!acc[customerId][dateKey]) acc[customerId][dateKey] = [];
      acc[customerId][dateKey].push(tx);
      return acc;
    }, {});
  }, [transactions]);

  const rows = useMemo(() => {
    return [...customers]
      .sort((a, b) => {
        const idA = String(a.customerID || a.id || "");
        const idB = String(b.customerID || b.id || "");
        return idA.localeCompare(idB, undefined, { numeric: true });
      })
      .map((customer) => {
        let totalQty = 0;
        const cells = dayNumbers.map((day) => {
          const dateKey = getDateString(year, month, day);
          const transactionsForDate = (transactionsByCustomer[customer.id] || {})[dateKey] || [];
          const { topLabel, bottomLabel, cssClass } = formatDayCell(transactionsForDate);
          totalQty += transactionsForDate.reduce(
            (sum, tx) => sum + (Number(tx.quantity) || 0),
            0,
          );
          return { dateKey, topLabel, bottomLabel, cssClass };
        });

        return {
          customer,
          totalQty,
          cells,
        };
      });
  }, [customers, dayNumbers, month, transactionsByCustomer, year]);

  const totalLiters = rows.reduce((sum, row) => sum + row.totalQty, 0);

  return (
    <div className="month-overview-container">
      <div className="month-overview-header-row">
        <div>
          <button className="btn-secondary" onClick={onBackToList}>
            ← Back to Customers
          </button>
        </div>
        <div className="month-overview-title-group">
          <h2>Monthly Customer Summary</h2>
          <p>
            {rows.length} customer{rows.length !== 1 ? "s" : ""} — {totalLiters} L
            in {selectedMonth}
          </p>
        </div>
      </div>

      <div className="month-overview-nav-bar">
        <button className="nav-button" onClick={onPrevMonth}>
          ←
        </button>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="month-input"
        />
        <button className="nav-button" onClick={onNextMonth}>
          →
        </button>
      </div>

      <div className="month-overview-table-scroll">
        <table className="month-overview-table">
          <thead>
            <tr>
              <th className="sticky-col left-col">#</th>
              <th className="sticky-col second-col">Customer Name</th>
              {dayNumbers.map((day) => (
                <th key={day}>{day}</th>
              ))}
              <th className="total-col">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={dayNumbers.length + 3} className="empty-state">
                  No customers available for this view.
                </td>
              </tr>
            ) : (
              rows.map(({ customer, cells, totalQty }) => (
                <tr key={customer.id || customer.customerID}>
                  <td className="sticky-col left-col">{customer.customerID || customer.id}</td>
                  <td className="sticky-col second-col">{customer.name}</td>
                  {cells.map(({ dateKey, topLabel, bottomLabel, cssClass }) => (
                    <td key={dateKey} className={cssClass}>
                      <div className="day-cell-line top">{topLabel}</div>
                      <div className="day-cell-line bottom">{bottomLabel}</div>
                    </td>
                  ))}
                  <td className="total-col">{totalQty} L</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyCustomerSummary;
