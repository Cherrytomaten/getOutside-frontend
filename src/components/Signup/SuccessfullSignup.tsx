import LogoNew from '@/resources/svg/Logo_new';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RegisterRepoClass } from '@/repos/RegisterRepo';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';
import { AnimatePresence, motion } from 'framer-motion';

type SuccessfullSignupProps = {
  username: string;
  email: string;
};

function SuccessfullSignup({ username, email }: SuccessfullSignupProps) {
  const [timer, setTimer] = useState<number>(0);
  const [serverErr, setServerErr] = useState<string | null>(null);

  function sendVerificationEmail(_email: string) {
    if (timer !== 0) {
      return;
    }

    setServerErr(null);
    setTimer(9);
    RegisterRepoClass.sendConfirmationEmail(_email)
      .then((_res) => {
        return;
      })
      .catch((err: FetchServerErrorResponse) => {
        setServerErr(err.errors.message);
      });
  }

  useEffect(() => {
    sendVerificationEmail(email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (timer !== 0) {
        setTimer(timer - 1);
      }
    }, 1000);
  }, [timer]);

  return (
    <main id="successfull-signup-container" className="w-full h-screen flex flex-col justify-start items-center overflow-x-hidden">
      <div className="w-full h-2/5 max-h-64 flex justify-center my-[6vh]">
        <LogoNew width="auto" height="100%" />
      </div>
      <h2 className="px-3 pb-3 text-2xl text-center text-white xs:text-3xl">
        Welcome <span className="text-bright-seaweed">{username}</span>!
      </h2>
      <h3 className="px-3 pb-10 text-2xl text-center text-white xs:text-3xl">You&apos;ve been signed up successfully</h3>
      <p className="px-3 pb-10 text-lg text-center text-white">
        We&apos;ve sent you a verification link to your email
        <br />
        <span className="text-bright-seaweed">{email}</span>
      </p>
      <Link href="/login">
        <button type="button" id="already-signedup-btn" className="w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer hover:bg-hovered-seaweed">
          Login
        </button>
      </Link>
      <button
        disabled={timer !== 0}
        onClick={() => sendVerificationEmail(email)}
        className="relative w-full max-w-xs p-2 mb-4 text-bright-seaweed border rounded-md border-bright-seaweed transition-colors cursor-pointer disabled:text-lighter-sea disabled:border-lighter-sea disabled:cursor-default">
        Got no email? Resend verification {timer !== 0 && <span className="ml-1">({timer})</span>}
      </button>
      <AnimatePresence>
        {serverErr !== null && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }}>
            <p className="input-error-text mt-1 text-danger">{serverErr}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export { SuccessfullSignup };
