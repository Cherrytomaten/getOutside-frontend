import { ValidateProps } from '@/types/Auth/ValidateProps';

function validatePassword(password: string): ValidateProps {
  if (password === '' || password === undefined) {
    return { validated: false, message: 'Password must not be empty!' };
  } else {
    const regex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
    if (regex.test(password)) {
      return { validated: true, message: 'Validation success!' };
    }
    return {
      validated: false,
      message:
        'The choosen password is too weak!\n It should contain at least one big letter, one number and the length should be at minimum of 8 characters.',
    };
  }
}

export { validatePassword };
