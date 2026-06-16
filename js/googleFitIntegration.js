/**
 * Google Fit Integration Module
 * Purpose: Connect to Google Fit API to fetch daily steps and active calories
 * 
 * Setup:
 * 1. Create Google Cloud Project
 * 2. Enable Google Fit API
 * 3. Create OAuth 2.0 Web Client credentials
 * 4. Add redirect URI: https://yourdomain.com/callback.html (or http://localhost:8000 for dev)
 * 5. Copy CLIENT_ID below
 * 
 * Permissions needed:
 * - https://www.googleapis.com/auth/fitness.activity.read
 * - https://www.googleapis.com/auth/fitness.body.read
 */

const GoogleFitIntegration = (() => {
  
  // Configuration - UPDATE WITH YOUR GOOGLE CLOUD PROJECT CREDENTIALS
  const CONFIG = {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace this
    REDIRECT_URI: window.location.origin + '/', // Adjust if needed
    SCOPE: [
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read'
    ].join(' '),
    AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
    TOKEN_URL: 'https://oauth2.googleapis.com/token',
    API_BASE: 'https://www.googleapis.com/fitness/v1/users/me'
  };

  // Store access token in sessionStorage (cleared on browser close)
  let accessToken = null;

  /**
   * Step 1: Initiate OAuth login flow
   * Opens Google login dialog in a new window
   */
  const initiateLogin = () => {
    const params = new URLSearchParams({
      client_id: CONFIG.CLIENT_ID,
      redirect_uri: CONFIG.REDIRECT_URI,
      response_type: 'token',
      scope: CONFIG.SCOPE,
      access_type: 'offline'
    });

    const authUrl = `${CONFIG.AUTH_URL}?${params}`;
    console.log('Opening Google Fit login:', authUrl);
    
    // Open in popup (Calman can capture callback)
    const popup = window.open(authUrl, 'google_fit_login', 'width=500,height=600');
    
    if (!popup) {
      alert('Please allow popups to login with Google Fit');
      return false;
    }

    return true;
  };

  /**
   * Step 2: Extract token from URL hash (called from redirect page)
   * Parse: https://yourdomain.com/#access_token=...&expires_in=...
   * 
   * @returns {object|null} { access_token, expires_in, token_type }
   */
  const extractTokenFromHash = () => {
    const hash = window.location.hash.substring(1);
    if (!hash) return null;

    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (token) {
      return {
        access_token: token,
        expires_in: expiresIn,
        token_type: params.get('token_type') || 'Bearer'
      };
    }
    return null;
  };

  /**
   * Step 3: Store token and notify parent window
   * Callback from OAuth redirect - stores token and sends to parent
   */
  const handleAuthCallback = () => {
    const token = extractTokenFromHash();
    if (token) {
      accessToken = token.access_token;
      sessionStorage.setItem('google_fit_token', token.access_token);
      
      // Notify parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_FIT_AUTH_SUCCESS',
          token: token
        }, window.location.origin);
        
        console.log('Token sent to parent window, closing...');
        window.close();
      }
    }
  };

  /**
   * Step 4: Restore token from sessionStorage (on page load)
   * 
   * @returns {string|null} Access token if valid
   */
  const restoreToken = () => {
    const stored = sessionStorage.getItem('google_fit_token');
    if (stored) {
      accessToken = stored;
      return stored;
    }
    return null;
  };

  /**
   * Verify token is valid by making a test API call
   * 
   * @returns {Promise<boolean>}
   */
  const verifyToken = async () => {
    if (!accessToken) return false;

    try {
      const response = await fetch(`${CONFIG.API_BASE}/dataset:aggregate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aggregateBy: [{
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: Date.now() - 86400000,
          endTimeMillis: Date.now()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };

  /**
   * Fetch daily step count from Google Fit
   * 
   * @param {string} dateStr - YYYY-MM-DD format (default: today)
   * @returns {Promise<number>} Step count for the day
   */
  const fetchStepCount = async (dateStr = null) => {
    if (!accessToken) {
      console.warn('GoogleFitIntegration: No access token. Call initiateLogin() first.');
      return 0;
    }

    const date = dateStr ? new Date(dateStr) : new Date();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const startTimeMillis = startOfDay.getTime();
    const endTimeMillis = endOfDay.getTime();

    try {
      const response = await fetch(`${CONFIG.API_BASE}/dataset:aggregate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aggregateBy: [{
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTimeMillis,
          endTimeMillis: endTimeMillis
        })
      });

      if (!response.ok) {
        throw new Error(`Google Fit API error: ${response.status}`);
      }

      const data = await response.json();

      // Extract step count from response
      let totalSteps = 0;
      if (data.bucket && data.bucket.length > 0) {
        const bucket = data.bucket[0];
        if (bucket.dataset && bucket.dataset.length > 0) {
          const dataset = bucket.dataset[0];
          if (dataset.point && dataset.point.length > 0) {
            totalSteps = dataset.point[0].value[0].intVal || 0;
          }
        }
      }

      console.log(`Fetched ${totalSteps} steps for ${dateStr || 'today'}`);
      return totalSteps;
    } catch (error) {
      console.error('Error fetching step count:', error);
      return 0;
    }
  };

  /**
   * Fetch active calories burned from Google Fit
   * Note: This may vary by device and Google Fit implementation
   * 
   * @param {string} dateStr - YYYY-MM-DD format (default: today)
   * @returns {Promise<number>} Active calories burned
   */
  const fetchActiveCalories = async (dateStr = null) => {
    if (!accessToken) {
      console.warn('GoogleFitIntegration: No access token. Call initiateLogin() first.');
      return 0;
    }

    const date = dateStr ? new Date(dateStr) : new Date();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const startTimeMillis = startOfDay.getTime();
    const endTimeMillis = endOfDay.getTime();

    try {
      const response = await fetch(`${CONFIG.API_BASE}/dataset:aggregate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aggregateBy: [{
            dataTypeName: 'com.google.calories.expended'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTimeMillis,
          endTimeMillis: endTimeMillis
        })
      });

      if (!response.ok) {
        throw new Error(`Google Fit API error: ${response.status}`);
      }

      const data = await response.json();

      let totalCalories = 0;
      if (data.bucket && data.bucket.length > 0) {
        const bucket = data.bucket[0];
        if (bucket.dataset && bucket.dataset.length > 0) {
          const dataset = bucket.dataset[0];
          if (dataset.point && dataset.point.length > 0) {
            totalCalories = dataset.point[0].value[0].fpVal || 0;
          }
        }
      }

      console.log(`Fetched ${totalCalories.toFixed(0)} calories for ${dateStr || 'today'}`);
      return totalCalories;
    } catch (error) {
      console.error('Error fetching active calories:', error);
      return 0;
    }
  };

  /**
   * Fetch comprehensive daily summary: steps + active calories
   * 
   * @param {string} dateStr - YYYY-MM-DD format (default: today)
   * @returns {Promise<object>} { stepCount, activeCalories, date, fetchedAt }
   */
  const fetchDailySummary = async (dateStr = null) => {
    const date = dateStr || new Date().toISOString().split('T')[0];

    try {
      console.log('Fetching Google Fit data for:', date);
      
      const [steps, calories] = await Promise.all([
        fetchStepCount(date),
        fetchActiveCalories(date)
      ]);

      return {
        stepCount: steps,
        activeCalories: Math.round(calories),
        date: date,
        fetchedAt: new Date().toISOString(),
        source: 'google_fit'
      };
    } catch (error) {
      console.error('Error fetching daily summary:', error);
      throw error;
    }
  };

  /**
   * Logout: Clear stored token
   */
  const logout = () => {
    accessToken = null;
    sessionStorage.removeItem('google_fit_token');
    console.log('Google Fit token cleared');
  };

  /**
   * Check if user is authenticated
   * 
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return accessToken !== null || restoreToken() !== null;
  };

  // Public API
  return {
    CONFIG,
    initiateLogin,
    extractTokenFromHash,
    handleAuthCallback,
    restoreToken,
    verifyToken,
    fetchStepCount,
    fetchActiveCalories,
    fetchDailySummary,
    logout,
    isAuthenticated
  };
})();

// Export for Node.js environments (optional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoogleFitIntegration;
}
