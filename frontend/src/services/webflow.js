import api from './api';

export const connectWebflowSite = async (siteId, code) => {
  return await api.post('/auth/webflow/connect', { siteId, code });
};

export const getWebflowAuthUrl = async () => {
  return await api.get('/auth/webflow/url');
};

export const getWebflowSites = async () => {
  return [
    { id: 'site_design_agency', name: 'My Webflow Agency Site', shortName: 'agency-site', status: 'Connected' },
    { id: 'site_saas_landing', name: 'FlowForm SaaS Landing Page', shortName: 'saas-landing', status: 'Connected' }
  ];
};
