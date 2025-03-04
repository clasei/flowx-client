import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
// import { AuthInterceptorProvider } from './app/interceptors/auth.interceptors';


// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(withInterceptors([])),
//     provideZoneChangeDetection({ eventCoalescing: true }), 
//     provideRouter(routes), 
//     provideClientHydration(withEventReplay()),
//     provideHttpClient()
//   ]
// }).catch((err) => console.error(err));

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // standalone interceptors way
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay())
  ]
}).catch((err) => console.error(err));
