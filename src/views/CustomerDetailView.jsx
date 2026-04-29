// src/views/CustomerDetailView.jsx
import MilkTransactionForm from "@components/milk/AddMilkTransactionForm";
import MilkCalendarView from "@components/milk/MilkCalendarView";
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
  editingPaymentId,
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
        <h2 className={styles.customerName}>{customer?.name} </h2>
        <h3 className={styles.customerName}>({customer?.mobile})</h3>
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
          isEditing={editingPaymentId !== null}
          initialData={
            editingPaymentId !== null
              ? customer?.payments?.find((p) => p.id === editingPaymentId)
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