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
          <a className="block text-2xl text-center text-bright-seaweed underline underline-offset-3 cursor-pointer hover:text-hovered-seaweed">Homepage</a>
        </Link>
        <Link href="/login">
          <a className="block mt-4 text-2xl text-center text-bright-seaweed underline underline-offset-3 cursor-pointer hover:text-hovered-seaweed">Login</a>
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
