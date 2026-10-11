// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {useEffect, useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {VStack} from '@astryxdesign/core/Layout';
import {componentExampleLoaders} from '../../generated/componentExampleLoaders';
import type {ExampleEntry} from '../../generated/exampleRegistry';
import {ExampleBlock} from './ExampleBlock';

export function ComponentExamples({name}: {name: string}) {
  const [entries, setEntries] = useState<ExampleEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setEntries(null);
    setFailed(false);
    const load = componentExampleLoaders[name];
    if (!load) {return;}
    load().then(
      module => {
        if (active) {setEntries(module.default);}
      },
      () => {
        if (active) {setFailed(true);}
      },
    );
    return () => {
      active = false;
    };
  }, [name, attempt]);

  if (failed) {
    return (
      <Button
        label="Retry examples"
        variant="ghost"
        onClick={() => setAttempt(value => value + 1)}
      />
    );
  }
  if (!entries) {return <Skeleton width="100%" height={200} />;}
  return (
    <VStack gap={10}>
      {entries.map((entry, index) => (
        <ExampleBlock
          key={`${name}/${index}`}
          entry={entry}
          componentName={name}
        />
      ))}
    </VStack>
  );
}
