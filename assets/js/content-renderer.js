(async function () {
  const hooks = document.querySelectorAll("[data-render][data-manifest]");

  if (!hooks.length) return;

  const configs = {
    "services-list": {
      buttonLabel: "Open",
      metaPrefix: "Category",
      primaryWhenFeatured: true
    },
    "whitepapers-list": {
      buttonLabel: "Read artifact",
      metaPrefix: "Status",
      primaryWhenFeatured: false
    }
  };

  const sortItems = (items) =>
    items.slice().sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  const createCard = (item, config) => {
    const article = document.createElement("article");
    article.className = "card";

    const content = document.createElement("div");
    content.className = "card-content";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = item.title || "";
    content.appendChild(title);

    const summary = document.createElement("p");
    summary.className = "card-text";
    summary.textContent = item.summary || "";
    content.appendChild(summary);

    const metaValue =
      config.metaPrefix === "Category" ? item.category : item.status;

    if (metaValue) {
      const meta = document.createElement("p");
      meta.className = "muted";
      meta.textContent = `${config.metaPrefix}: ${metaValue}${item.featured ? " - Featured" : ""}`;
      content.appendChild(meta);
    }

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const link = document.createElement("a");
    link.className =
      config.primaryWhenFeatured && item.featured ? "btn btn-primary" : "btn btn-secondary";
    link.href = item.url || "#";
    link.textContent = config.buttonLabel;

    actions.appendChild(link);
    article.appendChild(content);
    article.appendChild(actions);

    return article;
  };

  await Promise.all(
    Array.from(hooks).map(async (hook) => {
      const renderKey = hook.dataset.render;
      const manifestPath = hook.dataset.manifest;
      const config = configs[renderKey];

      if (!config || !manifestPath) return;

      try {
        const res = await fetch(manifestPath, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items;

        if (!Array.isArray(items) || !items.length) return;

        const fragment = document.createDocumentFragment();
        sortItems(items).forEach((item) => fragment.appendChild(createCard(item, config)));

        hook.replaceChildren(fragment);
      } catch (err) {
        console.error(`content-renderer failed for ${renderKey}:`, err);
      }
    })
  );
})();
