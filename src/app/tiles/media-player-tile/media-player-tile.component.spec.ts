import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaPlayerTileComponent } from './media-player-tile.component';

describe('MediaPlayerTileComponent', () => {
  let component: MediaPlayerTileComponent;
  let fixture: ComponentFixture<MediaPlayerTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaPlayerTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaPlayerTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
