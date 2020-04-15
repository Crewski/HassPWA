import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PasscodeDialog } from '../modals/passcode-dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ListBottomSheet } from '../modals/listbottomsheet';
import iro from '@jaames/iro';
import { HttpService } from '../services/http.service';
import { MaterialCssVarsService } from 'angular-material-css-vars';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  url: string | null;
  cols: number;
  colsLand: number;
  font: number | 100;
  showTab: boolean;
  showCurrent: boolean;

  constructor(
    private settings: SettingsService,
    private dialog: MatDialog,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private http: HttpService,
  ) { }

  ngOnInit(): void {
    this.url = this.settings.getConnection['url'];
    this.cols = this.settings.getLayout['cols'] || 3;
    this.colsLand = this.settings.getLayout['cols_land'] || 6;
    this.showTab = this.settings.getLayout['tabs'];
    this.showCurrent = this.settings.getTiles['show_current'];
  }

  setCols() {
    this.settings.setCols(this.cols);
  }

  setColsLand() {
    this.settings.setColsLand(this.colsLand);
  }

  get getEffect() {
    return this.settings.getLayout['effect'] || 'slide';
  }

  get getTileColor() {
    return this.settings.getTileColor;
  }

  setEffect() {
    const options = ["slide", "fade", "coverflow", "flip"]
    const bottomSheetRef = this.bottomSheet.open(ListBottomSheet, {
      data: { options: options },
    });
    bottomSheetRef.afterDismissed().subscribe((option) => {
      if (option) {
        this.settings.setSwiperEffect(option);
      }
    });
  }

  setClimateDisplay() {
    this.settings.setClimateDisplay(this.showCurrent);
  }


  tryConnect() {
    this.settings.setUrl(this.url);
    let ha_url = 'https://' + this.url + '/auth/authorize?client_id=' + location.origin + '&redirect_uri=' + location.origin + '/home';
    let popup = window.open(ha_url, "authWindow");
    window.addEventListener('message', (code) => {
      window.removeEventListener('message', null)
      popup.close();
      this.http.getAuthToken(code.data);
    })
  }

  openPrimaryColor() {
    const oldColor = this.settings.getLayout['primary_color'] || '#fff';
    const dialogRef = this.dialog.open(TileColorDialog, {
      data: { color: oldColor, type: 'primary' },
    })
    dialogRef.afterClosed().subscribe(newColor => {
      if (newColor) {
        this.settings.setPrimaryColor(newColor);
      } else {
        this.settings.setPrimaryColor(oldColor)
      }
    });
  }

  openAccentColor() {
    const oldColor = this.settings.getLayout['accent_color'] || '#fff';
    const dialogRef = this.dialog.open(TileColorDialog, {
      data: { color: oldColor, type: 'accent' },
    })
    dialogRef.afterClosed().subscribe(newColor => {
      if (newColor) {
        this.settings.setAccentColor(newColor);
      } else {
        this.settings.setAccentColor(oldColor)
      }
    });
  }

  resetRooms() {
    const dialogRef = this.dialog.open(SettingsDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settings.resetRooms();
      }
    });
  }

  editRooms() {
    this.settings.setEditing(true);
    this.router.navigate(['/home']);
  }

  setPasscode() {
    if (this.settings.getLayout['passcode']) {

      const dialogRef = this.dialog.open(PasscodeDialog, {
        data: 'Old Passcode',
        panelClass: 'full-width-dialog',
      });
      dialogRef.afterClosed().subscribe(code => {
        if (code != this.settings.getLayout['passcode']) {
          window.alert("Wrong code");
          return;
        }
        const dialogRefNew = this.dialog.open(PasscodeDialog, {
          data: 'New Passocde',
          panelClass: 'full-width-dialog',
        })
        dialogRefNew.afterClosed().subscribe(newcode => {
          if (newcode) this.settings.setPasscode(newcode);
        })
      })
    } else {

      const dialogRefNew = this.dialog.open(PasscodeDialog, {
        data: 'New Passocde'
      })
      dialogRefNew.afterClosed().subscribe(newcode => {
        if (newcode) this.settings.setPasscode(newcode);
      })
    }
  }

}


@Component({
  selector: 'app-settings',
  template: `
  <h1 mat-dialog-title>Reset Rooms</h1>
    <div mat-dialog-content>
    <p>Are you sure you want to reset rooms?  This can not be undone.</p>
</div>
<div mat-dialog-actions>
  <button mat-button color="primary" [mat-dialog-close]="false">Cancel</button>
  <button mat-button color="warn" [mat-dialog-close]="true" cdkFocusInitial>Reset Rooms</button>
</div>
  `,
})
export class SettingsDialog {

}

@Component({

  template: `
  <div style="width: 250px; height: 300px">
  <button (tap)="setColor()" mat-flat-button [ngClass]="{'bg-500': data.type == 'primary', 'bga-500': data.type == 'accent'}">Press to set color</button>
    <div style="margin-top: 14px;" id="pickerColor"></div>
  </div>
  `,
})
export class TileColorDialog implements AfterViewInit {

  selectedColor: string = this.data.color;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TileColorDialog>,
    private materialCssVarsService: MaterialCssVarsService,
  ) { }

  ngAfterViewInit() {
    const colorPicker = new iro.ColorPicker("#pickerColor", {
      // Set the size of the color picker
      width: 250,
      height: 250,
      color: this.data.color,
      layout: [
        {
          component: iro.ui.Wheel,
          options: {
            wheelLightness: false
          }
        },
      ],
    });

    // colorPicker.on('input:end', (color) => {
    //     // this.dialogRef.close('rgb(' + [color.rgb.r, color.rgb.g, color.rgb.b].join(', ') + ')');
    //     this.dialogRef.close(color.hexString);

    // });
    colorPicker.on('input:change', (color) => {
      this.selectedColor = color.hexString;
      if (this.data.type == 'primary') {
        this.materialCssVarsService.setPrimaryColor(color.hexString);
      } else if (this.data.type == 'accent') {
        this.materialCssVarsService.setAccentColor(color.hexString);
      }
    });
  }

  setColor(){
    this.dialogRef.close(this.selectedColor);
  }

}
