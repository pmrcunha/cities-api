import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityAreaComponent } from './city-area.component';

describe('CityAreaComponent', () => {
  let component: CityAreaComponent;
  let fixture: ComponentFixture<CityAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CityAreaComponent]
    });
    fixture = TestBed.createComponent(CityAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
