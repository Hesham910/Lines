'use client';

// Interactive Switzerland map: the national outline is drawn from real
// border coordinates (simplified), cities sit at their true lat/lon, and
// picking a city below (or on the map) lights up its region. A gentle
// dash flow and pulsing dots keep it alive without being noisy.
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { cities, tr, type Locale } from '@/lib/site';

// (lon, lat) along the border, clockwise from Geneva.
const OUTLINE: ReadonlyArray<readonly [number, number]> = [
  [6.14, 46.20], [6.20, 46.30], [6.15, 46.44], [6.24, 46.52], [6.40, 46.62], [6.50, 46.74],
  [6.60, 46.82], [6.85, 47.00], [6.95, 47.10], [7.00, 47.20], [7.30, 47.35], [7.45, 47.47],
  [7.59, 47.56], [7.70, 47.58], [7.85, 47.55], [8.05, 47.50], [8.15, 47.54], [8.25, 47.44],
  [8.35, 47.52], [8.45, 47.48], [8.47, 47.58], [8.60, 47.62], [8.63, 47.68], [8.72, 47.67],
  [8.78, 47.58], [8.90, 47.62], [9.00, 47.55], [9.15, 47.60], [9.30, 47.55], [9.35, 47.60],
  [9.40, 47.50], [9.45, 47.42], [9.55, 47.40], [9.60, 47.30], [9.55, 47.15], [9.50, 47.10],
  [9.47, 46.95], [9.55, 46.90], [9.65, 46.85], [9.75, 46.80], [9.85, 46.72], [9.95, 46.70],
  [10.15, 46.65], [10.10, 46.55], [10.00, 46.50], [9.90, 46.55], [9.80, 46.45], [9.70, 46.42],
  [9.55, 46.35], [9.45, 46.30], [9.30, 46.35], [9.20, 46.30], [9.05, 46.25], [9.00, 46.10],
  [9.05, 45.97], [9.03, 45.85], [8.92, 45.90], [8.80, 46.00], [8.70, 46.05], [8.60, 46.10],
  [8.48, 46.14], [8.42, 46.24], [8.35, 46.30], [8.20, 46.20], [8.10, 45.98], [8.00, 45.94],
  [7.90, 45.90], [7.75, 45.95], [7.60, 45.90], [7.45, 45.95], [7.30, 45.90], [7.05, 45.87],
  [7.00, 45.95], [6.90, 46.05], [6.80, 46.10], [6.70, 46.15], [6.60, 46.22], [6.50, 46.26],
  [6.35, 46.20], [6.25, 46.12],
];

// Irregular region blob shape (scaled per city so the highlight reads as
// an area, not just a dot).
const BLOB: ReadonlyArray<readonly [number, number]> = [
  [0, -56], [42, -32], [58, 8], [34, 48], [-10, 58], [-50, 26], [-46, -20],
];

const project = (lon: number, lat: number): [number, number] => [
  10 + ((lon - 5.95) / 4.55) * 680,
  10 + (47.75 - lat) * 225,
];

export function SwissMap({ locale, selected }: { locale: Locale; selected?: string }) {
  const [active, setActive] = useState<string | undefined>(selected);
  const toggle = (slug: string) => setActive((value) => (value === slug ? undefined : slug));

  const outlinePath = 'M' + OUTLINE.map(([lon, lat]) => {
    const [x, y] = project(lon, lat);
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' L ') + ' Z';

  return <div className="swiss-map-wrap">
    <svg viewBox="0 0 700 470" className="swiss-map-svg" role="group" aria-label={tr(locale, ['Map of Switzerland with launch cities', 'Karte der Schweiz mit Startstädten', 'Carte de la Suisse avec les villes de lancement'])}>
      <defs>
        <clipPath id="ch-clip"><path d={outlinePath} /></clipPath>
      </defs>
      <path d={outlinePath} className="ch-base" />
      {cities.map((city, index) => {
        const [cx, cy] = project(city.lon, city.lat);
        if (active !== city.slug) return null;
        const rotation = (index * 51) % 360;
        const region = 'M' + BLOB.map(([dx, dy]) => {
          const rad = (rotation * Math.PI) / 180;
          const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
          const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
          return `${(cx + rx * 1.15).toFixed(1)} ${(cy + ry * 1.15).toFixed(1)}`;
        }).join(' L ') + ' Z';
        return <g key={`region-${city.slug}`} className="ch-region" clipPath="url(#ch-clip)"><path d={region} /></g>;
      })}
      <path d={outlinePath} className="ch-outline" />
      <path d={outlinePath} className="ch-outline-flow" />
      {cities.map((city) => {
        const [x, y] = project(city.lon, city.lat);
        const on = active === city.slug;
        return <g key={city.slug} className={`ch-city ${on ? 'on' : ''}`} role="button" tabIndex={0}
          aria-pressed={on} aria-label={tr(locale, city.name)}
          onClick={() => toggle(city.slug)}
          onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(city.slug); } }}>
          <circle className="ch-hit" cx={x} cy={y} r="34" />
          <circle className="ch-dot" cx={x} cy={y} r={on ? 9 : 6} />
          <text className="ch-label" x={x + 14} y={y + 4}>{tr(locale, city.name)}</text>
        </g>;
      })}
    </svg>
    <ul className="swiss-chips">
      {cities.map((city) => <li key={city.slug}>
        <button type="button" aria-pressed={active === city.slug} onClick={() => toggle(city.slug)}>
          <MapPin size={13} aria-hidden="true" />{tr(locale, city.name)}
        </button>
      </li>)}
    </ul>
    <p className="swiss-hint mono">{tr(locale, ['Pick a city to light up its region', 'Wähle eine Stadt und ihre Region leuchtet auf', 'Choisissez une ville pour éclairer sa région'])}</p>
  </div>;
}
