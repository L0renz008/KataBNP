import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { PropertiesComponent } from './properties.component';
import { BackendService } from '../backend.service';
import { of } from 'rxjs';
import { PropertyArray, Property } from '../interfaces/properties';
import { HttpClientModule } from '@angular/common/http';

describe('PropertiesComponent', () => {
  let component: PropertiesComponent;
  let fixture: ComponentFixture<PropertiesComponent>;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;

  beforeEach(async () => {
    backendServiceSpy = jasmine.createSpyObj('BackendService', [
      'getProperties',
      'deleteProperty',
      'addProperty',
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      // declarations: [PropertiesComponent],
      providers: [
        PropertiesComponent,
        { provide: BackendService, useValue: backendServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backendServiceSpy = TestBed.inject(
      BackendService
    ) as jasmine.SpyObj<BackendService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load properties on initialization', fakeAsync(() => {
    const mockProperties = [] as PropertyArray[];
    backendServiceSpy.getProperties.and.returnValue(of(mockProperties));

    fixture.detectChanges();
    tick();
    console.log('Component Properties:', component.properties);

    expect(component.properties).toEqual(mockProperties);
    expect(component.isLoading).toBeTrue();
  }));
});
