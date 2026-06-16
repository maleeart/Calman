/**
 * Dynamic TDEE UI Module
 * Purpose: Render sync button, activity input form, and display calculated TDEE
 * 
 * Dependencies:
 * - TDEECalculator (tdeeCalculator.js)
 * - GoogleFitIntegration (googleFitIntegration.js)
 * 
 * Design: Non-breaking - adds UI elements alongside existing TDEE display
 */

const DynamicTdeeUI = (() => {
  
  // State
  let userProfile = null;
  let activityLog = []; // Store daily activity records
  let isLoading = false;

  /**
   * Initialize the Dynamic TDEE UI
   * Should be called from index.html after user profile is set
   * 
   * @param {object} profile - { weight, height, age, gender, activityMultiplier, tdeeBasis? }
   *   - tdeeBasis: 'sedentary' (default) or 'activity-adjusted'
   * @param {string} containerId - HTML element ID where UI will be inserted
   */
  const init = (profile, containerId = 'dynamic-tdee-container') => {
    userProfile = {
      ...profile,
      tdeeBasis: profile.tdeeBasis || 'sedentary'  // Default to sedentary
    };
    console.log('DynamicTdeeUI initialized with profile:', userProfile);

    // Load stored activity log from localStorage
    loadActivityLog();

    // Restore Google Fit token if available
    GoogleFitIntegration.restoreToken();

    // Render the UI
    renderUI(containerId);
  };

  /**
   * Load activity log from localStorage
   */
  const loadActivityLog = () => {
    const stored = localStorage.getItem('calman_activity_log');
    if (stored) {
      try {
        activityLog = JSON.parse(stored);
        console.log('Loaded activity log:', activityLog);
      } catch (error) {
        console.error('Error parsing stored activity log:', error);
        activityLog = [];
      }
    }
  };

  /**
   * Save activity log to localStorage
   */
  const saveActivityLog = () => {
    localStorage.setItem('calman_activity_log', JSON.stringify(activityLog));
  };

  /**
   * Add or update activity record for a specific date
   */
  const addActivityRecord = (record) => {
    // Check if record for this date already exists
    const existingIndex = activityLog.findIndex(r => r.date === record.date);
    
    if (existingIndex >= 0) {
      activityLog[existingIndex] = { ...activityLog[existingIndex], ...record };
    } else {
      activityLog.push(record);
    }

    saveActivityLog();
  };

  /**
   * Get activity record for a specific date
   */
  const getActivityForDate = (dateStr) => {
    return activityLog.find(r => r.date === dateStr) || null;
  };

  /**
   * Render the main UI section
   */
  const renderUI = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const todayActivity = getActivityForDate(today);

    container.innerHTML = `
      <div style="margin-top: 2rem; padding: 1.5rem; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #4285f4;">
        <h3 style="margin: 0 0 1rem 0; color: #333; font-size: 1.1rem;">Dynamic TDEE</h3>
        
        <!-- TDEE Calculation Method -->
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: white; border-radius: 6px; border: 1px solid #e0e0e0;">
          <p style="font-size: 0.85rem; color: #666; margin: 0 0 0.5rem 0; font-weight: 500;">📊 TDEE Calculation Method:</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
              <input type="radio" name="tdee-basis" value="sedentary" 
                ${userProfile.tdeeBasis === 'sedentary' ? 'checked' : ''} 
                onchange="DynamicTdeeUI.changeTdeeMethod(this.value)"
                style="cursor: pointer;">
              <span>
                <strong>Sedentary Base</strong><br>
                <span style="font-size: 0.8rem; color: #999;">(1.2 multiplier + activity bonus)</span>
              </span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
              <input type="radio" name="tdee-basis" value="activity-adjusted" 
                ${userProfile.tdeeBasis === 'activity-adjusted' ? 'checked' : ''} 
                onchange="DynamicTdeeUI.changeTdeeMethod(this.value)"
                style="cursor: pointer;">
              <span>
                <strong>Activity-Adjusted</strong><br>
                <span style="font-size: 0.8rem; color: #999;">(Your multiplier + bonus)</span>
              </span>
            </label>
          </div>
          <p style="font-size: 0.75rem; color: #999; margin: 0.5rem 0 0 0; line-height: 1.4;">
            💡 <strong>Tip:</strong> Use "Sedentary Base" if your activity varies a lot day-to-day. Use "Activity-Adjusted" to preserve your typical weekly average.
          </p>
        </div>
        
        <!-- Google Fit Sync Section -->
        <div id="gfit-section" style="margin-bottom: 1.5rem;">
          <p style="font-size: 0.9rem; color: #666; margin: 0 0 0.5rem 0;">Sync activity from Google Fit:</p>
          <button id="gfit-login-btn" onclick="DynamicTdeeUI.handleGFitLogin()" 
            style="padding: 0.6rem 1rem; margin-right: 0.5rem; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
            🔗 Login Google Fit
          </button>
          <button id="gfit-sync-btn" onclick="DynamicTdeeUI.handleGFitSync()" 
            style="padding: 0.6rem 1rem; background: #34a853; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; display: none;">
            ↻ Sync Today's Data
          </button>
          <span id="gfit-status" style="font-size: 0.85rem; color: #666; margin-left: 1rem;"></span>
        </div>

        <!-- Manual Activity Input Section -->
        <div style="margin-bottom: 1.5rem;">
          <p style="font-size: 0.9rem; color: #666; margin: 0 0 0.5rem 0;">Or manually input activity:</p>
          <form id="activity-form" onsubmit="DynamicTdeeUI.handleManualInput(event)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label style="font-size: 0.85rem; color: #666; display: block; margin-bottom: 0.3rem;">Steps</label>
                <input type="number" id="step-input" placeholder="0" min="0" max="50000" 
                  value="${todayActivity?.stepCount || ''}"
                  style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
              <div>
                <label style="font-size: 0.85rem; color: #666; display: block; margin-bottom: 0.3rem;">Active Calories</label>
                <input type="number" id="calories-input" placeholder="0" min="0" max="5000" 
                  value="${todayActivity?.activeCalories || ''}"
                  style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
            </div>

            <div style="margin-bottom: 1rem;">
              <label style="font-size: 0.85rem; color: #666; display: block; margin-bottom: 0.3rem;">Exercise Type</label>
              <select id="exercise-type" 
                style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                <option value="other" ${todayActivity?.exerciseType === 'other' ? 'selected' : ''}>Other / None</option>
                <option value="running" ${todayActivity?.exerciseType === 'running' ? 'selected' : ''}>Running</option>
                <option value="weights" ${todayActivity?.exerciseType === 'weights' ? 'selected' : ''}>Strength Training</option>
                <option value="cycling" ${todayActivity?.exerciseType === 'cycling' ? 'selected' : ''}>Cycling</option>
                <option value="cardio" ${todayActivity?.exerciseType === 'cardio' ? 'selected' : ''}>Cardio</option>
              </select>
            </div>

            <button type="submit" 
              style="padding: 0.6rem 1rem; background: #ea4335; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; width: 100%;">
              Calculate Dynamic TDEE
            </button>
          </form>
        </div>

        <!-- Results Display Section -->
        <div id="results-section" style="display: none; padding: 1rem; background: white; border-radius: 4px; border: 1px solid #ddd;">
          <h4 style="margin: 0 0 1rem 0; color: #333; font-size: 1rem;">Today's TDEE Breakdown</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div style="padding: 1rem; background: #f0f4ff; border-radius: 4px;">
              <p style="font-size: 0.85rem; color: #666; margin: 0 0 0.3rem 0;">Base TDEE</p>
              <p id="base-tdee" style="font-size: 1.5rem; font-weight: bold; margin: 0; color: #333;">-</p>
            </div>
            <div style="padding: 1rem; background: #f0fff4; border-radius: 4px;">
              <p style="font-size: 0.85rem; color: #666; margin: 0 0 0.3rem 0;">Activity Bonus</p>
              <p id="bonus-tdee" style="font-size: 1.5rem; font-weight: bold; margin: 0; color: #34a853;">+0</p>
            </div>
          </div>

          <div style="padding: 1rem; background: #fff8f0; border-radius: 4px; border: 2px solid #fbbc04;">
            <p style="font-size: 0.85rem; color: #666; margin: 0 0 0.3rem 0;">Total Dynamic TDEE Today</p>
            <p id="total-tdee" style="font-size: 2rem; font-weight: bold; margin: 0; color: #ea4335;">-</p>
          </div>

          <div style="margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 4px; font-size: 0.85rem; color: #666;">
            <p id="breakdown-detail" style="margin: 0; line-height: 1.6;">-</p>
          </div>
        </div>
      </div>
    `;

    // Update Google Fit button visibility based on auth status
    updateGFitButtonState();

    // Listen for Google Fit auth messages
    window.addEventListener('message', handleAuthMessage, false);
  };

  /**
   * Update Google Fit button visibility
   */
  const updateGFitButtonState = () => {
    const loginBtn = document.getElementById('gfit-login-btn');
    const syncBtn = document.getElementById('gfit-sync-btn');

    if (GoogleFitIntegration.isAuthenticated()) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (syncBtn) syncBtn.style.display = 'inline-block';
    } else {
      if (loginBtn) loginBtn.style.display = 'inline-block';
      if (syncBtn) syncBtn.style.display = 'none';
    }
  };

  /**
   * Handle Google Fit login button click
   */
  const handleGFitLogin = async () => {
    console.log('Initiating Google Fit login...');
    
    // Check if CLIENT_ID is configured
    if (GoogleFitIntegration.CONFIG.CLIENT_ID.includes('YOUR_GOOGLE')) {
      alert('⚠️ Google Fit integration not configured.\n\nSteps:\n1. Create OAuth credentials at console.cloud.google.com\n2. Update CLIENT_ID in googleFitIntegration.js\n3. Enable Google Fit API');
      return;
    }

    GoogleFitIntegration.initiateLogin();
  };

  /**
   * Handle auth message from Google Fit popup
   */
  const handleAuthMessage = (event) => {
    if (event.data.type === 'GOOGLE_FIT_AUTH_SUCCESS') {
      console.log('Auth successful!');
      updateGFitButtonState();
      
      const status = document.getElementById('gfit-status');
      if (status) {
        status.textContent = '✓ Connected to Google Fit';
        status.style.color = '#34a853';
      }
    }
  };

  /**
   * Handle Google Fit sync button click
   */
  const handleGFitSync = async () => {
    if (isLoading) return;

    isLoading = true;
    const syncBtn = document.getElementById('gfit-sync-btn');
    const status = document.getElementById('gfit-status');
    
    if (syncBtn) syncBtn.disabled = true;
    if (status) {
      status.textContent = '⟳ Syncing...';
      status.style.color = '#666';
    }

    try {
      // Fetch data from Google Fit
      const today = new Date().toISOString().split('T')[0];
      const summary = await GoogleFitIntegration.fetchDailySummary(today);

      // Update activity log
      addActivityRecord(summary);

      // Populate form with fetched data
      document.getElementById('step-input').value = summary.stepCount;
      document.getElementById('calories-input').value = summary.activeCalories;

      if (status) {
        status.textContent = '✓ Data synced from Google Fit';
        status.style.color = '#34a853';
      }

      console.log('Google Fit sync successful:', summary);
    } catch (error) {
      console.error('Sync error:', error);
      if (status) {
        status.textContent = '✗ Sync failed. Check console.';
        status.style.color = '#ea4335';
      }
    } finally {
      isLoading = false;
      if (syncBtn) syncBtn.disabled = false;
    }
  };

  /**
   * Handle manual activity input form submission
   */
  const handleManualInput = (event) => {
    event.preventDefault();

    if (!userProfile) {
      alert('User profile not set. Call DynamicTdeeUI.init() first.');
      return;
    }

    // Get form values
    const stepCount = parseInt(document.getElementById('step-input').value) || 0;
    const activeCalories = parseInt(document.getElementById('calories-input').value) || 0;
    const exerciseType = document.getElementById('exercise-type').value;

    // Prepare day data
    const today = new Date().toISOString().split('T')[0];
    const dayData = {
      stepCount,
      activeCalories,
      exerciseType,
      date: today
    };

    // Calculate dynamic TDEE
    const result = TDEECalculator.calculateDynamicTDEE(userProfile, dayData);

    // Save to activity log
    addActivityRecord({
      ...dayData,
      baseTDEE: result.base.tdee,
      totalTDEE: result.total,
      timestamp: new Date().toISOString()
    });

    // Display results
    displayResults(result);

    console.log('Dynamic TDEE calculated:', result);
  };

  /**
   * Display calculated results in the UI
   */
  const displayResults = (result) => {
    const resultSection = document.getElementById('results-section');
    const baseTdee = document.getElementById('base-tdee');
    const bonusTdee = document.getElementById('bonus-tdee');
    const totalTdee = document.getElementById('total-tdee');
    const breakdown = document.getElementById('breakdown-detail');

    if (resultSection) resultSection.style.display = 'block';
    if (baseTdee) baseTdee.textContent = `${result.base.tdee} kcal`;
    if (bonusTdee) bonusTdee.textContent = `+${result.activity.totalActivityBonus} kcal`;
    if (totalTdee) totalTdee.textContent = `${result.total} kcal`;
    
    if (breakdown) {
      const details = `
        <strong>Breakdown:</strong><br>
        Base TDEE: ${result.base.tdee} kcal<br>
        ├─ Steps (${result.activity.stepCount}): +${result.activity.stepBonus} kcal<br>
        └─ Exercise (${result.activity.exerciseType}): +${result.activity.exerciseBonus} kcal<br>
        <strong style="color: #ea4335;">Total: ${result.total} kcal</strong>
      `;
      breakdown.innerHTML = details;
    }
  };

  /**
   * Handle TDEE method change
   */
  const changeTdeeMethod = (method) => {
    userProfile.tdeeBasis = method;
    console.log('Changed TDEE basis to:', method);
    
    // Re-display current results if any
    const stepInput = document.getElementById('step-input');
    const caloriesInput = document.getElementById('calories-input');
    
    if (stepInput?.value || caloriesInput?.value) {
      // Trigger recalculation with new method
      handleManualInput(new Event('submit'));
    }
  };

  /**
   * Expose public methods as window methods for onclick handlers
   */
  window.DynamicTdeeUI = {
    init,
    handleGFitLogin,
    handleGFitSync,
    handleManualInput,
    changeTdeeMethod,
    addActivityRecord,
    getActivityForDate,
    loadActivityLog,
    saveActivityLog
  };

  // Return private API for module testing
  return {
    init,
    renderUI,
    handleGFitSync,
    handleManualInput,
    displayResults,
    addActivityRecord,
    getActivityForDate
  };
})();

// Export for Node.js environments (optional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DynamicTdeeUI;
}
