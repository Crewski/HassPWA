import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import * as Hammer from 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsComponent, SettingsDialog } from './settings/settings.component';
import { HomeComponent, AddEntityDialog, EditRoomNameDialog } from './home/home.component';
import { LightTileComponent } from './tiles/light-tile/light-tile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})


@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    HomeComponent,
    LightTileComponent,
    SettingsDialog,
    AddEntityDialog,
    EditRoomNameDialog
  ],
  imports: [
    BrowserModule,
    HammerModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatGridListModule,
    MatButtonModule,
    MatSliderModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
