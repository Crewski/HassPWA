import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  url: string | null;
  cols: number;
  font: number | 100;

  constructor(
    private settings: SettingsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.url = this.settings.getConnection['url'];
    this.cols = this.settings.getLayout['cols'] || 3;
    
  }

  setCols(){
    this.settings.setCols(this.cols);
  }



  tryConnect(){
    this.settings.setUrl(this.url);

    let ha_url = 'https://' + this.url + '/auth/authorize?client_id=' + environment.app_url + '&redirect_uri=' + environment.app_url + '/home';
    window.open(ha_url,  "_blank");
  }

  resetRooms(){
    const dialogRef = this.dialog.open(SettingsDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settings.resetRooms();
      }
    });
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
