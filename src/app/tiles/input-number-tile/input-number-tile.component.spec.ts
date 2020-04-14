import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNumberTileComponent } from './input-number-tile.component';

describe('InputNumberTileComponent', () => {
  let component: InputNumberTileComponent;
  let fixture: ComponentFixture<InputNumberTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputNumberTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputNumberTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
