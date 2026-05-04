// src/views/CustomerDetailView.jsx
import { useState } from "react";
import MilkTransactionForm from "@components/milk/AddMilkTransactionForm";
import MilkCalendarView from "@components/milk/MilkCalendarView";
import PaymentHistory from "@components/payments/PaymentHistory";
import AddPaymentForm from "@components/payments/AddPaymentForm";
import SummaryTab from "@components/summary/SummaryTab";
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
  const [activeTab, setActiveTab] = useState("milk");
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

      {/* Main detail layout with tabs */}
      <div className="detail-view-container">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <div className="tab-group">
            <button
              className={`tab-button ${activeTab === "milk" ? "active" : ""}`}
              onClick={() => setActiveTab("milk")}
            >
              Milk Calendar
            </button>
            <button
              className={`tab-button ${activeTab === "payments" ? "active" : ""}`}
              onClick={() => setActiveTab("payments")}
            >
              Payment History
            </button>
            <button
              className={`tab-button ${activeTab === "summary" ? "active" : ""}`}
              onClick={() => setActiveTab("summary")}
            >
              Summary
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Milk Calendar Tab */}
          {activeTab === "milk" && (
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
          )}

          {/* Payment History Tab */}
          {activeTab === "payments" && (
            <div className="payment-history-section">
              <PaymentHistory
                payments={customer?.payments || []}
                milkTransactions={filteredTransactions}
                onAdd={onAddPaymentClick}
                onEdit={onEditPayment}
                onDelete={onDeletePayment}
              />
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === "summary" && (
            <div className="summary-section">
              <SummaryTab customer={customer} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
