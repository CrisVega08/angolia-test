import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarMakeItemComponent } from './car-make-item.component';

describe('CarMakeItemComponent', () => {
  let component: CarMakeItemComponent;
  let fixture: ComponentFixture<CarMakeItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarMakeItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarMakeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
