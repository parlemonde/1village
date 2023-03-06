// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

import { Base } from 'src/components/Base';
import { Modal } from 'src/components/Modal';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ClassroomContext } from 'src/contexts/classroomContext';
import { UserContext } from 'src/contexts/userContext';
import { bgPage } from 'src/styles/variables.const';
import { isNormalizedStringEqual } from 'src/utils/isNormalizedStringEqual';
import type { Student } from 'types/student.type';

const ClassroomParamStep2 = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserContext);

  const { students, setStudents, createStudent, deleteStudent } = React.useContext(ClassroomContext);
  const [isBtndisable, setBtnDisable] = React.useState(true);
  const firstnameRef = React.useRef<HTMLInputElement>(null);
  const lastnameRef = React.useRef<HTMLInputElement>(null);
  const [isDuplicateModalOn, setIsDuplicateModalOn] = React.useState(false);
  const [isDuplicateWarningModal, setIsDuplicateWarningModal] = React.useState(false);
  const [editableStudent, setEditableStudent] = useState(null);
  const [inputError, setInputError] = useState(false);

  //TODO: must be unique student

  const handleChange = () => {
    if (firstnameRef.current === null || lastnameRef.current === null) return;
    if (firstnameRef.current.value === '' || lastnameRef.current.value === '') return;
    setBtnDisable(firstnameRef.current.value === null && lastnameRef.current.value === null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // === ATTENTION === There is 2 modals in this code, one which is a simple warning (the check under this), which's used for the update
    if (isDuplicateWarningModal) {
      setIsDuplicateWarningModal(false);
    } else {
      if (firstnameRef.current === null || lastnameRef.current === null) return;
      if (firstnameRef.current.value === '' || lastnameRef.current.value === '') return;

      const newStudent = {
        firstname: firstnameRef.current.value,
        lastname: lastnameRef.current.value,
      };

      let isDuplicate = false;

      for (const student of students) {
        if (isNormalizedStringEqual(student.firstname, newStudent.firstname) && isNormalizedStringEqual(student.lastname, newStudent.lastname)) {
          isDuplicate = true;
          break;
        }
      }

      if (isDuplicate) {
        setIsDuplicateModalOn(true);
      } else {
        await createStudent(newStudent);

        // Reset the input fields
        firstnameRef.current.value = '';
        lastnameRef.current.value = '';

        // Close the duplicate modal
        setIsDuplicateModalOn(false);
      }
    }
  };

  const onModalConfirm = async () => {
    const newStudent = {
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
    };

    await createStudent(newStudent);

    // Reset the input fields
    firstnameRef.current.value = '';
    lastnameRef.current.value = '';

    // Close the duplicate modal
    setIsDuplicateModalOn(false);
  };

  const handleEdit = (student: Student) => {
    setEditableStudent(student);
    if (firstnameRef.current && lastnameRef.current) {
      firstnameRef.current.value = student.firstname;
      lastnameRef.current.value = student.lastname;
    }
  };

  const handleSave = async (e, student) => {
    e.preventDefault();

    const updatedStudent = {
      id: student.id,
      firstname: e.target[0].value,
      lastname: e.target[1].value,
    };

    for (const student of students) {
      if (
        isNormalizedStringEqual(student.firstname, updatedStudent.firstname) &&
        isNormalizedStringEqual(student.lastname, updatedStudent.lastname)
      ) {
        setIsDuplicateWarningModal(true);
        return;
      }
    }

    if (updatedStudent.firstname === '' || updatedStudent.lastname === '') {
      setInputError(true);
    } else {
      try {
        const updatedData = await editStudent(updatedStudent);
        // Update the state with the updated student data
        setStudents((prevStudents) => {
          const index = prevStudents.findIndex((s) => s.id === updatedData.id);
          const updatedStudents = [...prevStudents];
          updatedStudents[index] = updatedData;
          setEditableStudent(null); // Change from setEditableStudent(false)
          return updatedStudents;
        });
      } catch (err) {
        return err;
      }
    }
  };

  const onEditModalConfirm = async () => {
    if (!editableStudent) {
      // editableStudent is not defined, handle error
      return;
    }

    const updatedStudent = {
      id: editableStudent.id,
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
    };

    try {
      const updatedData = await editStudent(updatedStudent);

      // Update the state with the updated student data
      setStudents((prevStudents) => {
        const index = prevStudents.findIndex((s) => s.id === updatedData.id);
        const updatedStudents = [...prevStudents];
        updatedStudents[index] = updatedData;
        return updatedStudents;
      });

      // Close the edit modal
      setIsDuplicateWarningModal(false);
      setEditableStudent(null);
    } catch (err) {
      return err;
    }
  };

  const handleCancel = () => {
    setEditableStudent(false);
  };

  const editStudent = async (updatedStudent: Promise<Partial<Student>>) => {
    const { id, ...rest } = await updatedStudent;

    const response = await axiosLoggedRequest({
      method: 'PUT',
      url: `/students/${id}`,
      data: { ...rest },
    });

    if (response.error) {
      throw response.error;
    }
    return response.data;
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
        {isDuplicateModalOn && (
          <Modal
            onClose={() => {
              setIsDuplicateModalOn(false);
            }}
            ariaLabelledBy={''}
            ariaDescribedBy={''}
            onConfirm={onModalConfirm}
            confirmLabel="confirmer"
            title="Elève déjà existant"
          >
            Un élève que vous avez ajouté possède déjà ce nom. <br />
            Souhaitez-vous ajouter un autre élève à ce nom ?
          </Modal>
        )}
        {isDuplicateWarningModal && (
          <Modal
            onClose={() => {
              setIsDuplicateWarningModal(false);
            }}
            ariaLabelledBy={''}
            ariaDescribedBy={''}
            onConfirm={onEditModalConfirm}
            confirmLabel="confirmer"
            title="Elève déjà existant"
          >
            Attention !! <br />
            Un élève de votre classe possède déjà ce nom / prénom <br />
            S&apos;il s&apos;agit d&apos;une erreur veuillez supprimer le nouvel élève.
          </Modal>
        )}

        <div className="students-list" style={{ display: 'flex', flexDirection: 'column', width: '45%', minWidth: '350px' }}>
          {students.length > 0 &&
            students
              .map((student) => (
                <span key={student.id} style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                  {editableStudent === student ? (
                    <form onSubmit={(e) => handleSave(e, student)} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <input
                        type="text"
                        defaultValue={student.firstname}
                        style={{ flex: 1, marginRight: '10px' }}
                        error={inputError}
                        onChange={() => {
                          setInputError(false);
                        }}
                      />
                      <input
                        type="text"
                        defaultValue={student.lastname}
                        style={{ flex: 1, marginRight: '10px' }}
                        error={inputError}
                        onChange={() => {
                          setInputError(false);
                        }}
                      />
                      <button type="submit">Enregistrer</button>
                      <button type="button" onClick={handleCancel}>
                        Annuler
                      </button>
                    </form>
                  ) : (
                    <>
                      <p>{student.numLinkedAccount}</p>
                      <p style={{ flex: 1 }}>
                        {student.firstname} {student.lastname}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '31.6px',
                            height: '31,6px',
                            padding: '3px',
                            border: '1px solid currentColor',
                            borderRadius: '50%',
                            borderColor: '#4c3ed9',
                          }}
                        >
                          <ModeEditOutlineRoundedIcon color="primary" onClick={() => handleEdit(student)} />
                        </button>

                        <DeleteButton
                          onDelete={() => {
                            deleteStudent(student.id);
                          }}
                          confirmLabel="Êtes-vous sur de vouloir supprimer l'élève ?"
                          confirmTitle="Supprimer l'élève"
                          style={{ backgroundColor: bgPage, marginLeft: '0.5rem' }}
                        />
                      </div>
                    </>
                  )}
                </span>
              ))
              .reverse()}
        </div>

        <StepsButton prev={'/familles/1?edit'} next={onNext} />
      </div>
    </Base>
  );
};

export default ClassroomParamStep2;
