'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ProductImage({ src, fallbackSrc = '/placeholder-product.svg', ...props }) {
  const [activeSrc, setActiveSrc] = useState(src || fallbackSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageProps = {
    ...props,
    loading: props.priority ? props.loading : props.loading || 'lazy',
  };

  useEffect(() => {
    setActiveSrc(src || fallbackSrc);
    setIsLoaded(false);
  }, [src, fallbackSrc]);

  return (
    <>
      {!isLoaded && (
        <span
          className={`animate-pulse bg-slate-200/80 dark:bg-slate-700/60 ${
            imageProps.fill ? 'absolute inset-0' : 'block h-full w-full'
          }`}
        />
      )}
      <Image
        {...imageProps}
        src={activeSrc || fallbackSrc}
        className={`${props.className || ''} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={(event) => {
          setIsLoaded(true);
          if (typeof props.onLoad === 'function') {
            props.onLoad(event);
          }
        }}
        onError={(event) => {
          setIsLoaded(false);
          if (activeSrc !== fallbackSrc) {
            setActiveSrc(fallbackSrc);
          }
          if (typeof props.onError === 'function') {
            props.onError(event);
          }
        }}
      />
    </>
  );
}
