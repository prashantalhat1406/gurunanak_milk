// src/App.jsx
import "./App.css";
import "./styles/main-style.css";
import "./styles/detail-view.css";
import "./styles/buttons.css";

import { useState } from "react";
import Header from "@components/common/Header";
import CustomerListView from "./views/CustomerListView";
import CustomerDetailView from "./views/CustomerDetailView";

import { useCustomers } from "./hooks/useCustomer";
import { useCustomerDetail } from "./hooks/useCustomerDetail";
import { useMonthNavigation } from "./hooks/useMonthNavigation";

function App() {
  // --- Navigation state ---
  const [viewMode, setViewMode] = useState("list"); // "list" | "detail"
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // --- Search state (simple — no debounce needed, filter is synchronous) ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- Customer form state ---
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // --- Hooks ---
  const { customers, saveCustomer, removeCustomer, fetchCustomerDetails } =
    useCustomers();

  const { selectedMonth, setSelectedMonth, handlePrevMonth, handleNextMonth } =
    useMonthNavigation("2026-04");

  const detail = useCustomerDetail(selectedCustomer, setSelectedMonth);

  // --- Derived data ---
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTransactions =
    detail.customer?.milkTransactions?.filter((tx) =>
      tx.date.startsWith(selectedMonth),
    ) ?? [];

  const monthlyTotal = filteredTransactions.reduce(
    (sum, tx) => sum + (tx.amount || 0),
    0,
  );

  // --- Customer handlers ---
  const handleSubmitCustomer = async (customerData) => {
    try {
      await saveCustomer(customerData, editingCustomer);
      setShowForm(false);
      setEditingCustomer(null);
    } catch {
      alert("Failed to save customer. Please try again.");
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  // const handleDeleteCustomer = async (customerId) => {
  //   if (!window.confirm("Delete this customer and all their records?")) return;
  //   try {
  //     await removeCustomer(customerId);
  //     setViewMode("list");
  //     setSelectedCustomer(null);
  //   } catch {
  //     alert("Failed to delete customer. Please try again.");
  //   }
  // };

  const handleCustomerClick = async (customer) => {
    try {
      const full = await fetchCustomerDetails(customer.id);
      setSelectedCustomer(full);
      setViewMode("detail");
    } catch {
      alert("Failed to load customer details. Please try again.");
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedCustomer(null);
  };

  return (
    <>
      <Header name="GuruNanak" />
      <main className="main-container">
        {viewMode === "list" ? (
          <CustomerListView
            customers={filteredCustomers}
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onClearSearch={() => setSearchTerm("")}
            showForm={showForm}
            editingCustomer={editingCustomer}
            onAddCustomerClick={() => setShowForm(true)}
            onSubmitCustomer={handleSubmitCustomer}
            onCancelCustomer={() => {
              setShowForm(false);
              setEditingCustomer(null);
            }}
            onEditCustomer={handleEditCustomer}
            onCustomerClick={handleCustomerClick}
          />
        ) : (
          <CustomerDetailView
            customer={detail.customer}
            selectedMonth={selectedMonth}
            filteredTransactions={filteredTransactions}
            monthlyTotal={monthlyTotal}
            // Transaction
            showTransactionForm={detail.showTransactionForm}
            editingTransaction={detail.editingTransaction}
            transactionDate={detail.transactionDate}
            onSaveTransaction={detail.handleSaveTransaction}
            onEditTransaction={detail.handleEditTransaction}
            onDeleteTransaction={detail.handleDeleteTransaction}
            onAddTransactionFromCalendar={
              detail.handleAddTransactionFromCalendar
            }
            onCancelTransaction={detail.handleCancelTransaction}
            // Payment
            showPaymentForm={detail.showPaymentForm}
            editingPaymentIndex={detail.editingPaymentIndex}
            onSavePayment={detail.handleSavePayment}
            onEditPayment={detail.handleEditPayment}
            onDeletePayment={detail.handleDeletePayment}
            onAddPaymentClick={detail.handleAddPaymentClick}
            onCancelPayment={detail.handleCancelPayment}
            // Month navigation
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onMonthChange={setSelectedMonth}
            // Navigation
            onBackToList={handleBackToList}
          />
        )}
      </main>
    </>
  );
}

export default App;
