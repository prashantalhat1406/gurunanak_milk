// src/hooks/useCustomerDetail.js
import { useState, useEffect } from "react";
import {
  subscribeToTransactions,
  subscribeToPayments,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  addPayment,
  updatePayment,
  deletePayment,
} from "../utils/dataService";

export function useCustomerDetail(selectedCustomer, onMonthChange) {
  // --- Transaction state ---
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction]   = useState(null);
  const [transactionDate, setTransactionDate]         = useState(null);

  // --- Payment state ---
  const [showPaymentForm, setShowPaymentForm]       = useState(false);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState(null);

  // Real-time subscriptions for selected customer
  const [localCustomer, setLocalCustomer] = useState(selectedCustomer);

  useEffect(() => {
    setLocalCustomer(selectedCustomer);
  }, [selectedCustomer]);

  useEffect(() => {
    if (!selectedCustomer?.id) return;

    const unsubTx = subscribeToTransactions(selectedCustomer.id, (transactions) => {
      setLocalCustomer((prev) => ({ ...prev, milkTransactions: transactions }));
    });

    const unsubPay = subscribeToPayments(selectedCustomer.id, (payments) => {
      setLocalCustomer((prev) => ({ ...prev, payments }));
    });

    return () => {
      unsubTx();
      unsubPay();
    };
  }, [selectedCustomer?.id]);

  // --- Transaction handlers ---
  const handleSaveTransaction = async (transactionData) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, localCustomer.id, transactionData);
    } else {
      await addTransaction(localCustomer.id, transactionData);
      // Auto-navigate to the new transaction's month
      onMonthChange(transactionData.date.substring(0, 7));
    }
    setShowTransactionForm(false);
    setEditingTransaction(null);
    setTransactionDate(null);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = async (transaction) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    await deleteTransaction(transaction.id, localCustomer.id, transaction);
  };

  const handleAddTransactionFromCalendar = (dateStr) => {
    setTransactionDate(dateStr);
    setShowTransactionForm(true);
  };

  const handleCancelTransaction = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
    setTransactionDate(null);
  };

  // --- Payment handlers ---
  const handleSavePayment = async (paymentData) => {
    if (editingPaymentIndex !== null) {
      const payment = localCustomer.payments[editingPaymentIndex];
      await updatePayment(payment.id, localCustomer.id, paymentData);
    } else {
      await addPayment(localCustomer.id, paymentData);
    }
    setShowPaymentForm(false);
    setEditingPaymentIndex(null);
  };

  const handleEditPayment = (index) => {
    setEditingPaymentIndex(index);
    setShowPaymentForm(true);
  };

  const handleDeletePayment = async (index) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    const payment = localCustomer.payments[index];
    await deletePayment(payment.id, localCustomer.id, payment);
  };

  const handleAddPaymentClick = () => {
    setEditingPaymentIndex(null);
    setShowPaymentForm(true);
  };

  const handleCancelPayment = () => {
    setShowPaymentForm(false);
    setEditingPaymentIndex(null);
  };

  return {
    customer: localCustomer,
    // Transaction
    showTransactionForm,
    editingTransaction,
    transactionDate,
    handleSaveTransaction,
    handleEditTransaction,
    handleDeleteTransaction,
    handleAddTransactionFromCalendar,
    handleCancelTransaction,
    // Payment
    showPaymentForm,
    editingPaymentIndex,
    handleSavePayment,
    handleEditPayment,
    handleDeletePayment,
    handleAddPaymentClick,
    handleCancelPayment,
  };
}
