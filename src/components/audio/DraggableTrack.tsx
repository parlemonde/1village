import React from 'react';

import MicNoneIcon from '@mui/icons-material/MicNone';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import { useDragHandler } from 'src/hooks/useDragHandler';
import { clamp } from 'src/utils';

const SVG_WIDTH = 762;

type DraggableTrackProps = {
  verseRecordDuration: number;
  verseMixDuration: number;
  initialVerseStart?: number;
  onVerseStartChange: (newStart: number) => void;
  onChangeEnd: (newStart: number) => void;
  pauseAudios: () => void;
};

export const DraggableTrack = ({
  verseRecordDuration,
  verseMixDuration,
  initialVerseStart,
  onVerseStartChange,
  onChangeEnd,
  pauseAudios,
}: DraggableTrackProps) => {
  const SVGRef = React.useRef<SVGSVGElement | null>(null);
  const [VerseStart, setVerseStart] = React.useState(
    initialVerseStart || initialVerseStart === 0 ? initialVerseStart : (verseRecordDuration - verseMixDuration) / 2,
  );

  const leftCut = (VerseStart / verseRecordDuration) * SVG_WIDTH;
  const rightCut = ((VerseStart + verseMixDuration) / verseRecordDuration) * SVG_WIDTH;

  const SvgWidthRef = React.useRef(0);
  const initialClientXRef = React.useRef(0);
  const initialLeftCutRef = React.useRef(leftCut);

  const onDragStart = (event: MouseEvent) => {
    if (!SVGRef.current) {
      return false;
    }
    SvgWidthRef.current = SVGRef.current.getBoundingClientRect().width;
    initialClientXRef.current = event.clientX;
    initialLeftCutRef.current = leftCut;
    pauseAudios();
    return true;
  };

  const onDrag = (event: MouseEvent) => {
    const deltaX = ((event.clientX - initialClientXRef.current) * SVG_WIDTH) / SvgWidthRef.current;
    setVerseStart(clamp(((initialLeftCutRef.current + deltaX) / SVG_WIDTH) * verseRecordDuration, 0, verseRecordDuration - verseMixDuration));
    onVerseStartChange(
      Math.round(clamp(((initialLeftCutRef.current + deltaX) / SVG_WIDTH) * verseRecordDuration, 0, verseRecordDuration - verseMixDuration)),
    );
  };

  const onDragEnd = (event: MouseEvent) => {
    const deltaX = ((event.clientX - initialClientXRef.current) * SVG_WIDTH) / SvgWidthRef.current;
    const newVerseStart = Math.round(
      clamp(((initialLeftCutRef.current + deltaX) / SVG_WIDTH) * verseRecordDuration, 0, verseRecordDuration - verseMixDuration),
    );
    onChangeEnd(newVerseStart);
  };

  const { onMouseDown } = useDragHandler({
    onDrag,
    onDragStart,
    onDragEnd,
  });

  return (
    <svg
      ref={SVGRef}
      width="766"
      height="120"
      viewBox="0 0 800 120"
      style={{ width: '100%', height: '100%' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="14" width="766" height="94" rx="10" fill="#666666" />
      <rect x="2" y="16" width="762" height="90" rx="8" fill="#e6e6e6" />
      <g>
        <rect x="18" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="42" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="66" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="90" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="114" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="138" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="162" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="186" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="210" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="234" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="258" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="282" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="306" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="330" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="354" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="378" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="402" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="426" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="450" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="474" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="498" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="522" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="546" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="570" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="594" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="618" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="642" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="666" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="690" y="40.5" width="10" height="40" rx="5" fill="white" />
        <rect x="714" y="23" width="10" height="75" rx="5" fill="white" />
        <rect x="738" y="40.5" width="10" height="40" rx="5" fill="white" />
      </g>
      <g>
        <rect
          onMouseDown={onMouseDown}
          x={leftCut}
          y="16"
          width={rightCut - leftCut}
          height="90"
          rx="8"
          fill="#666666"
          opacity="0"
          style={{ cursor: 'grab' }}
        />

        <svg x={0} y="70" width="32px" fill="#666666" opacity="1">
          <MicNoneIcon sx={{ color: '#666666' }} />
        </svg>

        <svg x={leftCut + (rightCut - leftCut - 32) / 2} y="70" width="32px" fill="#666666" opacity="1">
          <MusicNoteIcon sx={{ color: '#666666' }} />
        </svg>

        <rect x="2" y="16" width={leftCut} height="90" rx="8" fill="#666666" opacity="0.5" />
        <rect x={rightCut} y="16" width={764 - rightCut} height="90" rx="8" fill="#666666" opacity="0.5" />
      </g>

      <rect x={leftCut - 6} width="8" height="120" rx="4" fill="#666666" />
      <rect x={rightCut - 2} width="8" height="120" rx="4" fill="#666666" />
    </svg>
  );
};