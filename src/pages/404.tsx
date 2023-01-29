import LogoNew from '@/resources/svg/Logo_new';
import Link from 'next/link';

function NotFoundPage() {
  return (
    <main className="w-full h-screen flex flex-col justify-center items-center overflow-x-hidden">
      <div className="w-full h-16 max-h-64 flex justify-center mb-2 -ml-2">
        <LogoNew width="auto" height="100%" />
      </div>
      <div className="text-center">
        <p className="mb-5 text-lg font-thin text-center text-orange-sun">404</p>
        <h2 className="px-3 pb-3 text-3xl text-center text-bright-seaweed xs:text-5xl">Sorry!</h2>
        <h2 className="px-3 mb-10 text-2xl text-center text-white xs:text-3xl">We couldn&apos;t find the page you were looking for.</h2>
        <Link href="/">
          <a className="w-full max-w-xs p-2 px-8 mt-4 mb-2 text-xl text-dark-sea bg-bright-seaweed rounded-md transition-all cursor-pointer hover:bg-hovered-seaweed">Homepage</a>
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
