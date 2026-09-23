import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchConfig } from '../lib/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('cms_admin_token') || '');
  const [adminSlug, setAdminSlug] = useState('admin');
  const [licenseStatus, setLicenseStatus] = useState({
    isInstalled: true,
    isLocked: false,
    status: 'active',
    daysRemaining: 365
  });

  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await fetchConfig();
      if (res && res.success && res.data) {
        setConfig(res.data);
        if (res.data.adminSlug) setAdminSlug(res.data.adminSlug);
        if (res.data.license) setLicenseStatus(res.data.license);
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
