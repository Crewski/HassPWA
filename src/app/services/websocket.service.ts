import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Observable } from 'rxjs';
import { SettingsService } from './settings.service';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  haWebSocket: WebSocketSubject<any>;
  private isConnected: BehaviorSubject<boolean>;
  private messageID: number = 1;

  private message_subject = new BehaviorSubject<any>({message: { id: null}});
  private message_change = this.message_subject.asObservable();

  constructor(
    private settings: SettingsService,
    private entityService: EntityService
  ) { }

  initConnection(token?: string) {
    // console.log(token);
    if (!this.settings.getConnection['token'] && !token){
      // window.alert("Connection hasn't been setup");
      return;
    }
    this.haWebSocket = webSocket('wss://' + this.settings.getConnection['url'] + '/api/websocket');
    this.haWebSocket.subscribe(message => {
      switch (message.type) {
        case "auth_required":
          var msg = { type: "auth", access_token: this.settings.getConnection['token'] || token };
          this.haWebSocket.next(msg);
          break;
        case "auth_ok":
          if (!this.settings.getConnection['token']) this.getLongLivedToken();
          this.setupEntities();
          break;
        case "auth_invalid":
          console.log(message);
          this.settings.setToken(null);
          break;
        default:
          this.message_subject.next(message);
      }
    })
  }

  async setupEntities(){
    await this.receiveStates();
    this.receivedStateChanges();
  }

  getLongLivedToken(){
    let id = this.messageID;
    this.messageID++;
    let msg = { id: id, type: "auth/long_lived_access_token", client_name: 'HassPWA' + Math.floor(Math.random() * 99999 + 1), client_icon: '', lifespan: 365 };
    this.haWebSocket.next(msg);
    let sub = this.message_change.subscribe(message => {
      if (message.id == id){
        this.settings.setToken(message.result);
        sub.unsubscribe();
      }
    })
  }

  receiveStates(): Promise<boolean> {
    let id = this.messageID;
    this.messageID++;
    let msg = { id: id, type: 'get_states' };
    this.haWebSocket.next(msg);
    return new Promise((resolve) => {
      let sub = this.message_change.subscribe(message => {
        if (message.id == id) {
          if (message.success && message.result && message.result.length > 1) {
            this.entityService.setEntities(message.result);
            sub.unsubscribe();
            resolve(true);
          }
        }
      })
    })
  }

  receivedStateChanges() {
    const id = this.messageID;
    let msg = { type: 'subscribe_events', event_type: 'state_changed', id: id };
    this.messageID++;
    this.haWebSocket.next(msg);
    this.message_change.subscribe(message => {
      if (message.id == id && message.type == "event") {
        this.entityService.updateEntity(message.event.data.new_state);        
      }
    })
  }

  callService(domain: string, service: string, entity_id: string) {
    let id = this.messageID;
    this.messageID++;
    let msg = { id: id, type: 'call_service', domain: domain, service: service, service_data: { entity_id: entity_id } };
    this.haWebSocket.next(msg);
    return new Promise((resolve) => {
      let sub = this.message_change.subscribe(data => {
        if (data.id == id) {
          sub.unsubscribe();
          resolve(data);
        }
      })
    })
  }
}