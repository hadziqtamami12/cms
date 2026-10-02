const BASE = 'http://127.0.0.1:5005';

async function audit() {
  const endpoints = [
    { method: 'GET', url: '/api/health' },
    { method: 'GET', url: '/api/config' },
    { method: 'GET', url: '/api/settings/public' },
    { method: 'GET', url: '/api/theme/presets' },
    { method: 'GET', url: '/api/articles/public' },
    { method: 'GET', url: '/api/articles/categories' },
    { method: 'GET', url: '/api/articles/popular' },
    { method: 'GET', url: '/api/travel-trips/public' },
    { method: 'GET', url: '/sitemap.xml' },
    { method: 'GET', url: '/manifest.json' },
    { method: 'GET', url: '/api/brand/logo.svg' },
    { method: 'POST', url: '/api/leads', body: { name: 'Test', phone: '08123456789', message: 'Test message' } },
    { method: 'POST', url: '/api/admin/login', body: { username: 'admin', password: 'admin123' } }
  ];

  console.log('=== AUDITING PUBLIC & BASE ENDPOINTS ===');
  let adminToken = '';

  for (const ep of endpoints) {
    try {
      const opts = { method: ep.method };
      if (ep.body) {
        opts.headers = { 'Content-Type': 'application/json' };
        opts.body = JSON.stringify(ep.body);
      }
      const res = await fetch(BASE + ep.url, opts);
      const ct = res.headers.get('content-type') || '';
      let data;
      if (ct.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      const ok = res.status >= 200 && res.status < 300;
      console.log(`[${res.status}] ${ep.method} ${ep.url} -> ${ok ? 'OK' : 'FAIL'}`);
      if (!ok) {
        console.log('  Response Error:', typeof data === 'string' ? data.slice(0, 150) : data);
      }
      if (ep.url === '/api/admin/login' && data && data.token) {
        adminToken = data.token;
      }
    } catch (err) {
      console.log(`[ERR] ${ep.method} ${ep.url} -> ${err.message}`);
    }
  }

  console.log('\nAdmin token acquired:', Boolean(adminToken));

  if (adminToken) {
    console.log('\n=== AUDITING ADMIN PROTECTED ENDPOINTS ===');
    const adminEndpoints = [
      { method: 'GET', url: '/api/admin/settings' },
      { method: 'GET', url: '/api/admin/theme/presets' },
      { method: 'GET', url: '/api/admin/orders' },
      { method: 'GET', url: '/api/admin/leads' },
      { method: 'GET', url: '/api/admin/seo-analytics' },
      { method: 'GET', url: '/api/admin/media' },
      { method: 'GET', url: '/api/admin/articles' },
      { method: 'GET', url: '/api/admin/travel-trips' },
      { method: 'GET', url: '/api/admin/scraper/history' },
      { method: 'POST', url: '/api/admin/brand/generate-logo', body: { appName: 'Test Brand', industry: 'automotive' } }
    ];

    for (const ep of adminEndpoints) {
      try {
        const opts = { 
          method: ep.method,
          headers: { 
            'Authorization': 'Bearer ' + adminToken,
            'Content-Type': 'application/json'
          }
        };
        if (ep.body) {
          opts.body = JSON.stringify(ep.body);
        }
        const res = await fetch(BASE + ep.url, opts);
        const data = await res.json().catch(() => res.text());
        const ok = res.status >= 200 && res.status < 400;
        console.log(`[${res.status}] ${ep.method} ${ep.url} -> ${ok ? 'OK' : 'FAIL'}`);
        if (!ok) {
          console.log('  Response Error:', typeof data === 'string' ? data.slice(0, 150) : data);
        }
      } catch (err) {
        console.log(`[ERR] ${ep.method} ${ep.url} -> ${err.message}`);
      }
    }
  }
}

audit();
