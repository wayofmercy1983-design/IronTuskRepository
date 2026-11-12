# Iron Tusk Records website

Netlify builds the verified snapshot in `iron-tusk-store-source.zip` using `python3 restore-store.py`, publishes `restored-store/dist`, and packages `restored-store/functions`. The older React files in `src/` are retained for reference; `npm run build` does not build the deployed store.

The snapshot preserves the live 18-product Stripe cart, server-authoritative pricing, customer-paid shipping, payment verification, durable orders, fulfillment safeguards, artist pages and images, and private Iron Tusk One manager.

## Product connection

- The Snot Rockets CD (ITR-009) is `PX00V4KEMX`, $8 plus shipping. Retired CD `PX00ZUDROB` cannot start new checkouts; saved browser carts upgrade to the replacement. Replacement 7-inch vinyl is `PX00I0GP08`, $20 plus shipping; retired vinyl `PX00Z925MY` is also upgraded in saved carts and rejected for new checkouts. Historical orders retain their original IDs.
- The EP landing page is `/snot-rockets/` and its primary purchase link selects the CD.

- Bone and the Strangels, *Ode to RFK Jr.* (ITR-012), CD: `PX00YPHI7O`, $5 plus shipping.
- ONG, *Tribal* (ITR-006), CD: `PX00ZKO739`, $16 plus shipping.

- Thomas Ate the Cat, *Power Chords and Other Nonsense*, CD: `PX00IMM4M3`, $16 plus shipping.
- Without, *Self Titled*, vinyl: `PX00H4Y785`, $50 plus shipping.
- Thomas Ate the Cat vinyl remains `PX00ZW89QC`, $50 plus shipping.
- Both formats are released as of October 30, 2026 and use standard purchase wording.
- Defective CD `PX008Q8MCO` is rejected for new carts. Historical orders are not rewritten or automatically replaced.
- Netlify's `KUNAKI_PRODUCT_THOMAS_POWER_CHORDS` setting must remain `PX00IMM4M3`.

The shop builder, preorder list, authoritative server catalog, and functions are inside the snapshot. `store-source-manifest.json` lists each archived file and its SHA-256 checksum. The restore script verifies the entire archive before extraction. Media are recovered from an existing immutable deployment and checked against `source/assets-sha256.json`; the original restored homepage image is retained in the archive.

## Local validation

Use Node.js 24 and Python 3:

```sh
npm ci
python3 restore-store.py --extract-only
node --test restored-store/tests/*.test.mjs
python3 restore-store.py
```

The 39 tests mock Stripe, Kunaki, and order storage. They do not charge, manufacture, refund, or create replacement orders. They cover corrected CD pricing and fulfillment IDs, separate shipping, rejected retired IDs, payment verification, duplicate prevention, ambiguous submissions, and product synchronization.

To edit the snapshot, extract it, edit `restored-store`, then repack the archive and update its checksum in `restore-store.py` and the per-file manifest. Extracted files are ignored by Git: include changes in the archive before committing. Never commit credentials or private order data.

## Deployment

### Public storefront improvements

After restoring the verified snapshot and applying the existing artwork changes,
`restore-store.py` runs `improve-storefront.mjs`. This checked post-build
step adds accessible artist links, release detail routes, links to the matching
physical formats, explicit cart subtotal wording, and route-specific initial HTML
and metadata. It removes placeholder social URLs and derives the two missing
catalog entries from the existing physical product catalog without inventing dates.
The snapshot archive, server catalog, payment functions, and private manager remain
the sources for their existing behavior.

The script emits 25 public sitemap routes, real robots and sitemap files, and a
404 fallback while retaining the account, workspace and checkout rewrites. Cart,
private pages, and deploy previews are excluded from indexing. Route metadata also
updates during client navigation. Public initial HTML is a readable static fallback;
the preserved React application replaces it when JavaScript loads.

Validate these additions after `python3 restore-store.py` with:

```sh
node --test storefront.test.mjs
```

CI builds these static additions without downloading the immutable media bundle.
The production build still verifies and recovers the original media. A changed
upstream snapshot must update the explicitly checked transforms; do not silently
skip a missing transform. The owner confirmed that orders ship in 2â€“3 business days
and delivery time depends on the customer-selected method. Return policies,
edition limits and TBA dates still require confirmed business information.

Keep the existing Netlify environment variables for Stripe, Kunaki, and fulfillment. Production uses the `LIVE` Kunaki mode; manufacturing is restricted to verified paid events at the production webhook. Do not invoke fulfillment or product-sync operations as deployment tests.

Before publishing, verify the generated store bundle, checkout routes, six function packages and their streaming invocation, private `/one/` headers, and webhook signature rejection. A successful static-page upload alone does not confirm checkout health. Customer replacement orders require separate review and authorization.

## Private contract documents

The Contracts page includes a document panel. Save a contract, refresh the list,
select the artist's agreement, then upload PDF, JPG or PNG files up to 3 MiB each.
Documents are stored in the private Iron Tusk One blob store, separate from the
contract's terms. Owner authentication is required for uploads, lists and downloads;
uploads also require the production origin. Files download as attachments and are
never served from the public store. Uploading does not change agreement status or
royalty terms. This feature stores documents; it does not parse or sign them.

The eight document tests cover authorization, origin rejection, file validation,
size limits, concurrent attachments, download persistence and unchanged terms.
The browser preview uses synthetic records and in-memory storage only. Production
blob persistence still needs verification after an approved deployment.

## Statement period defaults

New royalty entries select the current calendar quarter and year using the owner's
local date (Octoberâ€“December is Q4). The period remains editable for late reports.
Editing an existing royalty preserves its original accounting period, even if blank.
The active manager bundle imports `source/one-dist/quarter.js`; three tests cover all
months, quarter/year boundaries and historical periods. No stored records are migrated.
