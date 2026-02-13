import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { authInterceptor } from './app/interceptors/auth-interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { jwtInterceptor } from './app/interceptors/jwt-interceptor';
import { errorInterceptor } from './app/interceptors/error-interceptor';


bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, jwtInterceptor, errorInterceptor])
    ),
    provideRouter(routes),
  ],
}).catch(err => console.error(err));