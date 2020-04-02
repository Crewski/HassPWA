import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';


@Component({
    selector: 'input-select',
    template: `
    <mat-nav-list>
    <mat-list-item *ngFor="let option of data.options" (tap)="return(option)">
    {{option | spacedText | titlecase}}
    </mat-list-item>
  </mat-nav-list>
    `,
  })
  export class ListBottomSheet {
    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, 
    private bottomsheet: MatBottomSheetRef<ListBottomSheet>) {}
  
    return(option){
      this.bottomsheet.dismiss(option);
    }
  }