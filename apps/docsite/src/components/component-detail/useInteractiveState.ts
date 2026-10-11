// Copyright (c) Meta Platforms, Inc. and affiliates.
'use client';

import {useCallback, useMemo, useState} from 'react';
import {
  buildInitialState,
  getMissingRequiredProps,
  pickPrimaryProps,
} from './interactiveState';
import type {
  PropDoc,
  PlaygroundConfig,
} from '../../generated/componentRegistry';

// Keep edited props when the lazily loaded Properties panel is temporarily hidden.
export function useInteractiveState(
  name: string,
  props: PropDoc[],
  playground?: PlaygroundConfig | null,
) {
  const knobs = useMemo(() => pickPrimaryProps(name, props), [name, props]);
  const initialState = useMemo(
    () => buildInitialState(knobs, playground),
    [knobs, playground],
  );
  const [state, setState] = useState<Record<string, unknown>>(initialState);
  const missingRequiredProps = useMemo(
    () => getMissingRequiredProps(knobs, initialState),
    [knobs, initialState],
  );
  const setProp = useCallback(
    (propName: string, value: unknown) =>
      setState(prev => ({...prev, [propName]: value})),
    [],
  );
  const reset = useCallback(() => setState(initialState), [initialState]);
  const isDirty = useMemo(
    () => Object.keys(state).some(k => !Object.is(state[k], initialState[k])),
    [state, initialState],
  );
  return {knobs, state, setProp, reset, isDirty, missingRequiredProps};
}
