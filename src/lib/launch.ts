import type { Audience } from './site';

export type AppAudience = Exclude<Audience,'partner'>;
export type Platform = 'google_play' | 'app_store';
export const platforms = ['google_play','app_store'] as const;
const toStore = (value: string | undefined, host: string) => {
  try { const url = new URL(value ?? ''); return url.protocol==='https:' && url.hostname===host ? url.href : ''; } catch { return ''; }
};
export const storeLinks: Record<AppAudience,Record<Platform,string>> = {
  rider:{google_play:toStore(process.env.NEXT_PUBLIC_RIDER_GOOGLE_PLAY_URL,'play.google.com'),app_store:toStore(process.env.NEXT_PUBLIC_RIDER_APP_STORE_URL,'apps.apple.com')},
  driver:{google_play:toStore(process.env.NEXT_PUBLIC_DRIVER_GOOGLE_PLAY_URL,'play.google.com'),app_store:toStore(process.env.NEXT_PUBLIC_DRIVER_APP_STORE_URL,'apps.apple.com')},
};
export const launchAt = Date.parse(process.env.NEXT_PUBLIC_LINES_LAUNCH_AT ?? '');
export const launchConfigured = Number.isFinite(launchAt) && Object.values(storeLinks).every((links)=>platforms.every((platform)=>Boolean(links[platform])));
export const isLive = (at: number) => launchConfigured && at >= launchAt;
