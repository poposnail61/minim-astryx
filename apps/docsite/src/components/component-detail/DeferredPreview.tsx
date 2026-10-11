// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import {Skeleton} from '@astryxdesign/core/Skeleton';

/** Load a below-the-fold example once it approaches the viewport; preserve edits afterwards. */
export function DeferredPreview({children}: {children: ReactNode}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ref.current) {return;}
    if (typeof IntersectionObserver === 'undefined') {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      {rootMargin: '200px'},
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref}>
      {ready ? children : <Skeleton width="100%" height={200} />}
    </div>
  );
}
