import { useAuth } from '@/context/AuthContext';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PasswordInput } from '@/components/PasswordInput';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import LogoNew from '@/resources/svg/Logo_new';
import Link from 'next/link';

type LoginFormProps = {
  username: string;
  password: string;
};

function Login() {
  const { fetchUserAuthState, sendToUserAuthMachine } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormProps>({
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<LoginFormProps>({
    username: '',
    password: '',
  });

  function validateForm(): boolean {
    let validator: boolean = true;
    let data = formData;

    if (formData.username === '') {
      data = { ...data, username: 'Please enter username' };
      validator = false;
    } else {
      data = { ...data, username: '' };
    }

    if (formData.password === '') {
      data = { ...data, password: 'Please enter password' };
      validator = false;
    } else {
      data = { ...data, password: '' };
    }

    setFormErrors(data);
    return validator;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateForm()) {
      sendToUserAuthMachine({
        type: 'FETCH_AUTH_USER',
        payload: { username: formData.username, password: formData.password },
      });
    }
  }

  useEffect(() => {
    if (
      fetchUserAuthState.context.user !== null &&
      fetchUserAuthState.matches('success')
    ) {
      router.push('/');
    }
  }, [fetchUserAuthState, fetchUserAuthState.context, router]);

  // password manager can autofill password & username fields.
  useEffect(() => {
    if (document) {
      const preFilledPassword = (
        document.getElementById('login-password') as HTMLInputElement
      )?.value;
      if (preFilledPassword !== '') {
        setFormData((f) => ({ ...f, password: preFilledPassword }));
      }

      const preFilledUsername = (
        document.getElementById('login-username') as HTMLInputElement
      )?.value;
      if (preFilledUsername !== '') {
        setFormData((f) => ({ ...f, username: preFilledUsername }));
      }
    }
  }, []);

  return (
    <main className="w-full h-screen flex flex-col justify-start items-center overflow-x-hidden">
      <div className="w-full h-2/5 max-h-64 flex justify-center my-[6vh]">
        <LogoNew width="auto" height="100%" />
      </div>
      <form
        className="flex-auto w-4/5 max-w-md flex flex-col justify-start items-center px-5 pb-10"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div
          className={`${
            formErrors.username !== '' ? 'mb-3' : ''
          } w-full max-w-xs min-w-[220px] py-3 flex justify-start items-center flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
        >
          <label htmlFor="login-username" className="invisible w-0 h-0">
            Username
          </label>
          <input
            type="text"
            className={`${
              formErrors.username !== ''
                ? 'border-red-600'
                : 'border-bright-seaweed hover:border-hovered-seaweed'
            } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, username: e.target.value })
            }
            onClick={() => setFormErrors({ ...formErrors, username: '' })}
            placeholder="Username"
            id="login-username"
          />
          {formErrors.username !== '' && (
            <p className="input-error-text absolute bottom-[-15px] left-0 text-red-600">
              {formErrors.username}
            </p>
          )}
        </div>
        <div
          className={`${
            formErrors.username !== '' ? 'mb-3' : ''
          } w-full max-w-xs min-w-[220px] py-3 flex justify-start items-center flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
        >
          <label htmlFor="login-password" className="invisible w-0 h-0">
            Passwort
          </label>
          <PasswordInput
            className={`${
              formErrors.password !== ''
                ? 'border-red-600'
                : 'border-bright-seaweed hover:border-hovered-seaweed'
            } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: e.target.value })
            }
            onClick={() => setFormErrors({ ...formErrors, password: '' })}
            placeholder="Password"
            id="login-password"
          />
          {formErrors.password !== '' && (
            <p className="input-error-text absolute bottom-[-15px] left-0 text-red-600">
              {formErrors.password}
            </p>
          )}
        </div>
        <div className="w-full min-w-[220px] max-w-xs flex flex-col justify-center items-center mt-10">
          <input
            type="submit"
            value="Login"
            id="login-btn-submit"
            className="w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer hover:bg-hovered-seaweed"
          />
          <Link href="/">
            <button
              type="button"
              id="signup-btn"
              className="w-full max-w-xs p-2 text-default-font border-solid border rounded-md border-bright-seaweed transition-all cursor-pointer hover:border-hovered-seaweed hover:ring-1 hover:ring-inset hover:ring-bright-seaweed"
            >
              SignUp
            </button>
          </Link>
          {!fetchUserAuthState.matches('pending') &&
            fetchUserAuthState.context.err !== null &&
            formErrors.username === '' &&
            formErrors.password === '' && (
              <p className="server-fetch-error-text mt-4 text-center text-red-600">
                {fetchUserAuthState.context.err.errors.message}
              </p>
            )}
        </div>
        {fetchUserAuthState.matches('pending') && <LoadingSpinner />}
      </form>
    </main>
  );
}

export default Login;
