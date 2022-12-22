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
    <div className="z-[99998] fixed bottom-0 w-screen h-20 flex justify-center items-center bg-dark-sea">
      <nav className="w-full max-w-lg h-full bg-dark-sea">
        <ul className="w-full h-full flex justify-between items-center px-6">
          <Link href="/favorites">
            <li
              onMouseEnter={() => setHoverHeart(true)}
              onMouseLeave={() => setHoverHeart(false)}
              className="cursor-pointer"
            >
              {hoverHeart ? (
                <HeartSvgHovered width="40px" height="40px" />
              ) : (
                <HeartSvg width="40px" height="40px" />
              )}
            </li>
          </Link>
          <Link href="/home">
            <li className="mq-hover:hover:bg-hovered-seaweed p-2 bg-bright-seaweed rounded-full cursor-pointer">
              <HomeSvg width="40px" height="40px" />
            </li>
          </Link>
          <Link href="/profile">
            <li
              onMouseEnter={() => setHoverProfile(true)}
              onMouseLeave={() => setHoverProfile(false)}
              className="cursor-pointer"
            >
              {hoverProfile ? (
                <ProfileSvgHovered width="40px" height="40px" />
              ) : (
                <ProfileSvg width="40px" height="40px" />
              )}
            </li>
          </Link>
        </ul>
      </nav>
    </div>
  );
}

export { Navbar };
