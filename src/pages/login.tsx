import { useAuth } from "@/context/AuthContext";
import Logo from "@/resources/svg/Logo";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PasswordInput } from "@/components/PasswordInput";

type LoginFormProps = {
    email: string,
    password: string
}

function Login() {
    const { fetchUserAuthState, sendToUserAuthMachine } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormProps>({ email: '', password: '' });
    const [formErrors, setFormErrors] = useState<LoginFormProps>({ email: '', password: '' });

    function validateForm(): boolean {
        let validator: boolean = true;
        let data = formData;

        if (formData.email === '') {
            data = {...data, email: 'Bitte Email angeben'};
            validator = false;
        } else {
            data = {...data, email: ''};
        }

        if (formData.password === '') {
            data = {...data, password: 'Bitte Passwort ausfüllen'};
            validator = false;
        } else {
            data = {...data, password: ''};
        }

        setFormErrors(data);
        return validator;
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (validateForm()) {
            sendToUserAuthMachine({ type: 'FETCH_AUTH_USER', payload: { email: formData.email, password: formData.password } });
        }
    }

    useEffect(() => {
        if (fetchUserAuthState.context.user !== null && fetchUserAuthState.matches('success')) {
            router.push('/');
        }
    }, [fetchUserAuthState, fetchUserAuthState.context, router]);

    // password manager can autofill password & email fields.
    useEffect(() => {
        if (document) {
            const preFilledPassword = (document.getElementById('login-password') as HTMLInputElement)?.value;
            if (preFilledPassword !== '') { setFormData(f => ({...f, password: preFilledPassword})) }

            const preFilledEmail = (document.getElementById('login-mail') as HTMLInputElement)?.value;
            if (preFilledEmail !== '') { setFormData(f => ({...f, email: preFilledEmail})) }
        }
    }, []);

    return (
        <div>
            <div className="w-full h-64 flex justify-center">
                <Logo width="auto" height="100%" />
            </div>
            <form className="px-5 py-10" onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <p>max@mail.de</p>
                    <label htmlFor="login-mail" className="mr-3">Email</label>
                    <input type="email"
                           className={`${formErrors.email !== '' ? 'border-2 border-red-600' : ''}`}
                           onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
                           onClick={() => setFormErrors({...formErrors, email: ''})}
                           placeholder="Email"
                           id="login-mail" />
                    { formErrors.email !== '' && <p className="text-red-600">{formErrors.email}</p> }
                </div>
                <div>
                    <p>password123#</p>
                    <label htmlFor="login-password" className="mr-3">Passwort</label>
                </div>
                <PasswordInput className={`${formErrors.password !== '' ? 'border-2 border-red-600' : ''}`}
                               onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value})}
                               onClick={() => setFormErrors({...formErrors, password: ''})}
                               placeholder="Passwort"
                               id="login-password"
                />
                { formErrors.password !== '' && <p className="text-red-600">{formErrors.password}</p> }
                <div className="mt-10">
                    <input type="submit"
                           value="Login"
                           className="w-full p-2 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer hover:bg-hovered-seaweed"
                    />
                </div>
                { fetchUserAuthState.matches("pending") &&
                    <p className="text-3xl text-white">Loading..</p>
                }
                { (!fetchUserAuthState.matches("pending") && fetchUserAuthState.context.err !== null) &&
                    <p>{fetchUserAuthState.context.err.errors.message}</p>
                }
            </form>
        </div>
    );
}

export default Login;
