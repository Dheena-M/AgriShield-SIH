---
name: AgriShield
colors:
  surface: '#fef9ed'
  surface-dim: '#dedace'
  surface-bright: '#fef9ed'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3e7'
  surface-container: '#f2ede2'
  surface-container-high: '#ede8dc'
  surface-container-highest: '#e7e2d6'
  on-surface: '#1d1c15'
  on-surface-variant: '#424843'
  inverse-surface: '#323029'
  inverse-on-surface: '#f5f0e4'
  outline: '#727972'
  outline-variant: '#c2c8c1'
  surface-tint: '#446650'
  primary: '#042716'
  on-primary: '#ffffff'
  primary-container: '#1c3d2a'
  on-primary-container: '#84a88f'
  inverse-primary: '#aacfb5'
  secondary: '#1b6c3b'
  on-secondary: '#ffffff'
  secondary-container: '#a4f5b6'
  on-secondary-container: '#237240'
  tertiary: '#755b06'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a851'
  on-tertiary-container: '#503d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6ecd0'
  primary-fixed-dim: '#aacfb5'
  on-primary-fixed: '#002110'
  on-primary-fixed-variant: '#2d4e39'
  secondary-fixed: '#a4f5b6'
  secondary-fixed-dim: '#89d89c'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005228'
  tertiary-fixed: '#ffdf92'
  tertiary-fixed-dim: '#e6c369'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#fef9ed'
  on-background: '#1d1c15'
  surface-variant: '#e7e2d6'
typography:
  display:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  title-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Outfit
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  margin-tablet: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
This design system pairs grounded agricultural heritage with precision modern agronomy. Built specifically for mobile workflows under direct sunlight, field conditions, and single-handed gloved operation, the visual voice emphasizes quiet authority, natural vitality, and immediate utility. 

The aesthetic fuses organic tactile depth with structured high-contrast editorial clarity. Warm parchment backdrops eliminate harsh LCD glare in outdoor daylight, crisp paper layers organize telemetry and risk metrics, and deep botanical greens evoke lush canopy health. Interactions prioritize instant visual feedback, uncrowded tap geometry, and resilient readability across high-ambient-light farm environments.

## Colors
The palette balances field sunlight legibility with natural organic warmth:

- **Primary (`#1c3d2a`)**: Deep Forest Moss. The bedrock tone for high-contrast typography, primary call-to-actions, navigation bars, and critical state headers. Exceeds WCAG AAA contrast against cream paper backgrounds.
- **Secondary (`#2f7d4a`)**: Vibrant Crop Leaf Green. Used for active states, positive metric indicators, interactive switches, and secondary actionable components.
- **Tertiary (`#e7c46a`)**: Sun Harvest Gold. Highlights warnings, pending field approvals, soil dryness thresholds, and harvest readiness alerts.
- **Accent Sprout (`#b8e38a`)**: Fresh Sprout Lime. Reserved for pill badge fills, active telemetry graphs, and high-visibility status chips against dark forest containers.
- **Neutral Base (`#f4efe3`)**: Warm Natural Cream Parchment. Provides the universal canvas surface, reducing mobile glare under harsh open-sky lighting.
- **Surface Layer (`#fffdf8`)**: Crisp Card Paper. Elevated card containers, modal sheets, and data surfaces.
- **Structural Border (`#d7e3d4`)**: Crisp Leaf Stroke. Delivers subtle yet crisp visual containment without visual clutter.
- **Functional Semantics**: Danger Alert (`#b33a2b`) for critical frost/pest warnings and equipment halt; Success Status (`#1f7a45`) for verified irrigations, sensor syncs, and safe chemical applications.

## Typography
The typographic hierarchy leverages Newsreader to inject organic dignity, authority, and editorial craft into headlines, balanced by Outfit's geometric clarity for operational telemetry, indices, sensor metrics, and input labels.

- **Headlines & Editorial Titles**: Rendered in Newsreader. Used for crop stage titles, field identification numbers, inspection reports, and high-impact summaries.
- **Telemetry & Body Text**: Rendered in Outfit with open counters and generous x-height, engineered to maintain rapid scanning speed when viewed outdoors or at arm's length on tractor mounts.
- **Numbers & Data Points**: All field sensor metrics (moisture percentages, temperatures, chemical dosages) utilize tabular lining figures within Outfit for instantaneous comparison across lists and gauges.

## Layout & Spacing
A fluid 4-column layout governs mobile viewport widths (360px–480px), transitioning to an 8-column layout on tablets (600px–840px). 

- **Ergonomic Safe Zones**: All critical primary actions reside within the lower "thumb zone" (bottom 40% of the viewport) with a persistent bottom utility bar or floating action cluster.
- **Minimum Tap Envelope**: No interactive element, input target, or selector occupies less than 48px × 48px of tappable boundary, preventing mis-taps during rough tractor travel or when operating with wet/gloved hands.
- **Vertical Rhythm**: Layout modules separate by `space-md` (16px) or `space-lg` (24px) to present clear card segregation against the warm `#f4efe3` canvas.

## Elevation & Depth
Depth is modeled as stacked tactile layers of physical farm ledgers, paper logs, and tactile field tiles:

- **Surface Floor (`Level 0`)**: The natural unbleached cream base (`#f4efe3`). Flat, matte, zero shadow.
- **Resting Cards (`Level 1`)**: Crisp card paper (`#fffdf8`) bounded by a subtle `#d7e3d4` organic border and a soft ambient drop shadow: `0 2px 8px -2px rgba(28, 61, 42, 0.08)`. The shadow is tinted with the primary forest green rather than neutral black, imparting a lush, organic quality.
- **Interactive Focus & Floating Trays (`Level 2`)**: Active telemetry monitors, drawer sheets, and floating filter bars: `0 8px 24px -4px rgba(28, 61, 42, 0.14)`.
- **Modals & Overlays (`Level 3`)**: Critical weather warnings and chemical dilution emergency sheets: `0 16px 36px -6px rgba(28, 61, 42, 0.22)`.

## Shapes
Geometry utilizes medium rounded corners (`roundedness: 2`, 8px base) on cards, inputs, and layout containers to convey structural solidity, while pill treatments (fully circular radii) are strictly applied to status badges, chips, and primary floating call-to-actions to ensure rapid focal identification. 

Corners on interactive metric tiles use 16px (`rounded-lg`), providing soft, finger-friendly tactile enclosures that separate clean data tables from raw environmental noise.

## Components

### Buttons
- **Primary Button**: Solid Deep Forest Moss (`#1c3d2a`) background, Crisp Card Paper (`#fffdf8`) text in Outfit SemiBold, height 52px, full width or thumb-aligned pill radius. Hover/Active state shifts to `#2f7d4a`.
- **Secondary Button**: Outlined in 1.5px `#2f7d4a` over transparent or `#fffdf8` paper background with `#1c3d2a` text.
- **Alert / Action Button**: Solid Alert Danger (`#b33a2b`) background with white text for critical actions such as valve shutoffs or pest quarantine triggers.

### Chips & Pill Badges
- **Status Badges**: Fully rounded pills (`border-radius: 9999px`), 28px height, padding 4px 12px.
  - *Optimal Growth*: Sprout Lime background (`#b8e38a`) with Deep Forest Moss text (`#1c3d2a`).
  - *Risk Alert*: Soft gold wash (`rgba(231, 196, 106, 0.25)`) with `#8a6b18` text.
  - *Severe Warning*: Soft danger wash (`rgba(179, 58, 43, 0.15)`) with `#b33a2b` text.

### Cards & Field Telemetry Tiles
- Constructed from Crisp Card Paper (`#fffdf8`) with a 1px border of `#d7e3d4` and 16px rounded corners.
- Internal padding is 16px (`space-md`) on mobile, expandable to 20px on tablet.
- Sensor metric cards feature a top Newsreader title, an oversized Outfit bold numerical value (32px), and a sprout-tinted sparkline or status badge at the top-right.

### Form Inputs & Selectors
- Minimum touch container height of 52px with 12px border radius.
- Background set to `#fffdf8` with a 1.5px border of `#d7e3d4`. Focused inputs transition to a 2px `#2f7d4a` border with a 3px soft outer ring of `rgba(47, 125, 74, 0.15)`.
- High-contrast floating label in Outfit Medium (`#1c3d2a`).

### Checkboxes & Radio Buttons
- 24px × 24px structural box with 48px touch boundary padding.
- Unchecked: 2px border in `#2f7d4a` on `#fffdf8`.
- Checked: Solid `#2f7d4a` fill with a crisp white tick or inner pill dot.

### Lists & Activity Logs
- Separated by 1px dividers using `#d7e3d4`.
- Rows provide 56px minimum height with leading high-contrast agricultural icons (droplet, leaf, tractor, sun) encased in soft circular sprout or gold containers.