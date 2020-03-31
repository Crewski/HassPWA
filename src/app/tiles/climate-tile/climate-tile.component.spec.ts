import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimateTileComponent } from './climate-tile.component';

describe('ClimateTileComponent', () => {
  let component: ClimateTileComponent;
  let fixture: ComponentFixture<ClimateTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClimateTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClimateTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
