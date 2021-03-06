import { Component, OnInit, Input, } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { MatBottomSheet, } from '@angular/material/bottom-sheet';
import { SettingsService } from 'src/app/services/settings.service';
import { ListBottomSheet } from 'src/app/modals/listbottomsheet';

@Component({
  selector: 'general-tile',
  templateUrl: '../generic-tile.html',
})
export class GeneralTileComponent implements OnInit {

  @Input() entity_id: string;
  entity: any = {};
  active: boolean = false;
  iconColor: string = null;
  domain: string | null;

  constructor(
    private entityService: EntityService,
    private websocketService: WebsocketService,
    private bottomSheet: MatBottomSheet,
    public settings: SettingsService
  ) { }

  ngOnInit(): void {
    this.domain = this.entity_id.split('.')[0];

    this.entityService.entity_change.subscribe(data => {      
      try {
        this.entity = data.find(x => x.entity_id == this.entity_id);
        
        if (this.entity) this.processEntity();
      } catch (err) {
        console.log(err);
      }
    })  
    // this.setupEntity();
  }

  async setupEntity() {
    this.entity = await this.entityService.getEntity(this.entity_id);
    this.processEntity();
  }

  processEntity() {
    let icon = null
    switch (this.domain) {
      case "script":
        icon = "mdi:script-text";
        this.entity.state = 'Script';
        this.active = true;        
        // this.iconColor = this.entityService.standardOnColor;
        break;
      case "switch":
        icon = "mdi:toggle-switch";        
        this.setActive();
        break;
      default:
        this.setActive();
        break;
    }
    
    if (!this.entity.attributes['icon']) {
      this.entity.attributes['icon'] = icon;
    }
  }

  setActive() {
    if ((this.entity.state).toLowerCase() == 'on' || (this.entity.state).toLowerCase() == 'home') {
      this.active = true;
      // this.iconColor = this.entityService.standardOnColor;

    } else {
      this.active = false;
      // this.iconColor = this.entityService.standardOffColor;
    }
  }

  onTap() {
    let action = '';
    switch (this.domain){
      case "script":
        action = 'turn_on';
        break;
      case "input_select":
        this.callBottomSheet();
        return;
      default:
        action = 'toggle';
    }
    this.websocketService.callService(this.domain, action, this.entity_id)
  }

  callBottomSheet(){
    const bottomSheetRef = this.bottomSheet.open(ListBottomSheet, {
      data: { options: this.entity.attributes.options },
    });
    bottomSheetRef.afterDismissed().subscribe((option) => {
      if(option){
        this.websocketService.callService('input_select', 'select_option', this.entity_id, [{key: 'option', value: option}] )
      } else {
      }
    });
  }

  onPressUp() {
    console.log("press up");
  }

  get getState(): string {
    if (!this.entity) return null;
    if (this.entity.state == 'unavailable') return '?';
    return this.entity.state
  }

  get getFriendlyName(): string {
    if (this.entity && this.entity.attributes && this.entity.attributes.friendly_name) {
      return this.entity.attributes.friendly_name;
    } else {
      return this.entity_id.split('.')[1];
    }
  }

}


