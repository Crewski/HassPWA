import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PasscodeDialog } from '../modals/passcode-dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  url: string | null;
  cols: number;
  font: number | 100;
  showTab: boolean;

  constructor(
    private settings: SettingsService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.url = this.settings.getConnection['url'];
    this.cols = this.settings.getLayout['cols'] || 3;
    this.showTab = this.settings.getLayout['tabs'];
    console.log(this.settings.getLayout);
  }

  setCols() {
    this.settings.setCols(this.cols);
  }

  setTabs() {
    console.log("Change tab to " + this.showTab);
    this.settings.setTabs(this.showTab);
  }


  tryConnect() {
    this.settings.setUrl(this.url);

    let ha_url = 'https://' + this.url + '/auth/authorize?client_id=' + environment.app_url + '&redirect_uri=' + environment.app_url + '/home';
    window.open(ha_url, "_blank");
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
        data: 'Old Passcode'
      });
      dialogRef.afterClosed().subscribe(code => {
        if (code != this.settings.getLayout['passcode']) {
          window.alert("Wrong code");
          return;
        }
        const dialogRefNew = this.dialog.open(PasscodeDialog, {
          data: 'New Passocde'
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
