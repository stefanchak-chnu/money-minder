import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DecimalPipe } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgApexchartsModule } from 'ng-apexcharts';
import { errorInterceptor } from './inteceptors/error.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { authInterceptor } from './inteceptors/token.interceptor';
import { HammerModule } from '@angular/platform-browser';
import 'hammerjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimations(),
    DecimalPipe,
    InfiniteScrollModule,
    NgApexchartsModule,
    AuthGuard,
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    importProvidersFrom(HammerModule),
  ],
};
