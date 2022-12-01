import { HTMLAttributes, useState } from "react";
import { Eye } from "@/resources/svg/Eye";
import { EyeCrossed } from "@/resources/svg/EyeCrossed";

function PasswordInput(props: HTMLAttributes<any>) {
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    return (
      <div className="flex-auto border-b-2 border-solid w-full relative">
        <input {...props} type={passwordShown ? 'text' : 'password'} />
        <button
          type="button"
          className="absolute right-5 h-full"
          onClick={togglePassword}
        >
          {passwordShown ? (
            <Eye width="auto" height="85%" />
          ) : (
            <EyeCrossed width="auto" height="85%" />
          )}
        </button>
      </div>
    );
}

export { PasswordInput };
