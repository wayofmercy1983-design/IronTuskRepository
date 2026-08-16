import bone from "../assets/releases/bone.png";
import noIntention from "../assets/releases/no-intention.png";
import politics from "../assets/releases/politics-and-other-strange-tales.jpg";
import essentials from "../assets/releases/the-essentials-of-2020.jpg";
import tribal from "../assets/releases/tribal.png";
import snot from "../assets/releases/snotrockets.jpg";
import mothersDay from "../assets/releases/mothers-day-in-april.jpg";
import ongAlbum from "../assets/releases/ong-album-cover.jpg";

const powerChords = "/shop/power-chords.png";

const releases = [
  {
    id: 1,
    title: "Scott's Tune",
    artistSlug: "bone-and-the-strangels",
    type: "Single",
    releaseDate: "2025",
    status: "Released",
    genre: "Blues Rock",
    description: "The debut single from Bone and the Strangels.",
    cover: bone,
    links: {
      spotify: "",
      apple: "",
      youtube: "",
      bandcamp: "",
    },
  },

  {
    id: 2,
    title: "Mother's Day in April",
    artistSlug: "bone-and-the-strangels",
    type: "Single",
    releaseDate: "2026",
    status: "Released",
    genre: "Blues Rock",
    description: "A heartfelt single from Bone and the Strangels.",
    cover: mothersDay,
    links: {
      spotify: "",
      apple: "",
      youtube: "",
      bandcamp: "",
    },
  },

  {
    id: 3,
    title: "No Intention",
    artistSlug: "thomas-ate-the-cat",
    type: "Single",
    releaseDate: "2025",
    status: "Released",
    genre: "Alternative Rock",
    description: "The latest single from Thomas Ate the Cat.",
    cover: noIntention,
    links: {
      spotify: "",
      apple: "",
      youtube: "",
      bandcamp: "",
    },
  },

  {
    id: 4,
    title: "Power Chords and Other Nonsense",
    artistSlug: "thomas-ate-the-cat",
    type: "Album",
    releaseDate: "Coming Soon",
    status: "Coming Soon",
    genre: "Alternative Rock",
    description:
      "The upcoming debut full-length album from Thomas Ate the Cat.",
    cover: powerChords,
    links: {
      spotify: "",
      apple: "",
      youtube: "",
      bandcamp: "",
    },
  },

  {
    id: 5,
    title: "Politics and Other Strange Tales",
    artistSlug: "eddie-michaels",
    type: "Album",
    releaseDate: "TBA",
    status: "Limited Edition",
    genre: "Rock",
    description:
      "A limited edition release from Eddie Michaels.",
    cover: politics,
    links: {
      spotify: "",
      apple: "",
      youtube: "",
      bandcamp: "",
    },
  },

  {
    id: 6,
    title: "The Essentials of 2020",
    artistSlug: "eddie-michaels",
    type: "Album",
    releaseDate: "2020",
    status: "Released",
    genre: "Rock",
    description:
      "A collection of songs written during 2020 by Eddie Michaels.",
    cover: essentials,
    links: {
      spotify: "",
      apple: "",
      youtube: "",
      bandcamp: "",
    },
  },

  {
    id: 7,
    title: "Ong",
    artistSlug: "ong",
    type: "Album",
    releaseDate: "May 2019",
    status: "Released",
    genre: "Alt-Rock / Alt-Country / Alt-Reality",
    description:
      "ONG's self-titled debut album featuring their signature blend of alt-rock, alt-country, and roadhouse rock.",
    cover: ongAlbum,
    links: {
      spotify: "https://open.spotify.com/artist/0kaREFEyORetPaGatUNvKq",
      apple: "",
      youtube: "https://youtube.com/@Ongtheband",
      bandcamp: "https://ongmusic1.bandcamp.com",
    },
  },

  {
    id: 8,
    title: "Tribal",
    artistSlug: "ong",
    type: "Album",
    releaseDate: "December 2023",
    status: "Released",
    genre: "Alt-Rock / Alt-Country / Alt-Reality",
    description:
      "The band's acclaimed second album, mastered by Andy Walter and Alex Gordon at Abbey Road Studios.",
    cover: tribal,
    links: {
      spotify: "https://open.spotify.com/artist/0kaREFEyORetPaGatUNvKq",
      apple: "",
      youtube: "https://youtube.com/@Ongtheband",
      bandcamp: "https://ongmusic1.bandcamp.com",
    },
  },

  {
    id: 9,
    title: "The Snot Rockets",
    artistSlug: "the-snot-rockets",
    type: "EP",
    releaseDate: "Coming Soon",
    status: "Coming Soon",
    genre: "Folk Punk",
    description:
      "The debut five-song EP from The Snot Rockets. Blending raw folk storytelling with punk attitude, the EP marks the band's first release on Iron Tusk Records and introduces the duo's honest songwriting and DIY spirit.",
    cover: snot,
    links: {
      spotify: "",
      apple: "",
      youtube: "",
      bandcamp: "",
    },
  },
];

export default releases;