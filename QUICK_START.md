# Dynamic TDEE Feature - Quick Start (5 minutes)

## 🎯 Goal
Add activity-based TDEE adjustment to Calman without breaking existing code.

---

## ⚡ Minimal Setup (Copy-Paste)

### 1️⃣ Add 3 Files to Your Project

Copy these files to `Calman/js/`:
- `tdeeCalculator.js`
- `googleFitIntegration.js`
- `dynamicTdeeUI.js`

### 2️⃣ Add Scripts to index.html

Add this **before closing `</body>`**:

```html
<script src="js/tdeeCalculator.js"></script>
<script src="js/googleFitIntegration.js"></script>
<script src="js/dynamicTdeeUI.js"></script>
```

### 3️⃣ Add Container to index.html

Add this **anywhere you want the UI to appear** (e.g., after your TDEE display):

```html
<div id="dynamic-tdee-container"></div>
```

### 4️⃣ Initialize in Your JavaScript

Add this **after you have user profile data**:

```javascript
// When user enters their profile (weight, height, age, etc.)
const userProfile = {
  weight: 70,              // kg
  height: 180,             // cm
  age: 28,
  gender: 'male',
  activityMultiplier: 1.55 // Your activity level from existing code
};

// Initialize the Dynamic TDEE UI
DynamicTdeeUI.init(userProfile, 'dynamic-tdee-container');
```

### 5️⃣ (Optional) Setup Google Fit API

For automatic step/calorie sync:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → Enable Google Fit API
3. Create OAuth credentials (Web application)
4. Copy Client ID → Update `googleFitIntegration.js`:

```javascript
CLIENT_ID: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
```

---

## ✨ What You Get

After setup, users see:

```
┌─────────────────────────────────────────┐
│  Dynamic TDEE                           │
├─────────────────────────────────────────┤
│ 🔗 Login Google Fit  ↻ Sync Today's    │
│                                         │
│ Or manually input activity:             │
│ Steps: [12000]  Active Cal: [450]       │
│ Exercise: [Running ▼]                   │
│ [Calculate Dynamic TDEE]                │
│                                         │
│ ─ Results ─                             │
│ Base TDEE: 2550 kcal                   │
│ Activity Bonus: +833 kcal  ↑           │
│                                         │
│ ═══════════════════════════════════════ │
│ Total Dynamic TDEE: 3383 kcal          │
│ ═══════════════════════════════════════ │
│                                         │
│ Base: 2550 + Steps: 315 + Ex: 518      │
└─────────────────────────────────────────┘
```

---

## 🧪 Test It

After adding the code:

1. Open Calman in your browser
2. Enter profile (weight, height, age, activity level)
3. You should see the Dynamic TDEE section appear
4. Enter steps/calories manually or click "Login Google Fit"
5. Click "Calculate Dynamic TDEE" or sync
6. See the breakdown!

---

## 🔧 Existing Code - No Changes Needed!

Your current TDEE calculation stays exactly as is:

```javascript
// YOUR EXISTING CODE - UNTOUCHED
bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
globalTDEE = Math.round(bmr * act);  // Still works the same
```

The Dynamic TDEE feature is **completely separate** and optional. Users can ignore it or use it alongside your existing calorie tracking.

---

## 📊 How It Calculates

```
Dynamic TDEE = Base TDEE + Activity Bonus

Base TDEE:
  = Your existing formula (Mifflin-St Jeor)
  = BMR × Activity Multiplier

Activity Bonus:
  = Step Bonus + Exercise Bonus
  
Step Bonus:
  = (steps - 5000) × 0.045 kcal/step
  = Reward for steps above sedentary level
  
Exercise Bonus:
  = Active Calories × (1.05 to 1.20)
  = Depends on exercise type (EPOC effect)
  = Running: +15% | Weights: +20% | Other: +5%
```

**Example:**
- Base TDEE: 2550 kcal/day
- Steps today: 12,000 → Bonus: (12000-5000) × 0.045 = 315 kcal
- Running 30 min: 450 active cal → Bonus: 450 × 1.15 = 518 kcal
- **Total: 2550 + 315 + 518 = 3383 kcal**

---

## 📱 Where's My Data?

Activity records are saved in **browser localStorage**:

```javascript
// Check your data in browser console (F12):
JSON.parse(localStorage.getItem('calman_activity_log'))

// Output:
[
  {
    "date": "2025-06-16",
    "stepCount": 12000,
    "activeCalories": 450,
    "exerciseType": "running",
    "totalTDEE": 3383
  }
]
```

Data persists even after closing the browser.

---

## ⚙️ Configuration (Advanced)

Want to tweak the calculations?

### Step Bonus Sensitivity

In `tdeeCalculator.js`, change these:

```javascript
const SEDENTARY_BASELINE = 5000;  // Change to adjust "baseline"
const KCAL_PER_STEP = 0.045;      // Change to 0.05 for more bonus
```

### Exercise Multipliers

In `tdeeCalculator.js`, modify `calculateExerciseBonus()`:

```javascript
case 'running':
  bonus = activeCalories * 1.15;  // Change 1.15 to other value
  break;
case 'weights':
  bonus = activeCalories * 1.20;  // Change 1.20 for strength training
  break;
```

Higher = more generous bonus for that activity type.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| UI not showing | Check `<div id="dynamic-tdee-container"></div>` exists |
| "DynamicTdeeUI undefined" | Verify all 3 `.js` files are loaded (check F12 console) |
| Google Fit won't login | Set CLIENT_ID in googleFitIntegration.js |
| Calculations seem wrong | Check userProfile is initialized with correct values |

---

## 📚 Full Documentation

See **INTEGRATION_GUIDE.md** for:
- Detailed step-by-step setup
- Module API reference
- Google Fit detailed configuration
- Deployment checklist
- Phase 2+ roadmap

---

## 🚀 You're Ready!

Your Calman now supports:
- ✅ Manual activity input (steps, calories, exercise type)
- ✅ Dynamic TDEE calculation (base + bonuses)
- ✅ Google Fit sync (optional)
- ✅ Data persistence (localStorage)
- ✅ Zero breaking changes to existing code

**Next**: Go through INTEGRATION_GUIDE.md for the detailed walkthrough, or reach out if you have questions!
