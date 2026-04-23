# Firebase Integration Quick Reference

## What Changed?

### Before (Local JSON)
```jsx
const [customers, setCustomers] = useState([]);

useEffect(() => {
  const loadData = async () => {
    const loadedCustomers = await loadCustomers();
    setCustomers(loadedCustomers);
  };
  loadData();
}, []);
```

### After (Firebase - Real-time)
```jsx
const [customers, setCustomers] = useState([]);

useEffect(() => {
  const unsubscribe = subscribeToCustomers((customersData) => {
    setCustomers(customersData);
  });
  return () => unsubscribe(); // Cleanup
}, []);
```

## Key Differences

| Feature | Before | After |
|---------|--------|-------|
| **Data Source** | Local JSON file | Cloud Firestore |
| **Updates** | Manual refresh | Real-time sync |
| **Persistence** | Browser only | Cloud + all devices |
| **Scalability** | Limited | Unlimited |
| **Offline** | Not supported | Can implement |
| **Cost** | Free | Free tier included |

## Installation Done ✅

1. ✅ Firebase package installed
2. ✅ Firebase config file created at `src/config/firebase.js`
3. ✅ DataService updated with Firestore functions
4. ✅ Environment file example created

## Next Steps

1. **Create `.env.local` file** with your Firebase credentials
2. **Set up Firestore Database** in Firebase Console
3. **Update App.jsx** to use new Firebase functions
4. **Test the app** - changes should sync in real-time!

## File Locations

- 📄 **Firebase Config**: `src/config/firebase.js`
- 📄 **Data Service**: `src/utils/dataService.js` (updated)
- 📄 **Setup Guide**: `FIREBASE_SETUP.md`
- 📄 **Env Example**: `.env.example`

## Common Changes Needed in App.jsx

```jsx
// OLD
import { loadCustomers, saveCustomers } from './utils/dataService';

// NEW
import {
  subscribeToCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  // ... other functions
} from './utils/dataService';

// OLD - Load once on mount
useEffect(() => {
  loadCustomers().then(setCustomers);
}, []);

// NEW - Real-time listener
useEffect(() => {
  const unsubscribe = subscribeToCustomers(setCustomers);
  return () => unsubscribe();
}, []);

// OLD - Manual save after changes
useEffect(() => {
  if (customers.length > 0) {
    saveCustomers(customers);
  }
}, [customers]);

// NEW - No manual save needed! Firestore does it automatically
// Just call addCustomer, updateCustomer, deleteCustomer functions
```

## Testing

To verify Firebase is working:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Make changes to customers/transactions
4. You should see requests to `firestore.googleapis.com`
5. Check Firestore Console to see data appear

## Support Files

- `src/config/firebase.js` - Firebase initialization
- `src/utils/dataService.js` - All Firestore operations
- `FIREBASE_SETUP.md` - Detailed setup instructions
- `.env.example` - Environment variable template
