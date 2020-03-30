import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  entities: any[] = [];

  private entity_subject = new BehaviorSubject<any[]>(this.entities);
  public entity_change = this.entity_subject.asObservable();


  constructor() { }

  setEntities(entities){
    this.entities = entities;
    this.entity_subject.next(entities);
  }

  updateEntity(message){    
    try {      
      let index = this.entities.findIndex(entity => entity.entity_id == message.entity_id);
      if (message) {
        this.entities[index] = message;
      }
      this.entity_subject.next(this.entities);
    } catch (err) {
      console.log(err);
    }
  }

  getEntity(entity_id): Promise<any>{
    
    return new Promise ((resolve, reject) => {
      if (this.entities.length > 0) resolve(this.entities.find(entity => entity.entity_id == entity_id))
      else {
        let waiting = setInterval(() => {
          if (this.entities.length > 0) {
            resolve(this.entities.find(entity => entity.entity_id == entity_id));
            clearInterval(waiting);
          }
        }, 500)
      }
    })

  }

  getAllEntities(){
    return this.entities;
  }

  changeToPercent(value): number {
    return Math.round((value - 0) * (100 - 0) / (255 - 0) + 0);
  }

  get standardOnColor(){
    return 'rgb(255,255,255)';
  }

  get standardOffColor(){
    return 'rgb(0,0,0)';
  }
}
