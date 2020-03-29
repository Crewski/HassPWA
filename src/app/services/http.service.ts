import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SettingsService } from './settings.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private settings: SettingsService,
    private ws: WebsocketService
  ) { }

  getAuthToken(code){
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');    
    const body = new HttpParams()
    .set('grant_type', 'authorization_code')
    .set('client_id', environment.app_url)
    .set('code', code);
    this.http.post('https://' + this.settings.getConnection['url'] + '/auth/token', body, {headers: headers}).subscribe(res => {
      console.log(res);
      this.ws.initConnection(res['access_token']);
    })
  }

  
}
