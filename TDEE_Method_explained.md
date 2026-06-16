# Dynamic TDEE: Double-Counting Problem & Solutions

## ⚠️ ปัญหา: Double-Counting Activity

### เข้าใจปัญหา

Activity Multiplier ในสูตร TDEE แบบดั้งเดิม (เช่น 1.55) **รวมการออกกำลังและเดินเข้าไปแล้ว**

```
Traditional TDEE Formula:
TDEE = BMR × Activity Multiplier

Activity Multiplier Levels:
• 1.2 = Sedentary (no exercise, desk job)
• 1.375 = Lightly active (1-3 days/week exercise)
• 1.55 = Moderately active (3-5 days/week exercise) ← รวมการออกกำลังแล้ว
• 1.725 = Very active (6-7 days/week)
• 1.9 = Extremely active (2× per day)
```

**ตัวอย่าง:**
```
Calman user:
BMR = 1700 kcal
Activity Multiplier = 1.55 (typical 3-5 days/week exercise)

Base TDEE = 1700 × 1.55 = 2635 kcal
            ↑ This already includes typical weekly exercise

Then if we add Dynamic bonus:
+ Step Bonus: 315 kcal
+ Exercise Bonus: 518 kcal
────────────────────
Total: 2635 + 315 + 518 = 3468 kcal ❌ DOUBLE-COUNTED!

เพราะว่า 2635 kcal รวมการออกกำลังแบบปกติแล้ว
แล้วเราบวก exercise bonus อีก → ซ้ำ!
```

---

## ✅ วิธีแก้: 2 Options

### Option A: SEDENTARY BASELINE (แนะนำ!)

**คิดเห็น:** ใช้ sedentary multiplier (1.2) เป็น base ที่ไม่มีการออกกำลัง แล้วบวก activity bonus ตามกิจกรรมจริง

**ตัวอย่าง:**
```
BMR = 1700 kcal

วันพัก (ไม่ออกกำลัง):
Base TDEE = 1700 × 1.2 = 2040 kcal ✓
+ Activity bonus = 0 (no steps/exercise)
= 2040 kcal (ถูกต้อง)

วันเดินเยอะ (12,000 steps):
Base TDEE = 1700 × 1.2 = 2040 kcal
+ Step Bonus = 315 kcal
= 2355 kcal ✓

วันวิ่ง (12,000 steps + 450 cal running):
Base TDEE = 1700 × 1.2 = 2040 kcal
+ Step Bonus = 315 kcal
+ Exercise Bonus = 518 kcal
= 2873 kcal ✓ (ไม่ซ้ำ!)
```

**ข้อดี:**
✅ ไม่มี double-counting
✅ ตรงกับความเป็นจริง (วันไหนเดิน/ออกกำลัง บางนั้น)
✅ หากผู้ใช้มีกิจกรรมแปรผัน (บางวันเยอะ บางวันน้อย) ดีที่สุด

**ข้อเสีย:**
❌ Base TDEE ลดลงจากค่า 1.55 เดิม
❌ ต้องเปลี่ยนวิธีคิดจากเดิม

---

### Option B: ACTIVITY-ADJUSTED BASELINE

**คิดเห็น:** ใช้ activity multiplier ที่ให้ (เช่น 1.55) แต่อ่านว่า "typical weekly average" แล้วปรับแต่งละเอียด

**ตัวอย่าง:**
```
Activity Multiplier 1.55 = typical week (4 days exercise, 3 days rest)
Base TDEE = 1700 × 1.55 = 2635 kcal

วันพัก:
ต้องลดจาก 2635 ลง (because no exercise)
= 2635 - (normal exercise calories) + 0
= ??? (complex calculation)

วันออกกำลังมาก:
ต้องบวกเพิ่ม (because more than typical week)
= 2635 + (extra exercise bonus)
```

**ข้อดี:**
✅ Preserve ค่า 1.55 เดิมของผู้ใช้
✅ Maintain weekly average

**ข้อเสีย:**
❌ ซับซ้อน ต้องรู้ "normal exercise" baseline
❌ ยังมี double-counting ถ้าคำนวณผิด
❌ ไม่ดี สำหรับ sedentary multiplier (1.2)

---

## 🎯 ข้อแนะนำ: ใช้ Option A (Sedentary)

**เหตุผล:**

1. **ถูกต้องทางวิทยาศาสตร์**
   - ไม่มี double-counting
   - TDEE สะท้อน actual activity ของวันนั้น

2. **ง่ายต่อการเข้าใจ**
   - วันไม่ออกกำลัง = 2040 kcal
   - วันออกกำลัง = 2040 + bonus

3. **เหมาะสำหรับ Calman**
   - Calman track food + activity
   - Dynamic TDEE ต้องตรงกับ activity จริง

---

## 🔧 วิธีใช้ในโค้ด

### ตัวเลือก 1: ตั้งเป็น Default (Sedentary)

```javascript
const userProfile = {
  weight: 70,
  height: 180,
  age: 28,
  gender: 'male',
  activityMultiplier: 1.55,
  tdeeBasis: 'sedentary'  // ← ใช้ 1.2 sedentary เป็น base
};

DynamicTdeeUI.init(userProfile, 'dynamic-tdee-container');
```

**ผลลัพธ์:**
- Base TDEE จะเป็น: 1700 × 1.2 = 2040 kcal
- activityMultiplier 1.55 ถูกเก็บไว้เฉพาะสำหรับ reference

### ตัวเลือก 2: ให้ผู้ใช้เลือก

UI ของเรา มีตัวเลือก radio button ให้เลือก:
- "Sedentary Base" (1.2 + activity bonus)
- "Activity-Adjusted" (1.55 + adjustment)

ผู้ใช้สามารถสลับได้ตลอด

---

## 📊 เปรียบเทียบ 2 Methods

| Aspect | Sedentary Base | Activity-Adjusted |
|--------|----------------|------------------|
| **Base Formula** | BMR × 1.2 | BMR × user multiplier |
| **Double-counting** | ❌ No | ⚠️ Possible |
| **Simplicity** | ✅ Easy | ❌ Complex |
| **For variable activity** | ✅ Best | ❌ Not ideal |
| **Daily accuracy** | ✅ High | ⚠️ Medium |
| **Preserves original multiplier** | ❌ No | ✅ Yes |

---

## 🧮 สูตรทั้งสอง

### Sedentary Base

```
Dynamic TDEE = (BMR × 1.2) + StepBonus + ExerciseBonus

Where:
  BMR = (10×weight) + (6.25×height) - (5×age) ± 5 (±161 female)
  StepBonus = max(0, (steps - 5000) × 0.045)
  ExerciseBonus = calories × (1.05 to 1.20)

Example:
  BMR = 1700
  Steps = 12,000 → StepBonus = 7000 × 0.045 = 315
  Running 450 cal → ExerciseBonus = 450 × 1.15 = 518
  
  Dynamic TDEE = (1700 × 1.2) + 315 + 518
               = 2040 + 315 + 518
               = 2873 kcal ✓
```

### Activity-Adjusted Base

```
Dynamic TDEE = (BMR × userMultiplier) + AdjustmentBonus

Where:
  userMultiplier = original activity level (e.g., 1.55)
  AdjustmentBonus = (actual exercise) - (baseline exercise) + extra bonus
  
This requires knowing the "baseline exercise" for that multiplier.
  e.g., if 1.55 assumes 4 days/week, calculate baseline calories
  Then adjust up/down from there

Example:
  BMR × 1.55 = 2635 kcal (assumes typical 4 days exercise)
  
  If user exercises MORE than typical:
    + Extra bonus
    
  If user exercises LESS:
    - Reduction
    
  ⚠️ Requires careful baseline calculation
```

---

## 💡 Practical Example: Maleeart's Use Case

**Maleeart's Profile:**
- Weight: 70 kg
- Height: 180 cm
- Age: 28
- Activity Level: 1.55 (moderately active - 3-5 days/week)
- Activity Pattern: **Variable** (sometimes gym, sometimes no)
  - Some weeks: 5 days calisthenics + running
  - Some weeks: 2 days light activity
  - Some weeks: 1 day off

**Choice:** **SEDENTARY BASE** ✓

**Why:**
1. Activity varies a lot week-to-week
2. Dynamic TDEE should reflect ACTUAL activity each day
3. Simple to calculate and understand
4. No double-counting

**Daily Examples:**

```
วันที่ 1: Day off (ไม่ออกกำลัง, 3000 steps)
  Base: 1700 × 1.2 = 2040 kcal
  Bonus: (3000 - 5000) × 0.045 = 0 (below baseline)
  Total: 2040 kcal ← maintenance calories

วันที่ 2: Light day (5000 steps, light walk)
  Base: 2040 kcal
  Bonus: (5000 - 5000) × 0.045 = 0 (no bonus)
  Total: 2040 kcal

วันที่ 3: Workout day (12000 steps + 400 cal calisthenics)
  Base: 2040 kcal
  Step bonus: (12000 - 5000) × 0.045 = 315 kcal
  Exercise bonus: 400 × 1.20 = 480 kcal (weights = high EPOC)
  Total: 2040 + 315 + 480 = 2835 kcal

วันที่ 4: Heavy running day (15000 steps + 500 cal running)
  Base: 2040 kcal
  Step bonus: (15000 - 5000) × 0.045 = 450 kcal
  Exercise bonus: 500 × 1.15 = 575 kcal (running = EPOC)
  Total: 2040 + 450 + 575 = 3065 kcal
```

**Weekly Average:**
```
(2040 + 2040 + 2835 + 3065 + 2040) / 5 = 2404 kcal

Original 1.55 multiplier expected:
1700 × 1.55 = 2635 kcal

Different because Maleeart's actual activity < "moderately active (1.55)"
Dynamic TDEE จะแสดงความเป็นจริง not average assumption ✓
```

---

## 🔄 Implementation Timeline

✅ **Already Done:**
- Code updated to support both methods
- UI has radio button to choose
- Default = Sedentary (recommended)

📝 **Steps for Maleeart:**

1. Copy updated files (same 3 JS files)
2. In `index.html`, initialize with:
   ```javascript
   const userProfile = {
     weight: 70,
     height: 180,
     age: 28,
     gender: 'male',
     activityMultiplier: 1.55,
     tdeeBasis: 'sedentary'  // ← Default to Sedentary
   };
   DynamicTdeeUI.init(userProfile, 'dynamic-tdee-container');
   ```

3. Users can switch method in UI if they want

4. Done! ✓

---

## 📖 Summary

| Question | Answer |
|----------|--------|
| **ทำไมต้องเปลี่ยน multiplier?** | เพื่อหลีกเลี่ยง double-counting activity |
| **ต้องเปลี่ยนเป็น 1.2 ถาวรหรือ?** | ใช่ สำหรับ Dynamic TDEE ให้ถูกต้อง |
| **แล้วค่า 1.55 เดิมล่ะ?** | เก็บไว้เฉพาะ reference ไม่ใช้คำนวณ |
| **จะคืนไป 1.55 ได้ไหม?** | ได้ เลือก "Activity-Adjusted" ใน UI |
| **ผู้ใช้จะสับสนไหม?** | มี UI อธิบายอย่างชัดเจน + tooltip |
| **ตัวอักษรหรือตัวเลขตรงข้ามไปสังค์ที่ผ่านมา?** | ใช่ แต่ถูกต้องตามวิทยาศาสตร์ |

