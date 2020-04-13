import { Component, OnInit, Input, ChangeDetectorRef, ViewEncapsulation, Inject, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { WebsocketService, KeyValuePair } from 'src/app/services/websocket.service';
import { HttpService } from 'src/app/services/http.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import iro from '@jaames/iro';
import { Subscription } from 'rxjs';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';

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

  processEntity() {
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

  onTap() {
    this.waitingChange = true;
    this.websocketService.callService("light", "toggle", this.entity_id);
  }

  onPressUp() {
    const dialogRef = this.dialog.open(LightDetailDialog, {
      // width: '250px',
      panelClass: 'full-width-dialog',

      data: this.entity_id,
    });

  }

  get getState(): string {
    if (this.entity && this.entity.attributes && (this.entity.attributes.brightness || this.entity.attributes.white_value)) {
      if (!this.entity.attributes.brightness) return this.entityService.changeToPercent(this.entity.attributes.white_value) + '%'
      if (!this.entity.attributes.white_value) return this.entityService.changeToPercent(this.entity.attributes.brightness) + '%'
      let value = this.entity.attributes.brightness > this.entity.attributes.white_value ? this.entity.attributes.brightness : this.entity.attributes.white_value;
      return this.entityService.changeToPercent(value) + '%';
    }
    return (this.entity && this.entity['state']) ? this.entity.state : null;
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

  templateUrl: './light-details.html',
})

export class LightDetailDialog implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('content') elementView: ElementRef;

  entity: any;
  sub: Subscription;
  adjustedBrightness: number | null;
  adjustedWhiteValue: number | null;

  colorPicker: iro.ColorPicker;
  tempPicker: iro.ColorPicker;

  constructor(
    @Inject(MAT_DIALOG_DATA) public entity_id: string,
    private entityService: EntityService,
    private websocketService: WebsocketService,
    private dialogRef: MatDialogRef<LightDetailDialog>,
    private breakpointObserver: BreakpointObserver
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
        if (this.entity && this.entity.attributes.brightness) {
          this.adjustedBrightness = this.entityService.changeToPercent(this.entity.attributes.brightness);
        }
        if (this.entity && this.entity.attributes.white_value != null) {
          this.adjustedWhiteValue = this.entityService.changeToPercent(this.entity.attributes.white_value);
        }
        this.setTempSelector();
        this.setColorSelector();

      } catch (err) {
        console.log(err);
      }
    })
  }

  ngAfterViewInit(){
    this.breakpointObserver.observe([
      '(orientation: portrait)',
    ]).subscribe(res => {
      this.colorPicker.resize(this.elementView.nativeElement.offsetWidth);
      this.tempPicker.resize(this.elementView.nativeElement.offsetWidth);
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  get getBrightness() {
    if (this.entity && this.entity.attributes.brightness) {
      return this.entityService.changeToPercent(this.entity.attributes.brightness);
    } else {
      return null
    }
  }

  get getFriendlyName(): string {
    if (this.entity && this.entity.attributes && this.entity.attributes.friendly_name) {
      return this.entity.attributes.friendly_name;
    } else {
      return this.entity_id.split('.')[1];
    }
  }

  updateEntity() {
    let options: KeyValuePair[] = [];
    if (this.adjustedBrightness != null) options.push({ key: 'brightness', value: (this.adjustedBrightness / 100 * 255) });
    if (this.adjustedWhiteValue != null) options.push({ key: 'white_value', value: (this.adjustedWhiteValue / 100 * 255) });
    this.websocketService.callService('light', 'turn_on', this.entity_id, options);
  }

  get isOn(): boolean {
    if (this.entity.state.toLowerCase() == 'on') {
      return true;
    } else {
      return false;
    }
  }

  toggleLight() {
    this.websocketService.callService("light", "toggle", this.entity_id);
  }

  close() {
    this.dialogRef.close();
  }

  setColorSelector(){
    if (this.entity.attributes['rgb_color']) {
      document.getElementById('pickerColor').style.display = 'block';
    } else {
      document.getElementById('pickerColor').style.display = 'none';
    }

    if(!this.colorPicker){
      
      this.colorPicker = new iro.ColorPicker("#pickerColor", {
        // Set the size of the color picker
        // width: 250,
        layout: [
          {
            component: iro.ui.Slider,
            options: {
              sliderType: 'hue'
            }
          },
          {
            component: iro.ui.Slider,
            options: {
              sliderType: 'saturation'
            }
          },
        ],
      });

      this.colorPicker.on('input:end', (color) => {
        // console.log(color);
          let options: KeyValuePair[] = [{key: 'rgb_color', value: [color.rgb.r, color.rgb.g, color.rgb.b]}];
          this.websocketService.callService('light', 'turn_on', this.entity_id, options);
        
      });
    }

    if(this.entity.attributes['rgb_color']){
         this.colorPicker.color.set('rgb(' + this.entity.attributes['rgb_color'].join(', ') + ')') ; 
    }


  }



  setTempSelector(){
    
    if (this.entity.attributes['color_temp']) {
      document.getElementById('pickerTemp').style.display = 'block';
    } else {
      document.getElementById('pickerTemp').style.display = 'none';
    }

    if(!this.tempPicker){
      
      this.tempPicker = new iro.ColorPicker("#pickerTemp", {
        // Set the size of the color picker
        // width: 250,
        layout: [
          {
            component: iro.ui.Slider,
            options: {
              sliderType: 'kelvin',            
              minTemperature: 1000000 / this.entity.attributes['max_mireds'],
              maxTemperature: 1000000 / this.entity.attributes['min_mireds'], // can also be 'saturation', 'value', 'alpha' or 'kelvin'
            }
          },
        ],
      });

      this.tempPicker.on('input:end', (color) => {
          let options: KeyValuePair[] = [{key: 'color_temp', value: (1000000/color.kelvin)}];
          this.websocketService.callService('light', 'turn_on', this.entity_id, options);
        
      });
    }
    let clippedmired = this.entity.attributes['color_temp'];
    if (clippedmired < this.entity.attributes['min_mireds']) clippedmired = this.entity.attributes['min-mireds'];
    if (clippedmired > this.entity.attributes['max_mireds']) clippedmired = this.entity.attributes['max-mireds'];
    this.tempPicker.color.kelvin = 1000000 / clippedmired;
    // if (this.elementView) this.tempPicker.resize(this.elementView.nativeElement.offsetWidth);
  }
  


}
