import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {replaceOnce, getData, createPages} from './improve-storefront.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'restored-store/dist');
const read = file => fs.readFileSync(path.join(dist, file), 'utf8').replace(/\r\n/g, '\n');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'restored-store/source/catalog.json'), 'utf8'));
const html = read('index.html');
const bundleName = html.match(/src="\/assets\/(store-[a-f0-9]+\.js)"/)[1];
const bundle = read('assets/' + bundleName);
const raw = fs.readFileSync(path.join(root,'restored-store/source/oct22-store.js'), 'utf8');
const artwork = JSON.parse(bundle.match(/const productArtwork=(\{.*?\});function jr/s)[1]);
const data = getData(raw, catalog, artwork);
const pages = createPages(data);
const preservedAssets = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(root, 'restored-store/source/assets-sha256.json'), 'utf8'))));

test('every physical offer retains its authoritative ID and price and has a release destination', () => {
  const start = bundle.indexOf('var Ar=') + 'var Ar='.length;
  const end = bundle.indexOf('];const productArtwork=', start) + 1;
  const products = JSON.parse(JSON.stringify(vm.runInNewContext('(' + bundle.slice(start, end) + ')')));
  assert.equal(products.length, 18);
  assert.deepEqual(products.map(p=>[p.id,p.price]).sort(), catalog.map(p=>[p.id,p.price]).sort());
  for (const product of catalog) {
    const release = data.releases.find(r=>r.title.toLowerCase().replace(/[’']/g,'') === product.title.toLowerCase().replace(/[’']/g,''));
    assert.ok(release, product.title);
    assert.ok(fs.existsSync(path.join(dist, 'release', release.slug, 'index.html')));
  }
});

test('public routes have unique titles, visible initial content, canonical and social metadata', () => {
  const titles = new Set();
  for (const route of Object.keys(pages).filter(p=>p!=='/404')) {
    const document = read(route === '/' ? 'index.html' : route.slice(1) + '/index.html');
    const title = document.match(/<title>(.*?)<\/title>/)[1];
    assert.ok(!titles.has(title), title); titles.add(title);
    assert.match(document, /<div id="root"><main/);
    assert.match(document, /<h1>/);
    assert.match(document, /<meta name="description" content="[^"]+"/);
    assert.ok(document.includes('rel="canonical" href="https://irontuskrecords.com' + (route === '/' ? '/' : route + '/') + '"'));
    assert.match(document, /property="og:image"/);
    assert.match(document, /name="twitter:card"/);
    const structured = JSON.parse(document.match(/id="store-structured-data">(.*?)<\/script>/s)[1]);
    assert.equal(structured['@context'], 'https://schema.org');
  }
});

test('all generated local links resolve to a page, static file, or declared preserved asset', () => {
  for (const route of Object.keys(pages)) {
    const file = route === '/404' ? '404.html' : route === '/' ? 'index.html' : route.slice(1) + '/index.html';
    for (const [,href] of read(file).matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)) {
      const localPath = href.split('?')[0];
      assert.ok(localPath === '/' || preservedAssets.has(localPath) || fs.existsSync(path.join(dist, localPath)) || fs.existsSync(path.join(dist,localPath,'index.html')), `${route} links to missing ${href}`);
    }
  }
});

test('sitemap and robots expose public catalog and exclude transactional and private pages', () => {
  assert.match(read('robots.txt'), /^User-agent: \*/);
  assert.match(read('robots.txt'), /Sitemap: https:\/\/irontuskrecords.com\/sitemap.xml/);
  const sitemap = read('sitemap.xml');
  assert.match(sitemap, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
  assert.equal((sitemap.match(/<loc>/g)||[]).length, 26);
  assert.ok(sitemap.includes('https://irontuskrecords.com/release/ode-to-rfk-jr/'));
  for (const privateRoute of ['/cart','/account','/one','/404']) assert.ok(!sitemap.includes('irontuskrecords.com'+privateRoute+'/'));
  assert.match(read('cart/index.html'), /name="robots" content="noindex, follow"/);
  assert.match(read('404.html'), /name="robots" content="noindex, follow"/);
});

test('unknown routes use 404 while existing checkout and private routing are retained', () => {
  const redirects = read('_redirects');
  assert.ok(redirects.endsWith('/* /404.html 404\n'));
  assert.ok(!redirects.includes('/* /index.html 200'));
  for (const name of ['kunaki-shipping-options','stripe-create-session','stripe-session-status']) {
    assert.ok(redirects.includes(`/store-api/${name} /.netlify/functions/${name} 200!`));
  }
  assert.ok(redirects.includes('/one/* /one/index.html 200'));
  assert.ok(redirects.includes('/account/* /account/index.html 200'));
  assert.match(read('_headers'), /\/one\/\*[\s\S]*X-Robots-Tag: noindex, nofollow/);
  assert.match(bundle, /stripe-session-status/);
  assert.match(bundle, /Subtotal before shipping/);
});

test('unconfirmed artist links are removed without replacing them with invented profiles', () => {
  const eddie = data.artists.find(a=>a.slug==='eddie-michaels');
  assert.deepEqual(Object.keys(eddie.socials).filter(k=>eddie.socials[k]), ['bandcamp']);
  assert.equal(data.artists[0].genre, 'Alternative Rock');
  assert.ok(!read('artists/eddie-michaels/index.html').includes('https://www.facebook.com/...'));
});

test('snapshot patching rejects missing or ambiguous source and previews are noindex', () => {
  assert.throws(()=>replaceOnce('none', 'missing', 'after'));
  assert.throws(()=>replaceOnce('repeat repeat', 'repeat', 'after'));
  assert.ok(Object.values(createPages(data,{preview:true})).every(p=>p.noindex));
});

test('confirmed dispatch time is distinct from customer-selected delivery time', () => {
  const shipping = read('shipping/index.html');
  assert.match(shipping, /Orders ship in 2–3 business days/);
  assert.match(shipping, /Delivery time depends on the shipping method you select/);
  assert.ok(bundle.includes('Orders ship in 2–3 business days'));
  assert.ok(!bundle.includes('CDs and vinyl ship once manufacturing is complete.'));
});

test('ITR-012 links the artist, $5 CD offer and playable preview to a single release', () => {
  const release = data.releases.find(item => item.catalogNumber === 'ITR-012');
  const detail = read('release/ode-to-rfk-jr/index.html');
  assert.equal(release.artistSlug, 'bone-and-the-strangels');
  assert.ok(read('releases/index.html').includes('/release/ode-to-rfk-jr'));
  assert.ok(read('artists/bone-and-the-strangels/index.html').includes('/release/ode-to-rfk-jr'));
  assert.ok(detail.includes(`<audio controls preload="none" src="${release.audioPreview}"`));
  assert.ok(fs.existsSync(path.join(dist, release.audioPreview)));
  assert.ok(fs.existsSync(path.join(dist, release.cover)));
  assert.ok(detail.includes('href="/shop#product-PX00YPHI7O">CD · ITR-012 · $5.00 + shipping'));
  assert.ok(read('shop/index.html').includes('id="product-PX00YPHI7O"'));
  assert.equal(data.releases.filter(item => item.title === release.title).length, 1);
});

test('Tribal uses the replacement shop ID and updates saved carts', () => {
  assert.ok(read('release/tribal/index.html').includes('href="/shop#product-PX00ZKO739">CD · ITR-006 · $16.00 + shipping'));
  const shop = read('shop/index.html');
  assert.ok(shop.includes('id="product-PX00ZKO739"'));
  assert.ok(!shop.includes('id="product-PX00AQ4XD2"'));
  assert.match(bundle, /localStorage.getItem\(`iron-tusk-cart`\)\|\|`\[\]`\);return storeRestoreCart\(e\)/);
  const start = bundle.indexOf('function storeRestoreCart(');
  const end = bundle.indexOf('function storeProductsFor(', start);
  const input = [{id:'PX00AQ4XD2',quantity:2,price:16}, {id:'PX00YPHI7O',quantity:1,price:5}];
  const result = vm.runInNewContext(bundle.slice(start, end) + '\nstoreRestoreCart(items)', {items:input});
  assert.deepEqual(JSON.parse(JSON.stringify(result)), [{...input[0],id:'PX00ZKO739'}, input[1]]);
});

test('the shop and cart use the same December price rules as the server', () => {
  const offers = bundle.match(/from '\/assets\/(december-offers-[a-f0-9]+\.js)'/)[1];
  assert.equal(read('assets/' + offers), fs.readFileSync(path.join(root, 'restored-store/source/december-offers.mjs'), 'utf8').replace(/\r\n/g,'\n'));
  assert.match(bundle, /decemberOffersActive\(offersNow\)&&j.jsx\(StoreDecemberOffers/);
  assert.match(bundle, /offerPricing=priceDecemberCart\(S,offersNow\)/);
  assert.match(bundle, /shippingDescription:l,requestId:_.current,expectedTotal:totalCents/);
});
