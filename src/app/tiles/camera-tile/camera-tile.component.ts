import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { EntityService } from 'src/app/services/entity.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SettingsService } from 'src/app/services/settings.service';
import * as Hls from 'hls.js';
import * as Hammer from 'hammerjs';
import { Platform } from '@angular/cdk/platform';

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
    private settings: SettingsService,
    private platform: Platform
  ) { }

  ngOnInit(): void {
    this.entityService.getEntity(this.entity_id)
    this.ws.getThumbnail(this.entity_id).then(res => {
      if (res && res.result && res.result.content) {
        this.cameraimg = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64," + res.result.content);
      } else {
        console.log(res);
      }
    })
    this.cameraInterval = setInterval(() => {
      this.ws.getThumbnail(this.entity_id).then(res => {
        if (res && res.result && res.result.content) {
          this.cameraimg = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64," + res.result.content);
        } else {
          console.log(res);
        }
      })
    }, 10000)
  }

  async getStream() {
    let url = 'https://' + this.settings.getConnection['url'];

    url = url + await this.ws.getCameraStream(this.entity_id);
    const dialogRef = this.dialog.open(CameraStreamDialog, {
      // panelClass: 'graph-dialog',
      data: url,
    });
  }

  ngOnDestroy() {
    if (this.cameraInterval) {
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
  <div id='dialog-cont' class='video-container'  style="max-height: 100%">
<video id='video' controls autoplay muted playsinline></video>
</div>
  `,
})
export class CameraStreamDialog implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CameraStreamDialog>) {
  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit() {

    let hammertime = new Hammer(document.getElementById('dialog-cont'));
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime.on('swipe', ev => {
      if (ev.deltaY > 0) this.dialogRef.close();
    });
    var video = <any> document.getElementById('video');
    if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(this.data);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();

        if (video.requestFullscreen) {
          video.requestFullscreen();
        }
        else if (video.mozRequestFullScreen) {
          video.mozRequestFullScreen();
        }
        else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
        else if (video.msRequestFullscreen) {
          video.msRequestFullscreen();
        }
      });
    }
    // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
    // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element through the `src` property.
    // This is using the built-in support of the plain video element, without using hls.js.
    // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
    // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      try {
        video.src = this.data;
        video.addEventListener('loadedmetadata', function () {
          video.play();
        });
      } catch (err) {
        window.alert(err)
      }
    }
    else {
      window.alert("Can't Play");
    }
  }






}


