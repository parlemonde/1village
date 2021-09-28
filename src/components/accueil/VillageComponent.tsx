import React from 'react';

import CardActionArea from '@material-ui/core/CardActionArea';
import Card from '@material-ui/core/Card';

import { KeepRatio } from 'src/components/KeepRatio';
import Acti1 from 'src/svg/activities/acti1.svg';
import Acti2 from 'src/svg/activities/acti2.svg';
import Acti3 from 'src/svg/activities/acti3.svg';
import Acti4 from 'src/svg/activities/acti4.svg';
import HourGlass from 'src/svg/hourglass.svg';

type ActionItemProps = {
  label: string;
  icon: React.ReactNode;
};
const ActionItem = ({ label, icon }: ActionItemProps) => {
  return (
    <div style={{ display: 'inline-block', width: '43%', margin: '2%' }}>
      <KeepRatio ratio={1}>
        <Card style={{ width: '100%', height: '100%' }}>
          <CardActionArea style={{ height: '100%' }}>
            <div className="flex-center" style={{ height: '75%', justifyContent: 'center' }}>
              {icon}
            </div>
            <span>{label}</span>
          </CardActionArea>
        </Card>
      </KeepRatio>
    </div>
  );
};

export const RightNavigation = () => {
  return (
    <div className="bg-secondary" style={{ borderRadius: '10px', overflow: 'hidden' }}>
      <div className="text-center">
        <HourGlass style={{ width: '60px', height: '60px', margin: '1rem' }} />
        <p style={{ margin: '0 2%' }}>La création du village idéal sera débloquée après la présentation des classes</p>
        <div style={{ margin: '1rem 0' }}>
          <ActionItem label="La chanson" icon={<Acti1 style={{ width: 'auto', height: '90%' }} />} />
          <ActionItem label="Les cartes" icon={<Acti2 style={{ width: 'auto', height: '90%' }} />} />
          <ActionItem label="La fresque" icon={<Acti3 style={{ width: 'auto', height: '90%' }} />} />
          <ActionItem label="La bibliothèque" icon={<Acti4 style={{ width: 'auto', height: '90%' }} />} />
        </div>
        <Card style={{ width: '88%', display: 'inline-block', borderRadius: '1rem', marginBottom: '0.8rem' }}>
          <CardActionArea style={{ padding: '0.5rem' }}>
            <span className="text text--primary text--bold text--small">Voir toutes les activités</span>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
};
