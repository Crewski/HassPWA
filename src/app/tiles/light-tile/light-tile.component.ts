import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'light-tile',
  templateUrl: './light-tile.component.html',
  styleUrls: ['./light-tile.component.scss']
})
export class LightTileComponent implements OnInit {

  @Input() entity_id: string;
  entity: any = {};
  active: boolean = false;
  iconColor: string = 'rgb(255,0,0)';

  pressEvent = false;
  waitingChange: boolean = false;

  constructor(
    private entityService: EntityService,
    private websocketService: WebsocketService,    
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.setupEntity();
  }

  async setupEntity(){
    this.entity = await this.entityService.getEntity(this.entity_id);
    this.processEntity();
    this.entityService.entity_change.subscribe(data => {      
      if(data && data.entity_id == this.entity_id) {
        this.entity = data;
        this.processEntity();
      }
    })
  }

  processEntity(){
    if (!this.entity.attributes['icon']) {
      this.entity.attributes['icon'] = "mdi:lightbulb";
    }
    this.setActive();
    this.waitingChange = false;
    this.cd.detectChanges();
  }

  setActive() {  
    console.log(this.entity.state);
    if ((this.entity.state).toLowerCase() == 'on') {
      this.active = true;
      if (this.entity.attributes['rgb_color']) {
        this.iconColor = 'rgb(' + this.entity.attributes['rgb_color'].join(', ') + ')';
      } else {
        this.iconColor = 'rgb(255,165,0)';
      }
    } else {
      this.active = false;
      this.iconColor = 'rgb(0,0,0)';
    }
    console.log(this.iconColor);
  }

  onPress(){
    this.pressEvent = true;
    // this.websocketService.callService("light", "toggle", this.entity_id)
  }

  onClick(){
    if (this.pressEvent){
      console.log("Long press event")
    } else {
      this.waitingChange = true;
      this.websocketService.callService("light", "toggle", this.entity_id)
    }
    this.pressEvent = false;
  }

  onPressUp(){
    // console.log("press up");
  }

}
