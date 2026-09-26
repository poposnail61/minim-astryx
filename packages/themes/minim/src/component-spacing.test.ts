// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {minimComponents} from './minimTheme';
import {minimBaseTokens, minimCompactTokens} from './minimTokens.generated';

describe('component spacing contract', () => {
  it('resolves spacing and component metrics in both modes without retired aliases', () => {
    const source = JSON.stringify(minimComponents);
    expect(source).not.toMatch(/--minim-(?:control|row)-/);
    const refs = [
      ...source.matchAll(/var\((--minim-(?:component|spacing)-[a-z0-9-]+)/g),
    ].map(m => m[1]);
    for (const tokens of [minimBaseTokens, minimCompactTokens]) {
      for (const ref of refs) {
        expect(tokens, ref).toHaveProperty(ref);
      }
    }
  });

  it('does not use vertical component recipes for horizontal padding or gaps', () => {
    for (const [component, variants] of Object.entries(minimComponents)) {
      for (const [variant, styles] of Object.entries(variants)) {
        for (const [property, value] of Object.entries(styles)) {
          if (
            !/^(paddingInline(?:Start|End)?|paddingLeft|paddingRight|gap|rowGap|columnGap)$/.test(
              property,
            )
          ) {
            continue;
          }
          expect(
            JSON.stringify(value),
            `${component}/${variant}/${property}`,
          ).not.toContain('--minim-component-');
        }
      }
    }
  });
});
