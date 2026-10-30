# Iron Tusk Records website

Netlify builds the verified snapshot in `iron-tusk-store-source.zip` using `python3 restore-store.py`, publishes `restored-store/dist`, and packages `restored-store/functions`. The older React files in `src/` are retained for reference; `npm run build` does not build the deployed store.

The snapshot preserves the live 16-product Stripe cart, server-authoritative pricing, customer-paid shipping, payment verification, durable orders, fulfillment safeguards, artist pages and images, and private Iron Tusk One manager.

## Product connection

- Thomas Ate the Cat, *Power Chords and Other Nonsense*, CD: `PX00FFSL4M`, $16 plus shipping.
- Vinyl remains `PX00ZW89QC`, $50 plus shipping.
- Defective CD `PX008Q8MCO` is rejected for new carts. Historical orders are not rewritten or automatically replaced.
- Netlify's `KUNAKI_PRODUCT_THOMAS_POWER_CHORDS` setting must remain `PX00FFSL4M`.

The shop builder, preorder list, authoritative server catalog, and functions are inside the snapshot. `store-source-manifest.json` lists each archived file and its SHA-256 checksum. The restore script verifies the entire archive before extraction. Media are recovered from an existing immutable deployment and checked against `source/assets-sha256.json`; the original restored homepage image is retained in the archive.

## Local validation

Use Node.js 24 and Python 3:

```sh
npm ci
python3 restore-store.py --extract-only
node --test restored-store/tests/*.test.mjs
python3 restore-store.py
```

The 28 tests mock Stripe, Kunaki, and order storage. They do not charge, manufacture, refund, or create replacement orders. They cover corrected CD pricing and fulfillment IDs, separate shipping, rejected retired IDs, payment verification, duplicate prevention, ambiguous submissions, and product synchronization.

To edit the snapshot, extract it, edit `restored-store`, then repack the archive and update its checksum in `restore-store.py` and the per-file manifest. Extracted files are ignored by Git: include changes in the archive before committing. Never commit credentials or private order data.

## Deployment

Keep the existing Netlify environment variables for Stripe, Kunaki, and fulfillment. Production uses the `LIVE` Kunaki mode; manufacturing is restricted to verified paid events at the production webhook. Do not invoke fulfillment or product-sync operations as deployment tests.

Before publishing, verify the generated store bundle, checkout routes, six function packages and their streaming invocation, private `/one/` headers, and webhook signature rejection. A successful static-page upload alone does not confirm checkout health. Customer replacement orders require separate review and authorization.
