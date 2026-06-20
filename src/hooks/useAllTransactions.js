import { useState, useEffect } from "react";
import { subscribeToAllTransactions } from "../utils/dataService";

export function useAllTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToAllTransactions((transactionsData) => {
      setTransactions(transactionsData);
    });

    return () => unsubscribe();
  }, []);

  return { transactions };
}
