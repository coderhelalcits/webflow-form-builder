import api from './api';

export const connectWebflowSite = async (siteId, code) => {
  return await api.post('/auth/webflow/connect', { siteId, code });
};

export const getWebflowSites = async () => {
  // In Phase 1, fetches connected Webflow site or returns mock list
  return [
    { id: 'site_design_agency', name: 'My Webflow Agency Site', shortName: 'agency-site', status: 'Connected' },
    { id: 'site_saas_landing', name: 'FlowForm SaaS Landing Page', shortName: 'saas-landing', status: 'Connected' }
  ];
};
