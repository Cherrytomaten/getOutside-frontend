import { useAuth } from '@/context/AuthContext';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PasswordInput } from '@/components/PasswordInput';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import LogoNew from '@/resources/svg/Logo_new';
import Link from 'next/link';

type LoginFormProps = {
  email: string;
  password: string;
};

function Login() {
  const { fetchUserAuthState, sendToUserAuthMachine } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormProps>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<LoginFormProps>({
    email: '',
    password: '',
  });

  function validateForm(): boolean {
    let validator: boolean = true;
    let data = formData;

    if (formData.email === '') {
      data = { ...data, email: 'Bitte Email angeben' };
      validator = false;
    } else {
      data = { ...data, email: '' };
    }

    if (formData.password === '') {
      data = { ...data, password: 'Bitte Passwort ausfüllen' };
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
        payload: { email: formData.email, password: formData.password },
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

  // password manager can autofill password & email fields.
  useEffect(() => {
    if (document) {
      const preFilledPassword = (
        document.getElementById('login-password') as HTMLInputElement
      )?.value;
      if (preFilledPassword !== '') {
        setFormData((f) => ({ ...f, password: preFilledPassword }));
      }

      const preFilledEmail = (
        document.getElementById('login-mail') as HTMLInputElement
      )?.value;
      if (preFilledEmail !== '') {
        setFormData((f) => ({ ...f, email: preFilledEmail }));
      }
    }
  }, []);

  return (
    <main className="w-full h-screen flex flex-col justify-start items-center overflow-x-hidden">
      <div className="w-full h-2/5 max-h-64 flex justify-center my-[6vh]">
        <LogoNew width="auto" height="100%" />
      </div>
      <form
        className="flex-auto w-4/5 max-w-md flex flex-col justify-center items-center px-5 py-10"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="w-full max-w-xs min-w-[220px] py-4 flex justify-center items-center">
          <label htmlFor="login-mail" className="mr-3 text-default-font">
            Email
          </label>
          <input
            type="email"
            className={`${
              formErrors.email !== '' ? 'border-2 border-red-600' : ''
            } bg-dark-sea text-default-font border-b-2 border-solid w-full`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
            onClick={() => setFormErrors({ ...formErrors, email: '' })}
            placeholder="Email"
            id="login-mail"
            defaultValue="max@mail.de"
          />
          {formErrors.email !== '' && (
            <p className="input-error-text text-red-600">{formErrors.email}</p>
          )}
        </div>
        <div className="w-full max-w-xs min-w-[220px] py-4 flex justify-center items-center">
          <label
            htmlFor="login-password"
            className="mr-3 text-default-font flex-auto"
          >
            Passwort
          </label>

          <PasswordInput
            className={`${
              formErrors.password !== '' ? 'border-2 border-red-600' : ''
            } bg-dark-sea text-default-font `}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: e.target.value })
            }
            onClick={() => setFormErrors({ ...formErrors, password: '' })}
            placeholder="Passwort"
            id="login-password"
            defaultValue="password123#"
          />
          {formErrors.password !== '' && (
            <p className="input-error-text text-red-600">
              {formErrors.password}
            </p>
          )}
        </div>
        <div className="w-full max-w-xs min-w-[220px] flex flex-col justify-center items-center mt-10">
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
        </div>
        {fetchUserAuthState.matches('pending') && <LoadingSpinner />}
        {!fetchUserAuthState.matches('pending') &&
          fetchUserAuthState.context.err !== null && (
            <p className="server-fetch-error-text">
              {fetchUserAuthState.context.err.errors.message}
            </p>
          )}
      </form>
    </main>
  );
}

export default Login;
