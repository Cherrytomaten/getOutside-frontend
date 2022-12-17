import HeartSvg from '@/resources/svg/Heart';
import HeartSvgHovered from '@/resources/svg/HeartHovered';
import HomeSvg from '@/resources/svg/Home';
import ProfileSvg from '@/resources/svg/Profile';
import ProfileSvgHovered from '@/resources/svg/ProfileHovered';
import Link from 'next/link';
import { useState } from 'react';

function Navbar() {
  const [hoverHeart, setHoverHeart] = useState<boolean>(false);
  const [hoverProfile, setHoverProfile] = useState<boolean>(false);

  return (
    <nav className="z-[100] fixed bottom-0 w-full max-w-lg h-20 mx-[50%] translate-x-[-50%] bg-dark-sea">
      <ul className="w-full h-full flex justify-between items-center px-6">
        <Link href="/favorites">
          <li
            onMouseEnter={() => setHoverHeart(true)}
            onMouseLeave={() => setHoverHeart(false)}
            className="cursor-pointer"
          >
            {hoverHeart ? (
              <HeartSvgHovered width="40" height="40" />
            ) : (
              <HeartSvg width="40" height="40" />
            )}
          </li>
        </Link>
        <Link href="/home">
          <li className="mq-hover:hover:bg-hovered-seaweed p-2 bg-bright-seaweed rounded-full cursor-pointer">
            <HomeSvg width="40" height="40" />
          </li>
        </Link>
        <Link href="/profile">
          <li
            onMouseEnter={() => setHoverProfile(true)}
            onMouseLeave={() => setHoverProfile(false)}
            className="cursor-pointer"
          >
            {hoverProfile ? (
              <ProfileSvgHovered width="40" height="40" />
            ) : (
              <ProfileSvg width="40" height="40" />
            )}
          </li>
        </Link>
      </ul>
    </nav>
  );
}

export { Navbar };
