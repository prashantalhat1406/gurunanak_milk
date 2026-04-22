// dataService.js
export const loadCustomers = async () => {
  try {
    const response = await fetch('/customers.json');
    if (!response.ok) {
      throw new Error('Failed to load customers data');
    }
    const customersData = await response.json();
    return customersData;
  } catch (error) {
    console.error('Error loading customers:', error);
    return [];
  }
};

export const saveCustomers = (customers) => {
  // In a real app, this would save to an API or local storage
  // For now, we'll just log it
  console.log('Saving customers:', customers);
  // You could use localStorage:
  // localStorage.setItem('customers', JSON.stringify(customers));
};

export const generateCustomerID = (customers) => {
  const maxID = customers.reduce((max, customer) => {
    const num = parseInt(customer.customerID.slice(1));
    return num > max ? num : max;
  }, 0);
  return 'C' + (maxID + 1).toString().padStart(3, '0');
};
