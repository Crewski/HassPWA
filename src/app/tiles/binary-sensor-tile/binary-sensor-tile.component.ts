import { Component, OnInit, Input } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { StackedChartModal } from 'src/app/modals/stackedchartmodal';

@Component({
  selector: 'binary-sensor-tile',
  templateUrl: '../generic-tile.html',
})
export class BinarySensorTileComponent implements OnInit {

  @Input() entity_id: string;
  entity: any = {};
  active: boolean;
  iconColor: string = null;

  constructor(
    private entityService: EntityService,
    public settings: SettingsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.entityService.entity_change.subscribe(data => {
      try {
        this.entity = data.find(x => x.entity_id == this.entity_id);
        if (this.entity) {
          this.processEntity();
        };
      } catch (err) {
        console.log(err);
      }
    })
  }



  processEntity() {
    if (this.entity.state.toLowerCase() == 'off' || this.entity.state.toLowerCase() == 'unavailable'){
      this.active = false;
      // this.iconColor = this.entityService.standardOffColor;
    } else {
      this.active = true;
      // this.iconColor = this.entityService.standardOnColor;
    }
    if (!this.entity || !this.entity.attributes || !this.entity.attributes.device_class || this.entity.attributes.icon) return;
    let icon = null
    switch (this.entity.attributes.device_class.toLowerCase()) {
      case "door":
        icon = 'mdi:door-closed';
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
  }

  onTap() {
    this.dialog.open(StackedChartModal, {
      panelClass: 'graph-dialog',
      data: {entity_id: this.entity_id, friendly_name: this.getFriendlyName, off_value: 'off', on_value: 'on'}
    });
  }

  onPressUp() {
    this.onTap();
  }

  get getState(): string {
    if (!this.entity) return null;
    if (this.entity.state == 'unavailable') return '?';
    return this.entity.state;
  }

  get getFriendlyName(): string {
    if (this.entity && this.entity.attributes && this.entity.attributes.friendly_name) {
      return this.entity.attributes.friendly_name;
    } else {
      return this.entity_id.split('.')[1];
    }
  }

}


