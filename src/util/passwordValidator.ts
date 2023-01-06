type ValidateProps = {
  validated: boolean;
  message: string;
};

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
    return { validated: false, message: 'Password not strong enough!' };
  }
}

export { validatePassword };
