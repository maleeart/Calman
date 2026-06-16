# Dynamic TDEE Integration Guide for Calman

## 📋 Overview

This guide walks you through integrating the Dynamic TDEE feature into your existing Calman project **without any breaking changes**.

The feature adds:
- ✅ Google Fit API integration (optional, for automatic data sync)
- ✅ Manual activity input form (steps, calories, exercise type)
- ✅ Dynamic TDEE calculation (base + activity bonus)
- ✅ Persistent storage (localStorage)

**Architecture principle**: All new code is **modular and opt-in**. Your existing TDEE calculation and calorie tracking remain untouched.

---

## 🚀 Quick Start (5 Steps)

### Step 1: Copy New JavaScript Modules

Copy these 3 files into your `Calman/js/` directory:

```
Calman/js/
├─ tdeeCalculator.js (NEW)
├─ googleFitIntegration.js (NEW)
├─ dynamicTdeeUI.js (NEW)
└─ [existing files...]
```

### Step 2: Update index.html - Add Script Tags

Open your `index.html` and add these `<script>` tags **before your closing `</body>` tag**:

```html
<!-- Dynamic TDEE Feature (new) -->
<script src="js/tdeeCalculator.js"></script>
<script src="js/googleFitIntegration.js"></script>
<script src="js/dynamicTdeeUI.js"></script>
```

**Location matters**: Add them AFTER your existing scripts but BEFORE your inline initialization code.

### Step 3: Add HTML Container (where you want the feature to appear)

Find a good spot in your `index.html` where you want the Dynamic TDEE UI to appear (e.g., below your existing TDEE display). Add:

```html
<!-- Dynamic TDEE Feature Container (new) -->
<div id="dynamic-tdee-container"></div>
```

**Example placement** (if you have a calorie tracker section):
```html
<section id="calorie-tracker">
  <h2>Calorie Tracking</h2>
  
  <!-- Your existing calorie input form here -->
  <form id="food-form">
    ...
  </form>
  
  <!-- NEW: Add this line here -->
  <div id="dynamic-tdee-container"></div>
</section>
```

### Step 4: Initialize Dynamic TDEE UI in Your JavaScript

In your `index.html` or a script file where you already have the user profile set up, add this initialization code:

```javascript
// After you have collected user profile (weight, height, age, gender, activityMultiplier)
// Example:
const userProfile = {
  weight: 70,        // kg
  height: 180,       // cm
  age: 28,
  gender: 'male',
  activityMultiplier: 1.55  // Your existing activity level
};

// Initialize Dynamic TDEE UI
document.addEventListener('DOMContentLoaded', () => {
  DynamicTdeeUI.init(userProfile, 'dynamic-tdee-container');
});
```

**If you already have user profile input in your form**, extract it when you calculate base TDEE:

```javascript
// Example (in your existing code):
function calculateBaseCalories() {
  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseFloat(document.getElementById('height').value);
  const age = parseFloat(document.getElementById('age').value);
  const actMult = parseFloat(document.getElementById('activity').value);
  
  // Your existing TDEE calculation
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  const globalTDEE = Math.round(bmr * actMult);
  
  // NEW: Also initialize Dynamic TDEE
  const userProfile = { weight, height, age, gender: 'male', activityMultiplier: actMult };
  DynamicTdeeUI.init(userProfile, 'dynamic-tdee-container');
  
  // ... rest of your code
}
```

### Step 5: (Optional) Configure Google Fit API

**Skip this if you only want manual input. Come back to this when ready for auto-sync.**

#### 5.1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (name it "Calman" or similar)
3. Enable the **Google Fit API**:
   - Search for "Google Fit API" in the search bar
   - Click "Enable"

#### 5.2: Create OAuth 2.0 Credentials

1. Go to **Credentials** (left sidebar)
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Authorized JavaScript origins:
   - Add `http://localhost:8000` (for local testing)
   - Add your production domain (e.g., `https://yourdomain.com`)
5. Authorized redirect URIs:
   - Add `http://localhost:8000/` (for local)
   - Add `https://yourdomain.com/` (for production)
6. Click Create → Copy the **Client ID**

#### 5.3: Update googleFitIntegration.js

Open `js/googleFitIntegration.js` and find this line:

```javascript
CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace this
```

Replace with your actual Client ID from step 5.2.

#### 5.4: Test Google Fit Login

1. Open your Calman app in a browser
2. Look for "🔗 Login Google Fit" button (in the Dynamic TDEE section)
3. Click it → You should see Google login dialog
4. Grant permissions → Button should change to "↻ Sync Today's Data"
5. Click sync → Steps and calories should populate

---

## 🔧 Technical Details

### How It Works

```
User Input (steps, calories, exercise type)
        ↓
   Dynamic TDEE Calculation
   - Base TDEE (from existing formula)
   - Step bonus (+0.045 kcal/step over 5000)
   - Exercise bonus (+5-20% depending on type)
        ↓
   Store in localStorage (calman_activity_log)
        ↓
   Display in UI (base + bonus breakdown)
```

### Data Storage

Activity data is stored in **localStorage** as a JSON array:

```json
[
  {
    "date": "2025-06-16",
    "stepCount": 12000,
    "activeCalories": 450,
    "exerciseType": "running",
    "baseTDEE": 2550,
    "totalTDEE": 3383,
    "timestamp": "2025-06-16T14:30:00Z"
  }
]
```

**Key**: `calman_activity_log`

You can inspect this in browser DevTools:
```javascript
// In browser console:
JSON.parse(localStorage.getItem('calman_activity_log'))
```

### Module API Reference

#### TDEECalculator

```javascript
// Calculate base TDEE
TDEECalculator.calculateBaseTDEE(weight, height, age, gender, multiplier)
// Returns: { bmr, tdee }

// Calculate step bonus
TDEECalculator.calculateStepBonus(stepCount, bodyWeight)
// Returns: number (kcal)

// Calculate exercise bonus
TDEECalculator.calculateExerciseBonus(activeCalories, exerciseType)
// Returns: number (kcal)

// Main function - calculate everything
TDEECalculator.calculateDynamicTDEE(userProfile, dayData)
// Returns: { date, base, activity, total, breakdown, timestamp }
```

#### GoogleFitIntegration

```javascript
// Login
GoogleFitIntegration.initiateLogin()

// Fetch data
GoogleFitIntegration.fetchDailySummary(dateStr)
// Returns: Promise<{ stepCount, activeCalories, date, fetchedAt, source }>

// Logout
GoogleFitIntegration.logout()

// Check auth status
GoogleFitIntegration.isAuthenticated()
// Returns: boolean
```

#### DynamicTdeeUI

```javascript
// Initialize
DynamicTdeeUI.init(userProfile, 'container-id')

// Get activity for a date
DynamicTdeeUI.getActivityForDate(dateStr)
// Returns: { stepCount, activeCalories, exerciseType, ... } or null
```

---

## ⚠️ Common Issues & Troubleshooting

### "DynamicTdeeUI is not defined"

**Solution**: Make sure all 3 JavaScript files are loaded:
1. Check console (F12) for errors
2. Verify `<script>` tags are in correct order:
   - tdeeCalculator.js
   - googleFitIntegration.js
   - dynamicTdeeUI.js

### "Google Fit sync fails"

**Checklist**:
- [ ] CLIENT_ID is set correctly in `googleFitIntegration.js`
- [ ] Google Fit API is enabled in Cloud Console
- [ ] Redirect URIs match your domain exactly
- [ ] Browser allows popups (check popup blocker)
- [ ] Check console (F12) for detailed error messages

### "Activity data not persisting"

**Solution**: localStorage might be disabled or full:
```javascript
// In browser console, check:
localStorage.getItem('calman_activity_log')

// Clear if corrupted:
localStorage.removeItem('calman_activity_log')
```

---

## 📊 Example: Full Integration in index.html

Here's a minimal example of how to integrate everything:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Calman</title>
</head>
<body>
  
  <!-- Existing Calman UI -->
  <h1>Calman - Food & Calorie Tracker</h1>
  
  <!-- User Profile Input -->
  <form id="profile-form">
    <input type="number" id="weight" placeholder="Weight (kg)" required>
    <input type="number" id="height" placeholder="Height (cm)" required>
    <input type="number" id="age" placeholder="Age" required>
    <input type="number" id="activity" placeholder="Activity multiplier" value="1.55" required>
    <button type="submit">Set Profile</button>
  </form>

  <!-- Display base TDEE -->
  <div id="tdee-display">
    <p>Your TDEE: <span id="tdee-value">-</span> kcal/day</p>
  </div>

  <!-- NEW: Dynamic TDEE Container -->
  <div id="dynamic-tdee-container"></div>

  <!-- Existing food tracker form, etc. -->
  ...

  <!-- Scripts: EXISTING CALMAN CODE -->
  <script>
    // Your existing Calman code here
    function calculateBaseCalories() {
      const weight = parseFloat(document.getElementById('weight').value);
      const height = parseFloat(document.getElementById('height').value);
      const age = parseFloat(document.getElementById('age').value);
      const act = parseFloat(document.getElementById('activity').value);
      
      const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      const globalTDEE = Math.round(bmr * act);
      
      document.getElementById('tdee-value').textContent = globalTDEE;
      
      // NEW: Initialize Dynamic TDEE
      const userProfile = { 
        weight, height, age, 
        gender: 'male',  // or get from user input
        activityMultiplier: act 
      };
      DynamicTdeeUI.init(userProfile, 'dynamic-tdee-container');
    }
    
    document.getElementById('profile-form').addEventListener('submit', (e) => {
      e.preventDefault();
      calculateBaseCalories();
    });
  </script>

  <!-- NEW: Dynamic TDEE Feature Scripts -->
  <script src="js/tdeeCalculator.js"></script>
  <script src="js/googleFitIntegration.js"></script>
  <script src="js/dynamicTdeeUI.js"></script>

</body>
</html>
```

---

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] Google Fit API is configured (if using auto-sync)
- [ ] CLIENT_ID is set in googleFitIntegration.js
- [ ] Redirect URIs in Google Cloud Console match your domain
- [ ] Test localStorage in your target browser
- [ ] Test on mobile (Google Fit works better on Android with real data)
- [ ] All 3 JavaScript files are deployed to your server

---

## 📚 Next Steps / Advanced

### Phase 2: Apple Health Integration

To add iOS support (Apple Health):
1. Create `js/appleHealthIntegration.js` (similar structure to googleFitIntegration.js)
2. Use HealthKit framework via web wrapper
3. Fallback to manual input on iOS web

### Phase 3: Cloud Sync

Store activity data on a backend server:
1. Create `/api/activity` endpoint
2. Sync localStorage → server on new record
3. Fetch from server on app load
4. Enable cross-device sync

### Phase 4: Advanced Analytics

Add charts and trends:
```javascript
// Example: Weekly TDEE trend
const weekData = activityLog.slice(-7);
const avgTDEE = weekData.reduce((sum, r) => sum + r.totalTDEE, 0) / weekData.length;
```

---

## 💬 Questions?

If you run into issues:

1. Check the **Troubleshooting** section above
2. Check **browser console** (F12 → Console tab) for error messages
3. Verify all files are in correct locations
4. Check that script tag order is correct

---

## 📝 License & Attribution

This Dynamic TDEE feature is designed to integrate seamlessly with Calman without breaking existing functionality. All modules follow vanilla JS patterns for maximum compatibility.
