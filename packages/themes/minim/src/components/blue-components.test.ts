// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {minimBaseTokens, minimCompactTokens} from '../minimTokens.generated';
import {minimSurfaceComponents} from './surfaces';
import {minimNavigationComponents} from './navigation';
import {minimCollectionComponents} from './collections';

const components = {
  ...minimSurfaceComponents,
  ...minimNavigationComponents,
  ...minimCollectionComponents,
};

describe('blue-outline component theme contracts', () => {
  it.each([
    ['base', minimBaseTokens],
    ['compact', minimCompactTokens],
  ])('resolves every semantic token in %s', (_, tokens) => {
    const references = [
      ...JSON.stringify(components).matchAll(/var\((--minim-[a-z0-9-]+)/g),
    ].map(match => match[1]);
    for (const reference of references) {
      expect(tokens, reference).toHaveProperty(reference);
    }
  });

  it('keeps Card elevation and selection ring composition in core', () => {
    for (const key of ['card', 'clickable-card', 'selectable-card'] as const) {
      expect(JSON.stringify(components[key])).not.toContain('boxShadow');
    }
    expect(components.card.base.padding).toBe('var(--minim-spacing-300)');
    expect(components['clickable-card'].base['--astryx-card-padding']).toBe(
      'var(--minim-spacing-400)',
    );
  });

  it('uses distinct header/body typography and divider roles', () => {
    expect(components['table-cell'].base.fontSize).toBe(
      'var(--minim-typography-font-size-lg)',
    );
    expect(components['table-cell'].base.borderColor).toBe(
      'var(--minim-stroke-neutral-subtle)',
    );
    expect(components['table-header-cell'].base.borderColor).toBe(
      'var(--minim-stroke-neutral)',
    );
  });

  it('does not override animation, focus, hidden labels or disabled behavior', () => {
    for (const forbidden of [
      'animation:',
      'outline:none',
      'display:none',
      'pointerEvents',
    ]) {
      expect(JSON.stringify(components)).not.toContain(forbidden);
    }
  });

  it('keeps icon-only navigation padding square and size-specific', () => {
    expect(components['side-nav-item']['size:md+collapsed:true'].width).toBe(
      components['side-nav-item']['size:md'].height,
    );
    expect(
      components['top-nav-item']['size:md+isIconOnly:true'].paddingInline,
    ).toBe('var(--minim-spacing-150)');
    for (const tokens of [minimBaseTokens, minimCompactTokens]) {
      expect(tokens['--minim-spacing-150']).toBe(
        tokens['--minim-component-medium-padding-block'],
      );
      expect(tokens['--minim-spacing-200']).toBe(
        tokens['--minim-component-large-padding-block'],
      );
    }
    expect(components['top-nav-item']['size:md+isIconOnly:true'].width).toBe(
      components['top-nav-item']['size:md'].height,
    );
    expect(components['top-nav-item']['size:lg+isIconOnly:true'].width).toBe(
      components['top-nav-item']['size:lg'].height,
    );
    expect(components['tab-icon']['size:md'].width).toBe(
      components['tab-icon']['size:md'].height,
    );
  });
});
