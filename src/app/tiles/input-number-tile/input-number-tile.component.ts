import { Component, OnInit, Input, Inject } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'input-number-tile',
  templateUrl: '../generic-tile.html',
})
export class InputNumberTileComponent implements OnInit {

  @Input() entity_id: string;
  entity: any = {};
  active: boolean = true;
  iconColor: string = null;

  constructor(
    private entityService: EntityService,
    public settings: SettingsService,
    private dialog: MatDialog,
    private websocketService: WebsocketService
  ) { }

  ngOnInit(): void {
    this.entityService.entity_change.subscribe(data => {
      try {
        this.entity = data.find(x => x.entity_id == this.entity_id);
        // if (this.entity) this.processEntity();
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
    const dialogRef = this.dialog.open(InputNumberDialog, {
      panelClass: 'full-width-dialog',
      data: this.entity
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.websocketService.callService('input_number', 'set_value', this.entity_id, [{key: 'value', value: res}])
      }
    })
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

@Component({
  
  template: `
  <mat-slider style="width: 100%" [max]="entity.attributes.max" [min]="entity.attributes.min" [step]="getStep" thumbLabel="true" [(ngModel)]="entity.state"
  (change)="setNumber()">
</mat-slider>
  `,
})
export class InputNumberDialog{

  constructor(
    @Inject(MAT_DIALOG_DATA) public entity: any,
    private dialogRef: MatDialogRef<InputNumberDialog>
  ){
    console.log(this.entity);
  }

  setNumber(){
    this.dialogRef.close(this.entity.state);
  }

  get getStep(){
    return this.entity.attributes['step'] || 1;
  }

}



