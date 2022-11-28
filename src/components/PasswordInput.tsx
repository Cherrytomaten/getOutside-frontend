import { HTMLAttributes, useState } from "react";
import { Eye } from "@/resources/svg/Eye";
import { EyeCrossed } from "@/resources/svg/EyeCrossed";

function PasswordInput(props: HTMLAttributes<any>) {
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <div className="relative w-max border-amber-500">
            <input {...props} type={passwordShown ? "text" : "password"} />
            <button type="button" className="absolute right-8 h-full" onClick={togglePassword}>
                { passwordShown
                ? <Eye width="auto" height="85%" />
                : <EyeCrossed width="auto" height="85%" />
                }
            </button>
        </div>
    );
}

export { PasswordInput };
