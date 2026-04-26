// src/views/CustomerDetailView.jsx
import MilkTransactionForm from "@components/MilkTransactionForm";
import MilkCalendarView from "@components/MilkCalendarView";
import PaymentHistory from "@components/payments/PaymentHistory";
import AddPaymentForm from "@components/payments/AddPaymentForm";
import styles from "../App.module.css";

export default function CustomerDetailView({
  customer,
  selectedMonth,
  filteredTransactions,
  monthlyTotal,
  // Transaction
  showTransactionForm,
  editingTransaction,
  transactionDate,
  onSaveTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onAddTransactionFromCalendar,
  onCancelTransaction,
  // Payment
  showPaymentForm,
  editingPaymentIndex,
  onSavePayment,
  onEditPayment,
  onDeletePayment,
  onAddPaymentClick,
  onCancelPayment,
  // Month navigation
  onPrevMonth,
  onNextMonth,
  onMonthChange,
  // Navigation
  onBackToList,
}) {
  return (
    <>
      {/* Detail header */}
      <div className={styles.detailHeader}>
        <button onClick={onBackToList} className="back-button">
          &larr; Back to Customers
        </button>
        <h2 className={styles.customerName}>{customer?.name}</h2>
      </div>

      {/* Inline forms (conditionally rendered) */}
      {(showTransactionForm || editingTransaction) && (
        <MilkTransactionForm
          onSubmit={onSaveTransaction}
          onCancel={onCancelTransaction}
          initialDate={transactionDate || editingTransaction?.date || ""}
          initialQuantity={editingTransaction?.quantity || ""}
          isEditing={!!editingTransaction}
        />
      )}

      {showPaymentForm && (
        <AddPaymentForm
          selectedMonth={selectedMonth}
          monthlyTotal={monthlyTotal}
          onSubmit={onSavePayment}
          onCancel={onCancelPayment}
          isEditing={editingPaymentIndex !== null}
          initialData={
            editingPaymentIndex !== null
              ? customer?.payments?.[editingPaymentIndex]
              : null
          }
        />
      )}

      {/* Main detail layout */}
      <div className="detail-view-container">
        <div className="calendar-section">
          <MilkCalendarView
            transactions={filteredTransactions}
            selectedMonth={selectedMonth}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            onMonthChange={onMonthChange}
            onAddTransaction={onAddTransactionFromCalendar}
            onEditTransaction={onEditTransaction}
            onDeleteTransaction={onDeleteTransaction}
          />
        </div>

        <div className="payment-history-section">
          <PaymentHistory
            payments={customer?.payments || []}
            milkTransactions={filteredTransactions}
            selectedMonth={selectedMonth}
            onAdd={onAddPaymentClick}
            onEdit={onEditPayment}
            onDelete={onDeletePayment}
          />
        </div>
      </div>
    </>
  );
}