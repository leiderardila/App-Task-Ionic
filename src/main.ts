import { inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { FeatureFlagService } from './app/core/services/feature-flag.service';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    // Espera (con tope de 3 s) a Remote Config para que el flag aplique desde el primer render.
    provideAppInitializer(() =>
      Promise.race([inject(FeatureFlagService).init(), new Promise((resolve) => setTimeout(resolve, 3000))]),
    ),
  ],
});
