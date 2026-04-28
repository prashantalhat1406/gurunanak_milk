// dataService.js
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  setDoc,
  writeBatch,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ==================== CUSTOMERS ====================

/**
 * Load all customers from Firestore
 */
export const loadCustomers = async () => {
  try {
    const customersCollection = collection(db, 'customers');
    const snapshot = await getDocs(customersCollection);
    const customers = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return customers;
  } catch (error) {
    console.error('Error loading customers:', error);
    return [];
  }
};

/**
 * Real-time listener for customers
 */
export const subscribeToCustomers = (callback) => {
  const customersCollection = collection(db, 'customers');
  const unsubscribe = onSnapshot(
    customersCollection,
    (snapshot) => {
      const customers = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      callback(customers);
    },
    (error) => {
      console.error('Error subscribing to customers:', error);
    }
  );
  return unsubscribe;
};

/**
 * Add a new customer
 */
export const addCustomer = async (customerData) => {
  try {
    // Generate sequential customer ID
    const customerID = await generateCustomerID();
    
    const newCustomer = {
      ...customerData,
      customerID: customerID,
      totalMilk: 0,
      totalAmount: 0,
      totalPaid: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, 'customers'), newCustomer);
    return { ...newCustomer, id: docRef.id };
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

/**
 * Update an existing customer
 */
export const updateCustomer = async (customerId, customerData) => {
  try {
    const customerRef = doc(db, 'customers', customerId);
    await updateDoc(customerRef, {
      ...customerData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

/**
 * Delete a customer and all their transactions/payments
 */
export const deleteCustomer = async (customerId) => {
  try {
    const batch = writeBatch(db);

    // Delete all transactions
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('customerID', '==', customerId)
    );
    const transactionDocs = await getDocs(transactionsQuery);
    transactionDocs.docs.forEach((doc) => batch.delete(doc.ref));

    // Delete all payments
    const paymentsQuery = query(
      collection(db, 'payments'),
      where('customerID', '==', customerId)
    );
    const paymentDocs = await getDocs(paymentsQuery);
    paymentDocs.docs.forEach((doc) => batch.delete(doc.ref));

    // Delete customer
    batch.delete(doc(db, 'customers', customerId));

    await batch.commit();
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// ==================== TRANSACTIONS ====================

/**
 * Load all milk transactions for a customer
 */
export const loadTransactions = async (customerId) => {
  try {
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('customerID', '==', customerId)
    );
    const snapshot = await getDocs(transactionsQuery);
    const transactions = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return transactions;
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

/**
 * Real-time listener for transactions of a customer
 */
export const subscribeToTransactions = (customerId, callback) => {
  const transactionsQuery = query(
    collection(db, 'transactions'),
    where('customerID', '==', customerId)
  );
  const unsubscribe = onSnapshot(
    transactionsQuery,
    (snapshot) => {
      const transactions = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      callback(transactions);
    },
    (error) => {
      console.error('Error subscribing to transactions:', error);
    }
  );
  return unsubscribe;
};

/**
 * Add a new milk transaction
 */
export const addTransaction = async (customerId, transactionData) => {
  try {
    const newTransaction = {
      customerID: customerId,
      ...transactionData,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'transactions'), newTransaction);

    // Update customer's total stats
    await updateDoc(doc(db, 'customers', customerId), {
      totalMilk: increment(transactionData.quantity || 0),
      totalAmount: increment(transactionData.amount || 0),
      updatedAt: Timestamp.now(),
    });

    return { ...newTransaction, id: docRef.id };
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

/**
 * Update an existing transaction
 */
export const updateTransaction = async (transactionId, customerId, transactionData) => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId);
    const oldTransaction = await getDoc(transactionRef);
    const oldData = oldTransaction.data();

    await updateDoc(transactionRef, {
      ...transactionData,
      updatedAt: Timestamp.now(),
    });

    // Update customer's total stats
    const quantityDiff = (transactionData.quantity || 0) - (oldData.quantity || 0);
    const amountDiff = (transactionData.amount || 0) - (oldData.amount || 0);

    await updateDoc(doc(db, 'customers', customerId), {
      totalMilk: increment(quantityDiff),
      totalAmount: increment(amountDiff),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (transactionId, customerId, transactionData) => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId);
    await deleteDoc(transactionRef);

    // Update customer's total stats
    await updateDoc(doc(db, 'customers', customerId), {
      totalMilk: increment(-(transactionData.quantity || 0)),
      totalAmount: increment(-(transactionData.amount || 0)),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// ==================== PAYMENTS ====================

/**
 * Load all payments for a customer
 */
export const loadPayments = async (customerId) => {
  try {
    const paymentsQuery = query(
      collection(db, 'payments'),
      where('customerID', '==', customerId)
    );
    const snapshot = await getDocs(paymentsQuery);
    const payments = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return payments;
  } catch (error) {
    console.error('Error loading payments:', error);
    return [];
  }
};

/**
 * Real-time listener for payments of a customer
 */
export const subscribeToPayments = (customerId, callback) => {
  const paymentsQuery = query(
    collection(db, 'payments'),
    where('customerID', '==', customerId)
  );
  const unsubscribe = onSnapshot(
    paymentsQuery,
    (snapshot) => {
      const payments = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      callback(payments);
    },
    (error) => {
      console.error('Error subscribing to payments:', error);
    }
  );
  return unsubscribe;
};

/**
 * Add a new payment
 */
export const addPayment = async (customerId, paymentData) => {
  try {
    const newPayment = {
      customerID: customerId,
      ...paymentData,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'payments'), newPayment);

    // Update customer's totalPaid
    await updateDoc(doc(db, 'customers', customerId), {
      totalPaid: increment(paymentData.amount || 0),
      updatedAt: Timestamp.now(),
    });

    return { ...newPayment, id: docRef.id };
  } catch (error) {
    console.error('Error adding payment:', error);
    throw error;
  }
};

/**
 * Update an existing payment
 */
export const updatePayment = async (paymentId, customerId, paymentData) => {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    const oldPayment = await getDoc(paymentRef);
    const oldData = oldPayment.data();

    await updateDoc(paymentRef, {
      ...paymentData,
      updatedAt: Timestamp.now(),
    });

    // Update customer's totalPaid
    const amountDiff = (paymentData.amount || 0) - (oldData.amount || 0);
    await updateDoc(doc(db, 'customers', customerId), {
      totalPaid: increment(amountDiff),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};

/**
 * Delete a payment
 */
export const deletePayment = async (paymentId, customerId, paymentData) => {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    await deleteDoc(paymentRef);

    // Update customer's totalPaid
    await updateDoc(doc(db, 'customers', customerId), {
      totalPaid: increment(-(paymentData.amount || 0)),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get the next sequential customer number
 */
const getNextCustomerNumber = async () => {
  try {
    const counterRef = doc(db, 'settings', 'customerCounter');
    const counterDoc = await getDoc(counterRef);
    
    let nextNumber = 1;
    if (counterDoc.exists()) {
      nextNumber = (counterDoc.data().count || 0) + 1;
    }
    
    // Update counter
    await setDoc(counterRef, { count: nextNumber, updatedAt: Timestamp.now() });
    
    return nextNumber;
  } catch (error) {
    console.error('Error getting next customer number:', error);
    // Fallback to timestamp-based ID if counter fails
    return Date.now();
  }
};

/**
 * Generate customer ID with sequential number
 */
export const generateCustomerID = async () => {
  const number = await getNextCustomerNumber();
  return number;
};

/**
 * Save/Sync customers (no longer needed with Firestore, kept for compatibility)
 */
export const saveCustomers = (customers) => {
  // With Firestore, saves happen automatically
  console.log('Changes are automatically synced to Firestore');
};

/**
 * Get customer with all their transactions and payments
 */
export const getCustomerWithDetails = async (customerId) => {
  try {
    const customerDoc = await getDoc(doc(db, 'customers', customerId));
    const transactions = await loadTransactions(customerId);
    const payments = await loadPayments(customerId);

    return {
      ...customerDoc.data(),
      id: customerId,
      milkTransactions: transactions,
      payments: payments,
    };
  } catch (error) {
    console.error('Error getting customer details:', error);
    throw error;
  }
};

/**
 * Migrate local data to Firestore (use once to move old data)
 */
export const migrateLocalDataToFirestore = async (customers) => {
  try {
    const batch = writeBatch(db);

    for (const customer of customers) {
      // Add customer
      const customerRef = doc(
        collection(db, 'customers'),
        customer.customerID || `C${Date.now()}`
      );
      batch.set(customerRef, {
        customerID: customer.customerID,
        name: customer.name,
        mobile: customer.mobile,
        totalMilk: customer.totalMilk || 0,
        totalAmount: customer.totalAmount || 0,
        totalPaid: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // Add transactions
      if (customer.milkTransactions && customer.milkTransactions.length > 0) {
        customer.milkTransactions.forEach((transaction) => {
          const transRef = doc(collection(db, 'transactions'));
          batch.set(transRef, {
            customerID: customer.customerID,
            ...transaction,
            createdAt: Timestamp.now(),
          });
        });
      }

      // Add payments
      if (customer.payments && customer.payments.length > 0) {
        customer.payments.forEach((payment) => {
          const payRef = doc(collection(db, 'payments'));
          batch.set(payRef, {
            customerID: customer.customerID,
            ...payment,
            createdAt: Timestamp.now(),
          });
        });
      }
    }

    await batch.commit();
    console.log('Data migration completed successfully');
  } catch (error) {
    console.error('Error migrating data:', error);
    throw error;
  }
};

// ==================== SETTINGS ====================

const DEFAULT_MILK_RATE = 82;

/**
 * Get current milk rate from settings
 */
export const getMilkRate = async () => {
  try {
    const settingsRef = doc(db, 'settings', 'milkRate');
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      return settingsDoc.data().rate || DEFAULT_MILK_RATE;
    }
    
    // If settings don't exist, create with default rate
    await setDoc(settingsRef, { rate: DEFAULT_MILK_RATE, updatedAt: Timestamp.now() });
    return DEFAULT_MILK_RATE;
  } catch (error) {
    console.error('Error getting milk rate:', error);
    return DEFAULT_MILK_RATE;
  }
};

/**
 * Update milk rate
 */
export const updateMilkRate = async (newRate) => {
  try {
    const settingsRef = doc(db, 'settings', 'milkRate');
    await setDoc(settingsRef, { rate: newRate, updatedAt: Timestamp.now() }, { merge: true });
  } catch (error) {
    console.error('Error updating milk rate:', error);
    throw error;
  }
};

/**
 * Real-time listener for milk rate changes
 */
export const subscribeMilkRate = (callback) => {
  const settingsRef = doc(db, 'settings', 'milkRate');
  const unsubscribe = onSnapshot(
    settingsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data().rate || DEFAULT_MILK_RATE);
      } else {
        callback(DEFAULT_MILK_RATE);
      }
    },
    (error) => {
      console.error('Error subscribing to milk rate:', error);
      callback(DEFAULT_MILK_RATE);
    }
  );
  return unsubscribe;
};
