import React from 'react';

import { useDragHandler } from 'src/hooks/useDragHandler';
import { clamp } from 'src/utils';

const SVG_WIDTH = 762;

type DraggableTrackProps = {
  trackDuration: number;
  coupletDuration: number;
  initialCoupletStart?: number;
  onCoupletStartChange: (newStart: number) => void;
  onChangeEnd: (newStart: number) => void;
};
export const DraggableTrack = ({ trackDuration, coupletDuration, initialCoupletStart, onCoupletStartChange, onChangeEnd }: DraggableTrackProps) => {
  const SVGRef = React.useRef<SVGSVGElement | null>(null);
  const [coupletStart, setCoupletStart] = React.useState(
    initialCoupletStart || initialCoupletStart === 0 ? initialCoupletStart : (trackDuration - coupletDuration) / 2,
  );

  const leftCut = (coupletStart / trackDuration) * SVG_WIDTH;
  const rightCut = ((coupletStart + coupletDuration) / trackDuration) * SVG_WIDTH;

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
    return true;
  };

  const onDrag = (event: MouseEvent) => {
    const deltaX = ((event.clientX - initialClientXRef.current) * SVG_WIDTH) / SvgWidthRef.current;
    setCoupletStart(clamp(((initialLeftCutRef.current + deltaX) / SVG_WIDTH) * trackDuration, 0, trackDuration - coupletDuration));
    onCoupletStartChange(Math.round(clamp(((initialLeftCutRef.current + deltaX) / SVG_WIDTH) * trackDuration, 0, trackDuration - coupletDuration)));
  };

  const onDragEnd = (event: MouseEvent) => {
    const deltaX = ((event.clientX - initialClientXRef.current) * SVG_WIDTH) / SvgWidthRef.current;
    const newCoupletStart = Math.round(clamp(((initialLeftCutRef.current + deltaX) / SVG_WIDTH) * trackDuration, 0, trackDuration - coupletDuration));
    onChangeEnd(newCoupletStart);
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
      viewBox="0 0 766 120"
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

        <svg x={leftCut - 23} y="-30" width={leftCut} fill="#666666" opacity="1">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.8519 20.0374C12.142 21.6828 8.5109 19.934 8.1358 16.6337C7.44326 10.7397 16.405 9.58703 17.1735 15.5614C17.2362 16.1114 17.218 16.7374 17.048 17.2026L20.4953 19.8861L31.2688 12.9114L36.1742 13.9136L23.4869 22.0866L35.3675 31.1211L30.4172 31.6841L20.2941 24.1883L16.864 26.3612C17.4002 29.5096 14.5782 32.3262 11.466 31.6103C5.62587 30.4247 7.37116 21.468 13.2871 22.7341C13.8326 22.8282 14.3737 23.0786 14.8342 23.4052L17.3073 21.8314L14.8525 20.0379L14.8519 20.0374ZM14.5559 27.6261C15.1107 24.6657 10.751 23.7575 10.1201 26.6372C9.48483 29.6735 13.925 30.5058 14.5559 27.6261ZM14.973 15.8118C14.5889 12.8245 10.0276 13.4769 10.3358 16.3837C10.8005 19.2949 15.2812 18.7187 14.973 15.8118Z"
            fill="#666666"
          />
        </svg>

        <rect x="2" y="16" width={leftCut} height="90" rx="8" fill="#666666" opacity="0.5" />

        <svg x={rightCut - 19} y="-30" width={764 - rightCut} fill="#666666" opacity="1">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.8519 20.0374C12.142 21.6828 8.5109 19.934 8.1358 16.6337C7.44326 10.7397 16.405 9.58703 17.1735 15.5614C17.2362 16.1114 17.218 16.7374 17.048 17.2026L20.4953 19.8861L31.2688 12.9114L36.1742 13.9136L23.4869 22.0866L35.3675 31.1211L30.4172 31.6841L20.2941 24.1883L16.864 26.3612C17.4002 29.5096 14.5782 32.3262 11.466 31.6103C5.62587 30.4247 7.37116 21.468 13.2871 22.7341C13.8326 22.8282 14.3737 23.0786 14.8342 23.4052L17.3073 21.8314L14.8525 20.0379L14.8519 20.0374ZM14.5559 27.6261C15.1107 24.6657 10.751 23.7575 10.1201 26.6372C9.48483 29.6735 13.925 30.5058 14.5559 27.6261ZM14.973 15.8118C14.5889 12.8245 10.0276 13.4769 10.3358 16.3837C10.8005 19.2949 15.2812 18.7187 14.973 15.8118Z"
            fill="#666666"
          />
        </svg>

        <rect x={rightCut} y="16" width={764 - rightCut} height="90" rx="8" fill="#666666" opacity="0.5" />
      </g>

      <rect x={leftCut - 6} width="8" height="120" rx="4" fill="#666666" />
      <rect x={rightCut - 2} width="8" height="120" rx="4" fill="#666666" />
    </svg>
  );
};
