import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { Box } from '@mui/material';

import { Base } from 'src/components/Base';
import { UserContext } from 'src/contexts/userContext';
import type { UserForm } from 'types/user.type';
import { UserType } from 'types/user.type';

const schema = Joi.object({
  firstname: Joi.string()
    .required()
    .pattern(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)
    .min(2)
    .max(50),
  lastname: Joi.string()
    .required()
    .pattern(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)
    .min(2)
    .max(100),
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string()
    .required()
    .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
    .min(8),
  passwordConfirmation: Joi.any().required().valid(Joi.ref('password')),
});

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<UserForm>({ mode: 'onChange', resolver: joiResolver(schema) });

  const { signup } = React.useContext(UserContext);

  const firstnameMessage = `Veuillez entrer votre prénom`;
  const lastnameMessage = `Veuillez entrer votre nom`;
  const emailMessage = `Veuillez entrer un email valide`;
  const passwordMessage = 'Doit contenir 8 caractères dont 1 spécial, une maj et un chiffre';
  const passwordConfirmationMessage = 'Les mots de passe doivent être identiques';

  const onSubmit: SubmitHandler<UserForm> = async (data) => {
    await signup({
      firstname: data.firstname,
      lastname: data.lastname,
      pseudo: data.firstname + ' ' + data.lastname[0].toUpperCase(),
      email: data.email,
      type: UserType.FAMILY,
      password: data.password,
    });
  };

  return (
    <>
      <Base>
        <Box
          sx={{
            marginLeft: '2%',
            marginRight: '2%',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <p>firstname</p>
            <input {...register('firstname')} />
            <p>{errors.firstname ? firstnameMessage : ''}</p>
            <p>lastname</p>
            <input {...register('lastname')} />
            <p>{errors.lastname ? lastnameMessage : ''}</p>
            <p>email</p>
            <input {...register('email')} />
            <p>{errors.email ? emailMessage : ''}</p>
            <p>password</p>
            <input type="password" {...register('password')} />
            {errors.password && <p>{passwordMessage} </p>}
            <p>{errors.password ? passwordMessage : ''}</p>
            <input {...register('passwordConfirmation', { required: true })} type="password" autoComplete="off" />
            {errors.password && <p>{passwordConfirmationMessage} </p>}
            <button disabled={!isValid} type="submit">
              submit
            </button>
          </form>
        </Box>
      </Base>
    </>
  );
};

export default SignUp;
