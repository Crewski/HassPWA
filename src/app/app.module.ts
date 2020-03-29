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
import {MatTabsModule, MAT_TABS_CONFIG} from '@angular/material/tabs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsComponent, SettingsDialog } from './settings/settings.component';
import { HomeComponent, AddEntityDialog, EditRoomNameDialog } from './home/home.component';
import { LightTileComponent } from './tiles/light-tile/light-tile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralTileComponent, InputSelectBottomSheet } from './tiles/general-tile/general-tile.component';
import { SpacedTextPipe } from './pipes/spaced-text.pipe';
import { CameraTileComponent } from './tiles/camera-tile/camera-tile.component';


@Injectable({
  providedIn: 'root'
})
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
      // pan: {
      //     direction: 6
      // },
      pinch: {
          enable: false
      },
      rotate: {
          enable: false
      }
  };
}


@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    HomeComponent,
    LightTileComponent,
    SettingsDialog,
    AddEntityDialog,
    EditRoomNameDialog,
    GeneralTileComponent,
    SpacedTextPipe,
    CameraTileComponent,
    InputSelectBottomSheet
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatListModule
  ],
  entryComponents: [
    InputSelectBottomSheet
  ],
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig},
  { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '150ms'}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
