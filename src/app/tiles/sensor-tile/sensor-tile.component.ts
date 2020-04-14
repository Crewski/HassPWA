import { Component, OnInit, Input, } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { ChartModal } from 'src/app/modals/chartmodal';

@Component({
  selector: 'sensor-tile',
  templateUrl: '../generic-tile.html',
})
export class SensorTileComponent implements OnInit {

  @Input() entity_id: string;
  entity: any = {};
  active: boolean;
  iconColor: string = null;

  waitingChange: boolean = false;

  constructor(
    private entityService: EntityService,
    public settings: SettingsService,
    private dialog: MatDialog
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

  processEntity() {
    if (this.entity.state.toLowerCase() == 'unavailable'){
      this.active = false;
      // this.iconColor = this.entityService.standardOffColor;
    } else {
      this.active = true;
      // this.iconColor = this.entityService.standardOnColor;
    }
    if (!this.entity || !this.entity.attributes || !this.entity.attributes.device_class || this.entity.attributes.icon) return;
    let icon = null
    switch (this.entity.attributes.device_class.toLowerCase()) {
      case "temperature":
        icon = 'mdi:thermometer';
        break;
      case "humidity":
        icon = 'mdi:water-percent'
        break;
      case "battery":
        icon = 'mdi:batter-70';
        break;
      case "power":
        icon = 'mdi:flash';
        break;
      default:
        icon = 'mdi:eye';
        break;
    }

    this.entity.attributes['icon'] = icon;
    console.log(icon);
  }

  onTap() {
    this.dialog.open(ChartModal, {
      panelClass: 'graph-dialog',
      data: {entity_id: this.entity_id, friendly_name: this.getFriendlyName}
    });
  }

  onPressUp() {
    this.onTap();
  }

  get getState(): string {
    if (!this.entity) return null;
    if (this.entity.state == 'unavailable') return '?';
    return this.entity.state + this.entity.attributes.unit_of_measurement
  }

  get getFriendlyName(): string {
    if (this.entity && this.entity.attributes && this.entity.attributes.friendly_name) {
      return this.entity.attributes.friendly_name;
    } else {
      return this.entity_id.split('.')[1];
    }
  }

}


