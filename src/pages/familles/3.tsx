import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Box, Button } from '@mui/material';

import AccessControl from 'src/components/AccessControl';
import { Base } from 'src/components/Base';
import { Modal } from 'src/components/Modal';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ClassroomContext } from 'src/contexts/classroomContext';

const TextEditor = dynamic(() => import('src/components/activities/content/editors/TextEditor'), { ssr: false });

const ClassroomParamStep3 = () => {
  const router = useRouter();
  const onNext = () => {
    router.push('/familles/4');
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { students } = React.useContext(ClassroomContext);
  const [textValue, setTextValue] = useState(
    `
    <p>Bonjour, 
    </br>
    </br>
    Notre classe participe au projet 1Village, de l’association Par Le Monde, agréée par le ministère de l’éducation nationale français. 
    1Village est un projet de correspondances avec d’autres classes du monde, accessible de façon sécurisée sur un site internet.</p>
    
    <p>Si vous souhaitez accéder à ce site et observer les échanges en famille, il vous faut suivre cette démarche :</p>
    
    <ol>
    <li>Créer un compte sur https://1v.parlemonde.org/inscription, en renseignant une adresse email et un mot de passe.</li>
    <li>Confirmez votre adresse mail en cliquant sur le lien envoyé</li>
    <li>Connectez-vous sur https://1v.parlemonde.org/inscription et rattachez votre compte à l’identifiant unique <strong>%identifiant</strong></li>
    </ol>
    
    <p>Jusqu’à 5 personnes de votre famille peuvent créer un compte et le rattacher à l’identifiant unique de votre enfant.
    </br>
    </br>
    Bonne journée</p>
    `,
  );
  const [keywordPresence, setKeywordPresence] = useState(true);
  const textDefaultValue = `\nBonjour,\n\nNotre classe participe au projet 1Village, de l’association Par Le Monde, agréée par le ministère de l’éducation nationale français. 1Village est un projet de correspondances avec d’autres classes du monde, accessible de façon sécurisée sur un site internet.\n\nSi vous souhaitez accéder à ce site et observer les échanges en famille, il vous faut suivre cette démarche :\n\n\t1. Créer un compte sur https://1v.parlemonde.org/inscription, en renseignant une adresse email et un mot de passe.\n\t2. Confirmez votre adresse mail en cliquant sur le lien envoyé.\n\t3. Connectez-vous sur https://1v.parlemonde.org/famille et rattachez votre compte à l’identifiant unique <strong>%identifiant</strong>\n\nJusqu’à 5 personnes de votre famille peuvent créer un compte et le rattacher à l’identifiant unique de votre enfant.\n\nBonne journée\n\n`;

  useEffect(() => {
    const keywordRegex = new RegExp(/%identifiant/gm);
    if (textValue.match(keywordRegex)) {
      setKeywordPresence(true);
    } else {
      setKeywordPresence(false);
    }
  }, [textValue]);

  // --- PDF Name ---
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  };

  const timestamp = formatDate(new Date());
  const fileName = `${timestamp}_codes-enfants.pdf`;

  const onPrint = () => {
    const keywordRegex = new RegExp(/%identifiant/gm);
    const messagesWithId: string[] = [];
    let count = 0;

    if (keywordPresence) {
      students.forEach((student) => {
        messagesWithId.push(`<div>Élève : <strong>${student.firstname} ${student.lastname}</strong></div>`);
        messagesWithId.push(textValue.replaceAll(keywordRegex, '' + student.hashedCode + ''));
        messagesWithId.push(`<div>--------------------------------------------------------</div>`);
        count += 1;

        if (textValue.length > 700 && count === 2) {
          messagesWithId.push(`<p style="page-break-after: always;">&nbsp;</p>`);
          count = 0;
        } else if (textValue.length > 450 && count === 3) {
          messagesWithId.push(`<p style="page-break-after: always;">&nbsp;</p>`);
          count = 0;
        } else if (textValue.length > 200 && count === 4) {
          messagesWithId.push(`<p style="page-break-after: always;">&nbsp;</p>`);
          count = 0;
        } else if (count === 5) {
          messagesWithId.push(`<p style="page-break-after: always;">&nbsp;</p>`);
          count = 0;
        }
      });

      const printContentString = `<html><head><title>${fileName}</title><meta charset="UTF-8"></head><body>${messagesWithId.join(' ')}</body></html>`;

      // Open the content in a new window and trigger the print dialog
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContentString);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      } else {
        console.error('Unable to open a new window for printing.');
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <Base>
      <AccessControl featureName="id-family" redirectToWIP>
        <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
          <Steps
            steps={['Visibilité', 'Identifiants', 'Communication', 'Gestion']}
            urls={['/familles/1', '/familles/2', '/familles/3', '/familles/4']}
            activeStep={2}
          />
          <div className="width-900">
            <h1> Communiquer les identifiants aux familles</h1>
            <p className="text">
              Pour inviter les familles à se connecter, nous avons préparé un texte de présentation, que vous pouvez modifier, ou traduire dans une
              autre langue.
            </p>
            <p>
              Comme vous pourrez le constater, ce texte contient le mot-variable <span style={{ fontWeight: 'bold' }}>%identifiant</span> : vous devez
              le laisser sous ce format.{' '}
            </p>
            <p>
              Ainsi, vous pourrez générer autant de textes de présentation que d’élèves dans votre classe : à vous ensuite de les imprimer et les
              transmettre aux familles. Dans chaque texte, le mot-variable <span style={{ fontWeight: 'bold' }}>%identifiant</span> aura été remplacé
              automatiquement par l’identifiant unique généré à l’étape précédente.
            </p>
            <TextEditor
              inlineToolbar
              error={false || !keywordPresence}
              withBorder
              value={textDefaultValue}
              onChange={(value) => {
                setTextValue(value);
              }}
            />
            <Box marginTop="10px" textAlign="center">
              <Button id="myButton" onClick={onPrint} variant="outlined">
                Imprimer
              </Button>
            </Box>
            <Modal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              ariaDescribedBy={'activate-phase-desc'}
              ariaLabelledBy={'activate-phase'}
              noTitle
              confirmLabel="confirmer"
            >
              <div>Votre message doit contenir l&apos;identifiant enfant suivant: %identifiant</div>
            </Modal>
            <StepsButton prev="/familles/2" next={onNext} />
          </div>
        </div>
      </AccessControl>
    </Base>
  );
};

export default ClassroomParamStep3;
