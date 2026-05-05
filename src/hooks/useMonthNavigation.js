// src/hooks/useMonthNavigation.js
import { useState, useMemo } from "react";

const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const DEFAULT_MONTHS = [
  "2024-04", "2024-05", "2024-06",
  "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
  "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06",
].map((value) => {
  const [year, monthNum] = value.split("-");
  return { value, label: `${MONTH_NAMES[parseInt(monthNum) - 1]} ${year}` };
});

function formatMonthLabel(value) {
  const [year, monthNum] = value.split("-");
  return { value, label: `${MONTH_NAMES[parseInt(monthNum) - 1]} ${year}` };
}

function getCurrentMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function useMonthNavigation(initialMonth) {
  const defaultMonth = initialMonth || getCurrentMonth();
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const prevMonth = month === 1
      ? `${year - 1}-12`
      : `${year}-${String(month - 1).padStart(2, "0")}`;
    setSelectedMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const nextMonth = month === 12
      ? `${year + 1}-01`
      : `${year}-${String(month + 1).padStart(2, "0")}`;
    setSelectedMonth(nextMonth);
  };

  return {
    selectedMonth,
    setSelectedMonth,
    handlePrevMonth,
    handleNextMonth,
  };
}

// Separate pure utility — derive available months from transaction data
export function useDerivedMonths(customers, selectedCustomer) {
  return useMemo(() => {
    const sources = selectedCustomer ? [selectedCustomer] : customers;
    const allMonths = new Set();

    sources.forEach((customer) => {
      (customer.milkTransactions || []).forEach((tx) => {
        allMonths.add(tx.date.substring(0, 7));
      });
    });

    const monthArray = Array.from(allMonths).sort();
    return monthArray.length === 0
      ? DEFAULT_MONTHS
      : monthArray.map(formatMonthLabel);
  }, [customers, selectedCustomer]);
}
