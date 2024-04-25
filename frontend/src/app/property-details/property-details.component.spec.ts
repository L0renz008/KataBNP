import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailsComponent } from './property-details.component';
import { HttpClientModule } from '@angular/common/http';
import {
  ActivatedRoute,
  RouterModule,
  convertToParamMap,
} from '@angular/router';
import { of } from 'rxjs';

describe('PropertyDetailsComponent', () => {
  let component: PropertyDetailsComponent;
  let fixture: ComponentFixture<PropertyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterModule],
      providers: [
        PropertyDetailsComponent,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ propertyid: '1' })), // Mock paramMap with propertyid '1'
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
