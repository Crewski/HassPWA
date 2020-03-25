import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  entities: any[] = [];

  private entity_subject = new BehaviorSubject<any>(null);
  public entity_change = this.entity_subject.asObservable();


  constructor() { }

  setEntities(entities){
    this.entities = entities;
  }

  updateEntity(entity){
    this.entity_subject.next(entity);
    try {
      let index = this.entities.findIndex(entity => entity.entity_id == entity.entity_id);
      if (entity) {
        this.entities[index] = entity;
      }
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
    //   return this.entities.find(entity => entity.entity_id == entity_id);      
    // } catch (err) {
    //   console.log(err);
    //   return null
    // }
  }
}
