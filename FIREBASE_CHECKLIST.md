# Firebase Setup Checklist

## Pre-Setup
- [ ] You have a Google account
- [ ] Internet connection
- [ ] Project installed and running locally

## Firebase Console Setup
- [ ] Create Firebase Project at console.firebase.google.com
- [ ] Register web app in Firebase
- [ ] Copy Firebase config credentials
- [ ] Create Firestore Database (Test mode)
- [ ] Enable Firestore in your region
- [ ] Update Firestore Security Rules (copy from FIREBASE_SETUP.md)

## Local Environment Setup
- [ ] Create `.env.local` file in project root
- [ ] Paste all Firebase config values
- [ ] Verify `.env.local` is in `.gitignore` (don't commit secrets!)
- [ ] Save and close `.env.local`

## Code Updates
- [ ] Review `src/config/firebase.js` (already created ✓)
- [ ] Review `src/utils/dataService.js` (already updated ✓)
- [ ] Update `src/App.jsx` to use new Firebase functions
  - [ ] Import Firebase functions (see APP_FIREBASE_SAMPLE.jsx)
  - [ ] Replace `loadCustomers()` with `subscribeToCustomers()`
  - [ ] Replace `saveCustomers()` calls with Firebase functions
  - [ ] Add error handling with try/catch
  - [ ] Remove the manual save useEffect
- [ ] Update any component files that directly call dataService
  - [ ] Check all components using `loadCustomers`, `saveCustomers`, etc.
  - [ ] Replace with appropriate Firebase functions

## Testing
- [ ] Start dev server: `npm run dev`
- [ ] Open app in browser
- [ ] Open DevTools Console (F12) - should see no errors
- [ ] Try adding a new customer
- [ ] Check Firebase Console - see data appear in Firestore
- [ ] Refresh page - customer still there (real data!)
- [ ] Try editing/deleting - changes sync instantly
- [ ] Open app in two browser tabs - changes sync between them!

## Optional - Data Migration
- [ ] If you want to keep old local data:
  - [ ] Backup `customers.json`
  - [ ] Use `migrateLocalDataToFirestore()` function
  - [ ] Verify all data in Firestore
  - [ ] Delete local customers.json

## Optional - Offline Support (Advanced)
- [ ] Install Firebase offline support library (if needed)
- [ ] Set up offline persistence
- [ ] Test offline mode

## Deployment Prep
- [ ] Create `.env.production` with Firebase config
- [ ] Update Firestore Security Rules for production
- [ ] Test in production build: `npm run build`
- [ ] Deploy to hosting (Firebase Hosting recommended)

## Troubleshooting
- [ ] No errors? Great! You're done! 🎉
- [ ] Error about missing `.env.local`? Check FIREBASE_SETUP.md Step 3
- [ ] Permission denied? Check Firestore rules (FIREBASE_SETUP.md Step 5)
- [ ] Data not syncing? Check console for errors (F12)
- [ ] App not connecting? Verify Firebase config values

## Files Created/Modified
✅ `src/config/firebase.js` - Firebase initialization
✅ `src/utils/dataService.js` - Firestore operations  
✅ `.env.example` - Environment template
✅ `FIREBASE_SETUP.md` - Detailed guide
✅ `FIREBASE_QUICKREF.md` - Quick reference
✅ `APP_FIREBASE_SAMPLE.jsx` - Sample integration
✅ `FIREBASE_CHECKLIST.md` - This file

## Need Help?
- Read: `FIREBASE_SETUP.md` - Full setup instructions
- Read: `FIREBASE_QUICKREF.md` - Quick reference
- Check: `APP_FIREBASE_SAMPLE.jsx` - Sample code
- Errors? Check browser console (F12)

---

**After completing this checklist, your app will:**
- ✅ Connect to live Firebase data
- ✅ Sync changes in real-time
- ✅ Work across multiple devices/browsers
- ✅ Have automatic backups in the cloud
- ✅ Scale to thousands of customers!
