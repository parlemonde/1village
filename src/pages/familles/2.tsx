import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { DeleteButton } from 'src/buttons/DeleteButton';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ContentEditor } from 'src/components/activities/content';
import { ClassroomContext } from 'src/contexts/classroomContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivities } from 'src/services/useActivities';
import { useVillageUsers } from 'src/services/useVillageUsers';
import type { Student } from 'types/student.type';
import { User } from 'types/user.type';
import { UserType } from 'types/user.type';

const ClassroomParamStep2 = () => {
  const router = useRouter();
  const [student, setStudent] = React.useState({
    classroomId: '',
    firstname: '',
    lastname: '',
    hashedCode: '',
    numLinkedAccount: '',
  });
  const { user } = React.useContext(UserContext);
  const { createStudent, deleteStudent } = React.useContext(ClassroomContext);
  const addStudent = (field: Extract<keyof Student, string>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudent({ ...student, [field]: event.target.value });
  };

  // const addStudent = () => {
  //   const [firstname, setFirstName] = useState('');
  //   const [lastname, setLastName] = useState('');
  // };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createStudent([...students, student]);
  };
  const isTeacher = user?.type === UserType.TEACHER;
  const onNext = () => {
    router.push('/familles/3');
  };

  return (
    <Base>
      <Steps
        steps={['Visibilité', 'Identifiants', 'Communication', 'Gestion']}
        urls={['/familles/1?edit', '/familles/2', '/familles/3', 'familles/4']}
        activeStep={1}
      />
      <div className="width-900">
        <h1>Ajouter un identifiant par élève</h1>
        <p className="text">
          Pour sécuriser la connexion des familles, nous allons créer un identifiant unique à chaque élève de votre classe. Ensuite chaque famille
          pourra créer jusqu'à 5 accès avec ce même identifiant unique: ainsi les parents divorcés, les grands-parents, les grands-frères ou les
          grandes-soeurs pourront accéder à 1Village. Vous devez donc créer autant d'identifiants qu'il y a d'élèves dans votre classe. Vous pourrez
          rajouter des identifiants en cours d'années, lorsqu'un nouvel élève arrive dans votre classe.
        </p>
        {/* <TextField
          value={student.firstname}
          defaultValue={'non renseignée'}
          placeholder="Prénom"
          isEditMode={editMode === 0}
          onChange={(firstname) => {
            setStudent((u) => (!u ? u : { ...u, firstname }));
          onChange={(firstname) => {
            addStudent((u) => (!u ? u : { ...u, firstname }));
          }}
        />
        <TextField
          value={student.lastname}
          defaultValue={'non renseignée'}
          placeholder="Nom"
          isEditMode={editMode === 0}
          onChange={(lastname) => {
            setStudent((u) => (!u ? u : { ...u, lastname }));
          }}
        /> */}

        <form onSubmit={handleSubmit}>
          <label>
            <TextField
              variant="standard"
              size="small"
              placeholder="Prénom"
              type="firstname"
              value={student.firstname ?? ''}
              // onChange={(firstname) => {
              //   addStudent((u) => (!u ? u : { ...u, firstname }));
              // }}
              //   onChange={(firstname) => {
              //     addStudent((u) => (!u ? u : { ...u, firstname }));
              //   }}
              // onChange={addStudent("firstname")}
              // onChange={(event) => addStudent(event.target.value)}
              onChange={(event) => setStudent({ ...student, firstname: event.target.value })}
              disabled={false}
            />
          </label>
          {'  '}
          <label>
            <TextField
              variant="standard"
              size="small"
              placeholder="Nom"
              type="lastname"
              value={student.lastname ?? ''}
              onChange={(event) => setStudent({ ...student, lastname: event.target.value })}
              disabled={false}
            />
          </label>
          {'  '}
          <Button type="submit" disabled={!isTeacher || !student.firstname || !student.lastname} variant="outlined">
            Ajouter un élève
          </Button>
        </form>
        <div>
          {students.map((student) => (
            <div key={student.hashedCode}>
              {student.firstname} {student.lastname}
              {/* <ContentEditor content={student.content} deleteContent={deleteContent} /> */}
            </div>
          ))}
        </div>

        {/* <Tooltip title="Supprimer">
          <IconButton
            aria-label="delete"
            onClick={() => {
              setDeleteIndex(users.findIndex((u) => u.id === id));
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip> */}

        {/* <input type="button" value="Ajouter un élève" onClick={addStudent}/> */}
        <StepsButton prev={'/familles/1?edit'} next={onNext} />
      </div>
    </Base>
  );
};

export default ClassroomParamStep2;

