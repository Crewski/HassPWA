import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraTileComponent } from './camera-tile.component';

describe('CameraTileComponent', () => {
  let component: CameraTileComponent;
  let fixture: ComponentFixture<CameraTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
