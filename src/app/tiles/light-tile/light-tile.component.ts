import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'light-tile',
  templateUrl: '../generic-tile.html',
})
export class LightTileComponent implements OnInit {

  @Input() entity_id: string;
  entity: any = {};
  active: boolean = false;
  iconColor: string = 'rgb(255,0,0)';

 
  waitingChange: boolean = false;

  constructor(
    private entityService: EntityService,
    private websocketService: WebsocketService,    
    // private cd: ChangeDetectorRef,
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
    // this.cd.detectChanges();
  }

  setActive() {  
    if ((this.entity.state).toLowerCase() == 'on') {
      this.active = true;
      if (this.entity.attributes['rgb_color']) {
        this.iconColor = 'rgb(' + this.entity.attributes['rgb_color'].join(', ') + ')';
      } else {
        this.iconColor = this.entityService.standardOnColor;
      }
    } else {
      this.active = false;
      this.iconColor = this.entityService.standardOffColor;
    }
  }

  onTap(){    
    this.waitingChange = true;
    this.websocketService.callService("light", "toggle", this.entity_id)
  }

  onPressUp(){
    console.log("press up");
  }

  get getState(): string{
    if (this.entity && this.entity.attributes && (this.entity.attributes.brightness || this.entity.attributes.white_value)){
      let value = this.entity.attributes.brightness > this.entity.attributes.white_value ? this.entity.attributes.brightness : this.entity.attributes.white_value;
      return this.entityService.changeToPercent(value) + '%';
    }
    return this.entity.state
  }

  get getFriendlyName(): string{
    if (this.entity && this.entity.attributes && this.entity.attributes.friendly_name) {
      return this.entity.attributes.friendly_name;
    } else {
      return this.entity_id.split('.')[1];
    }
  }

}
