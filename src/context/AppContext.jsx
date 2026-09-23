import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchConfig } from '../lib/api';
import { DEFAULT_CONFIG } from '../lib/defaultConfig';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true); // Start true — wait for loadConfig before rendering routes

  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('cms_admin_token') || '');
  const [adminSlug, setAdminSlug] = useState(() => {
    try {
      const raw = localStorage.getItem('cms_setup_state');
      if (raw) {
        const s = JSON.parse(raw);
        return s.adminSlug || 'admin';
      }
    } catch {}
    return 'admin';
  });

  // Read local setup state synchronously so first render is correct
  const [licenseStatus, setLicenseStatus] = useState(() => {
    try {
      const raw = localStorage.getItem('cms_setup_state');
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.isInstalled) {
          const expiresAt = s.expiresAt ? new Date(s.expiresAt) : null;
          const daysRemaining = expiresAt
            ? Math.max(0, Math.floor((expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
            : 30;
          return {
            isInstalled: true,
            isLocked: daysRemaining <= 0,
            status: daysRemaining > 0 ? 'active' : 'expired',
            daysRemaining,
            licenseKey: s.licenseKey,
            licenseType: s.licenseType || 'trial'
          };
        }
      }
    } catch {}
    return { isInstalled: false, isLocked: false, status: 'uninstalled', daysRemaining: 30 };
  });

  const loadConfig = async () => {
    try {
      setLoading(true);

      // Read current local setup state (ground truth for static mode)
      let localSetup = null;
      try {
        const raw = localStorage.getItem('cms_setup_state');
        if (raw) localSetup = JSON.parse(raw);
      } catch {}

      const res = await fetchConfig();

      if (res && res.success && res.data && !res.isFallback) {
        // Live server response (not fallback)
        setConfig(res.data);
        if (res.data.adminSlug) setAdminSlug(res.data.adminSlug);

        if (res.data.license) {
          const serverLicense = res.data.license;
          // CRITICAL: Never overwrite isInstalled=true with server's isInstalled=false
          // This happens when the Express server restarts and loses in-memory state.
          // localStorage is ground truth for static DB mode.
          if (serverLicense.isInstalled === false && localSetup?.isInstalled === true) {
            // Server lost state — keep local state
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
          } else if (serverLicense.isInstalled !== null && serverLicense.isInstalled !== undefined) {
            setLicenseStatus(serverLicense);
          }
          // If serverLicense.isInstalled is null (DEFAULT_CONFIG fallback marker), skip — keep current state
        }
      }
      // If isFallback: localStorage state is already correct from synchronous useState init — do nothing
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
