// Copyright (c) Meta Platforms, Inc. and affiliates.
'use client';

import {VStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Text';
import {Section} from '@astryxdesign/core/Section';
import * as stylex from '@stylexjs/stylex';
import type {ComponentEntry} from '../../generated/componentRegistry';
import {useInteractiveState} from './useInteractiveState';
import {InteractivePreviewStage} from './InteractivePreview';
import {PlaygroundPropsTable} from './PlaygroundPropsTable';

const styles = stylex.create({
  previewStage: {
    position: 'sticky',
    top: 44,
    zIndex: 10,
    backgroundColor: 'var(--color-background-page)',
    backdropFilter: 'blur(16px)',
    maxHeight: {default: 400, '@media (max-width: 768px)': 250},
    overflow: 'auto',
    borderWidth: 'var(--border-width, 1px)',
    borderStyle: 'solid',
    borderColor: 'var(--color-border-emphasized)',
    borderRadius: 'var(--radius-container)',
  },
});

export default function PropertiesPanel({
  comp,
  active,
}: {
  comp: ComponentEntry;
  active: boolean;
}) {
  const {knobs, state, setProp, missingRequiredProps} = useInteractiveState(
    comp.name,
    comp.props,
    comp.playground,
  );
  // Preserve edits without leaving hidden previews or their portals mounted.
  if (!active) {return null;}
  return (
    <VStack gap={4}>
      <div {...stylex.props(styles.previewStage)}>
        <InteractivePreviewStage
          name={comp.name}
          state={state}
          knobs={knobs}
          playground={comp.playground}
          missingRequiredProps={missingRequiredProps}
          onPropChange={setProp}
          embedded
          canControlOpenState={
            comp.props.some(prop => prop.name === 'isOpen') &&
            comp.props.some(prop => prop.name === 'onOpenChange')
          }
        />
      </div>
      {comp.props.length > 0 && (
        <Section>
          <VStack gap={3}>
            <Heading level={3}>Props</Heading>
            <PlaygroundPropsTable
              props={comp.props}
              typeDefs={comp.typeDefs}
              knobs={knobs}
              state={state}
              onPropChange={setProp}
            />
          </VStack>
        </Section>
      )}
    </VStack>
  );
}
