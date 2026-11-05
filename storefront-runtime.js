// Compiled into the preserved storefront by improve-storefront.mjs.
// k, j, x, ht, bt, _r, yr and Ar are the existing app's router, React and data.
function StoreReleasePage() {
  const {slug} = bt();
  const release = yr.find(item => item.slug === slug);
  if (!release) return j.jsx(StoreNotFound, {});
  const artist = _r.find(item => item.slug === release.artistSlug);
  const products = storeProductsFor(release);
  return j.jsxs('section', {className: 'release-page store-release-page', children: [
    j.jsx(k, {to: '/releases', children: '← All releases'}),
    j.jsxs('div', {className: 'store-release-header', children: [
      j.jsx('img', {src: release.cover, alt: release.title, width: 600, height: 600}),
      j.jsxs('div', {children: [
        j.jsx('h1', {children: release.title}),
        j.jsx(k, {to: '/artists/' + artist.slug, children: artist.name}),
        j.jsx('p', {children: release.type + ' · ' + release.releaseDate}),
        j.jsx('p', {children: release.description}),
        products.length > 0 && j.jsxs('section', {'aria-label': 'Choose a format', children: [
          j.jsx('h2', {children: 'Choose a format'}),
          ...products.map(product => j.jsx(k, {
            to: '/shop#' + storeProductId(product), className: 'store-format-link',
            children: product.format + ' · $' + product.price.toFixed(2) + ' + shipping'
          }, product.id)),
          j.jsx('p', {children: 'Orders ship in 2–3 business days. Delivery time depends on the shipping method you select.'}),
          j.jsx(k, {to: '/shipping', children: 'Shipping and order help'}),
          j.jsx(k, {to: '/contact', children: 'Questions about availability or shipping?'})
        ]})
      ]})
    ]}),
    Object.values(release.links || {}).some(Boolean) && j.jsxs('section', {className: 'release-links', 'aria-label': 'Listen to the artist', children:
      Object.entries(release.links || {}).filter(([, url]) => url && !url.includes('...')).map(([label, url]) =>
        j.jsx('a', {href: url, target: '_blank', rel: 'noopener noreferrer', className: 'listen-button',
          children: ({spotify: 'Spotify', youtube: 'YouTube', apple: 'Apple Music', bandcamp: 'Bandcamp'})[label] || label
        }, label))
    }),
    j.jsx(k, {to: '/artists/' + artist.slug + (artist.previews?.length ? '#artist-previews' : ''), className: 'store-format-link',
      children: artist.previews?.length ? 'Listen to artist previews' : 'Explore ' + artist.name})
  ]});
}

function StoreShippingPage() {
  return j.jsxs('section', {className:'store-release-page', children:[
    j.jsx('h1', {children:'Shipping and order help'}),
    j.jsx('h2', {children:'When your order ships'}),
    j.jsx('p', {children:'Orders ship in 2–3 business days.'}),
    j.jsx('h2', {children:'Delivery time'}),
    j.jsx('p', {children:'Delivery time depends on the shipping method you select. Shipping is calculated for your full order in the cart, where you can choose an available method.'}),
    j.jsx('h2', {children:'Questions about an order'}),
    j.jsx('p', {children:'For shipping questions or help with an order, email Iron Tusk Records. Include your order reference if you have one.'}),
    j.jsx('a', {href:'mailto:irontuskrecords513@gmail.com', children:'irontuskrecords513@gmail.com'}),
    j.jsx('p', {children:'We typically respond within 1–3 business days.'}),
    j.jsx(k, {to:'/shop', className:'store-format-link', children:'Browse the shop'})
  ]});
}

function storeProductId(product) {
  if (product.id === 'PX00Z925MY') return 'snot-rockets-vinyl';
  if (product.id === 'PX00ZUDROB') return 'snot-rockets-cd';
  return 'product-' + product.id;
}

function storeProductsFor(release) {
  const normal = value => value.toLowerCase().replace(/[’']/g, '');
  const artist = _r.find(item => item.slug === release.artistSlug);
  return Ar.filter(product => artist && product.artist === artist.name && normal(product.title) === normal(release.title));
}

function storeReleaseForProduct(product) {
  const normal = value => value.toLowerCase().replace(/[’']/g, '');
  const artist = _r.find(item => item.name === product.artist);
  return yr.find(item => item.artistSlug === artist?.slug && normal(item.title) === normal(product.title));
}

function StoreNotFound() {
  return j.jsxs('section', {className: 'store-not-found', children: [
    j.jsx('h1', {children: 'Page not found'}),
    j.jsx('p', {children: 'This address does not match a page in the Iron Tusk Records catalog.'}),
    j.jsx(k, {to: '/artists', children: 'Explore artists'}), ' · ',
    j.jsx(k, {to: '/shop', children: 'Browse the shop'})
  ]});
}

function useStorePageInfo() {
  const {pathname, hash} = ht();
  x.useEffect(() => {
    const path = pathname.replace(/\/$/, '') || '/';
    const page = storePageInfo[path] || storePageInfo['/404'];
    document.title = page.title;
    const meta = (selector, attr, name, content) => {
      let element = document.querySelector(selector);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attr, name); document.head.append(element); }
      element.setAttribute('content', content);
    };
    meta('meta[name="description"]', 'name', 'description', page.description);
    meta('meta[name="robots"]', 'name', 'robots', page.noindex ? 'noindex, follow' : 'index, follow');
    meta('meta[property="og:title"]', 'property', 'og:title', page.title);
    meta('meta[property="og:description"]', 'property', 'og:description', page.description);
    meta('meta[property="og:url"]', 'property', 'og:url', page.url);
    meta('meta[property="og:image"]', 'property', 'og:image', page.image);
    meta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    meta('meta[name="twitter:title"]', 'name', 'twitter:title', page.title);
    meta('meta[name="twitter:description"]', 'name', 'twitter:description', page.description);
    meta('meta[name="twitter:image"]', 'name', 'twitter:image', page.image);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical);}
    canonical.href = page.url;
    let data = document.getElementById('store-structured-data');
    if (!data) {data = document.createElement('script'); data.type = 'application/ld+json'; data.id = 'store-structured-data'; document.head.append(data);}
    data.textContent = JSON.stringify(page.structuredData);
    if (!hash) window.scrollTo({top: 0, left: 0, behavior: 'instant'});
    if (hash) requestAnimationFrame(() => {
      let id; try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (target) {target.scrollIntoView({block: 'center'}); target.focus({preventScroll: true});}
    });
  }, [pathname, hash]);
}
