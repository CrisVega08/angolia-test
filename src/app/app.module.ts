import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AlgoliaModule } from './pages/algolia/algolia.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AlgoliaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
