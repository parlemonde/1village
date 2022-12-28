import { useRouter } from 'next/router';
import React from 'react';

import Button from '@mui/material/Button';
import { UserContext } from 'src/contexts/userContext';
// import { PanelInput } from 'src/components/mon-compte/PanelInput';
import { TextField } from '@mui/material';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ClassroomContext } from 'src/contexts/classroomContext';
import type { Student } from 'types/student.type';
import { StudentType } from 'types/student.type';

const NewStudent = () => {
const router = useRouter();
const [student, setStudent] = React.useMemo({
  classroomId: '',
  firstname: '',
  lastname: '',
  hashedCode: '',
  numLinkedAccount: '',
  });
};
const ClassroomParamStep2 = () => {
  const router = useRouter();
  const addStudent = () => {
    setStudent();
  }
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
          Pour sécuriser la connexion des familles, nous allons créer un identifiant unique à chaque élève de votre classe.  Ensuite chaque famille pourra créer jusqu'à 5 accès avec ce même identifiant unique: ainsi les parents divorcés, les grands-parents, les grands-frères ou les grandes-soeurs pourront accéder à 1Village. Vous devez donc créer autant d'identifiants qu'il y a d'élèves dans votre classe. Vous pourrez rajouter des identifiants en cours d'années, lorsqu'un nouvel élève arrive dans votre classe.
        </p>
        <TextField
          value={student.firstname}
          defaultValue={'non renseignée'}
          placeholder="Prénom"
          isEditMode={editMode === 0}
          onChange={(firstname) => {
            setStudent((u) => (!u ? u : { ...u, firstname }));
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
        />
        <StepsButton prev={'/familles/1?edit'} next={onNext} />
      </div>
    </Base>
  );
};

export default ClassroomParamStep2;
