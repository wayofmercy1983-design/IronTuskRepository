import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = here;
const origin = 'https://irontuskrecords.com';
const normal = value => value.toLowerCase().replace(/[’']/g, '');
const slug = value => normal(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[char]);
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');

// Every transform fails closed if the upstream snapshot no longer matches.
export function replaceOnce(text, before, after) {
  if (text.split(before).length !== 2) throw new Error('Expected one storefront match, got ' + (text.split(before).length - 1) + ': ' + before.slice(0, 90));
  return text.replace(before, () => after);
}

function arrayExpression(bundle, begin, end, scope) {
  const finish = bundle.indexOf(end);
  const start = bundle.lastIndexOf(begin, finish);
  if (start < 0 || finish < 0) throw new Error('Missing snapshot data: ' + begin);
  return vm.runInNewContext('(' + bundle.slice(start + begin.length, finish + 1) + ')', scope, {timeout: 1000});
}

export function getData(bundle, catalog, artwork) {
  const scope = {};
  for (const match of bundle.matchAll(/(?:var |,)([A-Za-z_$][\w$]*)=`(\/(?:assets|shop)\/[^`]+)`/g)) scope[match[1]] = match[2];
  const artists = JSON.parse(JSON.stringify(arrayExpression(bundle, '_r=', '];_r.forEach', scope)));
  const releases = JSON.parse(JSON.stringify(arrayExpression(bundle, 'var yr=', '];function br', scope)));
  if (artists.length !== 6 || releases.length !== 9 || catalog.length !== 18) throw new Error('Unexpected catalog shape');
  for (const artist of artists) {
    artist.genre = artist.genre?.replace('Alternataive', 'Alternative');
    for (const key of Object.keys(artist.socials || {})) if (artist.socials[key].includes('...')) delete artist.socials[key];
  }
  releases.unshift({
    id: Math.max(...releases.map(item => item.id)) + 1,
    title: 'Ode to RFK Jr.',
    artistSlug: 'bone-and-the-strangels',
    type: 'Single',
    releaseDate: 'November 9, 2026',
    status: 'Released',
    catalogNumber: 'ITR-012',
    description: 'A single from Bone and the Strangels.',
    cover: '/release-media/ode-to-rfk-jr-cover.jpg',
    audioPreview: '/release-media/ode-to-rfk-jr-preview.wav',
    links: {},
  });
  for (const product of catalog) {
    const artist = artists.find(item => item.name === product.artist);
    if (!artist) throw new Error('Unknown product artist: ' + product.artist);
    if (!releases.some(item => item.artistSlug === artist.slug && normal(item.title) === normal(product.title))) {
      releases.push({id: Math.max(...releases.map(item => item.id)) + 1, title: product.title,
        artistSlug: artist.slug, type: 'Release', releaseDate: 'Date not listed', status: 'Catalog',
        genre: artist.genre || '', description: 'Explore physical formats of ' + product.title + ' by ' + artist.name + '.',
        cover: artwork[product.title], links: {}});
    }
  }
  for (const release of releases) {
    release.slug = slug(release.title);
    if (artwork[release.title]) release.cover = artwork[release.title];
  }
  if (new Set(releases.map(item => item.slug)).size !== releases.length) throw new Error('Release slug collision');
  return {artists, releases, catalog};
}

export function patchBundle(bundle, data, pageInfo) {
  let js = bundle;
  const replace = (before, after) => {js = replaceOnce(js, before, after);};
  const artistStart = js.lastIndexOf('_r=', js.indexOf('];_r.forEach')) + '_r='.length;
  const artistEnd = js.indexOf('];_r.forEach', artistStart) + 1;
  js = js.slice(0, artistStart) + json(data.artists) + js.slice(artistEnd);
  const releaseStart = js.lastIndexOf('var yr=', js.indexOf('];function br')) + 'var yr='.length;
  const releaseEnd = js.indexOf('];function br', releaseStart) + 1;
  js = js.slice(0, releaseStart) + json(data.releases) + js.slice(releaseEnd);
  replace('function Cr({artist:e}){let t=vt();return(0,j.jsxs)(`article`,{className:`artist-card artist-link`,onClick:()=>{M(),setTimeout(()=>{t(`/artists/${e.slug}`)},40)},style:{cursor:`pointer`},',
    'function Cr({artist:e}){return(0,j.jsxs)(k,{to:`/artists/${e.slug}`,"aria-label":`View ${e.name}`,className:`artist-card artist-link`,onClick:M,');
  replace('className:`artist-previews`,children:[', 'className:`artist-previews`,id:`artist-previews`,tabIndex:-1,children:[');
  replace('JSON.parse(window.localStorage.getItem(`iron-tusk-cart`)||`[]`);return Array.isArray(e)?e:[]',
    'JSON.parse(window.localStorage.getItem(`iron-tusk-cart`)||`[]`);return storeRestoreCart(e)');
  replace('(0,j.jsx)(`h2`,{children:e.title}),n&&', '(0,j.jsx)(`h2`,{children:(0,j.jsx)(k,{to:`/release/${e.slug}`,children:e.title})}),n&&');
  replace('className:`release-links`,children:[e.links.spotify&&',
    'className:`release-links`,children:[storeProductsFor(e).length>0&&(0,j.jsx)(k,{to:`/release/${e.slug}`,className:`listen-button`,children:`View formats`}),e.links.spotify&&');
  replace('to:`/releases`,className:`release-button`,children:`View Releases`',
    'to:`/release/${e.slug}`,className:`release-button`,children:`View release and formats`');
  replace('children:`Latest Releases`', 'children:`Featured Releases`');
  replace('Released October 30, 2026. CDs and vinyl ship once manufacturing is complete.', 'Released October 30, 2026. Orders ship in 2–3 business days. Delivery time depends on the shipping method you select.');
  replace('Add releases to your cart. Shipping is calculated for the full order at checkout.', 'Orders ship in 2–3 business days. Delivery time depends on the shipping method you select. Shipping is calculated for your full order in the cart.');
  replace('Enter your address to calculate shipping for the whole cart.', 'Orders ship in 2–3 business days. Delivery time depends on the shipping method you select. Enter your address to see shipping options for the whole cart.');
  replace('(0,j.jsx)(A,{to:`/contact`,onClick:M,children:`Contact`})', '(0,j.jsx)(A,{to:`/contact`,onClick:M,children:`Contact`}),(0,j.jsx)(A,{to:`/shipping`,children:`Shipping and order help`})');
  replace('className:`shop-card`,id:t.id===`PX00Z925MY`?`snot-rockets-vinyl`:t.id===`PX00ZUDROB`?`snot-rockets-cd`:undefined,',
    'className:`shop-card`,id:storeProductId(t),tabIndex:-1,');
  replace('className:`shop-buy-button`,type:`button`,onClick:()=>{e({id:t.id',
    'className:`shop-buy-button`,type:`button`,"aria-label":`Add ${t.artist} — ${t.title} (${t.format}) to cart`,onClick:()=>{e({id:t.id');
  replace('(0,j.jsx)(`h2`,{children:t.title}),(0,j.jsx)(`p`,{className:`shop-product-format`',
    '(0,j.jsx)(`h2`,{children:(0,j.jsx)(k,{to:`/release/${storeReleaseForProduct(t).slug}`,children:t.title})}),(0,j.jsx)(`p`,{className:`shop-product-format`');
  replace('children:[`Order total: `,Fr(ne)]', 'children:[te?`Items + shipping: `:`Subtotal before shipping: `,Fr(ne)]');
  replace('function jr(){let{addToCart:e,totalItems:t}=rr()', 'function jr(){const [offersNow]=useStoreClock();let{addToCart:e,totalItems:t}=rr()');
  replace('(0,j.jsx)(`section`,{className:`shop-products`,', 'decemberOffersActive(offersNow)&&j.jsx(StoreDecemberOffers,{}),(0,j.jsx)(`section`,{className:`shop-products`,');
  replace('function Ir(){let{cart:e,', 'function Ir(){const [offersNow,syncOffersClock]=useStoreClock();let{cart:e,');
  replace('C=S.reduce((e,t)=>e+t.price*t.quantity,0),te=s.find(e=>e.description===l),ne=C+Number(te?.price||0)',
    'offerPricing=priceDecemberCart(S,offersNow),C=offerPricing.itemsCents/100,te=s.find(e=>e.description===l),totalCents=offerPricing.subtotalCents+Math.round(Number(te?.price||0)*100),ne=totalCents/100');
  replace('children:Fr(C)})]}),te&&', 'children:Fr(C)})]}),...offerPricing.discounts.map(StoreDiscountLine),te&&');
  replace('let n=[...t.options||[]].sort(', 'syncOffersClock(t.pricingTime);let n=[...t.options||[]].sort(');
  replace('(0,j.jsx)(`button`,{type:`button`,className:`checkout-btn`,onClick:async()=>{if(!p)',
    'j.jsx(StoreCheckoutButtons,{pending:p,disabled:!l,total:ne,onCheckout:async paymentMethod=>{if(!p)');
  replace('},disabled:p||!l,children:p?`Connecting to secure checkout…`:`Pay securely · ${Fr(ne)}`})', '}})');
  replace('shippingDescription:l,requestId:_.current', 'shippingDescription:l,requestId:_.current,expectedTotal:totalCents,paymentMethod');
  replace('if(!t.ok||!n.url)throw Error(n.error||`Unable to start checkout.`);',
    'if(t.status===409){syncOffersClock(n.pricingTime);c([]);u(``);_.current=crypto.randomUUID()}if(!t.ok||!n.url)throw Error(n.error||`Unable to start checkout.`);');
  replace('(0,j.jsx)(sr,{})]})}', '(0,j.jsx)(StoreSignup,{}),(0,j.jsx)(sr,{})]})}');
  replace('children:`Shipping and order help`})', 'children:`Shipping and order help`}),(0,j.jsx)(`a`,{href:`/#join-the-herd`,children:`Join the Herd`})');
  const oldReleaseStart = js.indexOf('function Dr(){');
  const oldReleaseEnd = js.indexOf('function Or(){', oldReleaseStart);
  if (oldReleaseStart < 0 || oldReleaseEnd < 0) throw new Error('Missing release component');
  js = js.slice(0, oldReleaseStart) + 'function Dr(){return j.jsx(StoreReleasePage,{})}' + js.slice(oldReleaseEnd);
  replace('function Rr(){return', 'const storePageInfo=' + json(pageInfo) + ';\n' + fs.readFileSync(path.join(here, 'storefront-runtime.js'), 'utf8') + '\nfunction Rr(){useStorePageInfo();return');
  replace('(0,j.jsx)(Wt,{path:`/contact`,element:(0,j.jsx)(Lr,{})})',
    '(0,j.jsx)(Wt,{path:`/contact`,element:(0,j.jsx)(Lr,{})}),(0,j.jsx)(Wt,{path:`/shipping`,element:j.jsx(StoreShippingPage,{})}),(0,j.jsx)(Wt,{path:`*`,element:j.jsx(StoreNotFound,{})})');
  return js;
}

const navigation = '<nav aria-label="Main navigation">' + [['/','Home'], ['/artists','Artists'], ['/releases','Releases'], ['/shop','Shop'], ['/about','About'], ['/contact','Contact'], ['/shipping','Shipping and order help']].map(([url,label]) => `<a href="${url}">${label}</a>`).join(' ') + '</nav>';
const productId = item => item.id === 'PX00Z925MY' ? 'snot-rockets-vinyl' : item.id === 'PX00ZUDROB' ? 'snot-rockets-cd' : 'product-' + item.id;
const productsFor = (release, data) => data.catalog.filter(item => item.artist === data.artists.find(a => a.slug === release.artistSlug)?.name && normal(item.title) === normal(release.title));
const releasePath = release => '/release/' + release.slug;
const releaseLink = release => `<a href="${releasePath(release)}">${escape(release.title)}</a>`;

function formatLinks(release, data) {
  return productsFor(release, data).map(item => `<p><a href="/shop#${productId(item)}">${escape(item.format)} · $${item.price.toFixed(2)} + shipping</a></p>`).join('');
}

export function createPages(data, {preview = false} = {}) {
  const pages = {};
  const logo = '/assets/logo-BglfCxvB.png';
  const organization = {'@type':'Organization', '@id':origin + '/#label', name:'Iron Tusk Records', url:origin + '/',
    logo:origin + logo, email:'irontuskrecords513@gmail.com', address:{'@type':'PostalAddress', addressLocality:'Hamilton', addressRegion:'Ohio', addressCountry:'US'}};
  function add(urlPath, heading, description, content, {image = logo, entity, noindex = false} = {}) {
    pages[urlPath] = {title: heading + ' | Iron Tusk Records', heading, description, url:origin + (['/', '/404'].includes(urlPath) ? '/' : urlPath + '/'),
      image: origin + image, noindex: noindex || preview,
      structuredData: {'@context':'https://schema.org', '@graph':[organization, ...(entity ? [entity] : [])]},
      content: `<main class="store-static">${navigation}<h1>${escape(heading)}</h1>${content}</main>`};
  }
  const artistLinks = data.artists.map(a => `<article><h2><a href="/artists/${a.slug}">${escape(a.name)}</a></h2><p>${escape(a.genre || '')} · ${escape(a.hometown)}</p></article>`).join('');
  const releases = data.releases.map(r => `<article><h2>${releaseLink(r)}</h2><p>${escape(data.artists.find(a=>a.slug===r.artistSlug).name)} · ${escape(r.type)} · ${escape(r.releaseDate)}</p><p>${escape(r.description)}</p>${formatLinks(r,data)}</article>`).join('');
  add('/', 'Independent music and artists', 'Discover independent artists, albums, EPs and singles from Iron Tusk Records, an independent record label based in Hamilton, Ohio.', '<h2>Thomas Ate the Cat</h2><p>Alternative rock from Michigan.</p><a href="/artists/thomas-ate-the-cat">Explore Thomas Ate the Cat</a><h2>Featured Artists</h2>' + artistLinks);
  const signupPath = '/join-the-herd';
  const signupEmbed = 'https://528cb4e6.sibforms.com/v2/serve/MUIFAEZBBEDUPef4tXiGVK7JLIcdnnlMcSJQ0-pf46RWp9y8X9aKEb_k71uUr9GA-af8UGVBIpgNnaxSXh5Aq8m3OnPZV3Cj-Sq-UVh5kQpDG-4djt0NnX2-0kxh3Z73o7S2tOs6dvNERsMb5wg2nOyC_zUdeuAjf0zclLbvj8y14G-zgUAt8gzVEEhIdQUJ3lOG5z-sIsWUJUniNw==';
  const signupLink = signupEmbed.replace('/v2/serve/', '/serve/');
  add(signupPath, 'Join the Herd', 'Sign up for Iron Tusk Records newsletter updates on new music, artist news, releases, and exclusive offers.',
    '<section class="store-signup" aria-label="Newsletter signup"><iframe title="Join the Herd newsletter signup" src="' + escape(signupEmbed) + '" width="640" height="660"></iframe><p><a href="' + escape(signupLink) + '">Open the signup form directly</a></p></section>');
  pages[signupPath].title = 'Join the Herd | Iron Tusk Records Newsletter Signup';
  pages[signupPath].standalone = true;

  add('/artists', 'Artists', 'Meet Thomas Ate the Cat, ONG, Eddie Michaels, The Snot Rockets, Bone and the Strangels, and Without on Iron Tusk Records.', artistLinks);
  add('/releases', 'Releases', 'Explore albums, EPs and singles from the Iron Tusk Records artist roster, with links to music and physical formats.', releases);
  add('/shop', 'Shop the catalog', 'Browse CDs, vinyl and singles from Iron Tusk Records artists. View format prices and calculate shipping for your full order in the cart.',
    '<p>Shipping is calculated for your full order in the cart.</p>' + data.catalog.map(p => {
      const r = data.releases.find(r=>productsFor(r,data).some(i=>i.id===p.id));
      return `<article id="${productId(p)}"><h2>${releaseLink(r)}</h2><p>${escape(p.artist)} · ${escape(p.format)} · $${p.price.toFixed(2)} + shipping</p></article>`;
    }).join('') + '<noscript><p>Enable JavaScript to add items to your cart and calculate shipping.</p></noscript>');
  add('/about', 'About Iron Tusk Records', 'Learn about Iron Tusk Records, an independent record label based in Hamilton, Ohio, and its commitment to independent artists.', '<p>Iron Tusk Records began as an idea in 2022 and became a registered LLC in 2023, according to the label history. Thomas Ate the Cat became the first signed artist in 2025.</p><p>Great music deserves to be heard, and independent artists deserve to work with people who believe in them.</p>');
  add('/contact', 'Contact Iron Tusk Records', 'Contact Iron Tusk Records for artist distribution, licensing, business partnerships, press and general inquiries.', '<p>Based in Hamilton, Ohio.</p><p>Eddie Michaels — Founder &amp; Owner. Paul Rogers — Label Manager.</p><p><a href="mailto:irontuskrecords513@gmail.com">irontuskrecords513@gmail.com</a></p><p>We typically respond within 1–3 business days.</p>');
  add('/shows', 'Shows', 'Find information about the Iron Tusk Records live shows section and contact the label for inquiries.', '<p>The live shows section is under construction.</p><a href="/contact">Contact the label</a>');
  add('/shipping', 'Shipping and order help', 'Iron Tusk Records orders ship in 2–3 business days. Delivery time depends on your selected shipping method. Contact the label for help with an order.', '<h2>When your order ships</h2><p>Orders ship in 2–3 business days.</p><h2>Delivery time</h2><p>Delivery time depends on the shipping method you select. Shipping is calculated for your full order in the cart, where you can choose an available method.</p><h2>Questions about an order</h2><p>Email <a href="mailto:irontuskrecords513@gmail.com">irontuskrecords513@gmail.com</a> with your order reference if you have one. We typically respond within 1–3 business days.</p>');
  add('/cart', 'Your Shopping Cart', 'Review your Iron Tusk Records cart and calculate shipping for your order.', '<p>Enable JavaScript to review your cart and calculate shipping.</p>', {noindex:true});
  add('/404', 'Page not found', 'This address does not match a page in the Iron Tusk Records catalog.', '<a href="/shop">Browse the shop</a>', {noindex:true});
  for (const artist of data.artists) {
    const content = `<img src="${escape(artist.banner)}" alt="${escape(artist.name)}"><p>${escape(artist.genre || '')} · ${escape(artist.hometown)}</p><p>${escape(artist.bio)}</p><h2>Releases</h2>` + data.releases.filter(r=>r.artistSlug===artist.slug).map(r=>`<article><h3>${releaseLink(r)}</h3><p>${escape(r.releaseDate)}</p>${formatLinks(r,data)}</article>`).join('');
    add('/artists/' + artist.slug, artist.name, `Discover ${artist.name} on Iron Tusk Records. Explore the artist biography, music and physical release formats.`, content,
      {image:artist.banner, entity:{'@type':artist.slug === 'eddie-michaels' ? 'Person' : 'MusicGroup', name:artist.name, url:origin + '/artists/' + artist.slug, image:origin + artist.banner, sameAs:Object.values(artist.socials || {}).filter(Boolean)}});
  }
  for (const release of data.releases) {
    const artist = data.artists.find(a=>a.slug===release.artistSlug);
    const formats = formatLinks(release, data);
    const previewPlayer = release.audioPreview ? `<h2>Listen to a preview</h2><audio controls preload="none" src="${escape(release.audioPreview)}" aria-label="Preview of ${escape(release.title)}"></audio>` : '';
    const catalogNumber = release.catalogNumber ? ` · ${escape(release.catalogNumber)}` : '';
    const details = release.audioPreview ? 'Listen to a preview from Iron Tusk Records.' : 'Find release information and available physical formats from Iron Tusk Records.';
    add(releasePath(release), release.title + ' by ' + artist.name, `Explore ${release.title} by ${artist.name}. ${details}`,
      `<img src="${escape(release.cover)}" alt="${escape(release.title)}"><p><a href="/artists/${artist.slug}">${escape(artist.name)}</a> · ${escape(release.type)} · ${escape(release.releaseDate)}${catalogNumber}</p><p>${escape(release.description)}</p>${previewPlayer}${formats}${release.audioPreview && !formats ? '' : '<p>Shipping is calculated for your full order in the cart.</p>'}`,
      {image:release.cover, entity:{'@type':'MusicAlbum', name:release.title, byArtist:{'@type':artist.slug === 'eddie-michaels' ? 'Person':'MusicGroup', name:artist.name}, url:origin + releasePath(release), image:origin + release.cover}});
  }
  return pages;
}

export function renderPage(template, page) {
  const head = `<title>${escape(page.title)}</title>
<meta name="description" content="${escape(page.description)}">
<meta name="robots" content="${page.noindex ? 'noindex, follow':'index, follow'}">
<link rel="canonical" href="${escape(page.url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Iron Tusk Records">
<meta property="og:title" content="${escape(page.title)}">
<meta property="og:description" content="${escape(page.description)}">
<meta property="og:url" content="${escape(page.url)}">
<meta property="og:image" content="${escape(page.image)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(page.title)}">
<meta name="twitter:description" content="${escape(page.description)}">
<meta name="twitter:image" content="${escape(page.image)}">
<script type="application/ld+json" id="store-structured-data">${json(page.structuredData)}</script>`;
  return template.replace(/<title>[^<]*<\/title>/, () => head).replace('<div id="root"></div>', () => '<div id="root">' + page.content + '</div>');
}

export function improveStorefront() {
  const dist = path.join(root, 'restored-store/dist');
  let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  const oldBundle = html.match(/src="\/assets\/(store-[a-f0-9]+\.js)"/)?.[1];
  if (!oldBundle) throw new Error('Missing built store bundle');
  const original = fs.readFileSync(path.join(dist, 'assets', oldBundle), 'utf8');
  const artwork = JSON.parse(original.match(/const productArtwork=(\{.*?\});function jr/s)?.[1] || 'null');
  if (!artwork) throw new Error('Missing product artwork mapping');
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'restored-store/source/catalog.json'), 'utf8'));
  const data = getData(original, catalog, artwork);
  fs.cpSync(path.join(root, 'release-media'), path.join(dist, 'release-media'), {recursive: true});
  const pages = createPages(data, {preview: !!process.env.CONTEXT && process.env.CONTEXT !== 'production'});
  const runtimePages = Object.fromEntries(Object.entries(pages).map(([url, {content, heading, ...page}]) => [url, page]));
  const offers = fs.readFileSync(path.join(root, 'restored-store/source/december-offers.mjs'));
  const offersName = 'december-offers-' + crypto.createHash('sha256').update(offers).digest('hex').slice(0,12) + '.js';
  fs.writeFileSync(path.join(dist, 'assets', offersName), offers);
  const bundle = `import {decemberOffersActive,priceDecemberCart} from '/assets/${offersName}';\n` + patchBundle(original, data, runtimePages);
  const name = 'store-' + crypto.createHash('sha256').update(bundle).digest('hex').slice(0,12) + '.js';
  fs.writeFileSync(path.join(dist, 'assets', name), bundle);
  const css = fs.readFileSync(path.join(here, 'storefront-improvements.css'), 'utf8');
  const cssName = 'store-improvements-' + crypto.createHash('sha256').update(css).digest('hex').slice(0,12) + '.css';
  fs.writeFileSync(path.join(dist, cssName), css);
  html = html.replace(oldBundle, name).replace('</head>', `<link rel="stylesheet" href="/${cssName}">\n</head>`);
  for (const [route, page] of Object.entries(pages)) {
    const output = route === '/404' ? path.join(dist, '404.html') : path.join(dist, route === '/' ? '' : route.slice(1), 'index.html');
    fs.mkdirSync(path.dirname(output), {recursive:true});
    // Keep the static signup visible without mounting the store application.
    const template = page.standalone ? html.replace(/<script\b[^>]*src="\/assets\/store-[a-f0-9]+\.js"[^>]*>\s*<\/script>/, '') : html;
    fs.writeFileSync(output, renderPage(template, page));
  }
  const sitemapPaths = Object.keys(pages).filter(url=>!['/cart','/404'].includes(url));
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + sitemapPaths.map(url=>`  <url><loc>${origin}${url === '/' ? '/' : url + '/'}</loc></url>`).join('\n') + '\n</urlset>\n');
  fs.writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /one/\nDisallow: /account/\nDisallow: /cart\nDisallow: /store-api/\nDisallow: /.netlify/functions/\nSitemap: ' + origin + '/sitemap.xml\n');
  let redirects = fs.readFileSync(path.join(dist, '_redirects'), 'utf8');
  const routes = Object.keys(pages).filter(url=>!['/','/404'].includes(url)).map(url=>`${url} ${url}/index.html 200\n${url}/ ${url}/index.html 200`).join('\n');
  redirects = replaceOnce(redirects, '/* /index.html 200', routes + '\n/* /404.html 404');
  fs.writeFileSync(path.join(dist, '_redirects'), redirects);
  fs.appendFileSync(path.join(dist, '_headers'), '\n/cart\n  X-Robots-Tag: noindex, follow\n/cart/*\n  X-Robots-Tag: noindex, follow\n/robots.txt\n  Content-Type: text/plain; charset=utf-8\n/sitemap.xml\n  Content-Type: application/xml; charset=utf-8\n');
  console.log(`Improved ${data.artists.length} artist profiles, ${data.releases.length} releases, ${catalog.length} offers and ${sitemapPaths.length} indexable routes.`);
  return {data, pages, name};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) improveStorefront();
