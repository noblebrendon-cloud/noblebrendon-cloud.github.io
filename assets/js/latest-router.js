(async function () {
  const insertAfter = (referenceNode, newNode) => {
    if (!referenceNode || !referenceNode.parentNode) return;
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  };

  // Keep the homepage navigation aware of the Open Methods publication surface
  // without requiring the latest-content manifest to know about site taxonomy.
  const primaryNav = document.querySelector('.site-header .nav');
  if (primaryNav && !primaryNav.querySelector('a[href="/methods/"]')) {
    const methodsLink = document.createElement('a');
    methodsLink.href = '/methods/';
    methodsLink.textContent = 'Methods';
    const researchLink = primaryNav.querySelector('a[href="/public-architecture/"]');
    insertAfter(researchLink, methodsLink);
  }

  const routePills = document.querySelector('.route-pills');
  if (routePills && !routePills.querySelector('a[href="/methods/"]')) {
    const methodsPill = document.createElement('a');
    methodsPill.href = '/methods/';
    methodsPill.className = 'route-pill';
    methodsPill.textContent = 'Open Methods';
    const researchPill = routePills.querySelector('a[href="/public-architecture/"]');
    insertAfter(researchPill, methodsPill);
  }

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
