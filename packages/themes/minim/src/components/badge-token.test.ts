// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {minimBadgeTokenComponents} from './badge-token';
import {minimContentComponents} from './content';

describe('Minim badge-family spacing', () => {
  it('shares the responsive inline inset without adding vertical padding', () => {
    for (const component of [
      minimBadgeTokenComponents.badge,
      minimBadgeTokenComponents.token,
      minimContentComponents.citation,
      minimContentComponents.code,
    ]) {
      expect(component.base).toMatchObject({
        paddingInline: 'var(--minim-spacing-150)',
        paddingBlock: '0',
      });
    }
  });

  it('uses the parent-size inline height token and keeps the icon gap', () => {
    for (const component of [
      minimBadgeTokenComponents.badge,
      minimBadgeTokenComponents.token,
    ]) {
      expect(component.base.gap).toBe('var(--minim-spacing-100)');
      expect(component['size:lg'].height).toBe(
        'var(--minim-component-large-height-inline)',
      );
      expect(component['size:md'].height).toBe(
        'var(--minim-component-medium-height-inline)',
      );
    }
    expect(minimBadgeTokenComponents.badge['size:dot'].padding).toBe('0');
  });
});
