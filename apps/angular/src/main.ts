import { createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { createCustomElement } from '@angular/elements';

(async () => {
  const app = await createApplication(appConfig);

  const appElements = createCustomElement(AppComponent, {
    injector: app.injector,
  });
  customElements.define('app-angular', appElements);
})();

// bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
