import { Component, OnInit, Input, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { HttpService } from 'src/app/services/http.service';
import { SettingsService } from 'src/app/services/settings.service';

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
    private httpService: HttpService, 
    public settings: SettingsService  
    // private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.entityService.entity_change.subscribe(data => {      
      try {
        this.entity = data.find(x => x.entity_id == this.entity_id);        
        if (this.entity) this.processEntity();
      } catch (err) {
        console.log(err);
      }
    })  
  }

  // async setupEntity(){
  //   this.entity = await this.entityService.getEntity(this.entity_id);
  //   this.processEntity();
  //   this.entityService.entity_change.subscribe(data => {      
  //     if(data && data.entity_id == this.entity_id) {
  //       this.entity = data;
  //       this.processEntity();
  //     }
  //   })
  // }

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
    this.httpService.getHistory(this.entity_id).subscribe(data => {
      window.alert("It worked")
    }, err => window.alert("Cors Error"))
  }

  get getState(): string{
    if (this.entity && this.entity.attributes && (this.entity.attributes.brightness || this.entity.attributes.white_value)){
      if (!this.entity.attributes.brightness) return this.entityService.changeToPercent(this.entity.attributes.white_value) + '%'
      if (!this.entity.attributes.white_value) return this.entityService.changeToPercent(this.entity.attributes.brightness) + '%'
      let value = this.entity.attributes.brightness > this.entity.attributes.white_value ? this.entity.attributes.brightness : this.entity.attributes.white_value;
      return this.entityService.changeToPercent(value) + '%';
    }
    return (this.entity && this.entity['state']) ? this.entity.state : null;
  }

  get getFriendlyName(): string{
    if (this.entity && this.entity.attributes && this.entity.attributes.friendly_name) {
      return this.entity.attributes.friendly_name;
    } else {
      return this.entity_id.split('.')[1];
    }
  }

}
