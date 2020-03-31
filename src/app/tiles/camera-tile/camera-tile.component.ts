import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { EntityService } from 'src/app/services/entity.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SettingsService } from 'src/app/services/settings.service';
import { VgAPI } from '@hitrecord/videogular2';
import { element } from 'protractor';

@Component({
  selector: 'camera-tile',
  templateUrl: './camera-tile.component.html',
  styleUrls: ['./camera-tile.component.scss']
})
export class CameraTileComponent implements OnInit, OnDestroy {

  @Input() entity_id: string;
  cameraimg: SafeResourceUrl;
  cameraInterval: any;
  entity;

  constructor(
    private ws: WebsocketService,
    private entityService: EntityService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private settings: SettingsService
  ) { }

  ngOnInit(): void {
    this.entityService.getEntity(this.entity_id)
    this.ws.getThumbnail(this.entity_id).then(res => {
      if(res && res.result && res.result.content){
      this.cameraimg = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64," + res.result.content);
      } else {
        console.log(res);
      }
    })
    this.cameraInterval = setInterval(() => {
      this.ws.getThumbnail(this.entity_id).then(res => {
        if(res && res.result && res.result.content){
        this.cameraimg = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64," + res.result.content);
        } else {
          console.log(res);
        }
      })
    }, 10000)
  }

  async getStream(){
    let url = 'https://' + this.settings.getConnection['url'];

    url = url + await this.ws.getCameraStream(this.entity_id);
    const dialogRef = this.dialog.open(CameraStreamDialog, {
      // panelClass: 'full-width-dialog',
      data: url,
    });
  }

  ngOnDestroy(){
    if(this.cameraInterval){
      clearInterval(this.cameraInterval);
    }
  }

  get getFriendlyName(): string {
    if (this.entity && this.entity.attributes && this.entity.attributes.friendly_name) {
      return this.entity.attributes.friendly_name;
    } else {
      return this.entity_id.split('.')[1];
    }
  }

}

@Component({
  selector: 'app-settings',
  template: `
  <div  style="max-height: 100%" (swipedown)="close()">
  <vg-player (onPlayerReady)="onPlayerReady($event)">
  <video #media
  [vgMedia]="media"
  [vgHls]="data"
  id="video"
  controls
  >
</video>
</vg-player>
</div>
  `,
})
export class CameraStreamDialog {

 
  api: VgAPI;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<CameraStreamDialog>){
    console.log(this.data)
  }

  close(){
    this.dialogRef.close();
  }

  onPlayerReady(api: VgAPI) {
    try{
    console.log(api);
    this.api = api;
    api.play();
    
    window.alert(api.fsAPI.nativeFullscreen);
    // console.log(api.fsAPI.nativeFullscreen);
    // api.fsAPI.request(document.getElementsByName('media'));
      if (this.api.fsAPI.isAvailable && !this.api.fsAPI.isFullscreen) {
        
        // this.api.fsAPI.toggleFullscreen();
      }
    } catch (err) {
    }
    

  }

}


