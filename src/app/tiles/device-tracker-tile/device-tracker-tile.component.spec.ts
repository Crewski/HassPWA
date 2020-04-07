import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTrackerTileComponent } from './device-tracker-tile.component';

describe('DeviceTrackerTileComponent', () => {
  let component: DeviceTrackerTileComponent;
  let fixture: ComponentFixture<DeviceTrackerTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceTrackerTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTrackerTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
