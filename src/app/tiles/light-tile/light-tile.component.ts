import { Component, OnInit, Input, ChangeDetectorRef, ViewEncapsulation, Inject } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { WebsocketService, KeyValuePair } from 'src/app/services/websocket.service';
import { HttpService } from 'src/app/services/http.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    public settings: SettingsService,
    private dialog: MatDialog  
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
    this.websocketService.callService("light", "toggle", this.entity_id);
  }

  onPressUp(){
      const dialogRef = this.dialog.open(LightDetailDialog, {
        // width: '250px',
      panelClass: 'full-width-dialog',

        data: this.entity_id,
      });
    
    // console.log("press up");
    // this.httpService.getHistory(this.entity_id).subscribe(data => {
    //   window.alert("It worked")
    // }, err => window.alert("Cors Error"))
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

@Component({
  
  templateUrl: './light-details.html',
})

export class LightDetailDialog { 

  entity: any;
  adjustedBrightness: number | null;
  adjustedWhiteValue: number | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public entity_id: string,
    private entityService: EntityService,
    private websocketService: WebsocketService,
    private dialogRef: MatDialogRef<LightDetailDialog>,
    ){
    this.entityService.entity_change.subscribe(data => {      
      try {
        this.entity = data.find(x => x.entity_id == this.entity_id);  
        if (this.entity && this.entity.attributes.brightness){
          this.adjustedBrightness = this.entityService.changeToPercent(this.entity.attributes.brightness);
        }    
        if (this.entity && this.entity.attributes.white_value != null){
          
          console.log(this.entity.attributes.white_value);
          this.adjustedWhiteValue = this.entityService.changeToPercent(this.entity.attributes.white_value);
        }  
        
      } catch (err) {
        console.log(err);
      }
    })
  }

  get getBrightness(){
    if (this.entity && this.entity.attributes.brightness){
      return this.entityService.changeToPercent(this.entity.attributes.brightness);
    } else {
      return null
    }
  }

  get getFriendlyName(): string{
    if (this.entity && this.entity.attributes && this.entity.attributes.friendly_name) {
      return this.entity.attributes.friendly_name;
    } else {
      return this.entity_id.split('.')[1];
    }
  }

  updateEntity(){
    let options: KeyValuePair[] = [];
    if (this.adjustedBrightness != null) options.push({key: 'brightness', value: (this.adjustedBrightness / 100 * 255)});
    if (this.adjustedWhiteValue != null) options.push({key: 'white_value', value: (this.adjustedWhiteValue / 100 * 255)});
    this.websocketService.callService('light','turn_on', this.entity_id, options);
  }

 get isOn(): boolean{
  if (this.entity.state.toLowerCase() == 'on') {
    return true;
  } else {
    return false;
  }
 }

 toggleLight(){   
  this.websocketService.callService("light", "toggle", this.entity_id);
 }

 close(){
   this.dialogRef.close();
 }


}
