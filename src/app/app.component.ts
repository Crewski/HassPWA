import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'HassPWA';
  dialogOpen: boolean = false

  constructor(private ws: WebsocketService, private dialog: MatDialog) {
    this.ws.initConnection();
    // document.body.addEventListener('touchstart', (e) => {
    //   this.dialogOpen = (dialog.openDialogs.length > 0);
    // }, false)
    // document.body.addEventListener('touchend', (e) => {
    //   if (!this.dialogOpen) e.preventDefault();
    // }, false)


  }
}
