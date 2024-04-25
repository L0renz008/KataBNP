import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantsComponent } from './tenants.component';
import { HttpClientModule } from '@angular/common/http';

describe('TenantsComponent', () => {
  let component: TenantsComponent;
  let fixture: ComponentFixture<TenantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TenantsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
