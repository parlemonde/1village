import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ImageModal } from 'src/components/activities/content/editors/ImageEditor/ImageModal';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ClassroomContext } from 'src/contexts/classroomContext';
import { UserContext } from 'src/contexts/userContext';
import { bgPage } from 'src/styles/variables.const';
import type { Student, StudentForm } from 'types/student.type';
import { User, UserType } from 'types/user.type';

const ClassroomParamStep2 = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { students, setStudents, createStudent, deleteStudent } = React.useContext(ClassroomContext);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const firstnameRef = React.useRef<HTMLInputElement>(null);
  const lastnameRef = React.useRef<HTMLInputElement>(null);
  // const data = (student?.data as Student) || null;

  //TODO: issu to disabled the button for both input if empty (firstname)
  //TODO: issu to send the data to the bdd
  //TODO: issu with the button delete, find the student

  // const [value, setValue] = React.useState('');
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(firstnameRef, lastnameRef);
     if (firstnameRef.current === null || lastnameRef.current === null) return;
    // if (firstnameRef.current.value === '' || lastnameRef.current.value === '') return;

    //create of new student
    const newStudent = {
      // id: '',
      // classroomId,
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
      hashedCode: '5plk5',
    };

    //Set the list of students
    setStudents([...students, newStudent]);
    //Save in the bdd  createStudent(newStudent as Omit<Student, 'id' | 'classroomId' | 'numLinkedAccount'>);
    createStudent(newStudent);
  };
  const isTeacher = user?.type === UserType.TEACHER;

  // const isEnable = { isTeacher, firstnameRef, lastnameRef };

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
              // value={value}
              onChange={handleChange}
              //   setFirstName(event.target.value);
              // }}
              inputRef={firstnameRef}
            />
          </label>
          {'  '}
          <label>
            <TextField
              variant="standard"
              size="small"
              placeholder="Nom"
              type="lastname"
              // value={value}
              onChange={handleChange}
              // value={student.lastname}
              // onChange={(event) => {
              //   setLastName(event.target.value);
              // }}
              inputRef={lastnameRef}
            />
          </label>
          {'  '}
          {/* <Button type="submit" disabled={!isTeacher || !student.firstname || !student.lastname || !firstnameRef.current?.value || !lastnameRef.current?.value} variant="outlined"> */}
          <Button type="submit" variant="outlined" disabled={firstnameRef?.current?.value === '' || lastnameRef?.current?.value === ''}>
            Ajouter un élève
          </Button>
        </form>
        <div className="students-list">
          {students.length > 0
            ? students.map((student) => (
                <div className="student-name" key={student.hashedCode}>
                  <div className="firstname">
                    {student.firstname} {student.lastname}{' '}
                    {/* {data.student && (
          <div style={{ position: 'absolute', top: '0.25rem', right: '0.25rem' }}> */}
                    <DeleteButton
                      onDelete={() => {
                        deleteStudent(student.id);
                      }}
                      confirmLabel="Êtes-vous sur de vouloir supprimer l'élève ?"
                      confirmTitle="Supprimer l'élève"
                      style={{ backgroundColor: bgPage }}
                    />
                    {/* </div>
        )} */}
                    {/* <ImageModal
          id={0}
          isModalOpen={isImageModalOpen}
          setIsModalOpen={setIsImageModalOpen}
          imageUrl={data.student? || ''}
          setStudents={setStudents}
        /> */}
                  </div>
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
