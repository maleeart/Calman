/**
 * Dynamic TDEE Calculator Module
 * Purpose: Calculate Base TDEE + Activity Bonus from daily metrics
 * 
 * Architecture:
 * - Standalone module (no dependencies)
 * - Called when user syncs Google Fit data or inputs activity manually
 * - Returns object with breakdown for UI display
 * - Does NOT modify existing globalTDEE (to avoid breaking changes)
 */

const TDEECalculator = (() => {
  
  /**
   * Calculate Base TDEE using Mifflin-St Jeor formula
   * @param {number} weight - Weight in kg
   * @param {number} height - Height in cm
   * @param {number} age - Age in years
   * @param {string} gender - 'male' or 'female'
   * @param {number} activityMultiplier - Activity level multiplier (e.g., 1.2, 1.55)
   * @returns {object} { bmr, tdee }
   */
  const calculateBaseTDEE = (weight, height, age, gender, activityMultiplier) => {
    let bmr;
    
    // Mifflin-St Jeor Formula (same as existing Calman formula for males)
    if (gender.toLowerCase() === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      // Female variant
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    const tdee = Math.round(bmr * activityMultiplier);
    
    return {
      bmr: Math.round(bmr),
      tdee: tdee
    };
  };

  /**
   * Calculate step-based activity bonus (kcal)
   * Formula: (steps - sedentaryBaseline) × costPerStep
   * 
   * Rationale:
   * - Average person burns ~0.04-0.05 kcal per step while walking
   * - Sedentary baseline = ~5000 steps/day (light movement)
   * - Only bonus for steps ABOVE baseline
   * 
   * @param {number} stepCount - Total steps for the day
   * @param {number} bodyWeight - Weight in kg (affects calorie burn)
   * @returns {number} Bonus kcal from steps
   */
  const calculateStepBonus = (stepCount, bodyWeight = 70) => {
    const SEDENTARY_BASELINE = 5000;
    const KCAL_PER_STEP = 0.045; // Adjusted for average person
    
    if (stepCount <= SEDENTARY_BASELINE) {
      return 0; // No bonus on sedentary days
    }
    
    const excessSteps = stepCount - SEDENTARY_BASELINE;
    const bonus = excessSteps * KCAL_PER_STEP;
    
    return Math.round(bonus * 10) / 10; // Round to 1 decimal
  };

  /**
   * Calculate exercise bonus from active calories (from Strava, Google Fit, manual input)
   * Adjustments applied based on exercise type for EPOC (Excess Post-Exercise Oxygen Consumption)
   * 
   * @param {number} activeCalories - Active calories burned (from app or manual)
   * @param {string} exerciseType - 'running' | 'weights' | 'cycling' | 'cardio' | 'other'
   * @returns {number} Adjusted bonus kcal
   */
  const calculateExerciseBonus = (activeCalories, exerciseType = 'other') => {
    if (!activeCalories || activeCalories <= 0) {
      return 0;
    }
    
    let bonus = activeCalories;
    
    // Apply EPOC multiplier (afterburn effect)
    // Research: intense exercise increases TDEE for hours after
    switch (exerciseType.toLowerCase()) {
      case 'running':
      case 'hiit':
        bonus = activeCalories * 1.15; // 15% afterburn boost
        break;
      case 'weights':
      case 'strength':
        bonus = activeCalories * 1.20; // 20% EPOC (muscle recovery is expensive)
        break;
      case 'cycling':
        bonus = activeCalories * 1.10; // 10% afterburn
        break;
      case 'cardio':
        bonus = activeCalories * 1.12; // 12% afterburn
        break;
      default:
        bonus = activeCalories * 1.05; // 5% default afterburn
    }
    
    return Math.round(bonus * 10) / 10; // Round to 1 decimal
  };

  /**
   * Main function: Calculate Dynamic TDEE for a specific day
   * 
   * @param {object} userProfile - { weight, height, age, gender, activityMultiplier }
   * @param {object} dayData - { stepCount, activeCalories, exerciseType, date }
   * @returns {object} Complete TDEE breakdown for the day
   * 
   * Example return value:
   * {
   *   date: "2025-06-16",
   *   base: { bmr: 1700, tdee: 2550 },
   *   activity: {
   *     stepCount: 12000,
   *     stepBonus: 315,
   *     activeCalories: 450,
   *     exerciseType: "running",
   *     exerciseBonus: 518,
   *     totalActivityBonus: 833
   *   },
   *   total: 3383,
   *   breakdown: "2550 (base) + 315 (steps) + 518 (exercise) = 3383 kcal"
   * }
   */
  const calculateDynamicTDEE = (userProfile, dayData) => {
    // Validate input
    if (!userProfile.weight || !userProfile.height || !userProfile.age) {
      console.warn('TDEECalculator: Missing user profile data', userProfile);
      return null;
    }

    const {
      weight,
      height,
      age,
      gender = 'male',
      activityMultiplier = 1.55
    } = userProfile;

    const {
      stepCount = 0,
      activeCalories = 0,
      exerciseType = 'other',
      date = new Date().toISOString().split('T')[0]
    } = dayData;

    // Calculate base TDEE
    const baseTDEE = calculateBaseTDEE(weight, height, age, gender, activityMultiplier);

    // Calculate activity bonuses
    const stepBonus = calculateStepBonus(stepCount, weight);
    const exerciseBonus = calculateExerciseBonus(activeCalories, exerciseType);
    const totalActivityBonus = stepBonus + exerciseBonus;

    // Total dynamic TDEE
    const totalTDEE = baseTDEE.tdee + totalActivityBonus;

    // Formatted breakdown for UI display
    const breakdown = `${baseTDEE.tdee} (base) + ${stepBonus} (steps) + ${exerciseBonus} (exercise) = ${Math.round(totalTDEE)} kcal`;

    return {
      date: date,
      base: baseTDEE,
      activity: {
        stepCount: stepCount,
        stepBonus: stepBonus,
        activeCalories: activeCalories,
        exerciseType: exerciseType,
        exerciseBonus: exerciseBonus,
        totalActivityBonus: totalActivityBonus
      },
      total: Math.round(totalTDEE),
      breakdown: breakdown,
      timestamp: new Date().toISOString()
    };
  };

  /**
   * Parse stored activity data and return latest Dynamic TDEE
   * Useful for initializing UI with previously synced data
   * 
   * @param {array} activityLog - Array of daily activity records
   * @param {string} dateStr - YYYY-MM-DD format (default: today)
   * @returns {object} Activity data for that day or null
   */
  const getActivityForDate = (activityLog, dateStr = null) => {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    return activityLog.find(record => record.date === targetDate) || null;
  };

  // Public API
  return {
    calculateBaseTDEE,
    calculateStepBonus,
    calculateExerciseBonus,
    calculateDynamicTDEE,
    getActivityForDate
  };
})();

// Export for Node.js environments (optional, for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TDEECalculator;
}
