import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Button } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { ActivityContext } from 'src/contexts/activityContext';
import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

const QuestionSuccess = () => {
  const router = useRouter();
  const { activity } = React.useContext(ActivityContext);

  const content = React.useMemo(() => activity?.content?.filter((q) => q.value) ?? null, [activity]);
  const questionsCount = content?.length ?? 0;

  React.useEffect(() => {
    if (content === null) {
      router.push('/poser-une-question/1');
    }
  }, [router, content]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '1rem 1rem 1rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
          <p className="text">{questionsCount > 1 ? 'Vos questions ont bien été enregistrées !' : 'Votre question a bien été enregistrée !'}</p>
          <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
        </div>
        <div className="text-center">
          <Link href="/" passHref>
            <Button component="a" href="/" variant="outlined" color="primary">
              Retour à l’accueil
            </Button>
          </Link>
        </div>
      </div>
    </Base>
  );
};

export default QuestionSuccess;
