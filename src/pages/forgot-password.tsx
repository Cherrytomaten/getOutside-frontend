import LogoNew from '@/resources/svg/Logo_new';
import { FormEvent, useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { createGenericStateMachine } from '@/machines/genericMachine';
import { useMachine } from '@xstate/react';
import Link from 'next/link';
import { logger } from '@/util/logger';
import { UserRepoClass } from '@/repos/UserRepo';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';
import { AnimatePresence, motion } from 'framer-motion';

type ForgotPasswordPayload = {
  email: string;
};

type ForgotPasswordStateMachineData = {
  message: string;
};

const initStateMachine = createGenericStateMachine<ForgotPasswordStateMachineData, ForgotPasswordPayload>();

function ForgotPassword() {
  const [inputData, setInputData] = useState<string>('');
  const [machineState, sendToMachine] = useMachine(initStateMachine, {
    actions: {
      pendingFunction: (ctx, event: { type: 'RUN_REQUEST'; payload: ForgotPasswordPayload }) => {
        UserRepoClass.forgotPassword(event.payload.email)
          .then((_res) => {
            logger.log('Forgot password request succeeded');
            sendToMachine({ type: 'RESOLVE', data: { message: 'request succeeded' }, err: null });
          })
          .catch((err: FetchServerErrorResponse) => {
            logger.log('Forgot password request failed');
            sendToMachine({ type: 'REJECT', data: null, err: err });
          });
      },
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendToMachine({ type: 'RUN_REQUEST', payload: { email: inputData } });
  }

  // reset input field after refresh
  useEffect(() => {
    const emailInput: HTMLInputElement | null = document.getElementById('rp-mail-input') as HTMLInputElement;
    if (emailInput !== null) {
      emailInput.value = inputData;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(inputData);
    const submitBtn: HTMLInputElement | null = document.getElementById('reset-password-submit') as HTMLInputElement;
    if (submitBtn !== null) {
      submitBtn.disabled = inputData.length === 0;
    }
  }, [inputData]);

  // Obscure possible error from server, where user tried to use an email that has no matching account
  // adjust condition to status code later on, to show possible other server errors.
  if (machineState.matches('success')) {
    return (
      <main className="w-full h-full min-h-screen flex flex-col justify-start items-center overflow-x-hidden">
        <div className="w-full h-auto max-h-64 flex justify-center my-14">
          <LogoNew width="220px" height="auto" />
        </div>
        <h3 className="px-4 mb-6 text-xl text-center text-white">We&apos;ve sent you an email to reset your password.</h3>
        <Link href="/login">
          <button type="button" className="w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer hover:bg-hovered-seaweed">
            Log in
          </button>
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full h-full min-h-screen flex flex-col justify-start items-center overflow-x-hidden">
      <div className="w-full h-auto max-h-64 flex justify-center my-14">
        <LogoNew width="220px" height="auto" />
      </div>
      <form className="flex-auto w-4/5 max-w-md flex flex-col justify-start items-center px-5 pb-10" onSubmit={(e) => handleSubmit(e)}>
        <div className={`w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}>
          <label htmlFor="rp-mail-input" className="invisible w-0 h-0">
            Please enter your email address. We will send you an email to reset your password.
          </label>
          <input
            type="email"
            className={`border-bright-seaweed hover:border-hovered-seaweed bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
            onChange={(e) => setInputData(e.target.value)}
            value={inputData}
            placeholder="Email"
            id="rp-mail-input"
          />
        </div>
        <div className="w-full min-w-[220px] max-w-xs flex flex-col justify-center items-center mt-10">
          <input
            type="submit"
            value="Reset password"
            disabled={false}
            id="reset-password-submit"
            className="mq-hover:hover:bg-hovered-seaweed w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer disabled:bg-darker-sea disabled:cursor-default disabled:hover:bg-darker-sea"
          />
          <Link href="/">
            <a className="font-light text-bright-seaweed transition-colors xs:hover:text-hovered-seaweed">Back home</a>
          </Link>
        </div>
        <AnimatePresence>
          {machineState.matches('failure') && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }}>
              <p className="input-error-text mt-3 text-danger">{machineState.context.err.errors.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {machineState.matches('pending') && <LoadingSpinner />}
      </form>
    </main>
  );
}

export default ForgotPassword;
