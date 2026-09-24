// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {Spinner} from '@astryxdesign/core/Spinner';
import {Banner} from '@astryxdesign/core/Banner';
import {minimSurfaceComponents as surfaces} from './surfaces';
import {minimMenuSpinnerComponents as indicators} from './menu-spinner';
import {minimBadgeTokenComponents as chips} from './badge-token';

describe('Feedback Figma synchronization', () => {
  it('exposes radius, title, label, and ring paint targets without changing semantics', () => {
    expect(renderToStaticMarkup(<Skeleton radius={1} />)).toContain(
      'data-radius="1"',
    );
    const banner = renderToStaticMarkup(
      <Banner status="warning" title="Warning" description="Details" />,
    );
    expect(banner).toContain('astryx-banner-title');
    expect(banner).toContain('role="alert"');
    const spinner = renderToStaticMarkup(<Spinner size="lg" label="Loading" />);
    expect(spinner).toContain('astryx-spinner-label');
    expect(spinner).toContain('astryx-spinner-track');
    expect(spinner).toContain('role="status"');
  });

  it('uses the badge gap token and keeps skeleton paint unchanged', () => {
    expect(chips.badge.base.gap).toBe('var(--minim-spacing-100)');
    expect(chips.badge['size:lg'].gap).toBe('var(--minim-spacing-100)');
    expect(surfaces.skeleton.base.backgroundColor).toBe(
      'var(--minim-bg-neutral)',
    );
    expect(surfaces.skeleton['radius:0'].borderRadius).toBe(
      'var(--minim-radius-inner)',
    );
    expect(surfaces.skeleton['radius:1'].borderRadius).toBe(
      'var(--minim-radius-element-item)',
    );
    expect(surfaces.skeleton['radius:4'].borderRadius).toBe(
      'var(--minim-radius-overlay)',
    );
  });

  it('uses supporting typography and state-colored banner text and borders', () => {
    expect(surfaces['banner-title'].base.color).toBe('inherit');
    expect(surfaces['banner-title'].base.fontSize).toBe(
      'var(--minim-typography-font-size-sm)',
    );
    expect(surfaces['banner-description'].base.fontSize).toBe(
      'var(--minim-typography-font-size-xs)',
    );
    expect(surfaces['banner-content']['status:warning'].borderColor).toBe(
      'var(--minim-stroke-warning)',
    );
    expect(surfaces['progress-bar'].base['--text-body-size']).toBe(
      'var(--minim-typography-font-size-sm)',
    );
    expect(surfaces['status-dot']['variant:neutral'].backgroundColor).toBe(
      'var(--minim-fg-neutral)',
    );
  });

  it('matches the 20/22/36px ring silhouette and three-quarter sweep', () => {
    for (const [size, box] of [
      ['sm', '20px'],
      ['md', '20px'],
      ['lg', '22px'],
      ['xl', '36px'],
    ] as const) {
      expect(indicators.spinner[`size:${size}`]['--spinner-box-size']).toBe(
        box,
      );
      expect(indicators.spinner[`size:${size}`]['--spinner-arc-fraction']).toBe(
        '0.75',
      );
    }
    expect(indicators['spinner-track']['shade:onMedia'].strokeOpacity).toBe(
      '1',
    );
  });
});
