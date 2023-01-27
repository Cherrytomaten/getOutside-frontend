import { ValidateProps } from '@/types/Auth/ValidateProps';
import { ProfileProps } from '@/types/Profile/ProfileProps';
import { logger } from '@/util/logger';
import { validatePassword } from '@/util/passwordValidator';
import axios, { AxiosResponse } from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from 'react';
import { PasswordInput } from '../PasswordInput';

type EditProfileProps = EditPersonalProps & {
  setLocalProps: Dispatch<SetStateAction<ProfileProps>>;
  localProps: ProfileProps;
};

type EditPersonalProps = {
  fname: string;
  lname: string;
  username: string;
  email: string;
};

type EditPersonalErrProps = {
  fnameErr: string;
  lnameErr: string;
  usernameErr: string;
  emailErr: string;
};

type EditPwProps = {
  cPassword: string; // current password
  nPassword: string; // new password
  n2Password: string; // new password repeat
};

type EditPwErrProps = {
  cPasswordErr: string;
  nPasswordErr: string;
  n2PasswordErr: string;
};

type SubmitMessage = {
  success: string;
  err: string;
};

function EditProfile(profileProps: EditProfileProps) {
  const [profileInfoData, setProfileInfoData] = useState<EditPersonalProps>({
    fname: profileProps.fname,
    lname: profileProps.lname,
    username: profileProps.username,
    email: profileProps.email,
  });
  const [profileInfoErr, setProfileInfoErr] = useState<EditPersonalErrProps>({
    fnameErr: '',
    lnameErr: '',
    usernameErr: '',
    emailErr: '',
  });
  const [passwordData, setPasswordData] = useState<EditPwProps>({
    cPassword: '',
    nPassword: '',
    n2Password: '',
  });
  const [passwordErr, setPasswordErr] = useState<EditPwErrProps>({
    cPasswordErr: '',
    nPasswordErr: '',
    n2PasswordErr: '',
  });
  const [submitPDMsg, setSubmitPDMsg] = useState<SubmitMessage>({
    success: '',
    err: '',
  });
  const [submitPWMsg, setSubmitPWMsg] = useState<SubmitMessage>({
    success: '',
    err: '',
  });
  const emailRegex = new RegExp('[^@s]+@[^@s]+.[^@s]+');

  // ######
  // validation methods
  // ######
  function isUndefined(input: string): boolean {
    return input === undefined;
  }

  function isEmpty(input: string): boolean {
    return input === '';
  }

  function matchesPattern(input: string, regex: RegExp): boolean {
    return regex.test(input);
  }

  function isSame(input1: string, input2: string): boolean {
    return input1 === input2;
  }

  // ######
  // handle Input
  // ######
  function validateDataInput(id: string): void {
    setSubmitPDMsg({
      success: '',
      err: '',
    });

    switch (id) {
      case 'edit-fname':
        if (isUndefined(profileInfoData.fname)) {
          setProfileInfoErr({
            ...profileInfoErr,
            fnameErr: 'Something about your firstname is not right.',
          });
        } else {
          setProfileInfoErr({ ...profileInfoErr, fnameErr: '' });
        }
        break;

      case 'edit-lname':
        if (isUndefined(profileInfoData.lname)) {
          setProfileInfoErr({
            ...profileInfoErr,
            lnameErr: 'Something about your lastname is not right.',
          });
        } else {
          setProfileInfoErr({ ...profileInfoErr, lnameErr: '' });
        }
        break;

      case 'edit-username':
        if (isUndefined(profileInfoData.username)) {
          setProfileInfoErr({
            ...profileInfoErr,
            usernameErr: 'Something about your username is not right.',
          });
        } else if (isEmpty(profileInfoData.username)) {
          setProfileInfoErr({
            ...profileInfoErr,
            usernameErr: 'Your username must not be empty!',
          });
        } else {
          setProfileInfoErr({ ...profileInfoErr, usernameErr: '' });
        }
        break;

      case 'edit-email':
        if (isUndefined(profileInfoData.email)) {
          setProfileInfoErr({
            ...profileInfoErr,
            emailErr: 'Something about your email is not right.',
          });
        } else if (isEmpty(profileInfoData.email)) {
          setProfileInfoErr({
            ...profileInfoErr,
            emailErr: 'Your email must not be empty!',
          });
        } else if (!matchesPattern(profileInfoData.email, emailRegex)) {
          setProfileInfoErr({
            ...profileInfoErr,
            emailErr: 'Please use a valid email address!',
          });
        } else {
          setProfileInfoErr({ ...profileInfoErr, emailErr: '' });
        }
        break;

      default:
        console.log(
          'Validating not possible. ID for requested input-field not found!'
        );
        setSubmitPDMsg({
          success: '',
          err: 'Validating not possible. ID for requested input-field not found!',
        });
    }
  }

  function validatePasswordInput(id: string): void {
    setSubmitPWMsg({
      success: '',
      err: '',
    });

    switch (id) {
      case 'edit-current-password':
        if (isUndefined(passwordData.cPassword)) {
          setPasswordErr({
            ...passwordErr,
            cPasswordErr: 'Something is not right about your password.',
          });
        } else {
          setPasswordErr({ ...passwordErr, cPasswordErr: '' });
        }
        break;

      case 'edit-new-password':
        if (isUndefined(passwordData.nPassword)) {
          setPasswordErr({
            ...passwordErr,
            nPasswordErr: 'Something is not right about your new password.',
          });
        } else if (!isEmpty(passwordData.nPassword)) {
          const { validated, message }: ValidateProps = validatePassword(
            passwordData.nPassword
          );

          if (!validated) {
            setPasswordErr({ ...passwordErr, nPasswordErr: message });
            break;
          } else {
            setPasswordErr({ ...passwordErr, nPasswordErr: '' });
          }

          if (isEmpty(passwordData.cPassword)) {
            setPasswordErr({
              ...passwordErr,
              cPasswordErr: 'Your current password must not be empty!',
            });
          } else {
            setPasswordErr({ ...passwordErr, cPasswordErr: '' });
          }
        } else {
          setPasswordErr({ ...passwordErr, nPasswordErr: '' });
        }
        break;

      case 'edit-repeat-new-password':
        if (isUndefined(passwordData.n2Password)) {
          setPasswordErr({
            ...passwordErr,
            n2PasswordErr:
              'Something is not right about your repeated password.',
          });
        } else if (
          // ignore errors when both previous fields are empty
          isEmpty(passwordData.nPassword) &&
          isEmpty(passwordData.cPassword)
        ) {
          setPasswordErr({
            ...passwordErr,
            n2PasswordErr: '',
          });
          break;
        } else if (!isSame(passwordData.nPassword, passwordData.n2Password)) {
          setPasswordErr({
            ...passwordErr,
            n2PasswordErr: 'Repeated password does not match with new one.',
          });
        } else {
          setPasswordErr({ ...passwordErr, n2PasswordErr: '' });
        }
        break;

      default:
        console.log(
          'Validating not possible. ID for requested input-field not found!'
        );
        setSubmitPWMsg({
          success: '',
          err: 'Validating not possible. ID for requested input-field not found!',
        });
    }
  }

  // ######
  // handle Submit
  // ######
  async function handlePersonalDataSubmit(
    e: FormEvent<HTMLButtonElement>
  ): Promise<void> {
    e.preventDefault();

    if (
      isEmpty(profileInfoErr.fnameErr) &&
      isEmpty(profileInfoErr.lnameErr) &&
      isEmpty(profileInfoErr.usernameErr) &&
      isEmpty(profileInfoErr.emailErr)
    ) {
      return await axios
        .put('/api/user/update-personal-data', {
          first_name: profileInfoData.fname,
          last_name: profileInfoData.lname,
          username: profileInfoData.username,
          email: profileInfoData.email,
        })
        .then((res: AxiosResponse) => {
          if (res.status === 200) {
            profileProps.setLocalProps({
              ...profileProps.localProps,
              username: res.data.username,
              fname: res.data.first_name,
              lname: res.data.last_name,
              email: res.data.email,
            });
            setSubmitPDMsg({
              success: 'Profile updated successfully.',
              err: '',
            });
          }
        })
        .catch((err: any) => {
          logger.log(
            'Submitting Error occured:',
            err.response.data.errors.message
          );
          setSubmitPDMsg({
            success: '',
            err: 'An error occured: ' + err.response.data.errors.message,
          });
        });
    } else {
      setSubmitPDMsg({
        success: '',
        err: 'Due to errors in form, it could not be submitted. Please check our inputs.',
      });
    }
  }

  async function handlePasswordSubmit(
    e: FormEvent<HTMLButtonElement>
  ): Promise<void> {
    e.preventDefault();

    // Error handling at submit
    if (
      !isEmpty(passwordErr.cPasswordErr) ||
      !isEmpty(passwordErr.nPasswordErr) ||
      !isEmpty(passwordErr.n2PasswordErr)
    ) {
      setSubmitPWMsg({
        success: '',
        err: 'Please check the error messages and then try again.',
      });
    } else if (
      isEmpty(passwordData.cPassword) ||
      isEmpty(passwordData.nPassword) ||
      isEmpty(passwordData.n2Password)
    ) {
      setSubmitPWMsg({
        success: '',
        err: 'Please make sure that all input fields are filled in.',
      });
    } else if (!isSame(passwordData.nPassword, passwordData.n2Password)) {
      setSubmitPWMsg({
        success: '',
        err: 'Please make sure that the repeated password corresponds to the new one.',
      });
    } else {
      return await axios
        .put('/api/user/update-password', {
          password: passwordData.cPassword,
          new_password: passwordData.nPassword,
          new_password2: passwordData.n2Password,
        })
        .then((res: any) => {
          if (res.status === 200) {
            setSubmitPWMsg({
              success: 'Password updated successfully.',
              err: '',
            });
          }
        })
        .catch((err: any) => {
          logger.log(
            'Submitting Error occured:',
            err.response.data.errors.message
          );
          setSubmitPWMsg({
            success: '',
            err: 'An error occured: ' + err.response.data.errors.message,
          });
        });
    }
  }

  // ######
  // return TSX
  // ######
  return (
    <div className="hide-scrollbar w-full h-full flex flex-col justify-start items-center pt-20 overflow-y-scroll">
      <form
        id="edit_profile_form"
        className="w-full flex flex-col items-center"
      >
        <section className="w-full flex flex-col items-center">
          <h2 className="mb-4 text-2xl text-bright-seaweed">
            Change Personal Data
          </h2>
          <div
            className={`${
              profileInfoErr.fnameErr !== '' ? 'mb-3' : ''
            } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
          >
            <label htmlFor="edit-fname" className="text-default-font/75">
              Firstname
            </label>
            <input
              type="text"
              id="edit-fname"
              className={`${
                profileInfoErr.fnameErr !== ''
                  ? 'border-danger'
                  : 'border-bright-seaweed hover:border-hovered-seaweed'
              } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
              defaultValue={profileInfoData.fname}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setProfileInfoData({
                  ...profileInfoData,
                  fname: e.target.value,
                });
              }}
              onFocus={() => {
                setProfileInfoErr({ ...profileInfoErr, fnameErr: '' });
                setSubmitPDMsg({ success: '', err: '' });
              }}
              onBlur={(e: any) => {
                validateDataInput(e.target.id);
              }}
            />
            <AnimatePresence>
              {profileInfoErr.fnameErr !== '' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                >
                  <p className="input-error-text mt-1 text-danger">
                    {profileInfoErr.fnameErr}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div
            className={`${
              profileInfoErr.lnameErr !== '' ? 'mb-3' : ''
            } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
          >
            <label htmlFor="edit-lname" className="text-default-font/75">
              Lastname
            </label>
            <input
              type="text"
              id="edit-lname"
              className={`${
                profileInfoErr.lnameErr !== ''
                  ? 'border-danger'
                  : 'border-bright-seaweed hover:border-hovered-seaweed'
              } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
              defaultValue={profileInfoData.lname}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setProfileInfoData({
                  ...profileInfoData,
                  lname: e.target.value,
                });
              }}
              onFocus={() => {
                setProfileInfoErr({ ...profileInfoErr, lnameErr: '' });
                setSubmitPDMsg({ success: '', err: '' });
              }}
              onBlur={(e: any) => {
                validateDataInput(e.target.id);
              }}
            />
            <AnimatePresence>
              {profileInfoErr.lnameErr !== '' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                >
                  <p className="input-error-text mt-1 text-danger">
                    {profileInfoErr.lnameErr}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div
            className={`${
              profileInfoErr.usernameErr !== '' ? 'mb-3' : ''
            } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
          >
            <label htmlFor="edit-username" className="text-default-font/75">
              Username
            </label>
            <input
              type="text"
              id="edit-username"
              className={`${
                profileInfoErr.usernameErr !== ''
                  ? 'border-danger'
                  : 'border-bright-seaweed hover:border-hovered-seaweed'
              } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
              defaultValue={profileInfoData.username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setProfileInfoData({
                  ...profileInfoData,
                  username: e.target.value,
                });
              }}
              onFocus={() => {
                setProfileInfoErr({ ...profileInfoErr, usernameErr: '' });
                setSubmitPDMsg({ success: '', err: '' });
              }}
              onBlur={(e: any) => {
                validateDataInput(e.target.id);
              }}
            />
            <AnimatePresence>
              {profileInfoErr.usernameErr !== '' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                >
                  <p className="input-error-text mt-1 text-danger">
                    {profileInfoErr.usernameErr}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div
            className={`${
              profileInfoErr.emailErr !== '' ? 'mb-3' : ''
            } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
          >
            <label htmlFor="edit-email" className="text-default-font/75">
              Email
            </label>
            <input
              type="email"
              id="edit-email"
              className={`${
                profileInfoErr.emailErr !== ''
                  ? 'border-danger'
                  : 'border-bright-seaweed hover:border-hovered-seaweed'
              } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
              defaultValue={profileInfoData.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setProfileInfoData({
                  ...profileInfoData,
                  email: e.target.value,
                });
              }}
              onFocus={() => {
                setProfileInfoErr({ ...profileInfoErr, emailErr: '' });
                setSubmitPDMsg({ success: '', err: '' });
              }}
              onBlur={(e: any) => {
                validateDataInput(e.target.id);
              }}
            />
            <AnimatePresence>
              {profileInfoErr.emailErr !== '' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                >
                  <p className="input-error-text mt-1 text-danger">
                    {profileInfoErr.emailErr}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="w-full min-w-[220px] max-w-xs flex flex-col justify-center items-center mt-5 mb-10">
            <button
              type="button"
              id="change_data_submit"
              onClick={(e) => handlePersonalDataSubmit(e)}
              className="mq-hover:hover:bg-hovered-seaweed w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer"
            >
              Change Personal Information
            </button>
            <div className="text-center">
              {submitPDMsg.err !== '' && (
                <p className="submit-error-text mt-1 text-danger">
                  {submitPDMsg.err}
                </p>
              )}
              {submitPDMsg.success !== '' && (
                <p className="submit-success-text mt-1 text-bright-seaweed">
                  {submitPDMsg.success}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ###### */}
        {/* Change password section */}
        {/* ###### */}
        <section className="w-full flex flex-col items-center">
          <h2 className="mb-4 text-2xl text-bright-seaweed">Change Password</h2>
          <div
            className={`${
              passwordErr.cPasswordErr !== '' ? 'mb-3' : ''
            } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
          >
            <label
              htmlFor="edit-current-password"
              className="text-default-font/75"
            >
              Current Password
            </label>
            <PasswordInput
              id="edit-current-password"
              className={`${
                passwordErr.cPasswordErr !== ''
                  ? 'border-danger'
                  : 'border-bright-seaweed hover:border-hovered-seaweed'
              } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
              defaultValue={passwordData.cPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPasswordData({
                  ...passwordData,
                  cPassword: e.target.value,
                });
              }}
              onFocus={() => {
                setPasswordErr({ ...passwordErr, cPasswordErr: '' });
                setSubmitPWMsg({ success: '', err: '' });
              }}
              onBlur={(e: any) => {
                validatePasswordInput(e.target.id);
              }}
            />
            <AnimatePresence>
              {passwordErr.cPasswordErr !== '' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                >
                  <p className="input-error-text mt-1 text-danger">
                    {passwordErr.cPasswordErr}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div
            className={`${
              passwordErr.nPasswordErr !== '' ? 'mb-3' : ''
            } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
          >
            <label htmlFor="edit-new-password" className="text-default-font/75">
              New Password
            </label>
            <PasswordInput
              id="edit-new-password"
              className={`${
                passwordErr.nPasswordErr !== ''
                  ? 'border-danger'
                  : 'border-bright-seaweed hover:border-hovered-seaweed'
              } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
              defaultValue={passwordData.nPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPasswordData({
                  ...passwordData,
                  nPassword: e.target.value,
                });
              }}
              onFocus={() => {
                setPasswordErr({ ...passwordErr, nPasswordErr: '' });
                setSubmitPWMsg({ success: '', err: '' });
              }}
              onBlur={(e: any) => {
                validatePasswordInput(e.target.id);
              }}
            />
            <AnimatePresence>
              {passwordErr.nPasswordErr !== '' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                >
                  <p className="input-error-text mt-1 text-danger">
                    {passwordErr.nPasswordErr}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div
            className={`${
              passwordErr.n2PasswordErr !== '' ? 'mb-3' : ''
            } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
          >
            <label
              htmlFor="edit-repeat-new-password"
              className="text-default-font/75"
            >
              Confirm New Password
            </label>
            <PasswordInput
              id="edit-repeat-new-password"
              className={`${
                passwordErr.n2PasswordErr !== ''
                  ? 'border-danger'
                  : 'border-bright-seaweed hover:border-hovered-seaweed'
              } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
              defaultValue={passwordData.n2Password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPasswordData({
                  ...passwordData,
                  n2Password: e.target.value,
                });
              }}
              onFocus={() => {
                setPasswordErr({ ...passwordErr, n2PasswordErr: '' });
                setSubmitPWMsg({ success: '', err: '' });
              }}
              onBlur={(e: any) => {
                validatePasswordInput(e.target.id);
              }}
            />
            <AnimatePresence>
              {passwordErr.n2PasswordErr !== '' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                >
                  <p className="input-error-text mt-1 text-danger">
                    {passwordErr.n2PasswordErr}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full min-w-[220px] max-w-xs flex flex-col justify-center items-center mt-5 mb-10">
            <button
              type="button"
              id="change_pw_submit"
              onClick={(e) => handlePasswordSubmit(e)}
              className="mq-hover:hover:bg-hovered-seaweed w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer"
            >
              Change Password
            </button>
            <div className="text-center">
              {submitPWMsg.err !== '' && (
                <p className="submit-error-text mt-1 text-danger">
                  {submitPWMsg.err}
                </p>
              )}
              {submitPWMsg.success !== '' && (
                <p className="submit-success-text mt-1 text-bright-seaweed">
                  {submitPWMsg.success}
                </p>
              )}
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}

export { EditProfile };
