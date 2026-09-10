# Merch collection embed — staged integration

## Status and release boundary

This change prepares `/merch/` for Brendon R. Coleman's personal website.
It is not a deployment. Keep it on a draft branch until the hosting decision
and live browser checks below are complete. Do not merge into a Pages-published
branch as an incidental part of installing this patch.

GitHub's Pages limits restrict ecommerce hosting. Resolve whether this mixed-use
site is permitted, or serve the site using hosting that permits its intended
use, before deploying the embedded storefront. The code may remain in GitHub.
No domain, DNS, hosting, payment, or fulfillment settings were changed.

## Files

- `merch/index.html`: full catalog page using the existing global stylesheet,
  scoped page styles, accessible navigation, and a permanent Shopify fallback.
- `assets/js/merch-shopify.js`: owner-supplied collection embed with product-detail
  modal, variant selection, shared cart, responsive card styles, and load/error handling.
- `assets/js/latest-router.js`: adds Merch to the header, quick links, and footer
  wherever this existing script is loaded. The homepage already loads it.
  This does not update every independently authored static navigation across the site.
- `tests/merch-embed.test.cjs`: dependency-free configuration and loader tests.

The integration package is an overlay for the existing website repository, not a
complete copy of the website. Retain the existing `assets/style.css` and all other
site files. Apply on a feature branch and reconcile unrelated changes to the router.

## Verified Shopify configuration

- Shop domains: `fgyxki-kx.myshopify.com` and `brendonrcoleman.myshopify.com`.
- Collection: `gid://shopify/Collection/481310376193`, handle `merch`.
- Buy Button publication: `gid://shopify/Publication/208765157633`.
- The collection and all 15 existing products were returned as available to Buy Button.
- No products, prices, SKUs, inventory, or Printful mappings were changed for this patch.

The embed preserves the generated `fgyxki-kx.myshopify.com` API domain. Its public
Storefront token is intentionally client-side; it is not an Admin API credential.
Never substitute a private Admin or private Storefront token into these files.

The collection is manual. New products must be added to Merch and made available
to Buy Button before they appear here. Existing product details are requested by
the Shopify component; there is no duplicate hard-coded product catalog.

## Behavior

Visitors open a product's details, review images and description, choose the
available variants, then add it to the cart. Shopify handles checkout.
The configuration targets one/two/three card columns according to available width.
Product images use contain rather than cropping. The SDK loads only on the Merch
page. Pagination remains enabled for future collection growth.

A loading status, slow-load notice, retry button, and direct collection link make
SDK/network failures visible. No new Google Analytics or Meta tracking was added.
Review the site's privacy notice for the Shopify embed before release.

## Tests performed

Run from the repository root with a Node.js version supporting `node:test`:

```sh
node --check assets/js/merch-shopify.js
node --check assets/js/latest-router.js
node --test tests/merch-embed.test.cjs
```

All 10 configuration/loader/markup tests passed in the preparation environment.
Shopify is stubbed in these tests: this is not a live cart or checkout test.
Separate offline Chromium checks passed for page-shell/fallback overflow at
375, 768, and 1440 pixels and idempotent navigation with a failed latest manifest.
Those checks did not render the live Shopify product iframe.

Remote browsing was blocked in the preparation environment. Live SDK rendering,
variant-to-cart correctness, and Shopify checkout handoff remain unverified.
Publication availability was checked through the connected Shopify Admin API.

## Release checklist

1. Resolve hosting permission/deployment target before merging to a deployed branch.
2. Serve the branch over HTTP locally or on an authorized staging host; open `/merch/`.
3. Confirm all 15 products load, including the final item, with no console/API errors.
4. Open Love. Check image carousel, description, size and color options; choose a
   non-default variant and verify that exact variant and its price in the cart.
5. Add a second product. Verify shared cart, quantity changes, removal, and subtotal.
6. Follow Checkout to the correct Shopify store. Do not submit an order for this check.
7. Check actual product cards, modal, and cart at mobile/tablet/desktop widths;
   check keyboard navigation, closing the modal, and focus visibility.
8. Verify the homepage Merch link reaches `/merch/`, and other links still work.
9. Disable JavaScript or block the SDK and verify the direct Shopify fallback.
10. Review the privacy notice, deploy only through the approved workflow, then repeat
    the product and checkout-handoff smoke test on the published domain.

## References

- Shopify Buy Button customization: https://shopify.github.io/buy-button-js/customization/
- Shopify Storefront authentication: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api
- GitHub Pages limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
