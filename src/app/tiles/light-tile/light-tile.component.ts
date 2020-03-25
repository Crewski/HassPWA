import { Component, OnInit, Input } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'light-tile',
  templateUrl: './light-tile.component.html',
  styleUrls: ['./light-tile.component.scss']
})
export class LightTileComponent implements OnInit {

  @Input() entity_id: string;
  entity: any | null;

  constructor(
    private entityService: EntityService,
    private websocketService: WebsocketService
  ) { }

  ngOnInit(): void {
    this.setupEntity();
  }

  async setupEntity(){
    this.entity = await this.entityService.getEntity(this.entity_id);
    this.entityService.entity_change.subscribe(data => {
      
      if(data && data.entity_id == this.entity_id) this.entity = data;
    })
  }

  onPress(){
    this.websocketService.callService("light", "toggle", this.entity_id).then(res => {
      console.log(res);
    })
  }

}
