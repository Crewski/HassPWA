import { Injectable } from '@angular/core';
import { LayoutModule, BreakpointObserver } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  SETTING_NAME = "HassPWA"

  settings = {connection: {}, layout: {}, rooms: []}
  editing: boolean = false;

  isPortrait: boolean = true;


  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
    let savedSettings = JSON.parse(localStorage.getItem(this.SETTING_NAME));
    if (savedSettings){
      this.settings = savedSettings;
    }
    this.breakpointObserver.observe([
      '(orientation: portrait)',
    ]).subscribe(res => {
      this.isPortrait = res.matches;
      console.log(res);
    });
   }

   saveSettings(){
     console.log(this.settings);
     localStorage.setItem(this.SETTING_NAME, JSON.stringify(this.settings));
   }

   setUrl(url){
     this.settings.connection = {url: url, token: null};
     this.saveSettings();
   }

   setCols(cols){
     this.settings.layout['cols'] = cols;
     this.saveSettings();
   }

   setColsLand(colsLand){
     this.settings.layout['cols_land'] = colsLand;
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
    if (this.isPortrait){
   return 10 / (this.settings.layout['cols'] || 3);
    } else {
     return 10 / (this.settings.layout['cols_land'] || 8);
    }
   }

   get getNameFont(): number {
     if (this.isPortrait){
    return 10 / (this.settings.layout['cols'] || 3);
     } else {
      return 10 / (this.settings.layout['cols_land'] || 8);
     }
  }

  getStateFont(state: string): number {
    let fontFactor = 1;
    if(state) {
      console.log(state.length);
      if(state.length > 6) fontFactor = 6.5 / state.length;
    }
    return this.getNameFont * 1.9 * fontFactor;
  }

   get getCols(): number {
     if (this.isPortrait){
     return this.settings.layout['cols'] || 3;
     } else {
       return this.settings.layout['cols_land'] || 8;
     }
   }

   get getRooms(): any {
     if (this.settings.rooms.length == 0 ) this.settings.rooms = [{name: '1st Room', tiles: []}];
     return this.settings.rooms;
   }

   get isEditing(): boolean {
     return this.editing;
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

   setSwiperEffect(effect: string){
     this.settings.layout['effect'] = effect;
     this.saveSettings();
   }
}
