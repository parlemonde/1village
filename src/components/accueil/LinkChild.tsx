import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';

import { Button, TextField } from '@mui/material';

// import { DeleteButton } from '../buttons/DeleteButton';
// import { ClassroomContext } from 'src/contexts/classroomContext';
import { UserContext } from 'src/contexts/userContext';
// import { bgPage } from 'src/styles/variables.const';
// import type { User } from 'types/user.type';
import type { Student } from 'types/student.type';

// type UserStudents = User & {
//   firstLetter: string;
// };

export const LinkChild = () => {
  const router = useRouter();
  const { linkStudent } = React.useContext(UserContext);
  const { user } = React.useContext(UserContext);
  const [linkedStudents, setLinkedStudents] = React.useState<Student[]>([]);
  const { getLinkedStudentsToUser } = React.useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const hashedCodeRef = React.useRef<HTMLInputElement>(null);
  //const { students } = React.useContext(ClassroomContext);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hashedCodeRef.current === null) return;
    if (hashedCodeRef.current.value === '') return;
    linkStudent(hashedCodeRef.current.value).then((response) => {
      if (response.success === false) {
        enqueueSnackbar("Le rattachement n'a pas fonctionné ! Veuillez renseigner un identifiant valide", {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Rattachement réalisé avec succès!', {
          variant: 'success',
        });
      }
    });
    hashedCodeRef.current.value = '';
    setTimeout(() => {
      router.reload();
    }, 2 * 1000);
  };

  // React.useEffect(() => {
  //   const fetchLinkedStudents = async () => {
  //     const linkedStudentsData = await getLinkedStudentsToUser(userId);
  //     const linkedStudents: UserStudents[] = linkedStudentsData.map((student) => ({
  //       ...student,
  //       firstLetter: /[0-9]/.test(student.firstname[0]) ? '0-9' : student.firstname[0].toUpperCase(),
  //     }));
  //     setLinkedStudents(linkedStudents);
  //   };
  //   fetchLinkedStudents();
  // }, [getLinkedStudentsToUser, userId]);

  React.useEffect(() => {
    getLinkedStudentsToUser;
  }, [getLinkedStudentsToUser]);
  console.log(linkedStudents);
  return (
    <div style={{ padding: '15px' }}>
      <h1>Ajouter ou retirer un enfant</h1>
      <p className="text">
        Votre compte n’est pour l’instant relié à aucun enfant. Pour accéder aux échanges, il vous faut ajouter l’identifiant transmis par son
        professeur.
      </p>
      <h2>Ajouter un enfant</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <TextField
          variant="standard"
          size="small"
          placeholder="Identifiant à saisir ici"
          inputRef={hashedCodeRef}
          sx={{
            marginRight: 1,
          }}
        />
        <Button type="submit" variant="outlined">
          Ajouter un enfant
        </Button>
      </form>
      <div className="students-list" style={{ display: 'flex', flexDirection: 'column', width: '72%', minWidth: '350px' }}>
        {linkedStudents.map((student) => (
          <span key={student.id} style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
            <p style={{ flex: 1 }}>
              {student.hashedCode} {student.firstname} {student.lastname}
            </p>

            {/* <div style={{ display: 'flex', alignItems: 'center' }}>
            <DeleteButton
              onDelete={() => {
                // deleteLinkedStudent(user.id);
              }}
              confirmLabel="Êtes-vous sur de vouloir supprimer votre lien avec l'élève ?"
              confirmTitle="Supprimer lien élève"
              style={{ backgroundColor: bgPage, marginLeft: '0.5rem' }}
            />
          </div> */}
          </span>
        ))}
        {/* .reverse() */}
      </div>
    </div>
  );
};
