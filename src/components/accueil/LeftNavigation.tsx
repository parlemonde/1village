import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Button from '@material-ui/core/Button';

import Map from 'src/svg/navigation/map.svg';

type NavigationProps = {
  map: boolean;
  tabs: Tab[];
};

interface Tab {
  label: string;
  path: string;
  icon: React.ReactNode;
  disabled: boolean;
  hasMascotte?: boolean;
}

export const LeftNavigation = ({ map, tabs }: NavigationProps) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = React.useState(-1);

  React.useEffect(() => {
    let index = tabs.findIndex((tab) => tab.path.split('/')[1] === router.pathname.split('/')[1]);
    if (router.pathname.split('/')[1] === 'activity') {
      index = 0;
    }
    setSelectedTab(index);
  }, [router.pathname, tabs]);

  return (
    <div className="navigation__content with-shadow">
      {map && (
        <div style={{ padding: '10% 15%', position: 'relative' }}>
          <Map width="100%" height="100%" />
          <div className="absolute-center">
            <Button className="navigation__button" color="primary" variant="contained">
              Voir sur la carte
            </Button>
          </div>
        </div>
      )}
      <div style={{ padding: '5% 5%', position: 'relative' }}>
        {tabs.map((tab, index) => (
          <Link key={tab.path} href={tab.path} passHref>
            <Button
              component="a"
              onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                event.preventDefault();
                router.push(tab.path);
              }}
              href={tab.path}
              color={tab?.hasMascotte ? 'secondary' : 'primary'}
              startIcon={tab.icon}
              variant={tab?.hasMascotte ? 'contained' : index === selectedTab ? 'contained' : 'outlined'}
              className="navigation__button full-width"
              style={{
                justifyContent: 'flex-start',
                paddingRight: '0.1rem',
                marginBottom: '0.4rem',
                width: index === selectedTab ? '112%' : '100%',
              }}
              disableElevation
              disabled={tab.disabled}
            >
              {tab.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};
