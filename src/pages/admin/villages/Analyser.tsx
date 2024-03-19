import React from 'react';
import { Tab, Tabs } from '@mui/material';

const Analyser = () => {
  function samePageLinkNavigation(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 || // ignore everything but left-click
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return false;
    }
    return true;
  }

  interface LinkTabProps {
    label?: string;
    href?: string;
    selected?: boolean;
  }

  function LinkTab(props: LinkTabProps) {
    return (
      <Tab
        component="a"
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          if (samePageLinkNavigation(event)) {
            event.preventDefault();
          }
        }}
        aria-current={props.selected && 'page'}
        {...props}
      />
    );
  }
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (event.type !== 'click' || (event.type === 'click' && samePageLinkNavigation(event as React.MouseEvent<HTMLAnchorElement, MouseEvent>))) {
      setValue(newValue);
    }
  };

  const renderTitle = () => {
    return (
      <>
        <Tabs value={value} onChange={handleChange} aria-label="nav tabs example" role="navigation">
          <LinkTab label="1Village" href="/" />
          <LinkTab label="Pays" href="/admin/dashboard-statistics/pays" />
          <LinkTab label="Village-monde" href="/spam" />
          <LinkTab label="Classe" href="/spam" />
          <LinkTab label="Données" href="/spam" />
        </Tabs>
      </>
    );
  };

  return <>{renderTitle()}</>;
};

export default Analyser;
