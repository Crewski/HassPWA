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

  setColsLand(){
    this.settings.setColsLand(this.colsLand);
  }

  get getEffect(){
    return this.settings.getLayout['effect'] || 'slide';
  }

  get getTileColor(){
    return this.settings.getTileColor;
  }

  setEffect(){
    const options = ["slide", "fade", "coverflow", "flip"]
    const bottomSheetRef = this.bottomSheet.open(ListBottomSheet, {
      data: { options: options },
    });
    bottomSheetRef.afterDismissed().subscribe((option) => {
      if(option){
        this.settings.setSwiperEffect(option);
      }
    });
  }

  setClimateDisplay(){
    this.settings.setClimateDisplay(this.showCurrent);
  }


  tryConnect() {
    this.settings.setUrl(this.url);
    let ha_url = 'https://' + this.url + '/auth/authorize?client_id=' + environment.app_url + '&redirect_uri=' + environment.app_url + '/home';
    let popup = window.open(ha_url, "authWindow");
    window.addEventListener('message', (code) => {
      window.removeEventListener('message', null)
      popup.close();
      this.http.getAuthToken(code.data);
    })
  }

  openPrimaryColor(){    
    const dialogRef = this.dialog.open(TileColorDialog, {
      data: this.settings.getLayout['primary_color'] || '#fff',
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.settings.setPrimaryColor(result);      
    });
  }

  openAccentColor(){    
    const dialogRef = this.dialog.open(TileColorDialog, {
      data: this.settings.getLayout['accent_color'] || '#fff',
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.settings.setAccentColor(result);      
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
  <div style="width: 250px; height: 250px"><div  id="pickerColor"></div></div>
  `,
})
export class TileColorDialog implements AfterViewInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public color: string,
    private dialogRef: MatDialogRef<TileColorDialog>
  ){}

  ngAfterViewInit(){
    const colorPicker = new iro.ColorPicker("#pickerColor", {
      // Set the size of the color picker
      width: 250,
      height: 250,
      color: this.color,
      layout: [
        {
          component: iro.ui.Wheel,
          options: {
            wheelLightness: false
          }
        },
      ],
    });

    colorPicker.on('input:end', (color) => {
        // this.dialogRef.close('rgb(' + [color.rgb.r, color.rgb.g, color.rgb.b].join(', ') + ')');
        this.dialogRef.close(color.hexString);
      
    });
  }

}
