import type { NextApiRequest, NextApiResponse } from 'next';
import {
  spaImg,
  volleyBallImg,
  skateparkImg,
  basketBallImg,
  tennisImg,
} from '@/simulation/images';

type MapPointApiRequest = NextApiRequest & {
  query: {
    mapPointUuid: string;
  };
};

const opening1: OpeningProps = {
  monday: '16.00-22.00',
  tuesday: 'geschlossen',
  wednesday: 'geschlossen',
  thursday: '16.00-22.00',
  friday: '12.00-24.00',
  saturday: '12.00-24.00',
  sunday: '12.00-22.00',
};

const opening2: OpeningProps = {
  monday: '1-467',
  tuesday: 'offen',
  wednesday: 'zu',
  thursday: 'auch offen',
  friday: '13.00',
  saturday: 'pipapo',
  sunday: '14.00-14.10',
};

const comments1: CommentProps[] = [
  {
    author: 'Gerhard',
    text: 'Das ist ein Kommentar',
  },
  {
    author: 'Sabine',
    text: 'Sabines Kommmentar, der sehr sehr lang ist. Ja Sabine hat wirklich sehr viel Text geschrieben, um hier den Rahmen zu sprengen.',
  },
  {
    author: 'Nummer 3',
    text: 'Sabines Kommmentar, der sehr sehr lang ist. Ja Sabine hat wirklich sehr viel Text geschrieben, um hier den Rahmen zu sprengen.',
  },
  {
    author: 'Nummer 4',
    text: 'Sabines Kommmentar, der sehr sehr lang ist. Ja Sabine hat wirklich sehr viel Text geschrieben, um hier den Rahmen zu sprengen.',
  },
];

const comments2: CommentProps[] = [
  {
    author: 'Autor 1',
    text: 'Das ist Kommentar 1',
  },
  {
    author: 'Autor 2',
    text: 'Das ist Kommentar 2',
  },
  {
    author: 'Autor 3',
    text: 'Das ist Kommentar 3',
  },
  {
    author: 'Autor 4',
    text: 'Das ist Kommentar 4',
  },
  {
    author: 'Autor 5',
    text: 'Das ist Kommentar 5',
  },
  {
    author: 'Autor 6',
    text: 'Das ist Kommentar 6',
  },
  {
    author: 'Autor 7',
    text: 'Das ist Kommentar 7',
  },
];

const mockMapPoints: MapPointProps[] = [
  {
    uuid: '1',
    name: 'Basketball Platz',
    desc: 'Hier steht eine wunderschöne und definitiv sehr aussagekräftige Beschreibung über einen Basketball Platz, wie man das so von den Usern gewohnt ist, lol.',
    address: 'Luxemburger Straße 100, 12345 Berlin',
    opening: opening1,
    rating: 4.2,
    comments: comments1,
    image: basketBallImg,
  },
  {
    uuid: '2',
    name: 'Volleyball Platz',
    desc: 'Hier steht eine BEschreibung zum Volleyball Platz.',
    address: 'Frankfurter Allee 144, 10365 Berlin',
    opening: opening2,
    rating: 1.6,
    comments: comments2,
    image: volleyBallImg,
  },
  {
    uuid: '1219',
    name: 'Bob MacQuarrie Skateboard Park (SK8 Extreme Park)',
    desc: 'Flat asphalt surface, 10 components, City run learn to skateboard programs, City run skateboard camps in summer.',
    address: 'Youville Drive 144, 14905 Berlin',
    opening: opening2,
    rating: 1.6,
    comments: comments2,
    image: skateparkImg,
  },
  {
    uuid: '1157',
    name: 'Walter Baker Basketball Park',
    desc: 'Concrete bowl, 7,000 sq ft.',
    address: '100 Charlie Rogers Place, Berlin',
    opening: opening2,
    rating: 2.5,
    comments: comments2,
    image: basketBallImg,
  },
  {
    uuid: '9157',
    name: 'Roving Baskteball Park Location',
    desc: 'Flat surface, 5 components',
    address: '2785 8th Line Road, Berlin',
    opening: opening2,
    rating: 3.5,
    comments: comments2,
    image: basketBallImg,
  },
  {
    uuid: '1160',
    name: 'Roving volleyball Location',
    desc: 'Flat surface, 9 components',
    address: '10 Warner Colpitts Lane, Berlin',
    opening: opening2,
    rating: 3.5,
    comments: comments2,
    image: volleyBallImg,
  },
  {
    uuid: '1693',
    name: 'Legacy volleball Park',
    desc: 'Large concrete bowl, many street and vertical components, 17,000 sq ft',
    address: '101 Centrepointe Drive',
    opening: opening2,
    rating: 4.5,
    comments: comments2,
    image: volleyBallImg,
  },
  {
    uuid: '1717',
    name: 'Greenboro Spa',
    desc: 'Flat asphalt surface, 5 components',
    address: '3142 Conroy Road, Berlin',
    opening: opening2,
    rating: 1,
    comments: comments2,
    image: spaImg,
  },
  {
    uuid: '137',
    name: 'Bridlewood Spa',
    desc: 'Flat asphalt surface, no components',
    address: '65 Stonehaven Drive, Berlin',
    opening: opening2,
    rating: 2,
    comments: comments2,
    image: spaImg,
  },
  {
    uuid: '1133',
    name: 'Roving Parkour Park Location',
    desc: 'Flat surface, infinity components',
    address: '100 Clifford Campbell Street',
    opening: opening2,
    rating: 3,
    comments: comments2,
    image: tennisImg,
  },
  {
    uuid: '657',
    name: 'Wolfsburg parkour  Park Location',
    desc: 'smooth surface, 25 components',
    address: '110 Malvern Drive, Berlin',
    opening: opening2,
    rating: 4,
    comments: comments2,
    image: spaImg,
  },
  {
    uuid: '653',
    name: 'Roving Skateboard Park Location',
    desc: 'Rough surface, 66 components',
    address: '5660 Osgoode Main Street, Berlin',
    opening: opening2,
    rating: 5,
    comments: comments2,
    image: skateparkImg,
  },
  {
    uuid: '812',
    name: 'Charlie Bowins Handball',
    desc: 'Flat concrete surface, 10 plus components (large half pipe), City run learn to skateboard programs, City run skateboard camps in summer',
    address: '435 Bronson Avenue, Berlin',
    opening: opening2,
    rating: 4.2,
    comments: comments2,
    image: volleyBallImg,
  },
  {
    uuid: '2457',
    name: 'Diamond Jubilee Skateboard Park',
    desc: 'Flat asphalt surface, City run skateboard camps in summer',
    address: '2810 Findlay Creek Drive',
    opening: opening2,
    rating: 3.2,
    comments: comments2,
    image: skateparkImg,
  },
  {
    uuid: '430',
    name: 'Blackburn Skateboard Park',
    desc: 'Flat asphalt surface, 5 components, City run skateboard camps in summer',
    address: '190 Glen Park Drive, Berlin',
    opening: opening2,
    rating: 3.2,
    comments: comments2,
    image: spaImg,
  },
  {
    uuid: '989',
    name: 'Goulbourn Spa',
    desc: '1000 surface, 60000 components',
    address: '1500 Shea Road, Berlin',
    opening: opening2,
    rating: 4.4,
    comments: comments2,
    image: spaImg,
  },
  {
    uuid: '330',
    name: 'Manotick Skateboard Park',
    desc: 'Flat asphalt surface, 8 components',
    address: '5572 Doctor Leach Drive, Berlin',
    opening: opening2,
    rating: 4.4,
    comments: comments2,
    image: skateparkImg,
  },
  {
    uuid: '693',
    name: 'Pankow Tennis Park Location',
    desc: 'Flat surface, 5555555555555 components',
    address: '1448 Meadow Drive, Berlin',
    opening: opening2,
    rating: 4.4,
    comments: comments2,
    image: tennisImg,
  },
  {
    uuid: '2544',
    name: 'Berrigan Tennis Park',
    desc: 'Flat concrete surface, 10 plus components',
    address: '51 Berrigan Drive, Berlin',
    opening: opening2,
    rating: 2.4,
    comments: comments2,
    image: tennisImg,
  },
  {
    uuid: '2599',
    name: 'EugÃne Martineau tennis Park',
    desc: '1 component',
    address: '710 Mikinak Road, Berlin',
    opening: opening2,
    rating: 3.5,
    comments: comments2,
    image: tennisImg,
  },
  {
    uuid: '2278',
    name: 'Vista Speedball Park',
    desc: 'Flat surface, 5 components, Flat surface, 5 components, Flat surface, 5 components',
    address: '720 Vistapark Drive, Berlin',
    opening: opening2,
    rating: 3.5,
    comments: comments2,
    image: volleyBallImg,
  },
];

export default function handler(
  _req: MapPointApiRequest,
  res: NextApiResponse
) {
  const mapPointObj = mockMapPoints.find(
    (elem) => elem.uuid === _req.query.uuid
  );

  try {
    setTimeout(async () => {
      return res.status(200).json(mapPointObj);
    }, 200);
  } catch (error) {
    setTimeout(async () => {
      return res.status(404).json(error);
    }, 404);
  }
}
