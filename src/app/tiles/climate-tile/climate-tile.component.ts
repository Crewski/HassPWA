import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy, Inject } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { WebsocketService, KeyValuePair } from 'src/app/services/websocket.service';
import { HttpService } from 'src/app/services/http.service';
import { SettingsService } from 'src/app/services/settings.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { interval, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ListBottomSheet } from 'src/app/modals/listbottomsheet';
import * as Hammer from 'hammerjs';
import { ChartModal } from 'src/app/modals/chartmodal';

@Component({
  selector: 'climate-tile',
  templateUrl: './climate-tile.component.html',
  styleUrls: ['./climate-tile.component.scss'],
  animations: [
    trigger('showhide', [
        state('true', style({opacity: '0', visibility: 'hidden'})),
        state('false', style({opacity: '1', visibility: 'visible'})),
        transition('* <=> *', animate('1s linear'))
    ])
]
})
export class ClimateTileComponent implements OnInit {

  @Input() entity_id: string;
  entity: any = {};
  active: boolean = false;
  iconColor: string = 'rgb(0,0,0)';
  running: boolean = false


  constructor(
    
    private entityService: EntityService,
    private websocketService: WebsocketService, 
    private httpService: HttpService, 
    public settings: SettingsService,
    private dialog: MatDialog,
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

    interval(1000)
    .subscribe(x => {
        if (this.getRunning){
          this.running = !this.running;
        } else {
          this.running = false;
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

    } else {
      this.active = false;
      this.iconColor = this.entityService.standardOffColor
    }
    // this.cd.detectChanges();
  }

  get getState(): string {
    if (!this.entity) return null;
    
    if (this.entity && this.entity.attributes){
      if (this.entity.attributes.current_temperature) {
        let state = Math.round(this.entity.attributes.current_temperature).toString();
        if (this.entity.attributes['unit_of_measurement']){
          state = state + this.entity.attributes['unit_of_measurement'];
        } else if (this.settings.getLayout['units'] && this.settings.getLayout['units']['temperature']){
          state = state + this.settings.getLayout['units']['temperature']
        }
        return state;
      } 
      
    }
    return 'Off';
  }

  get getFriendlyName(): string {
    if (this.entity && this.entity.attributes && this.entity.attributes.friendly_name) {
      return this.entity.attributes.friendly_name;
    } else {
      return this.entity_id.split('.')[1];
    }
  }

  get getRunning(): boolean {
    if (!this.entity || !this.entity.attributes || !this.entity.attributes['hvac_action']) return false
    if (this.entity.attributes['hvac_action'].toLowerCase() == 'heating' || this.entity.attributes['hvac_action'].toLowerCase() == 'cooling'){
      return true;
    } else {
      return false;
    }
  }

  get getIconColor(): string {
    if (!this.entity || !this.entity.state) return this.entityService.standardOffColor;
    if (this.entity.state.toLowerCase() == 'heat') {
      return 'rgb(255,0,0)';
    } else if (this.entity.state.toLowerCase() == 'cool') {
      return 'rgb(0,0,255)';
    } else if (this.entity.state.toLowerCase() == 'heat_cool' || this.entity.state.toLowerCase() == 'auto'){
      return 'rgb(0,255,0)'
    } else {
      return this.entityService.standardOffColor;
    }
  }

  get getBackgroundColor(): string {

    if (this.entity.state.toLowerCase() == 'off') return 'transparent'
    return 'rgb(255,255,255)'

  }

  onTap(){
      this.dialog.open(ClimateDetailDialog, {
      panelClass: 'full-width-dialog',
      data: this.entity_id,
    });
    
  }

}


@Component({

  templateUrl: './climate-details.html',
})

export class ClimateDetailDialog implements OnInit, OnDestroy {

  entity: any;
  sub: Subscription;


  constructor(
    @Inject(MAT_DIALOG_DATA) public entity_id: string,
    private entityService: EntityService,
    private websocketService: WebsocketService,
    private dialogRef: MatDialogRef<ClimateDetailDialog>,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() { 
     
    let hammertime = new Hammer(document.getElementById('dialog-cont'));
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime.on('swipe', ev => {
      console.log(ev);
      if(ev.deltaY > 0) this.dialogRef.close();
    }); 
    this.sub = this.entityService.entity_change.subscribe(data => {
      try {
        this.entity = data.find(x => x.entity_id == this.entity_id);        

      } catch (err) {
        console.log(err);
      }
    })
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }



  get getFriendlyName(): string {
    if (this.entity && this.entity.attributes && this.entity.attributes.friendly_name) {
      return this.entity.attributes.friendly_name;
    } else {
      return this.entity_id.split('.')[1];
    }
  }

  updateEntity(type: string) {
    let options: KeyValuePair[] = [];
    if (type == 'temp') options.push({key: 'temperature', value: this.entity.attributes.temperature});
    if (type == 'low') options.push({key: 'target_temp_low', value: this.entity.attributes.target_temp_low});
    if (type == 'high') options.push({key: 'target_temp_high', value: this.entity.attributes.target_temp_high});
    this.websocketService.callService('climate', 'set_temperature', this.entity_id, options);
  }

  get isOn(): boolean {
    if (this.entity.state.toLowerCase() != 'off') {
      return true;
    } else {
      return false;
    }
  }

  get getCurrentTemp(): number {
    if (!this.entity) return null;
    if (this.entity && this.entity.attributes){
      if (this.entity.attributes.current_temperature) return this.entity.attributes.current_temperature;
    }
    return null;
  }

  showList(type: string){
    let optionList = [];
    switch(type){
      case 'hvac':
        optionList = this.entity.attributes.hvac_modes;
        break;
      case 'preset':
        optionList = this.entity.attributes.preset_modes;
        break;
      case 'fan':
        optionList = this.entity.attributes.fan_modes;
        break;
    }
    const bottomSheetRef = this.bottomSheet.open(ListBottomSheet, {
      data: { options: optionList },
    });
    bottomSheetRef.afterDismissed().subscribe((option) => {
      if(option){
        const service = 'set_' + type + '_mode';
        const key = type + '_mode';
        let options: KeyValuePair[] = [{key: key, value: option}]
        this.websocketService.callService('climate', service, this.entity_id, options);
      }
    });
  }

  get getMin(): number {
    return this.entity.attributes.min_temp ? this.entity.attributes.min_temp : 32;
  }  
  
  get getMax(): number {
    return this.entity.attributes.max_temp ? this.entity.attributes.max_temp : 90;
  }

  get getStep(): number {
    return this.entity.attributes.target_temp_step ? this.entity.attributes.target_temp_step : 1;
  }

  showHistory(){
    this.dialog.open(ChartModal, {
      panelClass: 'graph-dialog',
      data: {entity_id: this.entity_id, friendly_name: this.getFriendlyName}
    });
  }



  close() {
    this.dialogRef.close();
  }




}

