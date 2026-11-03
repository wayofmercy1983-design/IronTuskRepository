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
};
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
js = js.replace('function jr(){', `const productArtwork=${JSON.stringify(covers)};function jr(){`);
js = js.replace(card, card + '(0,j.jsx)(`img`,{className:`shop-product-artwork`,src:`/product-artwork/${productArtwork[t.title]}`,alt:`${t.artist} — ${t.title} artwork`,width:600,height:600,loading:`lazy`,decoding:`async`}),');
js = js.replace('src:`/shop/power-chords.png`', 'src:`/product-artwork/power-chords.jpg`');
const bundle = `store-${crypto.createHash('sha256').update(js).digest('hex').slice(0,12)}.js`;
fs.writeFileSync(path.join(dist, 'assets', bundle), js);
const css = fs.readFileSync(path.join(root, 'store-visuals.css'));
const cssName = `store-visuals-${crypto.createHash('sha256').update(css).digest('hex').slice(0,12)}.css`;
fs.writeFileSync(path.join(dist, cssName), css);
html = html.replace(oldBundle, bundle).replace('</head>', `<link rel="stylesheet" href="/${cssName}">\n</head>`);
fs.writeFileSync(path.join(dist, 'index.html'), html);
console.log(`Updated artwork for ${catalog.length} products and consistent typography.`);
