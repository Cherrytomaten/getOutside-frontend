import { FormEvent, useEffect, useState } from "react";
import Logo from '@/resources/svg/Logo'

type SignUpFormProps = {
    title: string,
    fname: string,
    lname: string,
    email: string,
    password: string,
    cpassword: string
}

function Signup() {
    const [formData, setFormData] = useState<SignUpFormProps>({ title: '', fname: '', lname: '', email: '', password: '', cpassword: '' });
    const [formErrors, setFormErrors] = useState<SignUpFormProps>({ title: '', fname: '', lname: '', email: '', password: '', cpassword: '' });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (validateForm()) {
            
        }
    }

    function validateForm(): boolean {
        let validator: boolean = true;
        let data = formData;

        if (formData.title === '') {
            data = {...data, title: 'Bitte Anrede auswählen'};
            validator = false;
        } else {
            data = {...data, title: ''};
        }

        if (formData.fname === '') {
            data = {...data, fname: 'Bitte Vorname angeben'};
            validator = false;
        } else {
            data = {...data, fname: ''};
        }

        if (formData.lname === '') {
            data = {...data, lname: 'Bitte Nachnamen angeben'};
            validator = false;
        } else {
            data = {...data, lname: ''};
        }

        if (formData.email === '') {
            data = {...data, email: 'Bitte Email angeben'};
            validator = false;
        } else {
            data = {...data, email: ''};
        }

        console.log(formData.password);
        if (formData.password === '') {
            data = {...data, password: 'Bitte Passwort ausfüllen'};
            validator = false;
        }
        // one uppercase, one digit, three lowercase, length of atleast 8
        else if (!/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(formData.password)) {
            data = {...data, password: 'Das gewählte Passwort ist zu schwach!\n Es sollte mindestens ein Großbuchstaben, eine Zahl und eine mindestlänge von 8 Zeichen beinhalten.'};
            validator = false;
        } else {
            data = {...data, password: ''};
        }

        if (formData.cpassword === '') {
            data = {...data, cpassword: 'Bitte Passwort wiederholen'};
            validator = false;
        }
        else if (formData.cpassword !== formData.password) {
            data = {...data, cpassword: 'Die Passwörter stimmen nicht überein'};
            validator = false;
        } else {
            data = {...data, cpassword: ''};
        }

        setFormErrors(data);
        return validator;
    }

    useEffect(() => {
        console.log(formData);
    }, [formData, formErrors]);

    // password manager sometimes autofill fields like password & email
    useEffect(() => {
        if (document) {
            const preFilledPassword = (document.getElementById('signup-password') as HTMLInputElement)?.value;
            if (preFilledPassword !== '') { setFormData(f => ({...f, password: preFilledPassword})) }

            const preFilledEmail = (document.getElementById('signup-mail') as HTMLInputElement)?.value;
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
                    <label htmlFor="signup-select-title" className="mr-3">Anrede</label>
                    <select id="signup-select-title"
                            defaultValue="preselect"
                            className={`cursor-pointer ${formErrors.title !== '' ? 'border-2 border-red-600' : ''}`}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            onClick={() => setFormErrors({...formErrors, title: ''})}
                    >
                        <option value="preselect" disabled hidden>Bitte auswählen</option>
                        <option value="Herr">Herr</option>
                        <option value="Frau">Frau</option>
                        <option value="Divers">Divers</option>
                    </select>
                    { formErrors.title !== '' && <p className="text-red-600">{formErrors.title}</p> }
                </div>
                <div>
                    <label htmlFor="signup-fname" className="mr-3">Vorname</label>
                    <input type="text"
                           className={`${formErrors.fname !== '' ? 'border-2 border-red-600' : ''}`}
                           onChange={(e) => setFormData({...formData, fname: e.target.value})}
                           onClick={() => setFormErrors({...formErrors, fname: ''})}
                           placeholder="Vorname"
                           id="signup-fname" />
                    { formErrors.fname !== '' && <p className="text-red-600">{formErrors.fname}</p> }
                </div>
                <div>
                    <label htmlFor="signup-lname" className="mr-3">Nachname</label>
                    <input type="text"
                           className={`${formErrors.lname !== '' ? 'border-2 border-red-600' : ''}`}
                           onChange={(e) => setFormData({...formData, lname: e.target.value})}
                           onClick={() => setFormErrors({...formErrors, lname: ''})}
                           placeholder="Nachname"
                           id="signup-lname" />
                    { formErrors.lname !== '' && <p className="text-red-600">{formErrors.lname}</p> }
                </div>
                <div>
                    <label htmlFor="signup-mail" className="mr-3">Email</label>
                    <input type="email"
                           className={`${formErrors.email !== '' ? 'border-2 border-red-600' : ''}`}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           onClick={() => setFormErrors({...formErrors, email: ''})}
                           placeholder="Email"
                           id="signup-mail" />
                    { formErrors.email !== '' && <p className="text-red-600">{formErrors.email}</p> }
                </div>
                <div>
                    <label htmlFor="signup-password" className="mr-3">Passwort</label>
                    <input type="password"
                           className={`${formErrors.password !== '' ? 'border-2 border-red-600' : ''}`}
                           onChange={(e) => setFormData({...formData, password: e.target.value})}
                           onClick={() => setFormErrors({...formErrors, password: ''})}
                           placeholder="Passwort"
                           id="signup-password" />
                    { formErrors.password !== '' && <p className="text-red-600">{formErrors.password}</p> }
                </div>
                <div>
                    <label htmlFor="signup-password-confirm" className="mr-3">Passwort bestätigen</label>
                    <input type="password"
                           className={`${formErrors.cpassword !== '' ? 'border-2 border-red-600' : ''}`}
                           onChange={(e) => setFormData({...formData, cpassword: e.target.value})}
                           onClick={() => setFormErrors({...formErrors, cpassword: ''})}
                           placeholder="Passwort"
                           id="signup-password-confirm" />
                    { formErrors.cpassword !== '' && <p className="text-red-600">{formErrors.cpassword}</p> }
                </div>
                <div className="mt-10">
                    <input type="submit"
                           value="Registrieren"
                           className="w-full p-2 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer hover:bg-hovered-seaweed"
                    />
                </div>
            </form>
        </div>
    );
}

export { Signup };
