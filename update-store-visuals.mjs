import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'restored-store/dist');
const covers = {
  'Power Chords and Other Nonsense': 'power-chords.jpg',
  'Self Titled': 'without.jpg',
  'The Snot Rockets': 'snot-rockets.jpg',
  'Tribal': 'tribal.jpg',
  'Politics and Other Strange Tales': 'politics.jpg',
  'The Essentials of 2020': 'essentials.jpg',
  'Cog in the Wheel': 'cog-in-the-wheel.jpg',
  'Mother’s Day in April': 'mothers-day.jpg',
  'Scott’s Tune': 'scotts-tune.png',
  'No Intention': 'no-intention.png',
  'Ode to RFK Jr.': '/release-media/ode-to-rfk-jr-cover.jpg',
};
const artwork = Object.fromEntries(Object.entries(covers).map(([title, file]) => [title, file.startsWith('/') ? file : '/product-artwork/' + file]));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'restored-store/source/catalog.json'), 'utf8'));
for (const item of catalog) {
  if (!covers[item.title]) throw new Error(`Missing artwork for ${item.title}`);
}
fs.cpSync(path.join(root, 'public/product-artwork'), path.join(dist, 'product-artwork'), {recursive:true});
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const oldBundle = html.match(/src="\/assets\/(store-[a-f0-9]+\.js)"/)?.[1];
if (!oldBundle) throw new Error('Store bundle was not found');
let js = fs.readFileSync(path.join(dist, 'assets', oldBundle), 'utf8');
const card = 'className:`shop-card`,children:[';
if (js.split(card).length !== 2) throw new Error('Expected exactly one product card template');
js = js.replace('function jr(){', `const productArtwork=${JSON.stringify(artwork)};function jr(){`);
js = js.replace(card, card + '(0,j.jsx)(`img`,{className:`shop-product-artwork`,src:productArtwork[t.title],alt:`${t.artist} — ${t.title} artwork`,width:600,height:600,loading:`lazy`,decoding:`async`}),');
js = js.replace('src:`/shop/power-chords.png`', 'src:`/product-artwork/power-chords.jpg`');
const snotRelease = 'artistSlug:`the-snot-rockets`,type:`EP`,releaseDate:`Coming Soon`,status:`Coming Soon`';
if (!js.includes(snotRelease)) throw new Error('Snot Rockets release entry was not found');
js = js.replace(snotRelease, 'artistSlug:`the-snot-rockets`,type:`EP`,releaseDate:`October 30, 2026`,status:`Released`');
js = js.replace('className:`shop-card`,children:[', 'className:`shop-card`,id:t.id===`PX00Z925MY`?`snot-rockets-vinyl`:t.id===`PX00ZUDROB`?`snot-rockets-cd`:undefined,children:[');
js = js.replace('CDs and vinyl ship as soon as Kunaki manufactures them.', 'CDs and vinyl ship once manufacturing is complete.');
js = js.replace('Music available from Kunaki', 'Music available from Iron Tusk Records');
js = js.replace('Kunaki could not calculate shipping.', 'Shipping could not be calculated.');
const bundle = `store-${crypto.createHash('sha256').update(js).digest('hex').slice(0,12)}.js`;
fs.writeFileSync(path.join(dist, 'assets', bundle), js);
const css = fs.readFileSync(path.join(root, 'store-visuals.css'));
const cssName = `store-visuals-${crypto.createHash('sha256').update(css).digest('hex').slice(0,12)}.css`;
fs.writeFileSync(path.join(dist, cssName), css);
html = html.replace(oldBundle, bundle).replace('</head>', `<link rel="stylesheet" href="/${cssName}">\n</head>`);
fs.writeFileSync(path.join(dist, 'index.html'), html);
console.log(`Updated artwork for ${catalog.length} products and consistent typography.`);
fs.cpSync(path.join(root, 'public/tatc'), path.join(dist, 'tatc'), {recursive:true});
fs.cpSync(path.join(root, 'public/snot-rockets'), path.join(dist, 'snot-rockets'), {recursive:true});
