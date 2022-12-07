import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import LogoNew from "@/resources/svg/Logo_new";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Link from "next/link";
import { PasswordInput } from "@/components/PasswordInput";
import { AnimatePresence, motion } from "framer-motion";
import { useAlreadyAuthRedirect } from "@/hooks/useAlreadyAuthRedirect";
import { useRegisterMachineManager } from "@/hooks/useRegisterMachineManager";
import { SuccessfullSignup } from "@/components/Signup/SuccessfullSignup";

type SignUpFormProps = {
    username: string,
    fname: string,
    lname: string,
    email: string,
    password: string,
    cpassword: string
}

function Signup() {
    const { fetchUserAuthState } = useAuth();
    const isAlreadyAuthenticated = useAlreadyAuthRedirect(fetchUserAuthState);
    const { registerUserState, sendToRegisterMachine } = useRegisterMachineManager();
    const [formData, setFormData] = useState<SignUpFormProps>({ username: '', fname: '', lname: '', email: '', password: '', cpassword: '' });
    const [formErrors, setFormErrors] = useState<SignUpFormProps>({ username: '', fname: '', lname: '', email: '', password: '', cpassword: '' });

    // Reset form on page load
    useEffect(() => {
        if (document) {
            (document.getElementById('signup-form-container') as HTMLFormElement)?.reset();
        }
    }, []);

    function validateForm(): boolean {
        let validator: boolean = true;
        let data = formData;

        if (formData.username === '') {
            data = {...data, username: 'Please enter a username'};
        } else {
            data = {...data, username: ''};
        }

        if (formData.fname === '') {
            data = {...data, fname: 'Please enter your first name'};
            validator = false;
        } else {
            data = {...data, fname: ''};
        }

        if (formData.lname === '') {
            data = {...data, lname: 'Please enter your last name'};
            validator = false;
        } else {
            data = {...data, lname: ''};
        }

        if (formData.email === '') {
            data = {...data, email: 'Please enter your email'};
            validator = false;
        } else {
            data = {...data, email: ''};
        }

        if (formData.password === '') {
            data = {...data, password: 'Please enter a password'};
            validator = false;
        }
        // one uppercase, one digit, three lowercase, length of atleast 8
        else if (!/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(formData.password)) {
            data = {...data, password: 'The choosen password is too weak!\n It should contain atleast one big letter, one number and the length should be at minimum of 8 characters.'};
            validator = false;
        } else {
            data = {...data, password: ''};
        }

        if (formData.cpassword === '') {
            data = {...data, cpassword: 'Please repeat your password'};
            validator = false;
        }
        else if (formData.cpassword !== formData.password) {
            data = {...data, cpassword: 'The passwords don\'t match'};
            validator = false;
        } else {
            data = {...data, cpassword: ''};
        }

        setFormErrors(data);
        return validator;
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (validateForm()) {
            if (registerUserState.matches('failure')) {
                sendToRegisterMachine({ type: 'RETRY_REGISTER', payload: { username: formData.username, email: formData.email, fname: formData.fname, lname: formData.lname, password: formData.password } });
                return;
            }
            sendToRegisterMachine({ type: 'ATTEMPT_REGISTER', payload: { username: formData.username, email: formData.email, fname: formData.fname, lname: formData.lname, password: formData.password } });
        }
    }

    // hide form if already authenticated
    if (isAlreadyAuthenticated === null || isAlreadyAuthenticated) {
        return (
          <LoadingSpinner />
        );
    }

    // successfull sign up page render
    if (registerUserState.matches('success') && registerUserState.context.user?.username !== null) {
        return (<SuccessfullSignup username={registerUserState.context.user?.username} />);
    }

    return (
        <main className="w-full h-full min-h-screen flex flex-col justify-start items-center overflow-x-hidden">
            <div className="w-full h-auto max-h-64 flex justify-center my-14">
                <LogoNew width="220px" height="auto" />
            </div>
            <form
                id="signup-form-container"
                className="flex-auto w-4/5 max-w-md flex flex-col justify-start items-center px-5 pb-10"
                onSubmit={(e) => handleSubmit(e)}>

                <div
                    className={`${
                        formErrors.username !== '' ? 'mb-3' : ''
                    } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
                >
                    <label htmlFor="signup-username" className="invisible w-0 h-0">
                        Username
                    </label>
                    <input
                        type="text"
                        className={`${
                            formErrors.username !== ''
                                ? 'border-red-600'
                                : 'border-bright-seaweed hover:border-hovered-seaweed'
                        } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, username: e.target.value })
                        }
                        onClick={() => setFormErrors({ ...formErrors, username: '' })}
                        placeholder="Username"
                        id="signup-username"
                    />
                    <AnimatePresence>
                        {formErrors.username !== '' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ ease: 'easeOut', duration: .2 }}>
                                <p
                                    className="input-error-text mt-1 text-red-600">
                                    {formErrors.username}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div
                    className={`${
                        formErrors.fname !== '' ? 'mb-3' : ''
                    } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
                >
                    <label htmlFor="signup-fname" className="invisible w-0 h-0">
                        First name
                    </label>
                    <input
                        type="text"
                        className={`${
                            formErrors.fname !== ''
                                ? 'border-red-600'
                                : 'border-bright-seaweed hover:border-hovered-seaweed'
                        } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, fname: e.target.value })
                        }
                        onClick={() => setFormErrors({ ...formErrors, fname: '' })}
                        onFocus={() => setFormErrors({ ...formErrors, fname: '' })}
                        placeholder="First name"
                        id="signup-fname"
                    />
                    <AnimatePresence>
                        {formErrors.fname !== '' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ ease: 'easeOut', duration: .2 }}>
                                <p
                                    className="input-error-text mt-1 text-red-600">
                                    {formErrors.fname}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div
                    className={`${
                        formErrors.lname !== '' ? 'mb-3' : ''
                    } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
                >
                    <label htmlFor="signup-lname" className="invisible w-0 h-0">
                        Last name
                    </label>
                    <input
                        type="text"
                        className={`${
                            formErrors.lname !== ''
                                ? 'border-red-600'
                                : 'border-bright-seaweed hover:border-hovered-seaweed'
                        } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, lname: e.target.value })
                        }
                        onClick={() => setFormErrors({ ...formErrors, lname: '' })}
                        onFocus={() => setFormErrors({ ...formErrors, lname: '' })}
                        placeholder="Last name"
                        id="signup-lname"
                    />
                    <AnimatePresence>
                        {formErrors.lname !== '' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ ease: 'easeOut', duration: .2 }}>
                                <p
                                    className="input-error-text mt-1 text-red-600">
                                    {formErrors.lname}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div
                    className={`${
                        formErrors.email !== '' ? 'mb-3' : ''
                    } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
                >
                    <label htmlFor="signup-email" className="invisible w-0 h-0">
                        Email
                    </label>
                    <input
                        type="email"
                        className={`${
                            formErrors.email !== ''
                                ? 'border-red-600'
                                : 'border-bright-seaweed hover:border-hovered-seaweed'
                        } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        onClick={() => setFormErrors({ ...formErrors, email: '' })}
                        onFocus={() => setFormErrors({ ...formErrors, email: '' })}
                        placeholder="Email"
                        id="signup-email"
                    />
                    <AnimatePresence>
                        {formErrors.email !== '' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ ease: 'easeOut', duration: .2 }}>
                                <p
                                    className="input-error-text mt-1 text-red-600">
                                    {formErrors.email}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div
                    className={`${
                        formErrors.password !== '' ? 'mb-3' : ''
                    } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
                >
                    <label htmlFor="signup-password" className="invisible w-0 h-0">
                        Password
                    </label>
                    <PasswordInput
                        className={`${
                            formErrors.password !== ''
                                ? 'border-red-600'
                                : 'border-bright-seaweed hover:border-hovered-seaweed'
                        } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        onClick={() => setFormErrors({ ...formErrors, password: '' })}
                        onFocus={() => setFormErrors({ ...formErrors, password: '' })}
                        placeholder="Password"
                        id="signup-password"
                    />
                    <AnimatePresence>
                    {formErrors.password !== '' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             exit={{ opacity: 0, height: 0 }}
                             transition={{ ease: 'easeOut', duration: .2 }}>
                            <p
                                className="input-error-text mt-1 text-red-600">
                                {formErrors.password}
                            </p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>

                <div
                    className={`${
                        formErrors.cpassword !== '' ? 'mb-3' : ''
                    } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}
                >
                    <label htmlFor="signup-password-confirm" className="invisible w-0 h-0">
                        Confirm password
                    </label>
                    <PasswordInput
                        className={`${
                            formErrors.cpassword !== ''
                                ? 'border-red-600'
                                : 'border-bright-seaweed hover:border-hovered-seaweed'
                        } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, cpassword: e.target.value })
                        }
                        onClick={() => setFormErrors({ ...formErrors, cpassword: '' })}
                        onFocus={() => setFormErrors({ ...formErrors, cpassword: '' })}
                        placeholder="Confirm password"
                        id="signup-password-confirm"
                    />
                    <AnimatePresence>
                        {formErrors.cpassword !== '' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ ease: 'easeOut', duration: .2 }}>
                                <p
                                    className="input-error-text mt-1 text-red-600">
                                    {formErrors.cpassword}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="w-full min-w-[220px] max-w-xs flex flex-col justify-center items-center mt-10">
                    <input
                        type="submit"
                        value="Sign up"
                        id="signup-btn-submit"
                        className="w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer mq-hover:hover:bg-hovered-seaweed"
                    />
                    <Link href="/login">
                        <button
                            type="button"
                            id="already-signedup-btn"
                            className="w-full max-w-xs p-2 text-default-font border-solid border rounded-md border-bright-seaweed transition-all cursor-pointer hover:border-hovered-seaweed hover:ring-1 hover:ring-inset hover:ring-bright-seaweed"
                        >
                            Already signed up?
                        </button>
                    </Link>
                    {!registerUserState.matches('pending') &&
                        registerUserState.context.err !== null && (
                            <p className="server-fetch-error-text mt-4 text-center text-red-600">
                                {registerUserState.context.err.errors.message}
                            </p>
                        )}
                </div>
                {registerUserState.matches('pending') && <LoadingSpinner />}
            </form>
        </main>
    );
}

export default Signup;
