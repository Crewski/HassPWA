import { Component, OnInit, Input, Inject } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { PasscodeDialog } from 'src/app/modals/passcode-dialog';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'cover-tile',
  templateUrl: '../generic-tile.html',
})
export class CoverTileComponent implements OnInit {

  @Input() entity_id: string;
  entity: any = {};
  active: boolean = true;
  iconColor: string;
  iconOn: string;
  iconOff: string;

  waitingChange: boolean = false;

  constructor(
    private entityService: EntityService,
    public settings: SettingsService,
    public dialog: MatDialog,
    private websocketService: WebsocketService
  ) { }

  ngOnInit(): void {
    this.entityService.entity_change.subscribe(data => {
      try {
        this.entity = data.find(x => x.entity_id == this.entity_id);
        if (this.entity) {
          this.setIcon();
          this.setActive();
        }
      } catch (err) {
        console.log(err);
      }
    })
  }

  setIcon() {
    if (!this.entity || !this.entity.attributes || !this.entity.attributes.device_class || this.entity.attributes.icon) return;
    let icon = null
    switch (this.entity.attributes.device_class.toLowerCase()) {
      case "garage":
        this.iconOff = 'mdi:garage';
        this.iconOn = 'mdi:garage-open';
        break;
    }

    // this.entity.attributes['icon'] = icon;
  }

  setActive(){
    switch (this.entity.state.toLowerCase()){
      case 'closed':
        this.active = false;
        this.iconColor = this.entityService.standardOffColor;
        if (!this.entity.attributes['icon']) this.entity.attributes['icon'] = this.iconOff;
        break;
      case 'open':
        this.active = true;
        this.iconColor = this.entityService.standardOnColor;
        if (!this.entity.attributes['icon']) this.entity.attributes['icon'] = this.iconOn;
        break;
    }
  }

  onTap() {
    if (!this.settings.getLayout['passcode']){
      this.websocketService.callService('cover', 'toggle', this.entity_id);
      return;
    }
    let dialogRef = this.dialog.open(PasscodeDialog, {      
      panelClass: 'full-width-dialog',
    });
    dialogRef.afterClosed().subscribe(code => {
      if (code == this.settings.getLayout['passcode']){
        this.websocketService.callService('cover', 'toggle', this.entity_id);
      } else {
        window.alert("Wrong code");
      }
    })
  }

  onPressUp() {
    console.log("press up");
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