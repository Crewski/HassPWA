import { Component, OnInit, ViewEncapsulation, ViewChild, ViewChildren, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../services/settings.service';
import { HttpService } from '../services/http.service';
import { MatTabChangeEvent, MatTabGroup, MatTab } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { EntityService } from '../services/entity.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

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



  swipe(eType){
    if(eType === this.SWIPE_ACTION.RIGHT && this.index > 0){
      this.index--;
    }
    else if(eType === this.SWIPE_ACTION.LEFT && this.index < this.settings.getRooms.length - 1){
      this.index++;
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.http.getAuthToken(params['code']);
      } 
    });

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
      width: '90vw',
      height: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settings.addEntity(this.index, result);
      }
    });
  }

  addRoom(){
    this.settings.addRoom();
    this.index = this.settings.getRooms.length - 1;
  }

  moveRoom(direction: string){
    this.settings.moveRoom(this.index, direction);
  }

  deleteRoom(){
    this.settings.deleteRoom(this.index);
    if (this.index > this.settings.getRooms.length - 1) this.index--
  }

  editRoomName(){
      const dialogRef = this.dialog.open(EditRoomNameDialog, {
        width: '250px',
        data: this.settings.getRooms[this.index].name,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) this.settings.editRoomName(this.index, result);
      });
    }
  

}

@Component({
  
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

@Component({
  template: `
  <h1 mat-dialog-title>Edit Room Name</h1>
  <div mat-dialog-content>
    <mat-form-field>
      <mat-label>Room Name</mat-label>
      <input matInput [(ngModel)]="data">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="null">Cancel</button>
    <button mat-button [mat-dialog-close]="data" cdkFocusInitial>Set Name</button>
  </div>
  `,
})
export class EditRoomNameDialog { 

  constructor(@Inject(MAT_DIALOG_DATA) public data: string){console.log(this.data)}


}
