// src/App.jsx
import "./App.css";
import "@styles/main-style.css";
import "@styles/customer-detail-view.css";
import "@styles/buttons.css";

import { useState } from "react";
import Header from "@components/common/Header";
import CustomerListView from "./views/CustomerListView";
import CustomerDetailView from "./views/CustomerDetailView";
import SettingsModal from "@components/common/SettingsModal";

import { useCustomers } from "./hooks/useCustomer";
import { useCustomerDetail } from "./hooks/useCustomerDetail";
import { useMonthNavigation } from "./hooks/useMonthNavigation";
import { addTransaction } from "./utils/dataService";

function App() {
  // --- Navigation state ---
  const [viewMode, setViewMode] = useState("list"); // "list" | "detail"
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // --- Search state (simple — no debounce needed, filter is synchronous) ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- Customer form state ---
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // --- Quick milk form state ---
  const [showQuickMilkForm, setShowQuickMilkForm] = useState(false);
  const [quickMilkCustomer, setQuickMilkCustomer] = useState(null);

  // --- Settings state ---
  const [showSettings, setShowSettings] = useState(false);

  // --- Hooks ---
  const { customers, saveCustomer, removeCustomer, fetchCustomerDetails } =
    useCustomers();

  const { selectedMonth, setSelectedMonth, handlePrevMonth, handleNextMonth } =
    useMonthNavigation();

  const detail = useCustomerDetail(selectedCustomer, setSelectedMonth);

  // --- Derived data ---
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerID?.toString().includes(searchTerm) ||
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
      // Reset to current month when opening detail view
      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
      setSelectedMonth(currentMonth);
    } catch {
      alert("Failed to load customer details. Please try again.");
    }
  };

  const handleQuickAddMilk = (customer) => {
    setQuickMilkCustomer(customer);
    setShowQuickMilkForm(true);
  };

  const handleQuickMilkSubmit = async (transactionData) => {
    if (!quickMilkCustomer) return;
    try {
      await addTransaction(quickMilkCustomer.id, transactionData);
      setShowQuickMilkForm(false);
      setQuickMilkCustomer(null);
    } catch {
      alert("Failed to add milk transaction. Please try again.");
    }
  };

  const handleQuickMilkCancel = () => {
    setShowQuickMilkForm(false);
    setQuickMilkCustomer(null);
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedCustomer(null);
  };

  return (
    <>
      <Header name="GuruNanak" onSettingsClick={() => setShowSettings(true)} />
      
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
      
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
            onAddMilk={handleQuickAddMilk}
            showQuickMilkForm={showQuickMilkForm}
            quickMilkCustomer={quickMilkCustomer}
            onQuickMilkSubmit={handleQuickMilkSubmit}
            onQuickMilkCancel={handleQuickMilkCancel}
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
            editingPaymentId={detail.editingPaymentId}
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
