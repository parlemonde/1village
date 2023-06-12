import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';

import { DeleteButton } from '../buttons/DeleteButton';
import { ClassroomContext } from 'src/contexts/classroomContext';
import { UserContext } from 'src/contexts/userContext';
import { bgPage } from 'src/styles/variables.const';
import type { Student } from 'types/student.type';

export const LinkChild = () => {
  const router = useRouter();
  const { linkStudent, user, getLinkedStudentsToUser, deleteLinkedStudent } = React.useContext(UserContext);
  const [linkedStudents, setLinkedStudents] = React.useState<Student[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const hashedCodeRef = React.useRef<HTMLInputElement>(null);
  const [student, setStudent] = React.useState(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hashedCodeRef.current === null) return;
    if (hashedCodeRef.current.value === '') return;
    const isAlreadyLinked = linkedStudents.some((student) => student.hashedCode === hashedCodeRef.current?.value);
    if (isAlreadyLinked) {
      enqueueSnackbar('Cet identifiant a déjà été rattaché à votre compte!', {
        variant: 'error',
      });
      hashedCodeRef.current.value = '';
      return;
    }
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

  // const handleDelete = async (studentId: number) => {
  //   if (user) {
  //     try {
  //       const response = await deleteLinkedStudent(user.id, studentId);
  //       if (response.success) {
  //         enqueueSnackbar("Lien avec l'élève supprimé avec succès", {
  //           variant: 'success',
  //         });
  //         // Mettez à jour la liste des étudiants liés après la suppression
  //         const updatedLinkedStudents = linkedStudents.filter((student) => student.id !== studentId);
  //         setLinkedStudents(updatedLinkedStudents);
  //       } else {
  //         enqueueSnackbar("Une erreur s'est produite lors de la suppression du lien avec l'élève", {
  //           variant: 'error',
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Une erreur s'est produite lors de la suppression du lien avec l'élève :", error);
  //       enqueueSnackbar("Une erreur s'est produite lors de la suppression du lien avec l'élève", {
  //         variant: 'error',
  //       });
  //     }
  //   }
  // };

  React.useEffect(() => {
    const fetchLinkedStudents = async () => {
      try {
        if (user?.id) {
          const linkedStudentsData = await getLinkedStudentsToUser(user.id);
          setLinkedStudents(linkedStudentsData);
        }
      } catch (error) {
        console.error('Error fetching linked students:', error);
      }
    };
    fetchLinkedStudents();
  }, [getLinkedStudentsToUser, user?.id]);

  return (
    <div style={{ padding: '15px' }}>
      <h1>Enfant(s) rattaché(s) à votre compte</h1>
      <div style={{ marginTop: '1.5rem' }}>
        {linkedStudents.length === 0 && (
          <p className="text">
            Votre compte n’est pour l’instant relié à aucun enfant. Pour accéder aux échanges, il vous faut ajouter l’identifiant transmis par son
            professeur.
          </p>
        )}
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
          {linkedStudents
            .map((student) => (
              <span key={student.id} style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                <p style={{ flex: 1, marginRight: '10px' }}>Identifiant: {student.hashedCode}</p>
                <p style={{ flex: 1, marginRight: '10px' }}>
                  {student.firstname} {student.lastname}
                </p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DeleteButton
                    onDelete={() => {
                      if (user) {
                        deleteLinkedStudent(user.id, student.id);
                      }
                    }}
                    confirmLabel="Êtes-vous sûre de vouloir supprimer votre lien avec l'élève ?"
                    confirmTitle="Supprimer lien élève"
                    style={{ backgroundColor: bgPage, marginLeft: '0.5rem' }}
                  />
                </div>
              </span>
            ))
            .reverse()}
        </div>
      </div>
    </div>
  );
};
export default LinkChild;
