import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceFormComponent } from './maintenance-form.component';
import { HttpClientModule } from '@angular/common/http';

describe('MaintenanceFormComponent', () => {
  let component: MaintenanceFormComponent;
  let fixture: ComponentFixture<MaintenanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [MaintenanceFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
