// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {minimBaseTokens, minimCompactTokens} from './minimTokens.generated';
import {
  deriveMinimLeadingTokens,
  minimCompactTheme,
  minimGlobalSpacingMappings,
  minimGlobalTokenMappings,
  minimTheme,
} from './minimTheme';

const varPattern = /var\((--[a-z0-9-]+)(?:,[^)]+)?\)/g;

function unresolvedVariables(theme: typeof minimTheme): string[] {
  const available = new Set([
    ...Object.keys(theme.tokens),
    ...Object.keys(theme.localTokens ?? {}),
  ]);
  return Object.values({...theme.localTokens, ...theme.tokens}).flatMap(
    value =>
      typeof value === 'string'
        ? [...value.matchAll(varPattern)]
            .map(match => match[1])
            .filter(name => !available.has(name))
        : [],
  );
}

describe('Minim foundation themes', () => {
  it('keeps the reviewed global role map identical in both density modes', () => {
    expect(minimTheme.name).toBe('minim');
    expect(minimCompactTheme.name).toBe('minim-compact');
    expect(minimTheme.tokens).toMatchObject(minimGlobalTokenMappings);
    expect(minimCompactTheme.tokens).toMatchObject(minimGlobalTokenMappings);
    expect(minimTheme.components).toHaveProperty('checkbox-list-item');
    expect(minimCompactTheme.components).toHaveProperty(
      'segmented-control-item-label',
    );
  });

  it('uses the generated local map for each density mode', () => {
    expect(minimTheme.localTokens).toMatchObject(minimBaseTokens);
    expect(minimCompactTheme.localTokens).toMatchObject(minimCompactTokens);
    expect(minimTheme.localTokens?.['--minim-typography-font-size-md']).toBe(
      '0.9375rem',
    );
    expect(
      minimCompactTheme.localTokens?.['--minim-typography-font-size-md'],
    ).toBe('0.84375rem');
  });

  it.each([
    ['base', minimBaseTokens, minimTheme],
    ['compact', minimCompactTokens, minimCompactTheme],
  ] as const)(
    'maps every exact global spacing role in %s mode',
    (_mode, generated, theme) => {
      const expected = {
        '--spacing-0': '--minim-spacing-0',
        '--spacing-0-5': '--minim-spacing-50',
        '--spacing-1': '--minim-spacing-100',
        '--spacing-1-5': '--minim-spacing-150',
        '--spacing-2': '--minim-spacing-200',
        '--spacing-3': '--minim-spacing-300',
        '--spacing-4': '--minim-spacing-400',
        '--spacing-5': '--minim-spacing-500',
        '--spacing-8': '--minim-spacing-800',
        '--spacing-12': '--minim-spacing-1200',
      } as const;

      expect(theme.tokens).toMatchObject(minimGlobalSpacingMappings);
      for (const [role, local] of Object.entries(expected)) {
        expect(theme.tokens[role]).toBe(`var(${local})`);
        expect(theme.localTokens?.[local]).toBe(generated[local]);
      }
    },
  );

  it('retains upstream defaults for spacing roles with no exact Minim token', () => {
    for (const role of [
      '--spacing-6',
      '--spacing-7',
      '--spacing-9',
      '--spacing-10',
      '--spacing-11',
    ]) {
      expect(minimTheme.tokens).not.toHaveProperty(role);
      expect(minimCompactTheme.tokens).not.toHaveProperty(role);
    }
  });

  it.each([
    ['base', minimBaseTokens, minimTheme],
    ['compact', minimCompactTokens, minimCompactTheme],
  ] as const)(
    'derives unitless %s leading ratios that reconstruct source line heights',
    (_mode, generated, theme) => {
      const derived = deriveMinimLeadingTokens(generated);

      for (const [leadingToken, ratioText] of Object.entries(derived)) {
        expect(ratioText).toMatch(/^\d+(?:\.\d+)?$/);
        expect(Number.isFinite(Number(ratioText))).toBe(true);

        const size = leadingToken.replace('--minim-leading-', '');
        const fontSize = Number.parseFloat(
          generated[
            `--minim-typography-font-size-${size}` as keyof typeof generated
          ],
        );
        const lineHeight = Number.parseFloat(
          generated[
            `--minim-typography-line-height-${size}` as keyof typeof generated
          ],
        );
        expect(Number(ratioText) * fontSize).toBeCloseTo(lineHeight, 12);
        expect(theme.localTokens?.[leadingToken]).toBe(ratioText);
      }
    },
  );

  it('uses only derived unitless values for global semantic leading roles', () => {
    const leadingValues = Object.entries(minimTheme.tokens).filter(([name]) =>
      name.endsWith('-leading'),
    );
    expect(leadingValues.length).toBeGreaterThan(0);
    for (const [, value] of leadingValues) {
      expect(value).toMatch(
        /^var\(--minim-leading-(?:6xl|5xl|4xl|3xl|2xl|xl|lg|md|sm|xs)\)$/,
      );
    }
  });

  it('rejects malformed, non-finite and zero rem sources', () => {
    expect(() =>
      deriveMinimLeadingTokens({
        ...minimBaseTokens,
        '--minim-typography-font-size-md': '0rem',
      }),
    ).toThrow(/greater than zero/);
    expect(() =>
      deriveMinimLeadingTokens({
        ...minimBaseTokens,
        '--minim-typography-line-height-sm': 'calc(1rem)',
      }),
    ).toThrow(/positive finite rem/);
  });

  it('leaves no unresolved custom-property references in either theme', () => {
    expect(unresolvedVariables(minimTheme)).toEqual([]);
    expect(unresolvedVariables(minimCompactTheme)).toEqual([]);
  });
});
