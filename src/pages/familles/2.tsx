import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ClassroomContext } from 'src/contexts/classroomContext';
import { bgPage } from 'src/styles/variables.const';

const ClassroomParamStep2 = () => {
  const router = useRouter();
  const { students, createStudent, deleteStudent } = React.useContext(ClassroomContext);
  const [isBtndisable, setBtnDisable] = React.useState(true);
  const firstnameRef = React.useRef<HTMLInputElement>(null);
  const lastnameRef = React.useRef<HTMLInputElement>(null);

  //TODO: must be unique student

  const handleChange = () => {
    if (firstnameRef.current === null || lastnameRef.current === null) return;
    if (firstnameRef.current.value === '' || lastnameRef.current.value === '') return;
    setBtnDisable(firstnameRef.current.value === null && lastnameRef.current.value === null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (firstnameRef.current === null || lastnameRef.current === null) return;
    if (firstnameRef.current.value === '' || lastnameRef.current.value === '') return;

    const newStudent = {
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
    };
    createStudent(newStudent);
    firstnameRef.current.value = '';
    lastnameRef.current.value = '';
  };
  const onNext = () => {
    router.push('/familles/3');
  };

  return (
    <Base>
      <Steps
        steps={['Visibilité', 'Identifiants', 'Communication', 'Gestion']}
        urls={['/familles/1?edit', '/familles/2', '/familles/3', '/familles/4']}
        activeStep={1}
      />
      <div className="width-900">
        <h1>Ajouter un identifiant par élève</h1>
        <p className="text">
          Pour sécuriser la connexion des familles, nous allons créer{' '}
          <span style={{ fontWeight: 'bold' }}>un identifiant unique à chaque élève de votre classe. </span> <br></br>Ensuite chaque famille pourra
          créer jusqu&apos;à 5 accès avec ce même identifiant unique: ainsi les parents divorcés, les grands-parents, les grands-frères ou les
          grandes-soeurs pourront accéder à 1Village. <br></br>
          <br></br>Vous devez donc créer autant d&apos;identifiants qu&apos;il y a d&apos;élèves dans votre classe. Vous pourrez rajouter des
          identifiants en cours d&apos;années, lorsqu&apos;un nouvel élève arrive dans votre classe.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            <TextField
              variant="standard"
              size="small"
              placeholder="Prénom"
              type="firstname"
              onChange={handleChange}
              inputRef={firstnameRef}
              sx={{
                marginRight: 1,
              }}
            />
          </label>
          <label>
            <TextField
              variant="standard"
              size="small"
              placeholder="Nom"
              type="lastname"
              onChange={handleChange}
              inputRef={lastnameRef}
              sx={{
                marginRight: 1,
              }}
            />
          </label>
          <Button type="submit" variant="outlined" disabled={isBtndisable}>
            Ajouter un élève
          </Button>
        </form>
        <div className="students-list">
          {students.length > 0
            ? students.map((student) => (
                <div key={student.hashedCode} style={{ display: 'grid', gridTemplateColumns: '40px 1fr' }}>
                  <DeleteButton
                    onDelete={() => {
                      deleteStudent(student.id);
                    }}
                    confirmLabel="Êtes-vous sur de vouloir supprimer l'élève ?"
                    confirmTitle="Supprimer l'élève"
                    style={{ backgroundColor: bgPage, placeSelf: 'center start' }}
                  />
                  <p style={{ placeSelf: 'center start' }}>
                    {student.firstname} {student.lastname}
                  </p>
                </div>
              ))
            : null}
        </div>
        <StepsButton prev={'/familles/1?edit'} next={onNext} />
      </div>
    </Base>
  );
};

export default ClassroomParamStep2;
