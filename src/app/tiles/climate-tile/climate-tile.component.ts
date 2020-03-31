import { Component, OnInit, Input } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { HttpService } from 'src/app/services/http.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'climate-tile',
  templateUrl: './climate-tile.component.html',
  styleUrls: ['./climate-tile.component.scss']
})
export class ClimateTileComponent implements OnInit {

  @Input() entity_id: string;
  entity: any = {};
  active: boolean = false;
  iconColor: string = 'rgb(0,0,0)';


  constructor(
    
    private entityService: EntityService,
    private websocketService: WebsocketService, 
    private httpService: HttpService, 
    public settings: SettingsService  
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

  processEntity(){
    if (!this.entity.attributes['icon']) {
      this.entity.attributes['icon'] = "mdi:home-thermometer";
    }
    if (this.entity.state.toLowerCase() != 'off'){
      this.active = true;
      this.iconColor = this.entityService.standardOnColor;
      if (this.entity.state.toLowerCase() == 'heat') {
        this.iconColor = 'rgb(255,0,0)';
      } else if (this.entity.state.toLowerCase() == 'cool') {
        this.iconColor = 'rgb(0,0,255)';
      } else {
        this.iconColor = this.entityService.standardOnColor;
      }
    } else {
      this.active = false;
      this.iconColor = this.entityService.standardOffColor
    }
    // this.cd.detectChanges();
  }

  get getState(): string {
    if (!this.entity) return null;
    if (this.entity && this.entity.attributes){
      if (this.entity.attributes.temperature) return Math.round(this.entity.attributes.temperature).toString();
      if (this.entity.attributes.target_temp_high) return Math.round(this.entity.attributes.target_temp_high).toString();
    }
    return 'Off';
    // if (this.entity.state == 'unavailable') return '?';
    // if (this.entity.state == 'heat_cool') return 'Auto';
    // return this.entity.state
  }

  get getFriendlyName(): string {
    if (this.entity && this.entity.attributes && this.entity.attributes.friendly_name) {
      return this.entity.attributes.friendly_name;
    } else {
      return this.entity_id.split('.')[1];
    }
  }

  onTap(){
    console.log("Get Details")
  }

}
