// SAMPLE: App.jsx with Firebase Integration
// This shows the key changes needed - adapt to your existing code

import "./App.css";
import "./styles/main-style.css";
import "./styles/detail-view.css";
import "./styles/buttons.css";
import { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import CustomerCard from "./components/CustomerCard";
import AddCustomerModal from "./components/AddCustomerModal";
import MilkCard from "./components/MilkCard";
import MilkTransactionForm from "./components/MilkTransactionForm";
import MilkCalendarView from "./components/MilkCalendarView";
import PaymentHistory from "./components/PaymentHistory";
import AddPaymentForm from "./components/AddPaymentForm";

// ✅ UPDATED IMPORTS - Use Firebase functions
import {
  subscribeToCustomers,
  subscribeToTransactions,
  subscribeToPayments,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  addPayment,
  updatePayment,
  deletePayment,
  getCustomerWithDetails,
} from "./utils/dataService";

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'detail'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("2026-04");
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionDate, setTransactionDate] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState(null);

  // ✅ LOAD DATA ON COMPONENT MOUNT - Now using real-time listeners
  useEffect(() => {
    // Subscribe to customer updates in real-time
    const unsubscribe = subscribeToCustomers((customersData) => {
      const customersWithDefaults = customersData.map((customer) => ({
        ...customer,
        milkTransactions: customer.milkTransactions || [],
        payments: customer.payments || [],
      }));
      setCustomers(customersWithDefaults);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // ✅ LOAD TRANSACTION DETAILS - Load when customer is selected
  useEffect(() => {
    if (selectedCustomer) {
      const unsubscribeTransactions = subscribeToTransactions(
        selectedCustomer.id,
        (transactions) => {
          setSelectedCustomer((prev) => ({
            ...prev,
            milkTransactions: transactions,
          }));
        }
      );

      const unsubscribePayments = subscribeToPayments(
        selectedCustomer.id,
        (payments) => {
          setSelectedCustomer((prev) => ({
            ...prev,
            payments: payments,
          }));
        }
      );

      return () => {
        unsubscribeTransactions();
        unsubscribePayments();
      };
    }
  }, [selectedCustomer?.id]);

  // ✅ NO NEED TO SAVE MANUALLY - Firebase does it automatically!
  // Remove the old useEffect that saved data

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.customerID || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => setSearchTerm(e.target.value);

  // ✅ UPDATED - Now calls Firebase addCustomer or updateCustomer
  const handleAddCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        // Update existing customer
        await updateCustomer(editingCustomer.id, customerData);
      } else {
        // Add new customer
        await addCustomer(customerData);
      }
      setShowForm(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Failed to save customer. Please try again.");
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(customerId);
        setViewMode("list");
        setSelectedCustomer(null);
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Failed to delete customer. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleCustomerClick = async (customer) => {
    try {
      // ✅ Load full customer details with transactions and payments
      const fullCustomer = await getCustomerWithDetails(customer.id);
      setSelectedCustomer(fullCustomer);
      setViewMode("detail");
    } catch (error) {
      console.error("Error loading customer details:", error);
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedCustomer(null);
  };

  // ✅ UPDATED - Now calls Firebase addTransaction or updateTransaction
  const handleAddTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        // Update existing transaction
        await updateTransaction(
          editingTransaction.id,
          selectedCustomer.id,
          transactionData
        );
      } else {
        // Add new transaction
        await addTransaction(selectedCustomer.id, transactionData);

        // Auto-navigate to the newly added transaction's month
        const transactionMonth = transactionData.date.substring(0, 7);
        setSelectedMonth(transactionMonth);
      }

      setShowTransactionForm(false);
      setEditingTransaction(null);
      setTransactionDate(null);
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Failed to save transaction. Please try again.");
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleCancelTransaction = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
    setTransactionDate(null);
  };

  // ✅ UPDATED - Now calls Firebase deleteTransaction
  const handleDeleteTransaction = async (transaction) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(
          transaction.id,
          selectedCustomer.id,
          transaction
        );
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Failed to delete transaction. Please try again.");
      }
    }
  };

  // Payment handlers - similar pattern
  const handleAddPaymentClick = () => {
    setEditingPaymentIndex(null);
    setShowPaymentForm(true);
  };

  // ✅ UPDATED - Now calls Firebase addPayment
  const handleAddPayment = async (paymentData) => {
    try {
      await addPayment(selectedCustomer.id, paymentData);
      setShowPaymentForm(false);
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Failed to add payment. Please try again.");
    }
  };

  const handleEditPayment = (paymentIndex) => {
    setEditingPaymentIndex(paymentIndex);
    setShowPaymentForm(true);
  };

  // ✅ UPDATED - Now calls Firebase updatePayment
  const handleUpdatePayment = async (paymentData) => {
    try {
      const payment = selectedCustomer.payments[editingPaymentIndex];
      await updatePayment(payment.id, selectedCustomer.id, paymentData);
      setShowPaymentForm(false);
      setEditingPaymentIndex(null);
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment. Please try again.");
    }
  };

  // ✅ UPDATED - Now calls Firebase deletePayment
  const handleDeletePayment = async (paymentIndex) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        const payment = selectedCustomer.payments[paymentIndex];
        await deletePayment(payment.id, selectedCustomer.id, payment);
      } catch (error) {
        console.error("Error deleting payment:", error);
        alert("Failed to delete payment. Please try again.");
      }
    }
  };

  // ... rest of your component code remains the same
  // Just ensure you update the render functions to use the new event handlers

  return (
    <div>
      {/* Your JSX here */}
      <Header />
      {/* ... */}
    </div>
  );
}

export default App;
