import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { API_BASE_URL } from './tokens';
import { JWT_INTERCEPTOR_PROVIDER } from './core/interceptors/jwt.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    JWT_INTERCEPTOR_PROVIDER,
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        return () => {
          try {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
          } catch (e) {
            // ignore
          }
        };
      },
      multi: true,
      deps: []
    },
    { provide: API_BASE_URL, useValue: 'http://localhost:3000' }
  ]
};
