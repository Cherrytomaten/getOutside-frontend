import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { sanititzeUrlParams } from '@/util/sanititzeUrlParams';
import { ResetPasswordAuthProps } from '@/types/User/ResetPasswordAuthProps';
import { useRouter } from 'next/router';
import { UserRepoClass } from '@/repos/UserRepo';
import LogoNew from '@/resources/svg/Logo_new';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useMachine } from '@xstate/react';
import { logger } from '@/util/logger';
import { FetchServerErrorResponse } from '@/types/Server/FetchServerErrorResponse';
import { createGenericStateMachine } from '@/machines/genericMachine';
import { ResetPasswordProps } from '@/types/User/ResetPasswordProps';
import { PasswordInput } from '@/components/PasswordInput';
import Link from 'next/link';

type ResetPassword = {
  password: string;
  confirmationPassword: string;
};

type ResetPasswordStateMachineData = {
  message: string;
};

const initStateMachine = createGenericStateMachine<ResetPasswordStateMachineData, ResetPasswordProps>();

function ResetPassword() {
  const router = useRouter();
  const [headerParams, setHeaderParams] = useState<ResetPasswordAuthProps | null>(null);
  const [newPasswords, setNewPasswords] = useState<ResetPassword>({ password: '', confirmationPassword: '' });
  const [formErrors, setFormErrors] = useState<ResetPassword>({ password: '', confirmationPassword: '' });
  const [machineState, sendToMachine] = useMachine(initStateMachine, {
    actions: {
      pendingFunction: (ctx, event: { type: 'RUN_REQUEST'; payload: ResetPasswordProps }) => {
        UserRepoClass.resetPassword({
          user_id: event.payload.user_id,
          user_mail: event.payload.user_mail,
          confirmation_token: event.payload.confirmation_token,
          password: event.payload.password,
          password2: event.payload.password2,
        })
          .then((_res) => {
            logger.log('Reset password request succeeded');
            sendToMachine({ type: 'RESOLVE', data: { message: 'request succeeded' }, err: null });
          })
          .catch((err: FetchServerErrorResponse) => {
            logger.log('Reset password request failed');
            sendToMachine({ type: 'REJECT', data: null, err: err });
          });
      },
    },
  });

  useEffect(() => {
    const params: ResetPasswordAuthProps | null = sanititzeUrlParams(router.asPath) as ResetPasswordAuthProps;
    if (params === null || !params.user_id || !params.user_mail || !params.confirmation_token) {
      router.push('/');
    } else {
      setHeaderParams(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validateForm(): boolean {
    let valid = true;
    let data = formErrors;

    if (newPasswords.password.length === 0) {
      valid = false;
      data = { ...data, password: "Password can't be empty" };
    }

    if (newPasswords.confirmationPassword.length === 0) {
      valid = false;
      data = { ...data, confirmationPassword: "Confirm password can't be empty" };
    }

    if (newPasswords.confirmationPassword !== '' && newPasswords.password !== newPasswords.confirmationPassword) {
      valid = false;
      data = { ...data, confirmationPassword: "Passwords don't match" };
    }

    if (newPasswords.password !== '' && !/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(newPasswords.password)) {
      valid = false;
      data = {
        ...data,
        password: 'The choosen password is too weak!\n It should contain atleast one big letter, one number and the length should be at minimum of 8 characters.',
      };
    }
    setFormErrors(data);
    return valid;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateForm() && headerParams !== null) {
      sendToMachine({
        type: 'RUN_REQUEST',
        payload: {
          user_id: headerParams.user_id,
          user_mail: headerParams.user_mail,
          confirmation_token: headerParams.confirmation_token,
          password: newPasswords.password,
          password2: newPasswords.confirmationPassword,
        },
      });
    }
  }

  if (machineState.matches('success')) {
    return (
      <main className="w-full h-full min-h-screen flex flex-col justify-start items-center overflow-x-hidden">
        <div className="w-full h-auto max-h-64 flex justify-center my-14">
          <LogoNew width="220px" height="100%" />
        </div>
        <h2 className="px-3 pb-10 text-2xl text-center text-white xs:text-3xl">Your password was reseted successfully!</h2>
        <Link href="/login">
          <button type="button" id="already-signedup-btn" className="w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer hover:bg-hovered-seaweed">
            Login
          </button>
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full h-full min-h-screen flex flex-col justify-start items-center overflow-x-hidden">
      <div className="w-full h-auto max-h-64 flex justify-center my-14">
        <LogoNew width="220px" height="100%" />
      </div>
      <form className="flex-auto w-4/5 max-w-md flex flex-col justify-start items-center px-5 pb-10" onSubmit={(e) => handleSubmit(e)}>
        <div className={`w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}>
          <PasswordInput
            className={`${
              formErrors.password !== '' ? 'border-danger' : 'border-bright-seaweed hover:border-hovered-seaweed'
            } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewPasswords({
                ...newPasswords,
                password: e.target.value,
              })
            }
            placeholder="Password"
            onClick={() => setFormErrors({ ...formErrors, password: '' })}
            onFocus={() => setFormErrors({ ...formErrors, password: '' })}
            id="rp-password-input"
          />
          <AnimatePresence>
            {formErrors.password !== '' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }}>
                <p className="input-error-text mt-1 text-danger">{formErrors.password}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="w-full h-7"></div>
          <PasswordInput
            className={`${
              formErrors.confirmationPassword !== '' ? 'border-danger' : 'border-bright-seaweed hover:border-hovered-seaweed'
            } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
            aria-label="new password"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewPasswords({
                ...newPasswords,
                confirmationPassword: e.target.value,
              })
            }
            placeholder="Confirm password"
            onClick={() => setFormErrors({ ...formErrors, confirmationPassword: '' })}
            onFocus={() => setFormErrors({ ...formErrors, confirmationPassword: '' })}
            id="rp-confirm-password-input"
          />
          <AnimatePresence>
            {formErrors.confirmationPassword !== '' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }}>
                <p className="input-error-text mt-1 text-danger">{formErrors.confirmationPassword}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="w-full min-w-[220px] max-w-xs flex flex-col justify-center items-center mt-10">
          <input
            type="submit"
            aria-label="confirm new password"
            value="Reset password"
            disabled={false}
            id="reset-password-submit"
            className="mq-hover:hover:bg-hovered-seaweed w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer disabled:bg-darker-sea disabled:cursor-default disabled:hover:bg-darker-sea"
          />
        </div>
        <AnimatePresence>
          {machineState.matches('failure') && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }}>
              <p className="input-error-text text-danger">{machineState.context.err.errors.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {machineState.matches('pending') && <LoadingSpinner />}
      </form>
    </main>
  );
}

export default ResetPassword;
