import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    template: `
    <h1 mat-dialog-title>{{title}}</h1>
    <div>
    <div style='text-align: center; height: 50px; font-size: 200%;'>

    <span *ngIf='passcode.length > 0'>*</span>
    <span *ngIf='passcode.length > 1'>*</span>
    <span *ngIf='passcode.length > 2'>*</span>
    <span *ngIf='passcode.length > 3'>*</span>
    </div>
    <mat-grid-list cols='3' rowHeight='2:1'>
        <mat-grid-tile *ngFor="let button of buttons" >
            <button mat-stroked-button color="primary" (click)="onClick(button)">{{button}}</button>
        </mat-grid-tile>
    </mat-grid-list>
    </div>
    `,
  })
  export class PasscodeDialog { 

    buttons = [1,2,3,4,5,6,7,8,9,'Clear', 0, 'Del'];
    passcode: string = "";
    title = "Enter Passcode"

    constructor(
        private dialogRef: MatDialogRef<PasscodeDialog>,
        @Inject(MAT_DIALOG_DATA) public data: string
    ){
        if (this.data) this.title = this.data;
    }

    onClick(button: any){
        if (button == 'Clear') {
            this.passcode = '';
            return;
        } else if (button == 'Del' && this.passcode.length > 0) {
            this.passcode = this.passcode.slice(0, -1);
            return;
        } else {
            this.passcode = this.passcode + button.toString();
            if (this.passcode.length == 4) this.dialogRef.close(this.passcode);
        }
    }
  
  
  }