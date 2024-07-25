import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import {
  addTokenInterceptor,
  apiPrefixInterceptor,
  removeUndefinedNullParamsInterceptor,
} from './shared/interceptors';
import { provideEnvironment } from './shared/providers';
import { ErrorHandlerService } from './shared/services';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        apiPrefixInterceptor,
        removeUndefinedNullParamsInterceptor,
        addTokenInterceptor,
      ])
    ),
    provideEnvironment(environment),
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
  ],
};
