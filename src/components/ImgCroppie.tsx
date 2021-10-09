import 'croppie/croppie.css';
import Croppie from 'croppie';
import React, { forwardRef, memo, useEffect, useImperativeHandle } from 'react';

interface ImgCroppieProps {
  src: string;
  alt: string;
  imgWidth?: number;
  imgHeight?: number;
  type?: 'square' | 'circle';
}

export interface ImgCroppieRef {
  getBlob(): Promise<Blob>;
}

const ImgCroppieComponent: React.ForwardRefRenderFunction<ImgCroppieRef, ImgCroppieProps> = (
  { src, alt, imgWidth = 100, imgHeight = 100, type = 'square' }: ImgCroppieProps,
  ref: React.Ref<ImgCroppieRef>,
) => {
  const croppie = React.useRef<Croppie | null>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const timeoutRef = React.useRef<number>(null);
  const parentDiv = React.useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    async getBlob() {
      if (croppie.current === null) {
        return null;
      }
      return await croppie.current.result({
        type: 'blob',
        format: 'jpeg',
        circle: false,
      });
    },
  }));

  // init croppie
  useEffect(() => {
    const $image = imgRef.current;
    const $parent = parentDiv.current;

    if (!$parent || !$image) {
      return () => {};
    }

    if (croppie.current !== null) {
      croppie.current.destroy();
      croppie.current = null;
      $parent.innerHTML = '';
      $parent.appendChild($image);
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      croppie.current = new Croppie($image, {
        viewport: {
          width: imgWidth,
          height: imgHeight,
          type,
        },
      });
    }, 20);
    return () => {
      if (croppie.current !== null) {
        croppie.current.destroy();
        croppie.current = null;
        $parent.innerHTML = '';
        $parent.appendChild($image);
      }
    };
  }, [imgHeight, imgWidth, type, src]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} ref={parentDiv}>
      {
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} src={src} ref={imgRef} />
      }
    </div>
  );
};

export const ImgCroppie = memo(forwardRef(ImgCroppieComponent));
