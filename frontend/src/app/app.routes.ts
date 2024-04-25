import { Routes } from '@angular/router';
import { PropertiesComponent } from './properties/properties.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { TenantsComponent } from './tenants/tenants.component';
import { MaintenancesComponent } from './maintenances/maintenances.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  //   { path: '', component: AppComponent },
  { path: 'properties', component: PropertiesComponent },
  {
    path: 'properties/:propertyid',
    component: PropertyDetailsComponent,
  },
  { path: 'tenants', component: TenantsComponent },
  { path: 'maintenances', component: MaintenancesComponent },
];
