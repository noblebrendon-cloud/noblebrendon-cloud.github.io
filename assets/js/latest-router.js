(async function () {
  try {
    const res = await fetch('/assets/data/latest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    const bind = (key, prefix) => {
      const item = data[key];
      if (!item) return;

      const titleEl = document.querySelector(`[data-latest="${prefix}-title"]`);
      const descEl = document.querySelector(`[data-latest="${prefix}-desc"]`);
      const linkEl = document.querySelector(`[data-latest="${prefix}-link"]`);

      if (titleEl) titleEl.textContent = item.title || '';
      if (descEl) descEl.textContent = item.description || '';
      if (linkEl && item.url) linkEl.setAttribute('href', item.url);
    };

    bind('latest_project', 'project');
    bind('latest_whitepaper', 'whitepaper');
    bind('latest_service', 'service');
  } catch (err) {
    console.error('latest-router failed:', err);
  }
})();
