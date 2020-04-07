import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinarySensorTileComponent } from './binary-sensor-tile.component';

describe('BinarySensorTileComponent', () => {
  let component: BinarySensorTileComponent;
  let fixture: ComponentFixture<BinarySensorTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinarySensorTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinarySensorTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
