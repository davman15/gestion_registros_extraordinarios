import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalResultadosComponent } from './total-resultados.component';

describe('TotalResultadosComponent', () => {
  let component: TotalResultadosComponent;
  let fixture: ComponentFixture<TotalResultadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalResultadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
