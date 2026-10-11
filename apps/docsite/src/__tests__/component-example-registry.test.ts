// Copyright (c) Meta Platforms, Inc. and affiliates.

import {expect, it} from 'vitest';
import {exampleRegistry} from '../generated/exampleRegistry';
import {componentExampleLoaders} from '../generated/componentExampleLoaders';

it('keeps all component examples and source code in the split registry', async () => {
  expect(Object.keys(componentExampleLoaders).sort()).toEqual(
    Object.keys(exampleRegistry).sort(),
  );
  for (const [name, load] of Object.entries(componentExampleLoaders)) {
    const {default: entries} = await load();
    const metadata = (items: typeof entries) =>
      items.map(({load: _load, ...entry}) => entry);
    expect(metadata(entries), name).toEqual(metadata(exampleRegistry[name]));
    expect(entries.every(entry => typeof entry.load === 'function')).toBe(true);
  }
});
