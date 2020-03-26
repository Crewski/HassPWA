import { Component, OnInit, ViewEncapsulation, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../services/settings.service';
import { HttpService } from '../services/http.service';
import { MatTabChangeEvent, MatTabGroup, MatTab } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { EntityService } from '../services/entity.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild(MatTabGroup) group;
  @ViewChildren(MatTab) tabs;
  tab_num = 0;
  selected = 0;
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  title = 'Home';
  index = 0;

  constructor(
    private route: ActivatedRoute,
    public settings: SettingsService,
    private http: HttpService,
    private dialog: MatDialog
  ) { }

  number_tabs
  ngAfterViewInit(){
    this.tab_num = this.tabs.length - 1;  
    console.log(this.tab_num)
  }

  swipe(eType){
    console.log(eType);
    if(eType === this.SWIPE_ACTION.RIGHT && this.index > 0){
      this.index--;
    }
    else if(eType === this.SWIPE_ACTION.LEFT && this.index < this.tab_num){
      this.index++;
    }
    console.log(this.index)
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.http.getAuthToken(params['code']);
      } 
    });

  }

  get icon(){
    return this.settings.isEditing ? 'mdi:save' : 'mdi:edit';
  }

  changeRoom(event: MatTabChangeEvent){
    this.index = event.index;
    console.log(event);
  }

  moveEntity(roomindex: number, tileindex: number, direction: string){
    this.settings.moveEntity(roomindex, tileindex, direction);
  }

  deleteEntity(roomindex: number, tileindex: number){
    this.settings.deleteEntity(roomindex, tileindex);
  }

  addEntity(){
    const dialogRef = this.dialog.open(AddEntityDialog, {
      width: '100vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settings.addEntity(this.index, result);
      }
    });
  }

}

@Component({
  selector: 'app-settings',
  template: `
  <h1 mat-dialog-title>Add Entity</h1>
    <div mat-dialog-content>
    <mat-form-field style="width: 100%">
    <input type="text"
           placeholder="Pick one"
           aria-label="Number"
           matInput
           [formControl]="myControl"
           [matAutocomplete]="auto">
    <mat-autocomplete #auto="matAutocomplete" (optionSelected)="entitySelected()">
      <mat-option *ngFor="let entity of filteredEntities | async" [value]="entity.entity_id">
        {{entity.entity_id}}
      </mat-option>
    </mat-autocomplete>
  </mat-form-field>
</div>
<div mat-dialog-actions>
  <button mat-button color="primary" [mat-dialog-close]="false">Cancel</button>
</div>
  `,
})
export class AddEntityDialog implements OnInit {

  myControl = new FormControl();
  entities: any[];
  filteredEntities: Observable<any[]>;

  constructor(private entityService: EntityService, private dialogRef: MatDialogRef<AddEntityDialog>){}

  ngOnInit() {
    this.entities = this.entityService.getAllEntities();
    this.filteredEntities = this.myControl.valueChanges.pipe(startWith(''), map(value => this._filter(value)))
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLocaleLowerCase();
    return this.entities.filter(entity => entity.entity_id.toLocaleLowerCase().includes(filterValue));
  }

  entitySelected(){
    this.dialogRef.close(this.myControl.value);
  }
}
