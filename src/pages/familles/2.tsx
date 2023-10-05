// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

import { editStudent } from 'src/api/classroom/student.put';
import { Base } from 'src/components/Base';
import { Modal } from 'src/components/Modal';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ClassroomContext } from 'src/contexts/classroomContext';
import { bgPage } from 'src/styles/variables.const';
import { isNormalizedStringEqual } from 'src/utils/isNormalizedStringEqual';
import type { Student } from 'types/student.type';

const ClassroomParamStep2 = () => {
  const router = useRouter();

  const { students, setStudents, createStudent, deleteStudent } = React.useContext(ClassroomContext);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const firstnameRef = React.useRef<HTMLInputElement>(null);
  const lastnameRef = React.useRef<HTMLInputElement>(null);
  const [isDuplicateModalOn, setIsDuplicateModalOn] = React.useState(false);
  const [isDuplicateWarningModal, setIsDuplicateWarningModal] = React.useState(false);
  const [editableStudent, setEditableStudent] = useState(null);
  const [inputError, setInputError] = useState(false);
  const [inputValues, setInputValues] = useState({ firstname: '', lastname: '' });

  const handleChange = () => {
    if (firstnameRef.current === null || lastnameRef.current === null) return;

    const firstname = firstnameRef.current.value;
    const lastname = lastnameRef.current.value;

    setInputValues({ firstname, lastname });

    if (firstname === '' || lastname === '') {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    setIsDisabled(inputValues.firstname === '' || inputValues.lastname === '');
  }, [inputValues]);

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

        setIsDisabled(true);
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
    setIsDisabled(true);
  };

  const handleEdit = (student: Student) => {
    setEditableStudent(student);
    if (firstnameRef.current && lastnameRef.current) {
      if (firstnameRef.current === null || lastnameRef.current === null) return;
      if (firstnameRef.current.value === '' || lastnameRef.current.value === '') return;
    }
  };

  const handleSave = async (e, student) => {
    e.preventDefault();
    const newFirstname = e.target[0].value;
    const newLastname = e.target[1].value;
    const valuesChanged = newFirstname !== student.firstname || newLastname !== student.lastname;
    setEditableStudent({
      ...editableStudent,
      firstname: e.target[0].value,
      lastname: e.target[1].value,
    });
    if (valuesChanged) {
      const updatedStudent = {
        id: student.id,
        firstname: e.target[0].value,
        lastname: e.target[1].value,
      };

      for (const existingStudent of students) {
        if (
          isNormalizedStringEqual(existingStudent.firstname, updatedStudent.firstname) &&
          isNormalizedStringEqual(existingStudent.lastname, updatedStudent.lastname)
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
    }
  };

  const onEditModalConfirm = async () => {
    if (!editableStudent) {
      // editableStudent is not defined, handle error
      return;
    }

    const updatedStudent = {
      id: editableStudent.id,
      firstname: editableStudent.firstname,
      lastname: editableStudent.lastname,
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

  const onNext = () => {
    router.push('/familles/3');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
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
            <Button type="submit" variant="outlined" disabled={isDisabled} style={{ marginBottom: '20px' }}>
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

          <div className="students-list" style={{ display: 'flex', flexDirection: 'column', width: '72%', minWidth: '350px' }}>
            {students.length > 0 &&
              students
                .map((student) => (
                  <span key={student.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                    {editableStudent === student ? (
                      <form onSubmit={(e) => handleSave(e, student)} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <TextField
                          variant="standard"
                          size="small"
                          placeholder="Prénom"
                          type="firstname"
                          defaultValue={student.firstname}
                          style={{ flex: 1, marginRight: '10px' }}
                          error={inputError}
                          onChange={() => {
                            setInputError(false);
                          }}
                        />
                        <TextField
                          variant="standard"
                          size="small"
                          placeholder="Nom"
                          type="lastname"
                          defaultValue={student.lastname}
                          style={{ flex: 1, marginRight: '10px' }}
                          error={inputError}
                          onChange={() => {
                            setInputError(false);
                          }}
                        />
                        <Button type="submit" variant="outlined" style={{ margin: '5px' }}>
                          Enregistrer
                        </Button>

                        <Button type="button" variant="outlined" onClick={handleCancel} style={{ margin: '5px' }}>
                          Annuler
                        </Button>
                      </form>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                        <div style={{ width: '400px', marginRight: '10px' }}>
                          {student.firstname} {student.lastname}
                        </div>
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
                            confirmLabel="Êtes-vous sûre de vouloir supprimer l'élève ?"
                            confirmTitle="Supprimer l'élève"
                            style={{ backgroundColor: bgPage, marginLeft: '0.5rem' }}
                          />
                        </div>
                      </div>
                    )}
                  </span>
                ))
                .reverse()}
          </div>

          <StepsButton prev={'/familles/1?edit'} next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default ClassroomParamStep2;
