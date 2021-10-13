import Link from 'next/link';
import React, { useEffect } from 'react';

import Switch from '@material-ui/core/Switch';

import { Flag } from 'src/components/Flag';
import { Modal } from 'src/components/Modal';
import { LeftNavigation } from 'src/components/accueil/LeftNavigation';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useVillageRequests } from 'src/services/useVillages';
import MysteryFlag from 'src/svg/mystery-flag.svg';
import FreeContentIcon from 'src/svg/navigation/free-content-icon.svg';
import GameIcon from 'src/svg/navigation/game-icon.svg';
import HomeIcon from 'src/svg/navigation/home-icon.svg';
import IndiceIcon from 'src/svg/navigation/indice-culturel.svg';
import KeyIcon from 'src/svg/navigation/key-icon.svg';
import QuestionIcon from 'src/svg/navigation/question-icon.svg';
import SymbolIcon from 'src/svg/navigation/symbol-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import { UserType } from 'types/user.type';

interface Tab {
  label: string;
  path: string;
  icon: React.ReactNode;
  disabled: boolean;
}

export const Navigation = (): JSX.Element => {
  const { village, selectedPhase } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);
  const isModerateur = user !== null && user.type >= UserType.MEDIATOR;
  const { editVillage } = useVillageRequests();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [phase, setPhase] = React.useState(0);

  useEffect(() => setPhase(village?.activePhase), [village]);
  const allStep: Tab[] = [
    {
      label: 'Accueil',
      path: '/',
      icon: <HomeIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      disabled: false,
    },
    {
      label: 'Notre classe',
      path: '/ma-classe',
      icon: <UserIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      disabled: false,
    },
  ];
  isModerateur &&
    allStep.push({
      label: 'Publier un contenu libre',
      path: '/contenu-libre',
      icon: <FreeContentIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      disabled: false,
    });

  const stepOne: Tab[] = [
    {
      label: 'Présenter un indice culturel',
      path: '/indice-culturel',
      icon: <IndiceIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      disabled: false,
    },
    {
      label: 'Présenter un symbole',
      path: '/symbole',
      icon: <SymbolIcon style={{ fill: 'white' }} width="1.4rem" />,
      disabled: false,
    },
    {
      label: 'Poser une question',
      path: '/poser-une-question',
      icon: <QuestionIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      disabled: false,
    },
  ];

  const stepTwo: Tab[] = [
    {
      label: 'Lancer un défi',
      path: '/lancer-un-defi',
      icon: <TargetIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      disabled: !(selectedPhase <= phase),
    },
    {
      label: 'Créer un jeu',
      path: '/creer-un-jeu',
      icon: <GameIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      disabled: !(selectedPhase <= phase),
    },
    {
      label: 'Créer une énigme',
      path: '/creer-une-enigme',
      icon: <KeyIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      disabled: !(selectedPhase <= phase),
    },
    {
      label: 'Poser une question',
      path: '/poser-une-question',
      icon: <QuestionIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      disabled: !(selectedPhase <= phase),
    },
  ];

  const stepThree: Tab[] = [
    {
      label: 'Créer un jeu',
      path: '/creer-un-jeu',
      icon: <GameIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      disabled: !(selectedPhase <= phase),
    },
  ];

  const arrayNav = [allStep, stepOne, stepTwo, stepThree];

  return (
    <nav className="navigation">
      <div style={{ position: 'relative' }}>
        <div
          className="with-bot-left-shadow"
          style={{
            flex: 1,
            backgroundColor: 'white',
            height: '100%',
            borderRadius: '10px 10px 10px 10px',
            padding: '0.5rem 2rem 0.6rem 1rem',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            margin: '0rem 1rem 1.4rem 1rem',
          }}
        >
          <h2 style={{ marginRight: '1rem' }}>Village-monde </h2>
          {village &&
            village.countries.map((country: string) =>
              selectedPhase !== 1 ? (
                <Flag country={country}></Flag>
              ) : user.countryCode.toUpperCase() == country ? (
                <Flag country={country}></Flag>
              ) : (
                <MysteryFlag style={{ width: 'auto', height: '18', borderRadius: '2px' }} />
              ),
            )}
        </div>
        <LeftNavigation tabs={arrayNav[0]} map={false} />
        <div style={{ marginTop: '10%' }}></div>
        <LeftNavigation tabs={arrayNav[selectedPhase || 1]} map={false} />
        <div style={{ marginTop: '10%' }}></div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Link href="/cgu">
            <a className="text text--small">{"Conditions générales d'utilisation"}</a>
          </Link>
          {isModerateur && (
            <div style={{ marginTop: '1vw' }}>
              {phase >= selectedPhase ? 'Désactiver' : 'Activer'} la phase numéro {selectedPhase}
              <Switch
                checked={phase >= selectedPhase}
                onChange={() => setIsModalOpen(true)}
                value="checkedB"
                color="primary"
                disabled={selectedPhase < village?.activePhase || selectedPhase === 1}
              />
            </div>
          )}
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async () => {
          const result = await editVillage({
            id: village?.id,
            countries: village?.countries,
            name: village?.name,
            activePhase: phase >= selectedPhase ? phase - 1 : selectedPhase,
          });
          setIsModalOpen(false);
          if (result) setPhase(phase >= selectedPhase ? phase - 1 : selectedPhase);
        }}
        ariaDescribedBy={'activate-phase-desc'}
        ariaLabelledBy={'activate-phase'}
        title={`Êtes vous sûr de vouloir ${phase >= selectedPhase ? 'désactiver' : 'activer'} la phase numéro ${selectedPhase} ?`}
        cancelLabel="Annuler"
        confirmLabel="Confirmer"
        noCloseButton={true}
      />
    </nav>
  );
};
