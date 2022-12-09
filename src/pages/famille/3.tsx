import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Button } from '@mui/material';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { BackButton } from 'src/components/buttons/BackButton';

const TextEditor = dynamic(() => import('src/components/activities/content/editors/TextEditor'), { ssr: false });

const Communication = () => {
  const router = useRouter();
  const onNext = () => {
    router.push('/contenu-libre/2');
  };

  const [textValue, setTextValue] = useState(
    'Bonjour,\n\nNotre classe participe au projet 1Village, de l’association Par Le Monde, agréée par le ministère de l’éducation nationale français.\n1Village est un projet de correspondances avec d’autres classes du monde, accessible de façon sécurisée sur un site internet.\n\nSi vous souhaitez accéder à ce site et observer les échanges en famille, il vous faut suivre cette démarche :\n\n1. Créer un compte sur https://1v.parlemonde.org/famille, en renseignant une adresse email et un mot de passe.\n2. Confirmez votre adresse mail en cliquant sur le lien envoyé.\n3. Connectez-vous sur https://1v.parlemonde.org/famille et rattachez votre compte à l’identifiant unique %identifiant%\nJusqu’à 5 personnes de votre famille peuvent créer un compte et le rattacher à l’identifiant unique de votre enfant.\nBonne journée',
  );
  const [keywordPresence, setKeywordPresence] = useState(true);

  const checkForStudentCode = (customText: string) => {
    const codeString = '%identifiant%';
    if (customText.split(/\s+|\./).filter((word) => word === codeString).length === 1) {
      setKeywordPresence(true);
    } else {
      setKeywordPresence(false);
    }
  };

  useEffect(() => {
    checkForStudentCode(textValue);
  }, [textValue]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/contenu-libre" />
        <Steps
          steps={['Visibilité', 'Identifiants', 'Communication', 'Gestion']}
          urls={['/famille/1', '/famille/2', '/famille/3', '/famille/4']}
          activeStep={2}
        />
        <div className="width-900">
          <h1>Ecrivez le contenu de votre publication</h1>
          <p className="text">
            Communiquer les identifiants aux familles Pour inviter les familles à se connecter, nous avons préparé un texte de présentation, que vous
            pouvez modifier, ou traduire dans une autre langue.
          </p>
          <p>
            Comme vous pourrez le constater, ce texte contient le mot-variable <span style={{ fontWeight: 'bold' }}>%identifiant%</span> : vous devez
            le laisser sous ce format.{' '}
          </p>
          <p>
            Ainsi, vous pourrez générer autant de textes de présentation que d’élèves dans votre classe : à vous ensuite de les imprimer et les
            transmettre aux familles. Dans chaque texte, le mot-variable %identifiant% aura été remplacé automatiquement par l’identifiant unique
            généré à l’étape précédente.
          </p>
          <TextEditor inlineToolbar withBorder value={textValue} onChange={(value) => setTextValue(value)} />
          <Button>Télécharger au format PDF</Button>
          <Button
            disabled={keywordPresence}
            onClick={() => {
              console.log('si');
            }}
          >
            Imprimer
          </Button>
          <StepsButton prev="/famille/2" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default Communication;
