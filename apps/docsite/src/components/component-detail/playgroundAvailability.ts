// Copyright (c) Meta Platforms, Inc. and affiliates.
import type {ComponentEntry} from '../../generated/componentRegistry';

export function hasInteractivePlayground(
  comp: Pick<ComponentEntry, 'category' | 'params' | 'playground'>,
): boolean {
  return (
    comp.params == null &&
    (comp.category !== 'Utility' || comp.playground != null)
  );
}
