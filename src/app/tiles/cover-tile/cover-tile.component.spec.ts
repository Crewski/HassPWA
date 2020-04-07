import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverTileComponent } from './cover-tile.component';

describe('CoverTileComponent', () => {
  let component: CoverTileComponent;
  let fixture: ComponentFixture<CoverTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
