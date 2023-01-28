import { HTMLAttributes, useState } from 'react';
import { Eye } from '@/resources/svg/Eye';
import { EyeCrossed } from '@/resources/svg/EyeCrossed';

function PasswordInput(props: HTMLAttributes<any>) {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="relative w-full">
      <input {...props} type={passwordShown ? 'text' : 'password'} />
      <button type="button" className="absolute right-1 h-full" onClick={togglePassword}>
        {passwordShown ? <Eye width="24px" height="50%" /> : <EyeCrossed width="24px" height="50%" />}
      </button>
    </div>
  );
}

export { PasswordInput };
