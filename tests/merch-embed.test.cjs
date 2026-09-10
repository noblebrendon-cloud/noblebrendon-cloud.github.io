// Dependency-free configuration/loader tests. These stub Shopify; not a live checkout test.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/js/merch-shopify.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'merch/index.html'), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));

function environment({ sdk = true, reject = false, missing = false } = {}) {
  const state = { scripts: [], configs: [], timers: new Map(), reloads: 0 };
  const node = { dataset: {}, attrs: {}, setAttribute(k, v) { this.attrs[k] = v; } };
  const status = { textContent: 'Loading merchandise from Shopify...' };
  const retry = { hidden: true, addEventListener(name, fn) { this[name] = fn; } };
  const document = {
    getElementById(id) {
      if (id === 'collection-component-1789001381448') return missing ? null : node;
      return id === 'merch-status' ? status : retry;
    },
    createElement() { return {}; },
    head: { appendChild(script) { state.scripts.push(script); } }
  };
  const ShopifyBuy = {
    buildClient(config) { state.client = config; return config; },
    UI: { onReady() { return Promise.resolve({ createComponent(type, config) {
      state.type = type; state.configs.push(config);
      return reject ? Promise.reject(new Error('simulated Shopify failure')) : Promise.resolve({});
    } }); } }
  };
  const window = {
    document, location: { reload() { state.reloads++; } },
    setTimeout(fn, ms) { state.timers.set(1, { fn, ms }); return 1; },
    clearTimeout(id) { state.timers.delete(id); }
  };
  if (sdk) window.ShopifyBuy = ShopifyBuy;
  const context = vm.createContext({ window, document, console });
  const run = () => vm.runInContext(source, context);
  return { state, node, status, retry, window, ShopifyBuy, run };
}

test('uses the owner-supplied collection, verified domain, and public client token', async () => {
  const e = environment(); e.run(); await flush();
  assert.equal(e.state.client.domain, 'fgyxki-kx.myshopify.com');
  assert.equal(e.state.client.storefrontAccessToken.length, 32);
  assert.equal(e.state.type, 'collection');
  assert.equal(e.state.configs[0].id, '481310376193');
  assert.equal(e.state.configs[0].moneyFormat, '%24%7B%7Bamount%7D%7D');
  assert.equal(e.state.scripts.length, 0);
});

test('product selection uses details modal before the shared cart', async () => {
  const e = environment(); e.run(); await flush();
  const o = e.state.configs[0].options;
  assert.equal(o.product.buttonDestination, 'modal');
  assert.equal(o.product.text.button, 'View details');
  assert.equal(o.modalProduct.buttonDestination, 'cart');
  for (const key of ['options', 'description', 'imgWithCarousel', 'buttonWithQuantity']) assert.equal(o.modalProduct.contents[key], true);
  assert.equal(o.productSet.contents.pagination, true);
  assert.equal(o.cart.text.button, 'Checkout');
});

test('responsive product widths are configured for one, two, and three columns', async () => {
  const e = environment(); e.run(); await flush();
  const s = e.state.configs[0].options.product.styles.product;
  assert.equal(s.width, '100%');
  assert.match(s['@media (min-width: 601px)'].width, /50%/);
  assert.match(s['@media (min-width: 961px)'].width, /33\.333%/);
  const modal = e.state.configs[0].options.modalProduct.styles.product;
  assert.equal(modal['@media (min-width: 601px)'].width, '100%');
  assert.equal(modal['@media (min-width: 961px)'].width, '100%');
});

test('initialization is idempotent', async () => {
  const e = environment(); e.run(); e.run(); await flush();
  assert.equal(e.state.configs.length, 1);
  assert.equal(e.node.attrs['aria-busy'], 'false');
  assert.equal(e.status.textContent, '');
  assert.equal(e.state.timers.size, 0);
});

test('does not load Shopify on a page without the catalog node', () => {
  const e = environment({ missing: true }); e.run();
  assert.equal(e.state.scripts.length, 0);
  assert.equal(e.state.timers.size, 0);
});

test('loads the official SDK once and initializes when it arrives', async () => {
  const e = environment({ sdk: false }); e.run(); e.run();
  assert.equal(e.state.scripts.length, 1);
  const script = e.state.scripts[0];
  assert.equal(script.async, true);
  assert.equal(script.src, 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js');
  e.window.ShopifyBuy = e.ShopifyBuy; script.onload(); await flush();
  assert.equal(e.state.configs.length, 1);
});

test('script failure exposes a working reload action and clears busy state', () => {
  const e = environment({ sdk: false }); e.run(); e.state.scripts[0].onerror();
  assert.equal(e.retry.hidden, false);
  assert.equal(e.node.attrs['aria-busy'], 'false');
  assert.match(e.status.textContent, /could not load/);
  assert.equal(e.state.timers.size, 0);
  e.retry.click(); assert.equal(e.state.reloads, 1);
});

test('API rejection does not report a loaded catalog', async () => {
  const e = environment({ reject: true }); e.run(); await flush();
  assert.match(e.status.textContent, /could not load/);
  assert.equal(e.retry.hidden, false);
});

test('slow loading exposes fallback then recovers when the SDK arrives', async () => {
  const e = environment({ sdk: false }); e.run();
  const timer = e.state.timers.get(1); assert.equal(timer.ms, 20000); timer.fn();
  assert.match(e.status.textContent, /taking longer/);
  assert.equal(e.retry.hidden, false);
  e.window.ShopifyBuy = e.ShopifyBuy; e.state.scripts[0].onload(); await flush();
  assert.equal(e.status.textContent, ''); assert.equal(e.retry.hidden, true);
});

test('page has accessible navigation and persistent no-script/store fallbacks', () => {
  assert.match(html, /href="\/merch\/" aria-current="page"/);
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /https:\/\/brendonrcoleman\.myshopify\.com\/collections\/merch/);
  assert.match(html, /src="\/assets\/js\/merch-shopify\.js" defer/);
  assert.equal((html.match(/id="collection-component-1789001381448"/g) || []).length, 1);
  assert.ok(!source.includes('Admin-Access-Token'));
  assert.ok(!html.includes('gtag(') && !source.includes('fbq('));
});
