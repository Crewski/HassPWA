import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  SETTING_NAME = "HassPWA"

  settings = {connection: {}, layout: {}, rooms: []}
  editing: boolean = false;

  constructor() {
    let savedSettings = JSON.parse(localStorage.getItem(this.SETTING_NAME));
    if (savedSettings){
      this.settings = savedSettings;
    }
   }

   saveSettings(){
     console.log(this.settings);
     localStorage.setItem(this.SETTING_NAME, JSON.stringify(this.settings));
   }

   setUrl(url){
     this.settings.connection['url'] = url;
     this.saveSettings();
   }

   setFont(font){
     this.settings.layout['font'] = font;
     this.saveSettings();
   }

   setCols(cols){
     this.settings.layout['cols'] = cols;
     this.saveSettings();
   }

   setToken(token){
     this.settings.connection['token'] = token;
     this.saveSettings();
   }

   get getConnection(): any{
     return this.settings.connection;
   }

   get getLayout(): any{
     return this.settings.layout;
   }

   get getFont(): number {
     return 14 / (this.settings.layout['cols'] || 3);
   }

   get getCols(): number {
     return this.settings.layout['cols'] || 3;
   }

   get getRooms(): any {
     if (this.settings.rooms.length == 0 ) this.settings.rooms = [{name: '1st Room'}];
     return this.settings.rooms;
   }

   get isEditing(): boolean {
     return this.editing;
   }

   setEditing(){
     this.editing = !this.editing;
     if(!this.editing) this.saveSettings();
   }
}
