// import SearchIcon from '@mui/icons-material/Search';

import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import AccessControl from './AccessControl';
//import { getClassroomOfStudent } from 'src/api/student/student.get';
// import { getLinkedStudentsToUser } from 'src/api/user/user.get';
//import { updateUser } from 'src/api/user/user.put';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { secondaryColor } from 'src/styles/variables.const';
import Logo from 'src/svg/logo.svg';
// import type { Student } from 'types/student.type';
import { UserType } from 'types/user.type';

export const Header = () => {
  const router = useRouter();
  const { user, logout } = React.useContext(UserContext);
  //const { user, logout, setUser, setSelectedStudent } = React.useContext(UserContext);
  //const { user, logout, setUser, selectedStudent, setSelectedStudent } = React.useContext(UserContext);
  const { village, showSelectVillageModal } = React.useContext(VillageContext);
  // const [isModalOpen, setIsModalOpen] = React.useState(false);
  //const [ setIsModalOpen] = React.useState(false);
  // const [linkedStudents, setLinkedStudents] = React.useState<Student[]>([]);
  //const [selectedStudentIndex] = React.useState(linkedStudents.length > 0 ? 0 : -1);
  //const [selectedStudentIndex, setSelectedStudentIndex] = React.useState(linkedStudents.length > 0 ? 0 : -1);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  //* NOTE: might be interesting to make a hook for this below
  const isPelico =
    (user !== null && user.type === UserType.MEDIATOR) ||
    (user !== null && user.type === UserType.ADMIN) ||
    (user !== null && user.type === UserType.SUPER_ADMIN);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (open) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const goToPage = (page: string) => {
    setAnchorEl(null);
    router.push(page);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // useEffect(() => {
  //   const fetchLinkedStudents = async () => {
  //     if (user?.id) {
  //       try {
  //         const students = await getLinkedStudentsToUser(user.id);
  //         setLinkedStudents(students);
  //       } catch (err) {
  //         console.error('Error fetching linked students:', err);
  //       }
  //     }
  //   };
  //   fetchLinkedStudents();
  // }, []);

  // const onSelectStudent = async () => {
  //   if (user) {
  //     setSelectedStudent(linkedStudents.find((linkedStudent) => linkedStudent.id === selectedStudentIndex) || null);
  //     try {
  //       const classroomOfStudent = await getClassroomOfStudent(linkedStudents[selectedStudentIndex].id);
  //       await updateUser(user?.id, { countryCode: classroomOfStudent?.country?.isoCode });
  //       setUser({ ...user, country: { isoCode: classroomOfStudent?.country?.isoCode, name: '' } });

  //       // updateUser(user?.id, {country:  });
  //     } catch (err) { }
  //   }
  //   setIsModalOpen(false);
  // };

  // const showSelectStudentModal = () => {
  //   setIsModalOpen(true);
  // };

  return (
    <header>
      <div className="header__container with-shadow">
        <Link href="/">
          <a style={{ display: 'flex', alignItems: 'center' }}>
            <Logo style={{ width: '40px', height: 'auto' }} />
            <h1 className="title" style={{ margin: '0 0 0 0.5rem' }}>
              1Village
            </h1>
          </a>
        </Link>
        {user && (
          <div className="header__user">
            {isPelico ? (
              <div style={{ border: `1px solid ${secondaryColor}`, borderRadius: '12px' }}>
                <span className="text text--small" style={{ margin: '0 0.6rem' }}>
                  {village ? village.name : 'Village non choisi !'}
                </span>
                <Button variant="contained" color="secondary" size="small" style={{ margin: '-1px -1px 0 0' }} onClick={showSelectVillageModal}>
                  {village ? 'Changer' : 'Choisir un village'}
                </Button>
              </div>
            ) : null}
            {user.type === UserType.ADMIN ||
              (user.type === UserType.SUPER_ADMIN ? (
                <Link href="/admin/villages" passHref>
                  <Button component="a" href="/admin/villages" variant="contained" color="primary" size="small" style={{ marginLeft: '1rem' }}>
                    {"Aller à l'interface Admin"}
                  </Button>
                </Link>
              ) : null)}
            <div>
              <IconButton
                style={{ width: '40px', height: '40px', margin: '0 0.2rem' }}
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
              >
                <SettingsIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => goToPage('/mon-compte')}>Mon compte</MenuItem>
                {user.type !== UserType.FAMILY && <MenuItem onClick={() => goToPage('/mes-videos')}>Mes vidéos</MenuItem>}
                <AccessControl featureName="id-family" key={user?.id || 'default'}>
                  {user.type === UserType.TEACHER ? <MenuItem onClick={() => goToPage('/familles/1')}>Mes familles</MenuItem> : null}{' '}
                </AccessControl>
                <MenuItem onClick={logout}>
                  <span className="text text--alert">Se déconnecter</span>
                </MenuItem>
              </Menu>
            </div>
          </div>
        )}
        {user && (
          <div className="header__user">
            {/* {user.type === UserType.FAMILY && (
             {user.type === UserType.FAMILY && linkedStudents?.length > 1 && (  
              <> */}
            {/* <div style={{ border: `1px solid ${secondaryColor}`, borderRadius: '12px' }}>
                  <span className="text text--small" style={{ margin: '0 0.6rem' }}>
                    {selectedStudent
                      ? `${selectedStudent.firstname} ${selectedStudent.lastname}`
                      : linkedStudents.length > 0
                      ? `${linkedStudents[0].firstname} ${linkedStudents[0].lastname}`
                      : 'Eleve non selectionne'}
                  </span>
                  <Button variant="contained" color="secondary" size="small" style={{ margin: '-1px -1px 0 0' }} onClick={showSelectStudentModal}>
                    {linkedStudents?.length > 0 ? 'Changer' : 'Choisir un élève'}
                  </Button>
                </div>
                <Modal
                  open={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onConfirm={onSelectStudent}
                  confirmLabel="Confirmer"
                  title="Sélectionnes un élève"
                  fullWidth
                  maxWidth="sm"
                  ariaLabelledBy={'select-student'}
                  ariaDescribedBy={'select-student-desc'}
                  cancelLabel="Annuler"
                >
                  <div className="modal__content">
                    {(linkedStudents || []).length === 0 ? (
                      <p>Aucun élève n est lié à votre compte !</p>
                    ) : (
                      <FormControl variant="outlined" className="full-width">
                        <InputLabel id="select-student">Elève</InputLabel>
                        <Select
                          labelId="select-student"
                          id="select-student-outlined"
                          value={selectedStudentIndex === -1 ? '' : selectedStudentIndex}
                          onChange={(event) => {
                            setSelectedStudentIndex(event.target.value as number);
                          }}
                          label="StudentLinked"
                        >
                          {(linkedStudents || []).map((student) => (
                            <MenuItem value={student.id} key={student.id}>
                              {student.firstname} {student.lastname}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </div>
              //   </Modal> */}
            {/* </> */}
            {/* )} */}
            {user.type === UserType.ADMIN ||
              (user.type === UserType.SUPER_ADMIN ? (
                <Link href="/admin/newportal/create" passHref>
                  <Button
                    component="a"
                    href="/admin/newportal/create"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginLeft: '1rem' }}
                  >
                    {'Aller à la nouvelle interface admin'}
                  </Button>
                </Link>
              ) : null)}
            {/* <div>
              <IconButton
                style={{ width: '40px', height: '40px', margin: '0 0.2rem' }}
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
              >
                <SettingsIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => goToPage('/mon-compte')}>Mon compte</MenuItem>
                {user.type !== UserType.FAMILY && <MenuItem onClick={() => goToPage('/mes-videos')}>Mes vidéos</MenuItem>}
                {user.type === UserType.TEACHER ? <MenuItem onClick={() => goToPage('/familles/1')}>Mes familles</MenuItem> : null}{' '}
                <MenuItem onClick={logout}>
                  <span className="text text--alert">Se déconnecter</span>
                </MenuItem>
              </Menu>
            </div> */}
          </div>
        )}
      </div>
    </header>
  );
};
