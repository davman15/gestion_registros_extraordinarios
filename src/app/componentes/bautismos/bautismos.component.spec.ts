import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BautismosComponent } from './bautismos.component';

describe('BautismosComponent', () => {
  let component: BautismosComponent;
  let fixture: ComponentFixture<BautismosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BautismosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BautismosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
