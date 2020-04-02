import { Component, OnInit, Input, Inject } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'sensor-tile',
  templateUrl: '../generic-tile.html',
})
export class SensorTileComponent implements OnInit {

  @Input() entity_id: string;
  entity: any = {};
  active: boolean = true;
  iconColor: string;

  waitingChange: boolean = false;

  constructor(
    private entityService: EntityService,
    public settings: SettingsService
  ) { }

  ngOnInit(): void {
    this.iconColor = this.entityService.standardOnColor;
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
    console.log("Tapped")
  }

  onPressUp() {
    console.log("press up");
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


