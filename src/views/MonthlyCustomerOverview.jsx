import MonthlyCustomerSummary from "@components/summary/MonthlyCustomerSummary";

export default function MonthlyCustomerOverview({
  customers,
  transactions,
  selectedMonth,
  onPrevMonth,
  onNextMonth,
  onMonthChange,
  onBackToList,
}) {
  return (
    <MonthlyCustomerSummary
      customers={customers}
      transactions={transactions}
      selectedMonth={selectedMonth}
      onPrevMonth={onPrevMonth}
      onNextMonth={onNextMonth}
      onMonthChange={onMonthChange}
      onBackToList={onBackToList}
    />
  );
}
