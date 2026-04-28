# Gurunanak Milk Management - Agent Context

## Project Overview
A React + Vite web application for managing milk delivery customers, tracking transactions, and handling payments for a milk business. Built with Firebase Firestore for real-time data sync.

**Tech Stack:**
- React 19.2.5 with Vite
- Firebase (v12.12.1) - Firestore + Auth
- React Icons
- CSS Modules + Regular CSS
- ESLint for code quality

## Project Structure

```
src/
├── App.jsx                          # Main app with state management
├── App.css / App.module.css         # Main styling
├── main.jsx                         # Entry point
├── index.css                        # Global styles
├── config/
│   └── firebase.js                  # Firebase initialization
├── utils/
│   ├── dataService.js               # All Firestore operations
│   └── calandar-utils.js            # Date utilities
├── hooks/
│   ├── useCustomer.js               # Fetch & manage customers
│   ├── useCustomerDetail.js         # Load customer details
│   └── useMonthNavigation.js        # Month navigation logic
├── components/
│   ├── common/
│   │   ├── Header.jsx               # Top header component
│   │   └── SettingsModal.jsx        # Settings modal
│   ├── customer/
│   │   ├── AddCustomerModal.jsx     # Add/Edit customer form
│   │   ├── CustomerCard.jsx         # Customer list item
│   │   └── CustomerToolbar.jsx      # Search & add buttons
│   ├── milk/
│   │   ├── AddMilkTransactionForm.jsx
│   │   ├── MilkCalendarView.jsx
│   │   ├── MilkCard.jsx
│   │   ├── MilkSummary.jsx
│   │   └── MilkTransactionDetailsModal.jsx
│   ├── payments/
│   │   ├── AddPaymentForm.jsx
│   │   ├── PaymentHistory.jsx
│   │   └── PaymentItem.jsx
│   └── modals/
│       └── ConfirmDialog.jsx
├── views/
│   ├── CustomerListView.jsx         # Customer list page
│   └── CustomerDetailView.jsx       # Customer detail page
└── styles/                          # CSS files for components
```

## Database Schema (Firestore)

### Collections & Documents

#### 1. `customers` Collection
```javascript
{
  id: "<firestore-doc-id>",           // Auto-generated Firebase ID
  customerID: 1,                      // Sequential running number (unique, searchable)
  name: "John Doe",                   // Customer name
  mobile: "98765 43210",              // Phone (formatted: 10 digits)
  totalMilk: 150,                     // Sum of all milk quantities
  totalAmount: 12300,                 // Sum of all transaction amounts
  totalPaid: 10000,                   // Sum of all payment amounts
  createdAt: Timestamp,               // Firebase Timestamp
  updatedAt: Timestamp                // Last modified time
}
```

#### 2. `transactions` Collection
```javascript
{
  id: "<firestore-doc-id>",
  customerID: 1,                      // Foreign key to customers
  date: "2026-04-28",                 // YYYY-MM-DD format
  quantity: 10,                       // Liters of milk
  amount: 820,                        // Price calculated from milk rate
  notes: "Optional notes",
  createdAt: Timestamp
}
```

#### 3. `payments` Collection
```javascript
{
  id: "<firestore-doc-id>",
  customerID: 1,                      // Foreign key to customers
  date: "2026-04-28",                 // Payment date
  amount: 5000,                       // Amount paid
  method: "Cash",                     // Payment method
  notes: "Optional notes",
  createdAt: Timestamp
}
```

#### 4. `settings` Collection
```javascript
// Document: "milkRate"
{
  rate: 82,                           // Price per liter
  updatedAt: Timestamp
}

// Document: "customerCounter"
{
  count: 5,                           // Current customer number (next = count + 1)
  updatedAt: Timestamp
}
```

## Key Functions & Utilities (dataService.js)

### Customer Operations
- `loadCustomers()` - Fetch all customers (one-time)
- `subscribeToCustomers(callback)` - Real-time listener (preferred)
- `addCustomer(customerData)` - Create new customer with sequential ID
- `updateCustomer(customerId, customerData)` - Edit customer
- `deleteCustomer(customerId)` - Delete customer & all related data
- `getCustomerWithDetails(customerId)` - Fetch customer + transactions + payments

### Transaction Operations
- `loadTransactions(customerId)` - Fetch customer's transactions
- `subscribeToTransactions(customerId, callback)` - Real-time listener
- `addTransaction(customerId, transactionData)` - Create transaction
- `updateTransaction(transactionId, customerId, transactionData)` - Edit transaction
- `deleteTransaction(transactionId, customerId, transactionData)` - Delete transaction

### Payment Operations
- `loadPayments(customerId)` - Fetch customer's payments
- `subscribeToPayments(customerId, callback)` - Real-time listener
- `addPayment(customerId, paymentData)` - Create payment
- `updatePayment(paymentId, customerId, paymentData)` - Edit payment
- `deletePayment(paymentId, customerId, paymentData)` - Delete payment

### Settings Operations
- `getMilkRate()` - Get current milk rate
- `updateMilkRate(newRate)` - Update milk rate
- `subscribeMilkRate(callback)` - Real-time milk rate listener

### Internal Functions
- `getNextCustomerNumber()` - Increments customer counter, returns next number
- `generateCustomerID()` - Returns sequential customer ID (1, 2, 3, etc.)

## App State Management (App.jsx)

```javascript
// Navigation
viewMode: "list" | "detail"
selectedCustomer: null | {...}

// Search
searchTerm: ""

// Customer Form
showForm: boolean
editingCustomer: null | {...}

// Quick Milk Form
showQuickMilkForm: boolean
quickMilkCustomer: null | {...}

// Settings
showSettings: boolean
```

## Component Props & Handlers

### CustomerCard
```javascript
Props:
- id: string (Firebase ID)
- customerID: number (Sequential ID - displayed)
- name: string
- mobile: string
- totalMilk: number
- totalAmount: number
- onEdit(customer): callback
- onClick(customer): callback
- onAddMilk(customer): callback

Displays: Purple badge with sequential ID + customer name
```

### AddCustomerModal
```javascript
Props:
- onSubmit(data): { name, mobile }
- onCancel(): void
- initialName: string
- initialPhone: string
- isEditing: boolean
```

### MilkTransactionForm
```javascript
Props:
- onSubmit(data): void
- onCancel(): void
- initialDate: "YYYY-MM-DD"
- initialQuantity: string
- isEditing: boolean
- customerName: string
```

## Important Patterns & Rules

### 1. Customer ID System
- **Sequential ID (customerID)**: 1, 2, 3, etc. - For display and user search
- **Firebase ID (id)**: Alphanumeric - For internal database operations
- Always pass **both** when clicking/editing customers
- When displaying: use `customerID`
- When fetching details: use `id` (Firebase ID)

### 2. Real-time Data
- Use `subscribe*` functions for live updates (preferred)
- Use `load*` functions for one-time fetches (fallback only)
- Always call unsubscribe in cleanup to prevent memory leaks

### 3. Firestore Transactions
- Use `writeBatch()` for multi-document operations (delete customer + all records)
- Use `increment()` to atomically update totals
- Always update customer totals when modifying transactions/payments

### 4. Date Format
- Store dates as "YYYY-MM-DD" strings
- Use `Timestamp.now()` for created/updated timestamps
- Month filtering: `tx.date.startsWith(selectedMonth)` (e.g., "2026-04")

### 5. Phone Number Format
- Input: Any digits, "91" prefix optional
- Stored: Exactly 10 digits
- Displayed: Formatted as "XXXXX XXXXX"
- Validation: Must be 10 digits before storing

### 6. Calculations
- Milk amount = quantity × milk rate
- Total milk = sum of all transaction quantities
- Total amount = sum of all transaction amounts (pre-calculated)
- Total paid = sum of all payment amounts
- Balance = totalAmount - totalPaid

### 7. Error Handling
- Try/catch blocks in async functions
- User-facing alerts for critical errors
- Console.error for debugging
- Graceful fallbacks (return empty arrays if failed)

## Navigation Flow

```
App (Main container)
├── CustomerListView
│   ├── CustomerToolbar (Search + Add button)
│   ├── AddCustomerModal (Form)
│   └── CustomerCard[] (List items)
│       └── onClick → CustomerDetailView
│
└── CustomerDetailView
    ├── Back button → CustomerListView
    ├── MilkTransactionForm (Add/Edit transactions)
    ├── MilkCalendarView (Display transactions by date)
    ├── AddPaymentForm (Add/Edit payments)
    └── PaymentHistory (Display payment list)
```

## Key Hooks

### useCustomers()
```javascript
Returns: {
  customers: [],           // Array of all customers
  saveCustomer(),         // Add or update
  removeCustomer(),       // Delete
  fetchCustomerDetails()  // Get customer + transactions + payments
}
```

### useCustomerDetail(customer, setMonth)
```javascript
Returns: {
  customer: {...},
  transactions: [],
  payments: [],
  monthlyTotal: number,
  balance: number
}
```

### useMonthNavigation(initialMonth)
```javascript
Returns: {
  selectedMonth: "2026-04",
  setSelectedMonth(),
  handlePrevMonth(),
  handleNextMonth()
}
```

## Common Tasks for Agents

### Add a new customer field
1. Update Firestore document in `addCustomer()` (dataService.js)
2. Add to `getCustomerWithDetails()` return object
3. Add to AddCustomerModal form
4. Pass through props to display components

### Add a new page/view
1. Create component in `src/views/`
2. Add state & navigation handler in `App.jsx`
3. Update viewMode state
4. Add route/conditional rendering

### Modify customer display
1. Update `CustomerCard.jsx` component
2. Update `customer-card.css` for styling
3. Ensure both `id` and `customerID` are passed as props

### Add search functionality
1. Update filter logic in `App.jsx` filteredCustomers
2. Support searching by: name, customerID, phone, etc.
3. Filter is case-insensitive for strings

### Database queries
1. Always use functions from `dataService.js`
2. Never directly query Firestore in components
3. Use `subscribeToX()` for real-time updates
4. Use `loadX()` as fallback only

## Environment Variables (.env.local)

```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Styling

- Global: `src/index.css`, `src/App.css`
- Modules: `src/App.module.css`
- Component CSS: `src/styles/[component-name].css`
- Naming convention: `.class-name` (kebab-case)
- Color scheme: Purple (#4912d5) is primary brand color

## Recent Changes (Latest Features)

1. **Sequential Customer ID System**
   - Added `customerID` field (running number: 1, 2, 3)
   - Displays on purple badge in CustomerCard
   - Searchable by sequential ID
   - Maintained alongside Firebase ID for internal operations

2. **Firestore Integration**
   - Real-time sync via listeners
   - Batch operations for deletions
   - Atomic increments for totals
   - Auto-generated sequential IDs via counter

## Debugging Tips

1. **Check Firestore Console** - Verify data is syncing
2. **Browser DevTools** - Console.error for logs
3. **Real-time sync issues** - Check listener unsubscribe calls
4. **Missing data** - Verify both Firebase ID and sequential ID are passed
5. **Styling issues** - Check CSS specificity and media queries

## File Locations Quick Reference

| Type | Location |
|------|----------|
| Pages/Views | `src/views/` |
| Components | `src/components/` |
| Hooks | `src/hooks/` |
| Utils & DB | `src/utils/` |
| Styles | `src/styles/` |
| Config | `src/config/` |
| Firebase Setup | `src/config/firebase.js` |
| All DB Operations | `src/utils/dataService.js` |

---

**Last Updated:** April 28, 2026  
**Project Location:** `d:\sinprl\React_Projects\gurunank_react\gurunanak_milk`
