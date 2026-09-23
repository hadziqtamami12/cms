import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchConfig } from '../lib/api';
import { DEFAULT_CONFIG } from '../lib/defaultConfig';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('cms_admin_token') || '');
  const [adminSlug, setAdminSlug] = useState('admin');
  const [licenseStatus, setLicenseStatus] = useState({
    isInstalled: false,
    isLocked: false,
    status: 'uninstalled',
    daysRemaining: 30
  });

  const loadConfig = async () => {
    try {
      setLoading(true);

      // Check local Static DB setup state first (written by client-side installer)
      let localSetup = null;
      try {
        const raw = localStorage.getItem('cms_setup_state');
        if (raw) localSetup = JSON.parse(raw);
      } catch {}

      const res = await fetchConfig();
      if (res && res.success && res.data) {
        setConfig(res.data);
        if (res.data.adminSlug) setAdminSlug(res.data.adminSlug);
        if (res.data.license) setLicenseStatus(res.data.license);
      } else if (localSetup && localSetup.isInstalled) {
        // Backend not available, but installer ran locally — use stored state
        if (localSetup.adminSlug) setAdminSlug(localSetup.adminSlug);
        const expiresAt = localSetup.expiresAt ? new Date(localSetup.expiresAt) : null;
        const daysRemaining = expiresAt
          ? Math.max(0, Math.floor((expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
          : 30;
        setLicenseStatus({
          isInstalled: true,
          isLocked: daysRemaining <= 0,
          status: daysRemaining > 0 ? 'active' : 'expired',
          daysRemaining,
          licenseKey: localSetup.licenseKey,
          licenseType: localSetup.licenseType || 'trial'
        });
      }
    } catch (err) {
      console.error('[AppContext] Failed to load configuration:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const updateConfigLocally = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleAdminLogin = (token, slug) => {
    setAdminToken(token);
    localStorage.setItem('cms_admin_token', token);
    if (slug) setAdminSlug(slug);
  };

  const handleAdminLogout = () => {
    setAdminToken('');
    localStorage.removeItem('cms_admin_token');
  };

  return (
    <AppContext.Provider
      value={{
        config,
        loading,
        adminToken,
        adminSlug,
        licenseStatus,
        setLicenseStatus,
        updateConfigLocally,
        handleAdminLogin,
        handleAdminLogout,
        reloadConfig: loadConfig
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
