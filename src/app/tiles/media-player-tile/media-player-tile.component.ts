import { Component, OnInit, Input } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { StackedChartModal } from 'src/app/modals/stackedchartmodal';

@Component({
  selector: 'media-player-tile',
  templateUrl: '../generic-tile.html',
})
export class MediaPlayerTileComponent implements OnInit {

  @Input() entity_id: string;
  entity: any = {};
  active: boolean = true;
  iconColor: string;

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
    if (this.entity.state.toLowerCase() == 'off' || this.entity.state.toLowerCase() == 'idle' || this.entity.state.toLowerCase() == 'unavailable' || this.entity.state.toLowerCase() == 'standby'){
      this.active = false;
      this.iconColor = this.entityService.standardOffColor;
    } else {
      this.active = true;
      this.iconColor = this.entityService.standardOnColor;
    }
    if (!this.entity || !this.entity.attributes ||  this.entity.attributes.icon || !this.entity.attributes.device_class) return;
    switch(this.entity.attributes.device_class.toLowerCase()){
      case 'tv':
        this.entity.attributes.icon = 'mdi:television';
        break;
        default:
        this.entity.attributes.icon = 'mdi:volume-high';
        break;
    }
  }

  onTap() {

  }

  onPressUp() {
    this.onTap();
  }

  get getState(): string {
    if (!this.entity) return null;
    if (this.entity.state.toLowerCase() == 'unavailable') return '?';
    if (this.entity.attributes && this.entity.attributes.app_name) return this.entity.attributes.app_name;
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