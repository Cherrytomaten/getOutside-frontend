import Image from 'next/image';
import { useUserAuth } from '@/hooks/useUserAuth';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import { PasswordInput } from '../PasswordInput';
import { AnimatePresence, motion } from 'framer-motion';

// TODO: sinnvolle Typdeklarationen
type ValidateProps = {
  validated: boolean;
  message: string;
};

function ProfilePage({ ...props }: any) {
  const authenticationHook = useUserAuth();
  const [changePw, setChangePw] = useState<boolean>(false);
  const [pwInputData, setPwInputData] = useState<string>('');
  const [pwInputErr, setPwInputErr] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');

  // const [showFn, setShowFn] = useState<boolean>(false);
  // const [fnData, setFnData] = useState<string>("");
  // const [fnErr, setFnErr] = useState<boolean>(false);
  // const [fnErrMessage, setFnErrMessage] = useState<string>("");

  function validatePassword(): ValidateProps {
    if (pwInputData === '' || pwInputData === undefined) {
      return { validated: false, message: 'Password must not be empty!' };
    } else {
      const regex = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
      );
      if (regex.test(pwInputData)) {
        return { validated: true, message: 'Validation success!' };
      }
      return { validated: false, message: 'Password not strong enough!' };
    }
  }

  function handleSubmit(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setErrMessage('');
    const { validated, message } = validatePassword();
    if (!validated) {
      setPwInputErr(true);
      setErrMessage(message);
      return;
    } else {
      // TODO: functionality to renew user password
      console.log('user password changed successfully.');
    }
  }

  // function handleFnSubmit(e: FormEvent<HTMLButtonElement>) {
  //   e.preventDefault();
  //   setFnErrMessage('');
  //   const { validated, message } = validate();
  //   if (!validated) {
  //     setPwInputErr(true);
  //     setErrMessage(message);
  //     return;
  //   } else {
  //     // TODO: functionality to renew user password
  //     console.log('user password changed successfully.');
  //   }
  // }

  return (
    <main
      id={props.user.userId}
      className="w-full h-full min-h-screen flex justify-center items-center mb-8 text-white"
    >
      <div
        id="profile-wrapper"
        className="w-full h-full min-h-screen flex flex-col justify-start items-center"
      >
        <section
          id="header-section"
          className="w-full flex flex-col justify-start items-center"
        >
          <h1 className="py-14 text-4xl">
            Welcome{' '}
            <span className="text-bright-seaweed">{props.user.username}</span>!
          </h1>
          <div className="flex flex-col justify-center items-center">
            <div
              id="img-container"
              className="relative flex-auto w-48 min-w-[10rem] max-w-[14rem] h-48 min-h-[10rem] max-h-[14rem]"
            >
              <Image
                src={props.user.pic}
                alt="Profilbild"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <button
              type="button"
              id="change-profile-pic-btn"
              title="Change Profile Picture"
              className="mq-hover:hover:bg-dark-seaweed px-2 py-1 mt-4 text-default-font border-solid border-2 rounded-lg border-dark-seaweed transition-all"
            >
              Change Picture
            </button>
          </div>
        </section>

        {/* SECTION 2 */}
        <section
          id="settings-section"
          className="w-full max-w-[430px] flex flex-col justify-center items-center mt-20 mb-12 bg-darker-sea"
        >
          {/* OPTIONS */}
          <div className="w-full h-14 flex flex-row justify-between items-center px-6 border-b-2 border-dark-sea">
            <p>Option 1</p>
            <input
              id="check-1"
              type="checkbox"
              name="check"
              className="peer hidden"
            />
            <label
              htmlFor="check-1"
              className="peer-checked:bg-bright-seaweed peer-checked:shadow-shadow-inset-thin-darker-sea peer-checked:before:translate-x-[24px] peer-checked:before:bg-default-font relative w-[3.3rem] h-7 block bg-lighter-sea rounded-2xl transition-all cursor-pointer before:absolute before:top-1 before:left-1 before:w-5 before:h-5 before:block before:bg-darker-sea before:rounded-full before:transition-all"
            ></label>
          </div>
          <div className="w-full h-14 flex flex-row justify-between items-center px-6 border-b-2 border-dark-sea">
            <p>Option 2</p>
            <input
              id="check-2"
              type="checkbox"
              name="check"
              className="peer hidden"
            />
            <label
              htmlFor="check-2"
              className="peer-checked:bg-bright-seaweed peer-checked:shadow-shadow-inset-thin-darker-sea peer-checked:before:translate-x-[24px] peer-checked:before:bg-default-font relative w-[3.3rem] h-7 block bg-lighter-sea rounded-2xl transition-all cursor-pointer before:absolute before:top-1 before:left-1 before:w-5 before:h-5 before:block before:bg-darker-sea before:rounded-full before:transition-all"
            ></label>
          </div>
          <div className="w-full h-14 flex flex-row justify-between items-center px-6 border-b-2 border-dark-sea">
            <p>Option 3</p>
            <input
              id="check-3"
              type="checkbox"
              name="check"
              className="peer hidden"
            />
            <label
              htmlFor="check-3"
              className="peer-checked:bg-bright-seaweed peer-checked:shadow-shadow-inset-thin-darker-sea peer-checked:before:translate-x-[24px] peer-checked:before:bg-default-font relative w-[3.3rem] h-7 block bg-lighter-sea rounded-2xl transition-all cursor-pointer before:absolute before:top-1 before:left-1 before:w-5 before:h-5 before:block before:bg-darker-sea before:rounded-full before:transition-all"
            ></label>
          </div>
          <div className="w-full h-14 flex flex-row justify-between items-center px-6 border-b-2 border-dark-sea">
            <p>Option 4</p>
            <input
              id="check-4"
              type="checkbox"
              name="check"
              className="peer hidden"
            />
            <label
              htmlFor="check-4"
              className="peer-checked:bg-bright-seaweed peer-checked:shadow-shadow-inset-thin-darker-sea peer-checked:before:translate-x-[24px] peer-checked:before:bg-default-font relative w-[3.3rem] h-7 block bg-lighter-sea rounded-2xl transition-all cursor-pointer before:absolute before:top-1 before:left-1 before:w-5 before:h-5 before:block before:bg-darker-sea before:rounded-full before:transition-all"
            ></label>
          </div>

          {/* CHANGE PASSWORD */}
          <div
            className={`w-full ${changePw ? 'h-28' : 'h-14'} ${
              pwInputErr && 'h-32'
            } pt-[9px] border-b-2 border-dark-sea transition-all`}
          >
            <div className="w-full flex flex-row justify-between items-center px-6">
              <p>Change Password</p>
              <button
                type="button"
                id="change-password-btn"
                title="Change Password"
                className="mq-hover:hover:bg-lighter-sea min-w-[80px] px-2 py-1 ml-4 text-default-font border-solid border-2 rounded-lg border-lighter-sea transition-all"
                onClick={() => {
                  setChangePw(!changePw);
                  setErrMessage('');
                  setPwInputErr(false);
                  setPwInputData('');
                }}
              >
                Change
              </button>
            </div>
            {changePw && (
              <>
                <div className="w-full flex flex-row justify-between items-start px-6 mt-3">
                  <div className="w-full flex flex-col justify-center items-start">
                    <label htmlFor="new-password"></label>
                    <PasswordInput
                      id="set-password"
                      placeholder="New Password..."
                      className={`${
                        pwInputErr
                          ? 'border-danger'
                          : 'border-bright-seaweed hover:border-hovered-seaweed'
                      } w-full py-1 text-default-font bg-transparent border-solid border-b-2 rounded-none  transition-all appearance-none`}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPwInputData(e.target.value)
                      }
                      onFocus={() => {
                        setPwInputErr(false);
                        setErrMessage('');
                      }}
                    />
                    <AnimatePresence>
                      {pwInputErr && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ ease: 'easeOut', duration: 0.2 }}
                        >
                          <p className="input-error-text mt-1 text-danger">
                            {errMessage}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="button"
                    id="send-pw-btn"
                    title="Submit"
                    onClick={(e) => handleSubmit(e)}
                    className="mq-hover:hover:text-dark-sea mq-hover:hover:bg-bright-seaweed min-w-[80px] px-2 py-1 ml-4 text-default-font border-solid border-2 rounded-lg border-bright-seaweed transition-all"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>

          {/* CHANGE FIRSTNAME */}
          {/* <div
            className={`w-full ${showFn ? 'h-28' : 'h-14'} ${
              fnErr && 'h-32'
            } pt-[9px] border-b-2 border-dark-sea transition-all`}
          >
            <div className="w-full flex flex-row justify-between items-center px-6">
              <p>Change Firstname</p>
              <button
                type="button"
                id="change-fn-btn"
                title="Change Firstname"
                className="mq-hover:hover:bg-lighter-sea min-w-[80px] px-2 py-1 ml-4 text-default-font border-solid border-2 rounded-lg border-lighter-sea transition-all"
                onClick={() => {
                  setShowFn(!showFn);
                  setFnData('');
                  setFnErr(false);
                  setFnErrMessage('');
                }}
              >
                Change
              </button>
            </div>
            {showFn && (
              <>
                <div className="w-full flex flex-row justify-between items-start px-6 mt-3">
                  <div className="w-full flex flex-col justify-center items-start">
                    <label htmlFor="new-firstname"></label>
                    <PasswordInput
                      id="set-firstname"
                      placeholder="New Firstname..."
                      className={`${
                        fnErr
                          ? 'border-danger'
                          : 'border-bright-seaweed hover:border-hovered-seaweed'
                      } w-full py-1 text-default-font bg-transparent border-solid border-b-2 rounded-none  transition-all appearance-none`}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFnData(e.target.value)
                      }
                      onFocus={() => {
                        setFnErr(false);
                        setFnErrMessage('');
                      }}
                    />
                    <AnimatePresence>
                      {fnErr && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ ease: 'easeOut', duration: 0.2 }}
                        >
                          <p className="input-error-text mt-1 text-danger">
                            {fnErrMessage}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="button"
                    id="send-fn-btn"
                    title="Submit"
                    onClick={(e) => handleSubmit(e)}
                    className="mq-hover:hover:text-dark-sea mq-hover:hover:bg-bright-seaweed min-w-[80px] px-2 py-1 ml-4 text-default-font border-solid border-2 rounded-lg border-bright-seaweed transition-all"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div> */}

          {/* LOGOUT */}
          <div className="w-full h-14 flex flex-row justify-between items-center px-6 border-b-2 border-dark-sea">
            <p>Logout</p>
            <Link href="/">
              <button
                type="button"
                id="logout-btn"
                title="Logout"
                onClick={() => authenticationHook.logout()}
                className="mq-hover:hover:bg-lighter-danger mq-hover:hover:border-lighter-danger min-w-[80px] px-2 py-1 text-default-font bg-danger border-solid border-2 rounded-lg border-danger transition-all"
              >
                Logout
              </button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export { ProfilePage };
