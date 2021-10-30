import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Button } from '@mui/material';

import { KeepRatio } from 'src/components/KeepRatio';
import { useResizeObserver } from 'src/hooks/useResizeObserver';
import { bgPage } from 'src/styles/variables.const';

interface SuggestionCarouselProps {
  suggestions: Array<{
    imageUrl?: string;
    icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    href: string;
    title: string;
    text: string;
    button: string;
    disabled?: boolean;
  }>;
  style?: React.CSSProperties;
}

const SuggestionCarousel = ({ suggestions, style }: SuggestionCarouselProps) => {
  const [tab, setTab] = React.useState(0);
  const [textRef, dimensions] = useResizeObserver();
  const lineNumber = Math.max(1, Math.floor(dimensions.height / 16));
  const intervalRef = React.useRef<number | null>(null);

  const updateTab = React.useCallback(() => {
    setTab((t) => (t + 1) % suggestions.length);
  }, [suggestions]);
  React.useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(updateTab, 8000);
    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [updateTab]);
  const onChangeTab = (_event: React.ChangeEvent<HTMLElement>, value: number) => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    setTab(value);
  };

  const selectedSuggestion = suggestions[tab];

  return (
    <KeepRatio ratio={0.2} maxWidth="750px">
      <Card variant="outlined" className="with-light-shadow" style={{ ...style, height: '100%', borderRadius: '10px' }}>
        {selectedSuggestion && (
          <>
            <div
              style={{
                display: 'inline-block',
                verticalAlign: 'top',
                height: '100%',
                width: '32%',
                padding: '8px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: bgPage,
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  padding: '10px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {selectedSuggestion.icon ? (
                  <>
                    {<selectedSuggestion.icon style={{ width: '3rem', height: '3rem' }} />}
                    <span className="text text--bold" style={{ marginTop: '1rem' }}>
                      {selectedSuggestion.title}
                    </span>
                  </>
                ) : selectedSuggestion.imageUrl ? (
                  <Image layout="fill" objectFit="contain" src={selectedSuggestion.imageUrl} />
                ) : null}
              </div>
            </div>
            <div
              style={{
                display: 'inline-flex',
                verticalAlign: 'top',
                width: '68%',
                textAlign: 'left',
                height: '100%',
                minHeight: 0,
                minWidth: 0,
                flexDirection: 'column',
                padding: '8px 8px 8px 0',
              }}
            >
              <h3 style={{ flexShrink: 0, marginBottom: '0.3rem' }}>{selectedSuggestion?.title || ''}</h3>
              <div ref={textRef} style={{ flexShrink: 1, height: '100%', overflow: 'hidden' }}>
                <div className="text text--small multine-with-ellipsis" style={{ maxHeight: `${lineNumber}rem` }}>
                  {selectedSuggestion?.text || ''}
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', marginTop: '0.2rem', minHeight: 0 }}>
                <div style={{ flex: 1, flexShrink: 1, minWidth: 0 }}>
                  <Tabs
                    value={tab}
                    onChange={onChangeTab}
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="suggestion tabs"
                    style={{ minHeight: 0 }}
                  >
                    {suggestions.map((s) => (
                      <Tab
                        key={s.button}
                        label={
                          <span style={{ margin: 'auto', maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {s.button}
                          </span>
                        }
                        sx={{
                          minWidth: 0,
                          flex: 1,
                          fontSize: '0.95rem',
                          textTransform: 'unset',
                          padding: '0 12px 3px 12px',
                          minHeight: 'unset',
                        }}
                      />
                    ))}
                  </Tabs>
                </div>
                <Link href={selectedSuggestion.href} passHref>
                  <Button
                    component="a"
                    href={selectedSuggestion.href}
                    variant="outlined"
                    color="primary"
                    size="small"
                    style={{ marginLeft: '16px', flexShrink: 0 }}
                    disabled={selectedSuggestion.disabled}
                  >
                    {"C'est parti !"}
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </Card>
    </KeepRatio>
  );
};

export default SuggestionCarousel;
