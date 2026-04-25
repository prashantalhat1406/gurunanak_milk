// src/hooks/useCustomers.js
import { useState, useEffect } from "react";
import {
  subscribeToCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerWithDetails,
} from "../utils/dataService";

export function useCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToCustomers((customersData) => {
      const withDefaults = customersData.map((c) => ({
        ...c,
        milkTransactions: c.milkTransactions || [],
        payments: c.payments || [],
      }));
      setCustomers(withDefaults);
    });

    return () => unsubscribe();
  }, []);

  const saveCustomer = async (customerData, existingCustomer = null) => {
    if (existingCustomer) {
      await updateCustomer(existingCustomer.id, customerData);
    } else {
      await addCustomer(customerData);
    }
  };

  const removeCustomer = async (customerId) => {
    await deleteCustomer(customerId);
  };

  const fetchCustomerDetails = async (customerId) => {
    return await getCustomerWithDetails(customerId);
  };

  return { customers, saveCustomer, removeCustomer, fetchCustomerDetails };
}
