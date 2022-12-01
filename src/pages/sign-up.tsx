import { ajvResolver } from '@hookform/resolvers/ajv';
import type { JSONSchemaType } from 'ajv';
import { useRouter } from 'next/router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { Box } from '@mui/material';

import { Base } from 'src/components/Base';
import { useUserRequests } from 'src/services/useUsers';
import type { User } from 'types/user.type';

interface SignUpSchema {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
type FormValues = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

const schema: JSONSchemaType<SignUpSchema> = {
  type: 'object',
  properties: {
    firstname: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLenght: `Veuillez renseigner un prénom` },
    },
    lastname: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLenght: `Veuillez renseigner un nom de familles` },
    },
    email: {
      type: 'string',
      minLength: 4,
      errorMessage: { minLength: `un email doit ressembler à xx@xx.xx` },
    },
    password: {
      type: 'string',
      minLength: 8,
      errorMessage: { minLength: 'choisir un mot de passe de 8 caractères minimum' },
    },
  },
  required: ['firstname', 'lastname', 'email', 'password'],
  additionalProperties: false,
};

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: ajvResolver(schema) });

  const router = useRouter();
  const { addUser } = useUserRequests();
  /* 
  const { newUser, setNewUser } = React.useState<Partial<User>>({
    email: '',
    pseudo: '',
    firstname: '',
    lastname: '',
    city: '',
    address: '',
    postalCode: '',
    school: '',
    level: '',
    type: UserType.FAMILY,
    country: {
      isoCode: '',
      name: '',
    },
  });
 */
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    await addUser({ ...data });

    // router.push('/users');
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
            {errors.firstname && <p>{errors.firstname.message}</p>}
            <p>lastname</p>
            <input {...register('lastname')} />
            {errors.lastname && <p>{errors.lastname.message}</p>}
            <p>email</p>
            <input {...register('email')} />
            {errors.email && <p>{errors.email.message}</p>}
            <p>password</p>
            <input {...register('password')} />
            {errors.password && <p>{errors.password.message}</p>}
            <button type="submit">submit</button>
          </form>
        </Box>
      </Base>
    </>
  );
};

export default SignUp;
