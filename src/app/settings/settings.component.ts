import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  url: string | null;
  cols: number;
  font: number | 100;

  constructor(
    private settings: SettingsService
  ) { }

  ngOnInit(): void {
    this.url = this.settings.getConnection['url'];
    this.cols = this.settings.getLayout['cols'] || 3;
    
  }

  setCols(){
    this.settings.setCols(this.cols);
  }



  tryConnect(){
    this.settings.setUrl(this.url);

    let ha_url = 'https://' + this.url + '/auth/authorize?client_id=' + environment.app_url + '&redirect_uri=' + environment.app_url + '/home';
    window.open(ha_url,  "_blank");
  }

}
