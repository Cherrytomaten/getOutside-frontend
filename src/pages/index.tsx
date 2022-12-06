import LogoNew from "@/resources/svg/Logo_new";
import { Pin } from "@/resources/svg/Pin";
import { motion } from "framer-motion";
import Link from "next/link";

function Home() {
  return (
    <main className="to-dark-sea-hover w-full h-full min-h-screen flex flex-col justify-start items-center overflow-x-hidden bg-gradient-to-b from-dark-seaweed lg:flex-row lg:justify-center">
      <div className="relative max-w-full pt-6 -ml-24 lg:flex-1 lg:max-w-[410px] lg:ml:0">
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'easeOut', duration: .3, opacity: { duration: .15 } }}
            className="w-full h-60 flex justify-center mb-2 -ml-2 drop-shadow-lg">
          <LogoNew width="100%" height="auto" />
        </motion.div>
        <div className="z-10 relative w-full h-60 flex flex-col justify-center items-center -mt-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: 'easeOut', duration: .3, delay: .2, opacity: { duration: .15 } }}
              className="w-auto h-full ml-56 drop-shadow-lg" src="assets/skate-stock.png" alt="Skater in skatepark" />
          <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: 'easeOut', duration: .25, delay: .7, opacity: { duration: .1 } }}
              className="absolute -top-20 -right-4 drop-shadow-lg xs:right-2">
            <Pin width="45" height="auto" />
          </motion.div>
          <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: 'easeOut', duration: .25, delay: .8, opacity: { duration: .1 } }}
              className="absolute right-24 bottom-4 drop-shadow-lg xs:right-32">
            <Pin width="45" height="auto" />
          </motion.div>
        </div>
        <div className="z-20 w-full h-60 flex flex-col justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: 'easeOut', duration: .3, delay: .45, opacity: { duration: .15 } }}
              className="w-auto h-full -mt-28 mr-5 drop-shadow-lg" src="assets/boulder-stock.png" alt="Person climbing a wall" />
        </div>
        </div>
      <div className="flex flex-col justify-center items-center lg:flex-1 lg:max-w-md lg:items-start lg:ml-32">
        <div className="px-2 -mt-6 text-center lg:mt-0">
          <motion.h2
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: 'easeOut', duration: .3, delay: 1.1, opacity: { duration: .15 } }}
              className="mb-5 text-5xl text-white xs:text-6xl">GetOutside</motion.h2>
          <motion.h3
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: 'easeOut', duration: .3, delay: 1.25, opacity: { duration: .15 } }}
              className="text-2xl font-light text-bright-seaweed xs:text-3xl">The app for outside<br/>adventures!</motion.h3>
        </div>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: 'easeOut', duration: .4, delay: 1.4 }}
            className="w-full max-w-xs px-4 pb-24 mt-10">
          <Link href="/signup">
            <button
                type="button"
                className="w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer hover:bg-hovered-seaweed"
            >Sign up</button>
          </Link>
          <Link href="/login">
            <button
                type="button"
                className="w-full max-w-xs p-2 text-default-font border-solid border rounded-md border-bright-seaweed transition-all cursor-pointer hover:border-hovered-seaweed hover:ring-1 hover:ring-inset hover:ring-bright-seaweed"
            >Log in
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default Home;
