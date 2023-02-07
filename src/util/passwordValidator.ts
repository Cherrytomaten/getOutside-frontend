import { ValidateProps } from '@/types/Auth/ValidateProps';

function validatePassword(password: string): ValidateProps {
  if (password === '' || password === undefined) {
    return { validated: false, message: 'Password must not be empty!' };
  } else {
    const regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
    if (regex.test(password)) {
      return { validated: true, message: 'Validation success!' };
    }
    return {
      validated: false,
      message: 'The chosen password is too weak!\n It should consist of at least 8 characters, including a capital letter, a number and a special character.',
    };
  }
}

export { validatePassword };
