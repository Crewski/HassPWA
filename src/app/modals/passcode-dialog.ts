import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    template: `
    <div style="width: 100%; height: 100%; min-width: 250px;">
    <h1 mat-dialog-title style='text-align: center; width: 100%;'>{{title}}</h1>
    <div style="font-size: 200%;">
    <div style='text-align: center; height: 50px; width: 100%;'>

    <span *ngIf='passcode.length > 0'>*</span>
    <span *ngIf='passcode.length > 1'>*</span>
    <span *ngIf='passcode.length > 2'>*</span>
    <span *ngIf='passcode.length > 3'>*</span>
    </div>
    <mat-grid-list cols='3' >
        <mat-grid-tile *ngFor="let button of buttons" >
            <button mat-button style="font-size: inherit; height: 100%; width: 100%" color="primary" (click)="onClick(button)">{{button}}</button>
        </mat-grid-tile>
    </mat-grid-list>
    </div>
    </div>
    `,
  })
  export class PasscodeDialog { 

    buttons = [1,2,3,4,5,6,7,8,9,'Clr', 0, 'Del'];
    passcode: string = "";
    title = "Enter Passcode"

    constructor(
        private dialogRef: MatDialogRef<PasscodeDialog>,
        @Inject(MAT_DIALOG_DATA) public data: string
    ){
        if (this.data) this.title = this.data;
        dialogRef.disableClose = true;
        setTimeout(() => {
          dialogRef.backdropClick().subscribe(() => {
            dialogRef.close(null);
          })
        }, 50)
    }

    onClick(button: any){

        switch (button){
            case "Clr":                
            this.passcode = '';
            break;
            case 'Del':
                if (this.passcode.length > 0) this.passcode = this.passcode.slice(0, -1);
                break;
            default:            
                this.passcode = this.passcode + button.toString();
                if (this.passcode.length == 4) this.dialogRef.close(this.passcode);
                break;
        }
    }
  
  
  }