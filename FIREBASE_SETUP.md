# Firebase Integration Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "Gurunanak Milk")
4. Accept the terms and click "Continue"
5. Enable/Disable Google Analytics as you prefer
6. Click "Create project"

## Step 2: Register Your App

1. In the Firebase Console, click the web icon (`</>`)
2. Register app with nickname "Gurunanak Milk"
3. Copy your Firebase configuration

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root (copy from `.env.example`):
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. Replace values with your Firebase config (from Step 2)

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
   - ⚠️ Switch to production rules before deploying
4. Select location (closest to your users)
5. Click **Enable**

## Step 5: Firestore Security Rules (Important!)

Replace the default rules with these for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes for testing
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**For Production**, use:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /customers/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /transactions/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /payments/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 6: Update Your App.jsx

Update the imports in your `App.jsx` to use Firebase functions:

```jsx
import {
  loadCustomers,
  subscribeToCustomers,
  loadTransactions,
  subscribeToTransactions,
  loadPayments,
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
  migrateLocalDataToFirestore,
} from './utils/dataService';
```

## Step 7: Real-Time Listeners (Recommended)

Instead of just loading data once, use real-time listeners:

```jsx
useEffect(() => {
  // Subscribe to customers (real-time updates)
  const unsubscribe = subscribeToCustomers((customersData) => {
    const customersWithData = customersData.map(customer => ({
      ...customer,
      milkTransactions: [],
      payments: [],
    }));
    setCustomers(customersWithData);
  });

  return () => unsubscribe(); // Cleanup
}, []);
```

## Step 8: Migrate Existing Data (Optional)

To move your local JSON data to Firebase:

```jsx
import { migrateLocalDataToFirestore } from './utils/dataService';

// After loading local data:
const localCustomers = await loadCustomersFromJSON(); // your existing load function
await migrateLocalDataToFirestore(localCustomers);
```

## Available Functions

### Customers
- `loadCustomers()` - Get all customers
- `subscribeToCustomers(callback)` - Real-time updates
- `addCustomer(data)` - Add new customer
- `updateCustomer(id, data)` - Update customer
- `deleteCustomer(id)` - Delete customer

### Transactions
- `loadTransactions(customerId)` - Get customer's transactions
- `subscribeToTransactions(customerId, callback)` - Real-time updates
- `addTransaction(customerId, data)` - Add transaction
- `updateTransaction(id, customerId, data)` - Update transaction
- `deleteTransaction(id, customerId, data)` - Delete transaction

### Payments
- `loadPayments(customerId)` - Get customer's payments
- `subscribeToPayments(customerId, callback)` - Real-time updates
- `addPayment(customerId, data)` - Add payment
- `updatePayment(id, customerId, data)` - Update payment
- `deletePayment(id, customerId, data)` - Delete payment

### Utilities
- `getCustomerWithDetails(customerId)` - Get customer with all transactions & payments
- `migrateLocalDataToFirestore(customers)` - Migrate local data

## Firestore Database Structure

```
customers/
├── C001
│   ├── customerID: "C001"
│   ├── name: "Rajesh Kumar"
│   ├── mobile: "9876543210"
│   ├── totalMilk: 50
│   ├── totalAmount: 2500
│   ├── totalPaid: 1500
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp

transactions/
├── doc_id_1
│   ├── customerID: "C001"
│   ├── date: "2024-04-01"
│   ├── quantity: 2
│   ├── rate: 50
│   ├── amount: 100
│   └── createdAt: timestamp

payments/
├── doc_id_2
│   ├── customerID: "C001"
│   ├── amount: 500
│   ├── date: "2024-04-15"
│   ├── method: "cash"
│   └── createdAt: timestamp
```

## Troubleshooting

### Error: "Could not reach Cloud Firestore backend"
- Check your internet connection
- Verify Firebase config is correct
- Check Firestore is enabled in Firebase Console

### Error: "Permission denied"
- Update Firestore security rules (see Step 5)
- Make sure `.env.local` has correct credentials

### Data not syncing
- Check browser console for errors
- Verify Firestore collections exist
- Check real-time listeners are set up correctly

## Next Steps

1. Test locally with Firebase emulator (optional but recommended)
2. Update App.jsx to use new functions
3. Test all CRUD operations
4. Deploy to production with proper security rules
5. Monitor Firestore usage in Firebase Console
