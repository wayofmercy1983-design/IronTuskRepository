import thomas from "../assets/Artists/thomas-banner.png";
import ong from "../assets/Artists/ong-banner.png";
import eddie from "../assets/Artists/eddie-banner.png";
import snot from "../assets/Artists/snotrockets-banner.png";
import bone from "../assets/Artists/bone-banner.png";
import clickSound from "../assets/sounds/click.mp3";

const artists = [
  {
    id: 2,
    slug: "thomas-ate-the-cat",
    route: "/artists/thomas-ate-the-cat",
    featured: true,

    name: "Thomas Ate the Cat",
    genre: "Alternataive Rock",
    hometown: "Michigan",

    banner: thomas,

    bio: `Thomas Ate the Cat is a five-piece alternative rock band from Michigan. Blending heavy guitars, melodic hooks, and emotionally driven songwriting, the band has built a loyal following throughout the Midwest. Their partnership with Iron Tusk Records marks the next chapter in their musical journey.`,

    latestRelease: 3,

    socials: {
      spotify: "",
      youtube: "",
      facebook: "",
      instagram: "",
    },
  },

  {
    
  id: 3,
  slug: "ong",
  route: "/artists/ong",
  featured: true,

  name: "ONG",
  genre: "Alt-Rock • Alt-Country • Alt-Reality",
  hometown: "Norman, Oklahoma",

  banner: ong,

  bio: `Formed in 1996, ONG is a three-piece band from Norman, Oklahoma. Local club circuit regulars and perennial favorites of the Oklahoma City Arts Council, ONG delivers a unique blend of alt-rock, alt-country, and what they call alt-reality. Their music combines original songwriting with roadhouse rock influences, creating an unmistakable sound that has earned them a loyal following for decades.

The band consists of Tony "Bone" Ong (guitar, vocals, strings, songwriter), Mark Hancock (drums, percussion, vocals, songwriter), and Jody "Jackson" Randle (bass, vocals, recording engineer). Their latest release, "Tribal," was mastered by Andy Walter and Alex Gordon at the legendary Abbey Road Studios.`,

  latestRelease: 2,

  socials: {
  spotify: "https://open.spotify.com/artist/0kaREFEyORetPaGatUNvKq",
  youtube: "https://youtube.com/@Ongtheband",
  bandcamp: "https://ongmusic1.bandcamp.com",
  facebook: "https://facebook.com/ongtheband",
  instagram: "https://instagram.com/ongtheband",
},

  founded: "1996",

  members: [
    "Tony \"Bone\" Ong — Guitar, Vocals, Strings, Songwriter",
    "Mark Hancock — Drums, Percussion, Vocals, Songwriter",
    "Jody \"Jackson\" Randle — Bass, Vocals, Recording Engineer",
  ],

  funFacts: [
    "Tony has a degree in Music Performance.",
    "Mark is an award-winning photojournalist.",
    "Jody speaks fluent Swedish.",
    "\"Tribal\" was mastered by Andy Walter and Alex Gordon at Abbey Road Studios.",
  ],

  },

  {
    id: 4,
    slug: "eddie-michaels",
    route: "/artists/eddie-michaels",
    featured: true,

    name: "Eddie Michaels",
    genre: "Punk Rock",
    hometown: "Hamilton, Ohio",

    banner: eddie,

    bio: `Eddie Michaels began playing guitar at the age of fifteen and has spent more than two decades writing, recording, and performing original music. Inspired by bands such as Bad Religion and NOFX, his songwriting blends punk rock energy with melodic hooks, thoughtful lyrics, and classic rock influences.

Throughout his career, Eddie has performed with bands including D.W.A. and Without, developing his sound both on stage and in the studio. Beyond performing, he founded Iron Tusk Records Ltd., where he helps independent artists grow while continuing to release his own music.`,

    latestRelease: 5,

    socials: {
      spotify: "https://open.spotify.com/artist/...",
      youtube: "https://www.youtube.com/@...",
      bandcamp: "https://eddiemichaels.bandcamp.com",
      facebook: "https://www.facebook.com/...",
      instagram: "",
    },
  },

  {
  id: 5,
  slug: "the-snot-rockets",
  route: "/artists/the-snot-rockets",
  featured: true,

  name: "The Snot Rockets",
  genre: "Folk Punk",
  hometown: "Hamilton, Ohio",

  banner: snot,

  bio: `The Snot Rockets are a folk punk duo from Hamilton, Ohio, formed in 2025. The band was born from the ashes of two previous projects: Facing Marjorie, originally known as Ear-mark. Eric Combs left Ear-mark after realizing it wasn't the direction he wanted to pursue. Months later, after becoming increasingly disappointed with the direction of Facing Marjorie, Eddie Michaels also decided to move on.

Eddie eventually reached back out to Eric, and the two began discussing new ideas. One idea immediately stood out—the name The Snot Rockets. Eric's response was simple: "I would be totally down for being in a band called The Snot Rockets." From that moment, the duo began writing original material together.

Although rehearsals have been few and far between, The Snot Rockets have continued to push forward, writing five original songs for their debut EP, The Snot Rockets. Blending the raw honesty of folk music with the rebellious energy of punk, the band is just getting started and looks forward to bringing its music to audiences everywhere.`,

  latestRelease: 1,

  founded: "2025",

  members: [
    "Eddie Michaels — Vocals",
    "Eric Combs — Acoustic Guitar",
  ],

  socials: {
    spotify:
      "https://open.spotify.com/artist/33LeZKEMS1aX7LsGHqrufn?si=MmKH0C9QQJG_1pMp33kx3g",
    youtube: "",
    bandcamp: "",
    facebook:
      "https://www.facebook.com/profile.php?id=61583476506099",
    instagram:
      "https://www.instagram.com/the1snot2rockets/",
  },

  funFacts: [
    "Formed in 2025.",
    "The band was created after Eddie Michaels and Eric Combs left their previous projects to start something new.",
    "Their debut release is the five-song EP 'The Snot Rockets'.",
  ],
},

  {
    id: 6,
    slug: "bone-and-the-strangels",
    route: "/artists/bone-and-the-strangels",
    featured: true,

    name: "Bone and the Strangels",
    genre: "Blues Rock",
    hometown: "Ohio",

    banner: bone,

    bio: `Bone and the Strangels blend blues, southern rock, and classic rock into a powerful live experience. Their soulful vocals, gritty guitar work, and timeless songwriting have made them one of the standout acts on Iron Tusk Records.`,

    latestRelease: 1,

    socials: {
      spotify: "",
      youtube: "",
      facebook: "",
      instagram: "",
    },
  },
];

export default artists;