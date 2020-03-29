import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTileComponent } from './general-tile.component';

describe('GeneralTileComponent', () => {
  let component: GeneralTileComponent;
  let fixture: ComponentFixture<GeneralTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
