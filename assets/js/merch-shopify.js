/* Shopify Buy Button collection embed supplied by the store owner.
 * This is a PUBLIC Storefront token intended for browser use, not an Admin token.
 * Keep Shopify's generated domain: both store domains were verified via Admin API.
 */
(function () {
  'use strict';
  var node = document.getElementById('collection-component-1789001381448');
  if (!node || node.dataset.initialized === 'true') return;
  node.dataset.initialized = 'true';

  var status = document.getElementById('merch-status');
  var retry = document.getElementById('merch-retry');
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  var timer = window.setTimeout(function () {
    status.textContent = 'The catalog is taking longer to load. You can open the collection in Shopify using the link above.';
    retry.hidden = false;
  }, 20000);
  retry.addEventListener('click', function () { window.location.reload(); });

  function fail() {
    window.clearTimeout(timer);
    node.setAttribute('aria-busy', 'false');
    status.textContent = 'The catalog could not load here. Please reload it or open the same collection in Shopify using the link above.';
    retry.hidden = false;
  }

  var buttonStyles = {
    'background-color': '#1d4ed8', color: '#ffffff', 'border-radius': '8px',
    'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-weight': '600', ':hover': { 'background-color': '#1e40af' },
    ':focus': { 'background-color': '#1e40af', outline: '3px solid #60a5fa' }
  };

  function init() {
    if (!window.ShopifyBuy || !window.ShopifyBuy.UI) { fail(); return; }
    try {
      var client = window.ShopifyBuy.buildClient({
        domain: 'fgyxki-kx.myshopify.com',
        storefrontAccessToken: 'a2afb097b866b5156471e452206802e8'
      });
      window.ShopifyBuy.UI.onReady(client).then(function (ui) {
        return ui.createComponent('collection', {
          id: '481310376193', node: node, moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: {
            product: {
              buttonDestination: 'modal',
              contents: { options: false },
              text: { button: 'View details' },
              styles: {
                product: {
                  'background-color': '#ffffff', 'border-radius': '12px',
                  'box-sizing': 'border-box', padding: '16px',
                  width: '100%', 'max-width': '100%', 'margin-left': '0', 'margin-bottom': '24px',
                  '@media (min-width: 601px)': {
                    width: 'calc(50% - 20px)', 'max-width': 'calc(50% - 20px)', 'margin-left': '20px'
                  },
                  '@media (min-width: 961px)': {
                    width: 'calc(33.333% - 20px)', 'max-width': 'calc(33.333% - 20px)', 'margin-left': '20px'
                  }
                },
                title: { color: '#18181b', 'font-size': '18px' },
                price: { color: '#3f3f46' },
                img: { height: '100%', width: '100%', 'object-fit': 'contain', position: 'absolute', top: '0', left: '0' },
                imgWrapper: { 'padding-top': '100%', position: 'relative', height: '0', overflow: 'hidden' },
                button: buttonStyles
              }
            },
            productSet: {
              contents: { pagination: true },
              text: { nextPageButton: 'Load more products' },
              styles: { products: { '@media (min-width: 601px)': { 'margin-left': '-20px' } } }
            },
            modalProduct: {
              buttonDestination: 'cart',
              contents: { img: false, imgWithCarousel: true, title: true, price: true, options: true, description: true, button: false, buttonWithQuantity: true },
              styles: {
                product: {
                  'max-width': '100%', width: '100%', 'margin-left': '0', 'margin-bottom': '0',
                  '@media (min-width: 601px)': { 'max-width': '100%', width: '100%', 'margin-left': '0' },
                  '@media (min-width: 961px)': { 'max-width': '100%', width: '100%', 'margin-left': '0' }
                },
                title: { color: '#18181b' }, price: { color: '#3f3f46' },
                description: { color: '#3f3f46' }, button: buttonStyles
              },
              text: { button: 'Add to cart' }
            },
            option: {},
            cart: {
              text: { total: 'Subtotal', button: 'Checkout' },
              styles: { button: buttonStyles }
            },
            toggle: { styles: { toggle: { 'background-color': '#1d4ed8', ':hover': { 'background-color': '#1e40af' } } } }
          }
        });
      }).then(function () {
        window.clearTimeout(timer);
        node.setAttribute('aria-busy', 'false');
        status.textContent = '';
        retry.hidden = true;
      }).catch(fail);
    } catch (error) { fail(); }
  }

  if (window.ShopifyBuy && window.ShopifyBuy.UI) { init(); return; }
  var script = document.createElement('script');
  script.async = true;
  script.src = scriptURL;
  script.onload = init;
  script.onerror = fail;
  document.head.appendChild(script);
})();
