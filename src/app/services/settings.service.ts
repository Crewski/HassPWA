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
     this.settings.connection = {url: url, token: null};
     this.saveSettings();
   }

  //  setFont(font){
  //    this.settings.layout['font'] = font;
  //    this.saveSettings();
  //  }

   setCols(cols){
     this.settings.layout['cols'] = cols;
     this.saveSettings();
   }

   setToken(token){
     this.settings.connection['token'] = token;
     this.saveSettings();
   }

   setPasscode(code){
     this.settings.layout['passcode'] = code;
     this.saveSettings();
   }

   get getConnection(): any{
     return this.settings.connection;
   }

   get getLayout(): any{
     return this.settings.layout;
   }

   get getFont(): number {
     return 10 / (this.settings.layout['cols'] || 3);
   }

   get getNameFont(): number {
    return 10 / (this.settings.layout['cols'] || 3);
  }

  get getStateFont(): number {
    return this.getNameFont * 1.9;
  }

   get getCols(): number {
     return this.settings.layout['cols'] || 3;
   }

   get getRooms(): any {
     if (this.settings.rooms.length == 0 ) this.settings.rooms = [{name: '1st Room', tiles: []}];
     return this.settings.rooms;
   }

   get isEditing(): boolean {
     return this.editing;
   }

   get showRoomTabs(): boolean {
     return this.settings.layout['tabs'];
   }

   setTabs(showTabs: boolean){
    this.settings.layout['tabs'] = showTabs;
    this.saveSettings();
   }

   setEditing(edit: boolean){
     this.editing = edit;
   }

   resetRooms(){
     this.settings.rooms = [
       {name: '1st Room', tiles: ['light.pergola', 'light.basement_lights']},
       {name: '2nd Room', tiles: ['light.front_door', 'light.garage_entrance']}];
     this.saveSettings();
   }

   addEntity(roomindex: number, entity_id: string){
     this.settings.rooms[roomindex].tiles.push(entity_id);
     this.saveSettings();
   }

   deleteEntity(roomindex, tileindex){
     this.settings.rooms[roomindex].tiles.splice(tileindex, 1);
     this.saveSettings();
   }

   moveEntity(roomindex: number, tileindex: number, direction: string){
      let newIndex;
      if(direction == "right"){
        newIndex = tileindex + 1;
      } else if (direction == "left"){
        newIndex = tileindex - 1;
      } else {
        return;
      }
      let cutOut = this.settings.rooms[roomindex].tiles.splice(tileindex, 1) [0];
      this.settings.rooms[roomindex].tiles.splice(newIndex, 0, cutOut);       
      this.saveSettings();    
   }

   addRoom(){
     this.settings.rooms.push({name: "New Room", tiles: []});
     this.saveSettings();
   }

   deleteRoom(roomindex: number){
     this.settings.rooms.splice(roomindex, 1);
     this.saveSettings();
   }

   moveRoom(roomindex: number, direction: string){
    let newIndex;
    if(direction == "right"){
      newIndex = roomindex + 1;
    } else if (direction == "left"){
      newIndex = roomindex - 1;
    } else {
      return;
    }
    let cutOut = this.settings.rooms.splice(roomindex, 1) [0];
    this.settings.rooms.splice(newIndex, 0, cutOut);       
    this.saveSettings();   
   }

   editRoomName(roomindex: number, name: string){
     this.settings.rooms[roomindex].name = name;
     this.saveSettings();
   }
}
