import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../services/settings.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  title = 'Home';
  index = 0;
  icon = this.settings.isEditing ? 'mdi:save' : 'mdi:edit';

  constructor(
    private route: ActivatedRoute,
    public settings: SettingsService,
    private http: HttpService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.http.getAuthToken(params['code']);
      } 
    });

  }

}
