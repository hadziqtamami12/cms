import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchPublicSettings } from '../lib/api';
import { DEFAULT_CONFIG } from '../lib/defaultConfig';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Server is the single source of truth — start with defaults, NOT from localStorage.
  // localStorage.cms_active_theme_config is ONLY used for cross-tab instant sync
  // (so admin tab can signal landing page tab of changes), never as primary persistence.
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  // Session auth token — OK to persist in localStorage (it's a session credential)
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('cms_admin_token') || '');

  // Admin slug comes from the server; localStorage cms_setup_state is a fallback seed
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

  // License status — always unlocked & enterprise pre-activated
  const [licenseStatus, setLicenseStatus] = useState({
    isInstalled: true,
    isLocked: false,
    status: 'active',
    daysRemaining: 99999,
    licenseKey: 'ENTERPRISE-UNLIMITED-2026',
    licenseType: 'lifetime'
  });

  // Tracks whether the initial server load has completed
  const initialLoadDone = useRef(false);

  const loadConfig = async () => {
    try {
      setLoading(true);

      const res = await fetchPublicSettings();

      if (res && res.success && res.data && !res.isFallback) {
        // Server returned real data — this is the source of truth
        setConfig(res.data);
        if (res.data.adminSlug) setAdminSlug(res.data.adminSlug);

        // Update license from server response (enforce unlocked)
        setLicenseStatus({
          isInstalled: true,
          isLocked: false,
          status: 'active',
          daysRemaining: 99999,
          licenseKey: 'ENTERPRISE-UNLIMITED-2026',
          licenseType: 'lifetime'
        });

        // Keep setup state adminSlug in sync (for installer/offline use)
        try {
          const currentSetup = JSON.parse(localStorage.getItem('cms_setup_state') || '{}');
          localStorage.setItem('cms_setup_state', JSON.stringify({
            ...currentSetup,
            isInstalled: true,
            adminSlug: res.data.adminSlug || currentSetup.adminSlug || 'admin'
          }));
        } catch {}
      }
      // If server returns fallback (network error), keep current state (defaults or last known)
    } catch (err) {
      console.error('[AppContext] Failed to load configuration:', err);
    } finally {
      setLoading(false);
      initialLoadDone.current = true;
    }
  };

  useEffect(() => {
    loadConfig();

    // Cross-tab sync: when admin tab changes settings and writes to localStorage,
    // the storage event fires ONLY in OTHER tabs — update their config live.
    // This is purely a UI sync signal, not data persistence.
    const handleStorageChange = (e) => {
      if (e && e.key === 'cms_active_theme_config' && initialLoadDone.current) {
        try {
          const parsed = JSON.parse(e.newValue || '{}');
          if (parsed && Object.keys(parsed).length > 0) {
            setConfig(prev => ({ ...prev, ...parsed }));
          }
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Updates local React state immediately for optimistic UI
   * and signals other tabs via localStorage storage event.
   * This does NOT persist to the database — the API call must do that.
   */
  const updateConfigLocally = (newConfig) => {
    setConfig(prev => {
      const variant = newConfig.bottom_nav_variant || newConfig.bottomNavStyle;
      const merged = {
        ...prev,
        ...newConfig,
        ...(variant ? { bottom_nav_variant: variant, bottomNavStyle: variant } : {})
      };
      // Signal other browser tabs of the change (cross-tab live preview)
      try {
        localStorage.setItem('cms_active_theme_config', JSON.stringify(merged));
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
    // Clear cross-tab sync cache on logout
    localStorage.removeItem('cms_active_theme_config');
  };

  return (
    <AppContext.Provider
      value={{
        config,
        loading,
        adminToken,
        adminSlug,
        setAdminSlug,
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
