import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { EntityService } from 'src/app/services/entity.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

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
    private sanitizer: DomSanitizer
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

  getStream(){

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
