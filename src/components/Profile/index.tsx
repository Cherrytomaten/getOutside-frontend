import Image from 'next/image';
import { useUserAuth } from '@/hooks/useUserAuth';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { PasswordInput } from '../PasswordInput';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { convertBase64 } from '@/util/convertToBase64';
import { Logger } from '@/util/logger';

type ValidateProps = {
  validated: boolean;
  message: string;
};

type ProfileProps = {
  username: string;
  fname: string;
  lname: string;
  email: string;
  pic: string | null;
};

function ProfilePage({ ...props }: ProfileProps) {
  // Logout
  const authenticationHook = useUserAuth();
  // Change Password
  // const [changePw, setChangePw] = useState<boolean>(false);
  // const [pwInputData, setPwInputData] = useState<string>('');
  // const [pwInputErr, setPwInputErr] = useState<boolean>(false);
  // const [errMessage, setErrMessage] = useState<string>('');
  // const [pwInputSuccess, setPwInputSuccess] = useState<boolean>(false);
  // const [successMessage, setSuccessMessage] = useState<string>('');
  const [changePw, setChangePw] = useState<{
    visible: boolean;
    data: string;
    message: string;
    err: string;
  }>({ visible: false, data: '', message: '', err: '' });
  // Change Firstname
  const [changeFname, setChangeFname] = useState<{
    visible: boolean;
    data: string;
    message: string;
    err: string;
  }>({ visible: false, data: '', message: '', err: '' });
  // Change Picture
  const [profilePic, setProfilePic] = useState<any>(null);
  const [pPicMessage, setPPicMessage] = useState<{
    message: string;
    err: boolean;
  }>({ message: '', err: false });
  const placeholderImage: string = 'assets/ProfilePictureDefault.png';
  // props
  const [localProps, setLocalProps] = useState<{
    username: string;
    fname: string;
    lname: string;
    email: string;
    pic: string | null;
  }>({
    username: props.username,
    fname: props.fname,
    lname: props.lname,
    email: props.email,
    pic: props.pic,
  });

  function validatePassword(): ValidateProps {
    if (changePw.data === '' || changePw.data === undefined) {
      return { validated: false, message: 'Password must not be empty!' };
    } else {
      const regex = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
      );
      if (regex.test(changePw.data)) {
        return { validated: true, message: 'Validation success!' };
      }
      return { validated: false, message: 'Password not strong enough!' };
    }
  }

  function handleSubmit(e: FormEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setChangePw({ ...changePw, err: '' });
    const { validated, message } = validatePassword();
    if (!validated) {
      setChangePw({ ...changePw, message: '', err: message });
      return;
    } else {
      // TODO: functionality to renew user password
      (document.getElementById('set-password') as HTMLInputElement).value = '';
      setChangePw({ ...changePw, data: '', message: message, err: '' });
      Logger.log('user password changed successfully.');
    }
  }

  async function handleFnameSubmit(
    e: FormEvent<HTMLButtonElement>
  ): Promise<void> {
    setChangeFname({ ...changeFname, message: '', err: '' });
    if (
      changeFname.data === '' ||
      changeFname.data === null ||
      changeFname.data === undefined
    ) {
      setChangeFname({
        ...changeFname,
        data: '',
        message: '',
        err: 'Firstname must not be empty!',
      });
    } else {
      return await axios
        .put('/api/user/update-data', {
          username: localProps.username,
          email: localProps.email,
          first_name: changeFname.data,
          last_name: '',
        })
        .then((res: any) => {
          (document.getElementById('set-fname') as HTMLInputElement).value = '';
          setLocalProps({ ...localProps, fname: changeFname.data });
          setChangeFname({
            ...changeFname,
            data: '',
            message: 'Firstname changed successfully!',
            err: '',
          });
          Logger.log('Success');
        })
        .catch((err: any) => {
          setChangeFname({
            ...changeFname,
            data: '',
            message: '',
            err: 'Internal Server error occured.',
          });

          Logger.log('Error');
        });
    }
  }

  function handleInputChange(e: any) {
    if (
      e === undefined ||
      e.target.files === undefined ||
      e.target.files[0] === undefined
    ) {
      return;
    }

    if (e.target.files[0].size > 1097152) {
      Logger.log('file too big');
      setProfilePic('SizeError');
      setPPicMessage({ message: 'File is too big!', err: true });
      return;
    }

    Logger.log(e.target.files);

    if (e.target.files.length > 1) {
      Logger.log('You can only upload one Picture!');
      setPPicMessage({
        message: 'You can only upload one Picture!',
        err: true,
      });
      return;
    }

    setProfilePic(e.target.files[0]);
    setPPicMessage({ message: 'Picture saved in clipboard.', err: false });
  }

  async function uploadProfilePic() {
    const base64Pic: string | ArrayBuffer | null = await convertBase64(
      profilePic
    );

    Logger.log('base64: ', base64Pic);

    return await axios
      .post('/api/user/pfp/set', {
        picture: base64Pic,
      })
      .then((res: any) => {
        setProfilePic(null);
        setPPicMessage({ message: '', err: false });
        Logger.log('Success');
        // return Promise.resolve(res.data);
      })
      .catch((err: any) => {
        setProfilePic(null);
        setPPicMessage({ message: '', err: false });
        Logger.log('Error');
        // return Promise.reject(err.response.data);
      });
  }

  return (
    <main
      id={localProps.username + localProps.email}
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
            <span className="text-bright-seaweed">{localProps.username}</span>!
          </h1>
          <div className="relative flex flex-col justify-center items-center">
            <div
              id="img-container"
              className="relative flex-auto w-48 min-w-[10rem] max-w-[14rem] h-48 min-h-[10rem] max-h-[14rem]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  localProps.pic === null
                    ? placeholderImage
                    : 'https://cherrytomaten.herokuapp.com' + localProps.pic
                }
                alt="Profilbild"
                className="rounded-full"
              />
            </div>
            <div
              id="btns-container"
              className="flex flex-row justify-center items-center transition-all"
            >
              <input
                type="file"
                id="upload-profile-pic-btn"
                name="profile-pic-upload"
                title="Upload Profile Picture"
                className="hidden"
                accept="image/*"
                onChange={handleInputChange}
              />
              <label
                htmlFor="upload-profile-pic-btn"
                className="mq-hover:hover:bg-dark-seaweed px-2 py-1 mt-4 text-default-font border-solid border-2 rounded-lg border-dark-seaweed transition-all cursor-pointer"
              >
                Upload Picture
              </label>
              {profilePic !== null && !pPicMessage.err && (
                <>
                  <div className="w-5 h-full"></div>
                  <button
                    type="submit"
                    id="submit-profile-pic-btn"
                    title="Submit Profile Picture"
                    className="mq-hover:hover:text-dark-sea mq-hover:hover:bg-bright-seaweed px-2 py-1 mt-4 text-default-font border-solid border-2 rounded-lg border-bright-seaweed transition-all"
                    onClick={uploadProfilePic}
                  >
                    Submit Picture
                  </button>
                </>
              )}
            </div>
            {profilePic !== null && (
              <div className="absolute top-full max-w-[264px] pt-2 text-center">
                <p
                  className={`${
                    pPicMessage.err ? 'text-danger' : 'text-bright-seaweed'
                  }`}
                >
                  {pPicMessage.message}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2 */}
        <section
          id="settings-section"
          className="w-full max-w-[430px] flex flex-col justify-center items-center mt-16 mb-12 bg-darker-sea"
        >
          {/* OPTIONS */}
          <div className="w-full h-14 flex flex-row justify-between items-center px-6 border-b-2 border-dark-sea">
            <p>Firstname</p>
            <p>{localProps.fname === '' ? 'Anonymus' : localProps.fname}</p>
          </div>
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
            className={`w-full ${changePw.visible ? 'h-28' : 'h-14'} ${
              (changePw.err !== '' || changePw.message !== '') && 'h-32'
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
                  setChangePw({
                    visible: !changePw.visible,
                    data: '',
                    message: '',
                    err: '',
                  });
                }}
              >
                Change
              </button>
            </div>

            {changePw.visible && (
              <>
                <div className="w-full flex flex-row justify-between items-start px-6 mt-3">
                  <div className="w-full flex flex-col justify-center items-start">
                    <label htmlFor="set-password"></label>
                    <PasswordInput
                      id="set-password"
                      placeholder="New Password..."
                      className={`${
                        changePw.err !== ''
                          ? 'border-danger'
                          : 'border-bright-seaweed hover:border-hovered-seaweed'
                      } w-full py-1 text-default-font bg-transparent border-solid border-b-2 rounded-none  transition-all appearance-none`}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setChangePw({ ...changePw, data: e.target.value })
                      }
                      onFocus={() => {
                        setChangePw({ ...changePw, message: '', err: '' });
                      }}
                    />
                    <AnimatePresence>
                      {changePw.err !== '' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ ease: 'easeOut', duration: 0.2 }}
                        >
                          <p className="input-error-text mt-1 text-danger">
                            {changePw.err}
                          </p>
                        </motion.div>
                      )}
                      {changePw.message !== '' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ ease: 'easeOut', duration: 0.2 }}
                        >
                          <p className="input-success-text mt-1 text-bright-seaweed">
                            {changePw.message}
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
          <div
            className={`w-full ${changeFname.visible ? 'h-28' : 'h-14'} ${
              (changeFname.err !== '' || changeFname.message !== '') && 'h-32'
            } pt-[9px] border-b-2 border-dark-sea transition-all`}
          >
            <div className="w-full flex flex-row justify-between items-center px-6">
              <p>Change Firstname</p>
              <button
                type="button"
                id="change-fname-btn"
                title="Change Firstname"
                className="mq-hover:hover:bg-lighter-sea min-w-[80px] px-2 py-1 ml-4 text-default-font border-solid border-2 rounded-lg border-lighter-sea transition-all"
                onClick={() => {
                  setChangeFname({
                    visible: !changeFname.visible,
                    data: '',
                    message: '',
                    err: '',
                  });
                }}
              >
                Change
              </button>
            </div>

            {changeFname.visible && (
              <>
                <div className="w-full flex flex-row justify-between items-start px-6 mt-3">
                  <div className="w-full flex flex-col justify-center items-start">
                    <label htmlFor="set-fname"></label>
                    <input
                      id="set-fname"
                      type="text"
                      placeholder="New Firstname..."
                      className={`${
                        changeFname.err !== ''
                          ? 'border-danger'
                          : 'border-bright-seaweed hover:border-hovered-seaweed'
                      } w-full py-1 text-default-font bg-transparent border-solid border-b-2 rounded-none  transition-all appearance-none`}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setChangeFname({
                          ...changeFname,
                          data: e.target.value,
                        })
                      }
                      onFocus={() => {
                        setChangeFname({
                          ...changeFname,
                          message: '',
                          err: '',
                        });
                      }}
                    />
                    <AnimatePresence>
                      {changeFname.err !== '' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ ease: 'easeOut', duration: 0.2 }}
                        >
                          <p className="input-error-text mt-1 text-danger">
                            {changeFname.err}
                          </p>
                        </motion.div>
                      )}
                      {changeFname.message !== '' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ ease: 'easeOut', duration: 0.2 }}
                        >
                          <p className="input-success-text mt-1 text-bright-seaweed">
                            {changeFname.message}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="button"
                    id="send-fname-btn"
                    title="Submit"
                    onClick={(e) => handleFnameSubmit(e)}
                    className="mq-hover:hover:text-dark-sea mq-hover:hover:bg-bright-seaweed min-w-[80px] px-2 py-1 ml-4 text-default-font border-solid border-2 rounded-lg border-bright-seaweed transition-all"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>

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
