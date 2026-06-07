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
  const [editingPaymentId, setEditingPaymentId] = useState(null);

  // --- Confirmation dialog state ---
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null, // 'transaction' or 'payment'
    itemId: null,
    item: null,
    title: "",
    message: "",
  });

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
    try {
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
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction. Please try again.');
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = (transaction) => {
    setConfirmDialog({
      open: true,
      type: 'transaction',
      itemId: transaction.id,
      item: transaction,
      title: "Delete Transaction",
      message: "Are you sure you want to delete this transaction?",
    });
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
    try {
      if (editingPaymentId !== null) {
        await updatePayment(editingPaymentId, localCustomer.id, paymentData);
      } else {
        await addPayment(localCustomer.id, paymentData);
      }
      setShowPaymentForm(false);
      setEditingPaymentId(null);
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Failed to save payment. Please try again.');
    }
  };

  const handleEditPayment = (paymentId) => {
    setEditingPaymentId(paymentId);
    setShowPaymentForm(true);
  };

  const handleDeletePayment = (paymentId) => {
    const payment = localCustomer.payments.find((p) => p.id === paymentId);
    setConfirmDialog({
      open: true,
      type: 'payment',
      itemId: paymentId,
      item: payment,
      title: "Delete Payment",
      message: "Are you sure you want to delete this payment?",
    });
  };

  const handleAddPaymentClick = () => {
    setEditingPaymentId(null);
    setShowPaymentForm(true);
  };

  const handleCancelPayment = () => {
    setShowPaymentForm(false);
    setEditingPaymentId(null);
  };

  // --- Confirmation dialog handlers ---
  const handleConfirmDelete = async () => {
    try {
      if (confirmDialog.type === 'transaction' && confirmDialog.item) {
        await deleteTransaction(confirmDialog.itemId, localCustomer.id, confirmDialog.item);
      } else if (confirmDialog.type === 'payment' && confirmDialog.item) {
        await deletePayment(confirmDialog.itemId, localCustomer.id, confirmDialog.item);
      }
      setConfirmDialog({ open: false, type: null, itemId: null, item: null, title: "", message: "" });
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete. Please try again.');
      setConfirmDialog({ open: false, type: null, itemId: null, item: null, title: "", message: "" });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ open: false, type: null, itemId: null, item: null, title: "", message: "" });
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
    editingPaymentId,
    handleSavePayment,
    handleEditPayment,
    handleDeletePayment,
    handleAddPaymentClick,
    handleCancelPayment,
    // Confirmation Dialog
    confirmDialog,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
