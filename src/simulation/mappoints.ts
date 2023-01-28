import { basketBallImg, skateparkImg, spaImg, tennisImg, volleyBallImg } from '@/simulation/images';

const openingHours1: OpeningProps = {
  monday: '16.00-22.00',
  tuesday: 'geschlossen',
  wednesday: 'geschlossen',
  thursday: '16.00-22.00',
  friday: '12.00-24.00',
  saturday: '12.00-24.00',
  sunday: '12.00-22.00',
};

const openingHours2: OpeningProps = {
  monday: '10.00-20.00',
  tuesday: '08.00-18.00',
  wednesday: '12.00-22.00',
  thursday: '12.00-22.00',
  friday: '12.00-20.00',
  saturday: 'geschlossen',
  sunday: 'geschlossen',
};

const comments1: CommentProps[] = [
  {
    author: 'Gerhard',
    text: 'Das ist ein Kommentar, hahaha xD',
  },
  {
    author: 'Sabine',
    text: 'Sabines Kommmentar, der sehr sehr lang ist. Ja Sabine hat wirklich sehr viel Text geschrieben, um hier den Rahmen zu sprengen.',
  },
  {
    author: 'Jean',
    text: 'Hey! Wir suchen noch Leute zum Spielen, kommt 16:00 dazu!',
  },
  {
    author: 'Friedi',
    text: 'richtig frische Luft hier ;)',
  },
];

const comments2: CommentProps[] = [
  {
    author: 'Bertold B.',
    text: 'Super Spot! Kann auch gut zum Parkour trainieren genutzt werden.',
  },
  {
    author: 'Linus',
    text: 'Leuuider immer etwas voll',
  },
  {
    author: 'Viv',
    text: 'Im Winter etwas glatt, im Sommer einfach beste!',
  },
  {
    author: 'Jona',
    text: 'Yeahh! Endlich rauskomm!',
  },
  {
    author: 'Bertold B.',
    text: 'Danke für den Tipp!',
  },
  {
    author: 'Sabrina',
    text: 'Nicht gut für Fußball spielen, sonst in Ordnung',
  },
  {
    author: 'Bibi',
    text: 'Einfach ZAUBERhaft!!!',
  },
];

const mockMapPoints: MapPointProps[] = [
  {
    uuid: '1',
    title: 'Basketball Platz',
    description: 'Hier steht eine wunderschöne und definitiv sehr aussagekräftige Beschreibung über einen Basketball Platz, wie man das so von den Usern gewohnt ist, lol.',
    address: 'Luxemburger Straße 100, 12345 Berlin',
    openingHours: openingHours1,
    rating: 4.2,
    comments: comments1,
    image: basketBallImg,
  },
  {
    uuid: '2',
    title: 'Volleyball Platz',
    description: 'Hier steht eine BEschreibung zum Volleyball Platz.',
    address: 'Frankfurter Allee 144, 10365 Berlin',
    openingHours: openingHours2,
    rating: 1.6,
    comments: comments2,
    image: volleyBallImg,
  },
  {
    uuid: '1219',
    title: 'Bob MacQuarrie Skateboard Park (SK8 Extreme Park)',
    description: 'Flat asphalt surface, 10 components, City run learn to skateboard programs, City run skateboard camps in summer.',
    address: 'Youville Drive 144, 14905 Berlin',
    openingHours: openingHours1,
    rating: 1.6,
    comments: comments1,
    image: skateparkImg,
  },
  {
    uuid: '1157',
    title: 'Walter Baker Basketball Park',
    description: 'Concrete bowl, 7,000 sq ft.',
    address: '100 Charlie Rogers Place, Berlin',
    openingHours: openingHours2,
    rating: 2.5,
    comments: comments2,
    image: basketBallImg,
  },
  {
    uuid: '9157',
    title: 'Roving Baskteball Park Location',
    description: 'Flat surface, 5 components',
    address: '2785 8th Line Road, Berlin',
    openingHours: openingHours1,
    rating: 3.5,
    comments: comments1,
    image: basketBallImg,
  },
  {
    uuid: '1160',
    title: 'Roving volleyball Location',
    description: 'Flat surface, 9 components',
    address: '10 Warner Colpitts Lane, Berlin',
    openingHours: openingHours1,
    rating: 3.5,
    comments: comments2,
    image: volleyBallImg,
  },
  {
    uuid: '1693',
    title: 'Legacy volleball Park',
    description: 'Large concrete bowl, many street and vertical components, 17,000 sq ft',
    address: '101 Centrepointe Drive',
    openingHours: openingHours2,
    rating: 4.5,
    comments: comments1,
    image: volleyBallImg,
  },
  {
    uuid: '1717',
    title: 'Greenboro Spa',
    description: 'Flat asphalt surface, 5 components',
    address: '3142 Conroy Road, Berlin',
    openingHours: openingHours1,
    rating: 1,
    comments: comments2,
    image: spaImg,
  },
  {
    uuid: '137',
    title: 'Bruuidlewood Spa',
    description: 'Flat asphalt surface, no components',
    address: '65 Stonehaven Drive, Berlin',
    openingHours: openingHours1,
    rating: 2,
    comments: comments1,
    image: spaImg,
  },
  {
    uuid: '1133',
    title: 'Roving Parkour Park Location',
    description: 'Flat surface, infinity components',
    address: '100 Clifford Campbell Street',
    openingHours: openingHours2,
    rating: 3,
    comments: comments1,
    image: tennisImg,
  },
  {
    uuid: '657',
    title: 'Wolfsburg parkour  Park Location',
    description: 'smooth surface, 25 components',
    address: '110 Malvern Drive, Berlin',
    openingHours: openingHours2,
    rating: 4,
    comments: comments2,
    image: spaImg,
  },
  {
    uuid: '653',
    title: 'Roving Skateboard Park Location',
    description: 'Rough surface, 66 components',
    address: '5660 Osgoode Main Street, Berlin',
    openingHours: openingHours2,
    rating: 5,
    comments: comments1,
    image: skateparkImg,
  },
  {
    uuid: '812',
    title: 'Charlie Bowins Handball',
    description: 'Flat concrete surface, 10 plus components (large half pipe), City run learn to skateboard programs, City run skateboard camps in summer',
    address: '435 Bronson Avenue, Berlin',
    openingHours: openingHours2,
    rating: 4.2,
    comments: comments2,
    image: volleyBallImg,
  },
  {
    uuid: '2457',
    title: 'Diamond Jubilee Skateboard Park',
    description: 'Flat asphalt surface, City run skateboard camps in summer',
    address: '2810 Findlay Creek Drive',
    openingHours: openingHours2,
    rating: 3.2,
    comments: comments2,
    image: skateparkImg,
  },
  {
    uuid: '430',
    title: 'Blackburn Skateboard Park',
    description: 'Flat asphalt surface, 5 components, City run skateboard camps in summer',
    address: '190 Glen Park Drive, Berlin',
    openingHours: openingHours2,
    rating: 3.2,
    comments: comments1,
    image: spaImg,
  },
  {
    uuid: '989',
    title: 'Goulbourn Spa',
    description: '1000 surface, 60000 components',
    address: '1500 Shea Road, Berlin',
    openingHours: openingHours1,
    rating: 4.4,
    comments: comments2,
    image: spaImg,
  },
  {
    uuid: '330',
    title: 'Manotick Skateboard Park',
    description: 'Flat asphalt surface, 8 components',
    address: '5572 Doctor Leach Drive, Berlin',
    openingHours: openingHours1,
    rating: 4.4,
    comments: comments1,
    image: skateparkImg,
  },
  {
    uuid: '693',
    title: 'Pankow Tennis Park Location',
    description: 'Flat surface, 5555555555555 components',
    address: '1448 Meadow Drive, Berlin',
    openingHours: openingHours2,
    rating: 4.4,
    comments: comments2,
    image: tennisImg,
  },
  {
    uuid: '2544',
    title: 'Berrigan Tennis Park',
    description: 'Flat concrete surface, 10 plus components',
    address: '51 Berrigan Drive, Berlin',
    openingHours: openingHours2,
    rating: 2.4,
    comments: comments1,
    image: tennisImg,
  },
  {
    uuid: '2599',
    title: 'EugÃne Martineau tennis Park',
    description: '1 component',
    address: '710 Mikinak Road, Berlin',
    openingHours: openingHours1,
    rating: 3.5,
    comments: comments2,
    image: tennisImg,
  },
  {
    uuid: '2278',
    title: 'Vista Speedball Park',
    description: 'Flat surface, 5 components, Flat surface, 5 components, Flat surface, 5 components',
    address: '720 Vistapark Drive, Berlin',
    openingHours: openingHours1,
    rating: 3.5,
    comments: comments2,
    image: volleyBallImg,
  },
  {
    uuid: '2211',
    title: 'Schäfersee Lake & Park',
    description: 'Flat surface, 5 components, Flat surface, 5 components, Flat surface, 5 components',
    address: 'Schäfersee 13407',
    openingHours: openingHours2,
    rating: 5,
    comments: comments1,
    image: spaImg,
  },
];

export { mockMapPoints };
