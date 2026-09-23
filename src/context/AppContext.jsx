import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchConfig, fetchPublicSettings } from '../lib/api';
import { DEFAULT_CONFIG } from '../lib/defaultConfig';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('cms_active_theme_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CONFIG;
  });
  const [loading, setLoading] = useState(false);

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

      const res = await fetchPublicSettings();

      if (res && res.success && res.data && !res.isFallback) {
        // Live server response (not fallback)
        let localSaved = {};
        try {
          localSaved = JSON.parse(localStorage.getItem('cms_active_theme_config') || '{}');
        } catch {}

        const serverVariant = res.data.bottom_nav_variant || res.data.bottomNavStyle;
        const mergedConfig = {
          ...res.data,
          bottom_nav_variant: serverVariant || localSaved.bottom_nav_variant || localSaved.bottomNavStyle || 'floating_dock'
        };

        setConfig(mergedConfig);
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

    // Cross-tab and local reactive synchronization:
    // when admin modifies theme/bottom-nav/settings, landing page updates immediately!
    const syncConfig = () => {
      try {
        const raw = localStorage.getItem('cms_active_theme_config');
        if (raw) {
          const parsed = JSON.parse(raw);
          const variant = parsed.bottom_nav_variant || parsed.bottomNavStyle;
          setConfig(prev => ({
            ...prev,
            ...parsed,
            ...(variant ? { bottom_nav_variant: variant, bottomNavStyle: variant } : {})
          }));
        }
      } catch {}
    };

    const handleStorageChange = (e) => {
      if (!e || e.key === 'cms_active_theme_config') {
        syncConfig();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cms-config-updated', syncConfig);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cms-config-updated', syncConfig);
    };
  }, []);

  const updateConfigLocally = (newConfig) => {
    setConfig(prev => {
      const variant = newConfig.bottom_nav_variant || newConfig.bottomNavStyle;
      const merged = {
        ...prev,
        ...newConfig,
        ...(variant ? { bottom_nav_variant: variant, bottomNavStyle: variant } : {})
      };
      try {
        localStorage.setItem('cms_active_theme_config', JSON.stringify(merged));
        window.dispatchEvent(new Event('cms-config-updated'));
      } catch {}
      return merged;
    });
  };

  const handleAdminLogin = (token, slug) => {
    setAdminToken(token);
    localStorage.setItem('cms_admin_token', token);
    if (slug) setAdminSlug(slug);
  };

  const handleAdminLogout = () => {
    setAdminToken('');
    localStorage.removeItem('cms_admin_token');
    localStorage.removeItem('cms_admin_active_tab');
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
