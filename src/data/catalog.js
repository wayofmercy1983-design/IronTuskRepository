import noIntention from '../assets/releases/no-intention.png';
import politics from '../assets/releases/politics-and-other-strange-tales.jpg';
import essentials from '../assets/releases/the-essentials-of-2020.jpg';
import bone from '../assets/releases/bone.png';
import mothersDay from '../assets/releases/mothers-day-in-april.jpg';
import ong from '../assets/releases/ong-album-cover.jpg';
import tribal from '../assets/releases/tribal.png';

const cd = (id) => `https://kunaki.com/Sales.asp?PID=${id}&PP=1`;
const vinyl = (id, small = false) => `https://kunaki.com/${small ? 'SmallVinylRecord' : 'VinylRecord'}.asp?ProductId=${id}`;

// Recovered from the saved October 9 catalog deployment.
export const catalog = [
  { id: 'no-intention', artist: 'Thomas Ate the Cat', title: 'No Intention', type: 'SINGLE · CD', price: 3.75, image: noIntention, buyUrl: cd('PX00HEDOO6'), vinylUrl: vinyl('PX00HUOTT8', true), vinylPrice: '$15.00' },
  { id: 'cog-in-the-wheel', artist: 'Eddie Michaels', title: 'Cog in the Wheel', type: 'SINGLE · CD', price: 3.75, image: '/shop/cog-in-the-wheel.jpg', buyUrl: cd('PX00ZXAFOK'), vinylUrl: vinyl('PX00ZWP1SF', true), vinylPrice: '$15.00' },
  { id: 'politics', artist: 'Eddie Michaels', title: 'Politics and Other Strange Tales', type: 'ALBUM · CD', price: 12, image: politics, buyUrl: cd('PX00ZEJAB1'), vinylUrl: vinyl('PX00Z1H779'), vinylPrice: '$40.00' },
  { id: 'essentials', artist: 'Eddie Michaels', title: 'The Essentials of 2020', type: 'EP · CD', price: 8, image: essentials, buyUrl: cd('PX00A9LZ3Y'), vinylUrl: vinyl('PX00FB63TW') },
  { id: 'scotts-tune', artist: 'Bone and the Strangels', title: "Scott's Tune", type: 'SINGLE · CD', price: 3.75, image: bone, buyUrl: cd('PX009JCFZZ') },
  { id: 'mothers-day', artist: 'Bone and the Strangels', title: "Mother's Day in April", type: 'SINGLE · CD', price: 3.75, image: mothersDay, buyUrl: cd('PX00ZN9ZNN') },
  { id: 'ong', artist: 'ONG', title: 'Ong', type: 'ALBUM', image: ong },
  { id: 'tribal', artist: 'ONG', title: 'Tribal', type: 'ALBUM · CD', price: 12, image: tribal, buyUrl: cd('PX00ZS4HO8') },
];
