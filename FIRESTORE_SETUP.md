# 🔥 Firestore Security Rules Setup Instructions

## Current Issue
Your Firestore rules are blocking ALL access with `allow read, write: if false;`

## Solution

### Option 1: Copy-Paste in Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **Day-Track**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab at the top
5. **DELETE** all existing rules
6. **COPY** the rules from `firestore.rules` file (in your project root)
7. **PASTE** them into the Firebase console
8. Click **Publish** button

### Option 2: Deploy via Firebase CLI
If you have Firebase CLI installed:
```bash
firebase deploy --only firestore:rules
```

## What These Rules Do

### ✅ Transactions Collection
- **Read**: Users can only read their OWN transactions
- **Create**: Users can only create transactions with their own userId
- **Update**: Users can only update their OWN transactions
- **Delete**: Users can only delete their OWN transactions

### ✅ Validation
- Amount must be a positive number
- Type must be either 'income' or 'expense'
- Title must be 1-100 characters
- UserId must match authenticated user

### ✅ Security
- All operations require authentication
- Users cannot access other users' data
- All other collections are blocked by default

## Testing
After updating rules, try these in your app:
1. ✅ Add a new transaction (should work)
2. ✅ View your transactions (should work)
3. ✅ Edit your transaction (should work)
4. ✅ Delete your transaction (should work)
5. ❌ Access another user's data (should fail)

## Troubleshooting
If you still get "Permission Denied":
1. Make sure you're logged in with Google/Email
2. Check Firebase Console > Authentication > Users tab
3. Verify your user exists and has a UID
4. Wait 1-2 minutes after deploying rules (cache delay)

## Important Notes
- Rules are applied immediately after publishing
- Test in Firebase Console under Rules > Rules Playground
- Never use `allow read, write: if true;` in production (security risk!)
