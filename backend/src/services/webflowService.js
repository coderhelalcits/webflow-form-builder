const axios = require('axios');
const env = require('../config/env');

class WebflowService {
  /**
   * Generates OAuth Authorization URL for Webflow site connection
   */
  static getAuthUrl() {
    const clientId = env.WEBFLOW_CLIENT_ID || 'flowform_client_id';
    const redirectUri = encodeURIComponent(env.WEBFLOW_REDIRECT_URI);
    return `https://webflow.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=sites:read`;
  }

  /**
   * Exchanges OAuth code for access token
   * @param {string} code 
   */
  static async exchangeCodeForToken(code) {
    if (!env.WEBFLOW_CLIENT_ID || !env.WEBFLOW_CLIENT_SECRET) {
      // Development mock mode fallback
      console.log('[WebflowService] Webflow OAuth credentials not provided, returning mock token.');
      return {
        access_token: 'mock_webflow_access_token_' + Date.now(),
        token_type: 'bearer',
        site_id: 'webflow_site_12345'
      };
    }

    try {
      const response = await axios.post('https://api.webflow.com/oauth/access_token', {
        client_id: env.WEBFLOW_CLIENT_ID,
        client_secret: env.WEBFLOW_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      });
      return response.data;
    } catch (error) {
      console.error('[WebflowService] Token exchange failed:', error.response?.data || error.message);
      throw new Error('Failed to connect with Webflow API.');
    }
  }

  /**
   * Fetches user's Webflow sites using an access token
   * @param {string} accessToken 
   */
  static async getSites(accessToken) {
    if (!accessToken || accessToken.startsWith('mock_')) {
      return [
        { id: 'site_design_agency', name: 'My Webflow Agency Site', shortName: 'agency-site', customDomains: ['agency.webflow.io'] },
        { id: 'site_saas_landing', name: 'FlowForm SaaS Landing Page', shortName: 'saas-landing', customDomains: ['flowform.webflow.io'] }
      ];
    }

    try {
      const response = await axios.get('https://api.webflow.com/v2/sites', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Version': '2.0.0'
        }
      });
      return response.data.sites || [];
    } catch (error) {
      console.error('[WebflowService] Get sites failed:', error.response?.data || error.message);
      return [];
    }
  }
}

module.exports = WebflowService;
