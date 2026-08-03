import { useState, useEffect } from 'react';
import { connectWebflowSite, getWebflowSites } from '../services/webflow';

export const useWebflow = (user) => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectedSiteId, setConnectedSiteId] = useState(user?.webflowSiteId || null);

  useEffect(() => {
    if (user?.webflowSiteId) {
      setConnectedSiteId(user.webflowSiteId);
    }
    fetchSites();
  }, [user]);

  const fetchSites = async () => {
    setLoading(true);
    try {
      const data = await getWebflowSites();
      setSites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (siteId, code) => {
    setLoading(true);
    setError(null);
    try {
      const res = await connectWebflowSite(siteId, code);
      if (res.success) {
        setConnectedSiteId(res.webflowSiteId);
        return true;
      }
    } catch (err) {
      setError(err.message || 'Failed to connect Webflow site.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sites,
    connectedSiteId,
    loading,
    error,
    connectSite: handleConnect,
    refreshSites: fetchSites
  };
};
