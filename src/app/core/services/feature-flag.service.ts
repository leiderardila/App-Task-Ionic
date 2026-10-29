import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { fetchAndActivate, getBoolean, getRemoteConfig } from 'firebase/remote-config';
import { environment } from '../../../environments/environment';

export type FeatureFlag = 'categories';

/** Valores por defecto: se usan si Firebase no responde o aún no está configurado. */
const DEFAULTS: Record<FeatureFlag, boolean> = { categories: true };

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private readonly flags = signal<Record<FeatureFlag, boolean>>({ ...DEFAULTS });

  /** Se invoca al arrancar la app; nunca lanza para no bloquear el inicio. */
  async init(): Promise<void> {
    try {
      const rc = getRemoteConfig(initializeApp(environment.firebase));
      rc.settings.minimumFetchIntervalMillis = environment.production ? 3_600_000 : 0;
      rc.defaultConfig = { ...DEFAULTS };
      await fetchAndActivate(rc);
      this.flags.set({ categories: getBoolean(rc, 'categories') });
    } catch (error) {
      console.warn('Remote Config no disponible, se usan valores por defecto', error);
    }
  }

  isEnabled(flag: FeatureFlag): boolean {
    return this.flags()[flag];
  }
}
