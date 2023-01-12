import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ClassroomContext } from 'src/contexts/classroomContext';
import { UserContext } from 'src/contexts/userContext';
import type { Student, StudentForm } from 'types/student.type';
import { User, UserType } from 'types/user.type';

const ClassroomParamStep2 = () => {
  const router = useRouter();
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const { students, setStudents } = React.useContext(ClassroomContext);
  // const [students, setStudents] = React.useState([
  //   { firstname: 'Charline', lastname: 'Barbelette', hashedCode: 'dgdghhd' },
  //   { firstname: 'Charline2', lastname: 'Barbelette2', hashedCode: 'dgdghhd2' },
  //   { firstname: 'Charline3', lastname: 'Barbelette3', hashedCode: 'dgdghhd3' },
  // ]);
  /* const addStudent = (field: Extract<keyof Student, string>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudents({ ...student, [field]: event.target.value });
  }; */
  const [firstname, setFirstName] = React.useState('');
  const [lastname, setLastName] = React.useState('');
  const [hashedCode, setHashedCode] = React.useState<string>('');
  const [student, setStudent] = React.useState<StudentForm>({
    firstname: '',
    lastname: '',
    hashedCode: '',
  });

  /*   const addStudent = (): void => {
    const newStudent = { firstname: firstname, lastname: lastname, hashCode: hashCode };
    setStudents([...students, newStudent]);
    setFirstName('');
    setLastName('');
    setHashCode('');
  }; */

  useEffect(() => {
    setStudent({
      firstname: firstname,
      lastname: lastname,
      hashedCode: hashedCode,
    });
  }, [firstname, lastname, hashedCode]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(student);
    // setStudent(event.target.value);
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
              value={student.firstname}
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />
          </label>
          {'  '}
          <label>
            <TextField
              variant="standard"
              size="small"
              placeholder="Nom"
              type="lastname"
              value={student.lastname}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
          </label>
          {'  '}
          <Button type="submit" disabled={!isTeacher || !student.firstname || !student.lastname} variant="outlined">
            Ajouter un élève
          </Button>
        </form>
        {/* <div className="students">
          {students.map((student: Student) => (
            <div key={student.hashedCode}>
              {student.firstname} {student.lastname}
              console.log(students);
              {/* <DeleteButton /> /* 
              {/* <ContentEditor content={student.content} deleteContent={deleteContent} /> */}
        {/* </div> */}
        {/* ))} */}
        {/* </div> */}

        <div className="students-list">
          {students.map((student) => (
            <div className="student-name" key={student.hashedCode}>
              <div className="firstname">
                <span>{student.firstname}</span>
              </div>
              <div className="lastname">
                <span> {student.lastname} </span>
              </div>
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
