// Swappable screenshot sources. Replace the files in /public/media with real
// app captures — the names and aspect ratios below are the only contract.
export type SliderItem = { src: string; alt: string };

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export const heroRiderScreen = '/media/app-hero-rider.png';
export const heroDriverScreen = '/media/app-hero-driver.png';

export const riderScreens: SliderItem[] = range(8).map((n) => ({ src: `/media/app-rider-${n}.png`, alt: `Lines rider app · screen ${n}` }));
export const driverScreens: SliderItem[] = range(8).map((n) => ({ src: `/media/app-driver-${n}.png`, alt: `Lines driver app · screen ${n}` }));
export const partnerScreens: SliderItem[] = range(8).map((n) => ({ src: `/media/app-partner-${n}.png`, alt: `Lines-trips portal · screen ${n}` }));
export const partnerStepImages: string[] = range(4).map((n) => `/media/step-partner-${n}.png`);
