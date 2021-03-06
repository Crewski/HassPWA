import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject,  } from 'rxjs';
import { SettingsService } from './settings.service';
import { EntityService } from './entity.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export class KeyValuePair {
  key: string;
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  haWebSocket: WebSocketSubject<any>;
  private messageID: number = 1;
  private isConnected = new BehaviorSubject<boolean>(false);
  private connectedTimer;

  private message_subject = new BehaviorSubject<any>({ message: { id: null } });
  private message_change = this.message_subject.asObservable();

  constructor(
    private settings: SettingsService,
    private entityService: EntityService,
    private snackBar: MatSnackBar
  ) { }

  initConnection(token?: string) {
    this.isConnected.next(false);
    if (!this.settings.getConnection['token'] && !token) {
      return;
    }
    this.isConnected.subscribe(connected => {

      if (!connected) {
        this.haWebSocket = new WebSocketSubject('wss://' + this.settings.getConnection['url'] + '/api/websocket');

        this.haWebSocket.subscribe(message => {
          // console.log(message);
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
              break;
            default:
              this.message_subject.next(message);
          }
        }, error => {
          console.log(error);
          setTimeout(() => {
            console.log("Trying connection");
            this.isConnected.next(false);
          }, 2000);
        })

      }


    })


  }

  async setupEntities() {
    if (this.connectedTimer) clearTimeout(this.connectedTimer);
    this.connectedTimer = setTimeout(() => {
      this.snackBar.open("Connection Established", null, {
        duration: 2000
      })
    }, 1000);
    this.isConnected.next(true);
    this.heartbeat();
    this.getConfig();
    await this.receiveStates();
    this.receivedStateChanges();
    
  }

  getLongLivedToken() {
    let id = this.messageID;
    this.messageID++;
    let msg = { id: id, type: "auth/long_lived_access_token", client_name: 'HassPWA_' + Math.floor(Math.random() * 99999 + 1), client_icon: '', lifespan: 365 };
    this.haWebSocket.next(msg);
    let sub = this.message_change.subscribe(message => {
      if (message.id == id) {
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

  heartbeat() {

    if (this.isConnected.getValue()) {
      this.pingPong().then(() => {
        setTimeout(() => {
          this.heartbeat();
        }, 2000);
      }).catch(() => {
        console.log("disconnected");
        this.isConnected.next(false);
      })
    }
  }

  pingPong(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject();
      }, 2000);
      let id = this.messageID;
      this.messageID++;
      let msg = { id: id, type: 'ping' };
      this.haWebSocket.next(msg);
      let sub = this.message_change.subscribe(message => {
        if (message.id == id) {
          sub.unsubscribe();
          resolve();
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

  callService(domain: string, service: string, entity_id: string, options?: KeyValuePair[]) {
    // window.navigator.vibrate(150);
    let id = this.messageID;
    this.messageID++;
    let service_data = { entity_id: entity_id };
    if (options) options.forEach(option => service_data[option.key] = option.value);
    let msg = { id: id, type: 'call_service', domain: domain, service: service, service_data: service_data };
    this.snackBar.open(domain + '.' + service + ' called', null, {
      duration: 1000
    })
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

  getConfig() {
    let id = this.messageID;
    this.messageID++;
    let msg = { id: id, type: 'get_config' };
    this.haWebSocket.next(msg);
    return new Promise((resolve) => {
      let sub = this.message_change.subscribe(data => {
        if (data.id == id) {
          sub.unsubscribe();
          this.settings.setUnits(data.result.unit_system);
          resolve(true);
        }
      })
    })
  }

  getThumbnail(entity_id: string): Promise<any> {
    return new Promise((resolve) => {
      let con_sub = this.isConnected.subscribe(connected => {
        if (connected) {
          let id = this.messageID;
          this.messageID++;
          let msg = { id: id, type: entity_id.split('.')[0] + "_thumbnail", entity_id: entity_id };
          this.haWebSocket.next(msg);
          let sub = this.message_change.subscribe(data => {
            if (data.id == id) {
              sub.unsubscribe();
              con_sub.unsubscribe();
              resolve(data);
            }
          })
        }
      })
    })
  }



  getCameraStream(entity_id: string): Promise<any> {
    return new Promise((resolve) => {
      let con_sub = this.isConnected.subscribe(connected => {
        if (connected) {
          let id = this.messageID;
          this.messageID++;
          let msg = { id: id, type: "camera/stream", entity_id: entity_id };
          this.haWebSocket.next(msg);
          let sub = this.message_change.subscribe(data => {
            if (data.id == id) {
              sub.unsubscribe();
              con_sub.unsubscribe();
              resolve(data.result.url);
            }
          })
        }
      })
    })
  }

}