import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import React, { useEffect, useState } from 'react';

import { Base } from 'src/components/Base';
import type { UserForm } from 'types/user.type';
import { UserType } from 'types/user.type';

const SignUpForm = () => {
  const [email, setEmail] = useState<string>('');
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<UserForm>({
    email: email,
    firstname: firstname,
    lastname: lastname,
    password: password,
    type: UserType.FAMILY,
  });

  const registerValidationSchema = {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      firstName: {
        type: 'string',
        minLength: 1,
      },
      lastName: {
        type: 'string',
        minLength: 1,
      },
      password: {
        type: 'string',
        minLength: 8,
        pattern: '^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$',
      },
      confirmPassword: {
        type: 'string',
        minLength: 8,
        pattern: '^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$',
      },
    },
    required: ['email', 'firstName', 'lastName', 'password', 'confirmPassword'],
    oneOf: [
      {
        properties: {
          password: {
            const: {
              $data: '1/confirmPassword',
            },
          },
        },
        required: ['password'],
      },
    ],
  };

  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(registerValidationSchema);

  useEffect(() => {
    let newErrorMessage = '';
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!password.match(/\d/)) {
      newErrorMessage = 'Password must contain at least one number';
    }
    if (!password.match(/[A-Z]/)) {
      if (newErrorMessage) {
        newErrorMessage += ', and ';
      }
      newErrorMessage += 'at least one uppercase letter';
    }
    if (password.length < 8) {
      if (newErrorMessage) {
        newErrorMessage += ', and ';
      }
      newErrorMessage += 'be at least 8 characters long';
    }
    if (email.match(emailRegex)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }

    setIsPasswordMatch(password === confirmPassword);
    setErrorMessage(newErrorMessage ? `Password must ${newErrorMessage}` : '');
    setNewUser({
      email: email,
      firstname: firstname,
      lastname: lastname,
      password: password,
      type: UserType.FAMILY,
    });
  }, [email, firstname, lastname, password, confirmPassword]);

  useEffect(() => {
    if (validate(newUser) === true) {
      setIsFormValid(true);
    }
  }, [newUser, validate]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    /*     console.log(newUser);
    console.log(validate(newUser)); */

    if (!isFormValid) {
      /*       console.log(validate.errors);
       */
    }
  }

  return (
    <Base>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          {!isEmailValid && <p>Please enter a valid email address</p>}
        </label>
        <br />
        <label>
          Firstname:
          <input
            type="text"
            value={firstname}
            onChange={(event) => {
              setFirstname(event.target.value);
            }}
          />
        </label>
        <br />
        <label>
          Lastname:
          <input
            type="text"
            value={lastname}
            onChange={(event) => {
              setLastName(event.target.value);
            }}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          {errorMessage && <p>{errorMessage}</p>}
        </label>
        <br />
        <label>
          Confirm Password:
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          {!isPasswordMatch && <p>Passwords do not match</p>}
        </label>
        <br />
        <input
          type="submit"
          value="Submit"
          disabled={isPasswordMatch === false || firstname === '' || lastname === '' || isEmailValid === false || errorMessage !== '' ? true : false}
        />
      </form>
    </Base>
  );
};

export default SignUpForm;
