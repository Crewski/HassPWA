import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../services/settings.service';
import { HttpService } from '../services/http.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EntityService } from '../services/entity.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {


  index = 0;

  config: SwiperConfigInterface;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public settings: SettingsService,
    private http: HttpService,
    private dialog: MatDialog,
  ) { }

  onPress() {
    console.log("Press");
  }



  getColSpan(entity_id: string) {
    let domain = entity_id.split('.')[0];
    switch (domain) {
      case "camera":
        return this.settings.getCols > 2 ? 3 : this.settings.getCols;
      default:
        return 1;
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {        
        window.opener.postMessage(params['code'], environment.app_url + '/settings');
      }
    });
    this.config = {
      effect: this.settings.getLayout['effect'] || 'slide',
    }

  }


  moveEntity(roomindex: number, tileindex: number, direction: string) {
    this.settings.moveEntity(roomindex, tileindex, direction);
  }

  deleteEntity(roomindex: number, tileindex: number) {
    this.settings.deleteEntity(roomindex, tileindex);
  }

  addEntity(index: number) {
    const dialogRef = this.dialog.open(AddEntityDialog, {
      width: '90vw',
      // height: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settings.addEntity(index, result);
      }
    });
  }

  addRoom() {
    this.settings.addRoom();
    setTimeout(() => {
      this.index = this.settings.getRooms.length - 1;
    }, 50)
  }

  moveRoom(direction: string, index: number) {
    this.settings.moveRoom(index, direction);
    if (direction.toLowerCase() == 'right') this.index++;
    if (direction.toLowerCase() == 'left') this.index--;
  }

  deleteRoom(index: number) {
    this.settings.deleteRoom(index);
    if (this.index > this.settings.getRooms.length - 1) this.index--
  }

  editRoomName(index: number) {
    const dialogRef = this.dialog.open(EditRoomNameDialog, {
      width: '250px',
      data: this.settings.getRooms[index].name,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.settings.editRoomName(index, result);
    });
  }

  gotoSettings(){
    this.router.navigate(['/settings']);
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
      <mat-option style="min-height: 48px; line-height: 1.15; height: auto; padding: 8px 16px; white-space: normal;" *ngFor="let entity of filteredEntities | async" [value]="entity.entity_id">        
      <b>{{entity.attributes.friendly_name}}</b><br>  
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

  constructor(private entityService: EntityService, private dialogRef: MatDialogRef<AddEntityDialog>) { }

  ngOnInit() {
    this.entities = this.entityService.getAllEntities();
    this.entities.sort((a,b) => { 
      if (a.attributes.friendly_name.toLowerCase() > b.attributes.friendly_name.toLowerCase()){
        return 1;
      } else if (a.attributes.friendly_name.toLowerCase() < b.attributes.friendly_name.toLowerCase()){
        return -1;
      } else {
        return 0;
      }
      // try {
      // let aName = a.attributes.friendly_name ? a.attributes.friendly_name : a.entity_id.split['.'][1];
      // let bName = b.attributes.friendly_name ? b.attributes.friendly_name : b.entity_id.split['.'][1];
      
      //   if (aName > bName) return 1;
      //   if (aName < bName) return -1;
      // } catch (e) { return -1;}
    })
    this.entities.unshift({entity_id: 'blank.blank', attributes: {friendly_name: 'Blank Tile'}});
    this.filteredEntities = this.myControl.valueChanges.pipe(startWith(''), map(value => this._filter(value)))
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLocaleLowerCase();
    return this.entities.filter(entity => {
      if (entity.attributes.friendly_name){
        return entity.entity_id.toLocaleLowerCase().includes(filterValue) || entity.attributes.friendly_name.toLowerCase().includes(filterValue);
    
      } else {
        return entity.entity_id.toLocaleLowerCase().includes(filterValue);
      }
      }
    );
  }

  entitySelected() {
    this.dialogRef.close(this.myControl.value);
  }
}

@Component({
  template: `
  <h1 mat-dialog-title>Edit Room Name</h1>
  <div mat-dialog-content>
    <mat-form-field>
      <mat-label>Room Name</mat-label>
      <input text="input" matInput [(ngModel)]="data">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="null">Cancel</button>
    <button mat-button [mat-dialog-close]="data" cdkFocusInitial>Set Name</button>
  </div>
  `,
})
export class EditRoomNameDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) { console.log(this.data) }


}
