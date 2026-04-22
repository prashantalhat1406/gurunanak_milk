import './App.css'
import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import CustomerCard from './components/CustomerCard'
import AddCustomerForm from './components/AddCustomerForm'
import MilkCard from './components/MilkCard'
import MilkTransactionForm from './components/MilkTransactionForm'
import MilkCalendarView from './components/MilkCalendarView'
import { loadCustomers, saveCustomers, generateCustomerID } from './utils/dataService'

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionDate, setTransactionDate] = useState(null);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      const loadedCustomers = await loadCustomers();
      setCustomers(loadedCustomers);
    };
    loadData();
  }, []);

  // Save data whenever customers change
  useEffect(() => {
    if (customers.length > 0) {
      saveCustomers(customers);
    }
  }, [customers]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customerID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleAddCustomer = (customerData) => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(prev => prev.map(customer =>
        customer.customerID === editingCustomer.customerID
          ? { ...customer, ...customerData }
          : customer
      ));
    } else {
      // Add new customer
      const newCustomer = {
        customerID: generateCustomerID(customers),
        ...customerData,
        totalMilk: 0,
        totalAmount: 0,
        milkTransactions: []
      };
      setCustomers(prev => [...prev, newCustomer]);
    }
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleCustomerClick = (customer) => {
    const fullCustomer = customers.find(c => c.customerID === customer.customerID);
    setSelectedCustomer(fullCustomer);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCustomer(null);
  };

  const handleAddTransaction = (transactionData) => {
    let updatedCustomer;
    if (editingTransaction) {
      // Update existing transaction
      updatedCustomer = {
        ...selectedCustomer,
        milkTransactions: selectedCustomer.milkTransactions.map(transaction =>
          transaction.date === editingTransaction.date && transaction.quantity === editingTransaction.quantity
            ? transactionData
            : transaction
        )
      };
    } else {
      // Add new transaction
      updatedCustomer = {
        ...selectedCustomer,
        milkTransactions: [...selectedCustomer.milkTransactions, transactionData]
      };
      // Auto-navigate to the newly added transaction's month
      const transactionMonth = transactionData.date.substring(0, 7);
      setSelectedMonth(transactionMonth);
    }
    
    // Update both customers list and selectedCustomer
    setCustomers(prev => prev.map(customer =>
      customer.customerID === selectedCustomer.customerID ? updatedCustomer : customer
    ));
    setSelectedCustomer(updatedCustomer);
    
    setShowTransactionForm(false);
    setEditingTransaction(null);
    setTransactionDate(null);
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

  const handleDeleteTransaction = (transaction) => {
    setCustomers(prev => prev.map(customer =>
      customer.customerID === selectedCustomer.customerID
        ? {
            ...customer,
            milkTransactions: customer.milkTransactions.filter(t =>
              !(t.date === transaction.date && t.quantity === transaction.quantity && t.rate === transaction.rate)
            )
          }
        : customer
    ));
    
    // Update selectedCustomer as well
    setSelectedCustomer(prev => ({
      ...prev,
      milkTransactions: prev.milkTransactions.filter(t =>
        !(t.date === transaction.date && t.quantity === transaction.quantity && t.rate === transaction.rate)
      )
    }));
  };

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    if (month === 1) {
      setSelectedMonth(`${year - 1}-12`);
    } else {
      setSelectedMonth(`${year}-${String(month - 1).padStart(2, '0')}`);
    }
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    if (month === 12) {
      setSelectedMonth(`${year + 1}-01`);
    } else {
      setSelectedMonth(`${year}-${String(month + 1).padStart(2, '0')}`);
    }
  };

  const handleAddTransactionFromCalendar = (dateStr) => {
    setTransactionDate(dateStr);
    setShowTransactionForm(true);
  };

  const filteredMilkTransactions = selectedCustomer
    ? selectedCustomer.milkTransactions.filter(transaction =>
        transaction.date.startsWith(selectedMonth)
      )
    : [];

  const months = useMemo(() => {
    const allMonths = new Set();
    
    // If a customer is selected (detail view), collect months from that customer only
    // Otherwise, collect from all customers
    const sourcesForMonths = selectedCustomer ? [selectedCustomer] : customers;
    
    sourcesForMonths.forEach(customer => {
      customer.milkTransactions.forEach(transaction => {
        const month = transaction.date.substring(0, 7); // Extract YYYY-MM
        allMonths.add(month);
      });
    });
    
    // Convert to array and sort
    const monthArray = Array.from(allMonths).sort();
    
    // If no transactions, provide some default months
    if (monthArray.length === 0) {
      return [
        { value: '2024-04', label: 'April 2024' },
        { value: '2024-05', label: 'May 2024' },
        { value: '2024-06', label: 'June 2024' },
        { value: '2025-01', label: 'January 2025' },
        { value: '2025-02', label: 'February 2025' },
        { value: '2025-03', label: 'March 2025' },
        { value: '2025-04', label: 'April 2025' },
        { value: '2025-05', label: 'May 2025' },
        { value: '2025-06', label: 'June 2025' },
        { value: '2026-01', label: 'January 2026' },
        { value: '2026-02', label: 'February 2026' },
        { value: '2026-03', label: 'March 2026' },
        { value: '2026-04', label: 'April 2026' },
        { value: '2026-05', label: 'May 2026' },
        { value: '2026-06', label: 'June 2026' }
      ];
    }
    
    // Convert to label format
    return monthArray.map(month => {
      const [year, monthNum] = month.split('-');
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      const monthName = monthNames[parseInt(monthNum) - 1];
      return { value: month, label: `${monthName} ${year}` };
    });
  }, [customers, selectedCustomer]);

  return (
    <>
      <Header name="GuruNanak Milk Dairy" />
      <main style={{ padding: '20px' }}>
        {viewMode === 'list' ? (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={handleSearch}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Add Customer
              </button>
            </div>
            {showForm && (
              <AddCustomerForm
                onSubmit={handleAddCustomer}
                onCancel={handleCancel}
                initialName={editingCustomer?.name || ''}
                initialPhone={editingCustomer?.mobile || ''}
                isEditing={!!editingCustomer}
              />
            )}
            <h2>Customer List ({filteredCustomers.length})</h2>
            {filteredCustomers.map(customer => (
              <CustomerCard
                key={customer.customerID}
                customerID={customer.customerID}
                name={customer.name}
                mobile={customer.mobile}
                totalMilk={customer.totalMilk}
                totalAmount={customer.totalAmount}
                onEdit={handleEditCustomer}
                onClick={handleCustomerClick}
              />
            ))}
          </>
        ) : (
          <>
            <div style={{ marginBottom: '10px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <button
                onClick={handleBackToList}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ← Back to Customers
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h2 style={{ margin: 0 }}>{selectedCustomer?.name}</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <label style={{ marginRight: '5px', fontSize: '14px' }}>Month:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{
                      padding: '6px 8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            

            {(showTransactionForm || editingTransaction) && (
              <MilkTransactionForm
                onSubmit={handleAddTransaction}
                onCancel={handleCancelTransaction}
                initialDate={transactionDate || editingTransaction?.date || ''}
                initialQuantity={editingTransaction?.quantity || ''}
                isEditing={!!editingTransaction}
              />
            )}

            <MilkCalendarView
              transactions={filteredMilkTransactions}
              selectedMonth={selectedMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onAddTransaction={handleAddTransactionFromCalendar}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </>
        )}
      </main>
    </>
  )
}

export default App
