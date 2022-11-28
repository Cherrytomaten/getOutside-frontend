import { LoadingSpinner } from '@/components/LoadingSpinner';
import Link from 'next/link';

function Home() {
  return (
    <main className="w-full h-screen flex justify-center items-center bg-dark-sea">
      <Link href="/mappoint/1">
        <a>Ab zu MapPoint1!</a>
      </Link>
      <Link href="/mappoint/2">
        <a>Ab zu MapPoint2!</a>
      </Link>
      {/* <LoadingSpinner /> */}
    </main>
  );
}

export default Home;
