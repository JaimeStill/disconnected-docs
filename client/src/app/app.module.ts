import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';
import { ServicesModule } from './services.module';
import { AppComponent } from './app.component';
import { Components } from './components';
import { Routes, RouteComponents } from './routes';

@NgModule({
  declarations: [
    AppComponent,
    ...Components,
    ...RouteComponents
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    ServicesModule,
    RouterModule.forRoot(Routes, {
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
