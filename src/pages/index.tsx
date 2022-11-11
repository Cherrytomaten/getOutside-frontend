import { Pins } from '@/components/Pins';

const comments = [
  {
    author: 'Gerhard',
    text: 'Das ist ein Kommentar',
  },
  {
    author: 'Sabine',
    text: 'Sabines Kommmentar',
  },
];

function Home() {
  return (
    <main className="w-full h-screen flex justify-center items-center bg-dark-sea">
      <Pins
        uuid={'akjbd-223321--'}
        name={'Basketball Platz'}
        desc={'Beschreibung'}
        rating={4.9}
        comments={comments}
      />
    </main>
  );
}

export default Home;
