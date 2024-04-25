import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property, PropertyArray } from './interfaces/properties';
import { Tenant, TenantArray } from './interfaces/tenants';
import { Maintenance } from './interfaces/maintenances';
import { map } from 'rxjs/operators';

export interface BackendInterface {
  message: string;
}
@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getProperties(): Observable<PropertyArray[]> {
    return this.http.get<PropertyArray[]>(`${this.baseUrl}/properties`).pipe(
      map((res: PropertyArray[]) => {
        return res;
      })
    );
  }

  getOneProperty(
    propertyid: number
  ): Observable<{ property: PropertyArray; message: string }> {
    return this.http
      .get<{ property: PropertyArray; message: string }>(
        `${this.baseUrl}/properties/${propertyid}`
      )
      .pipe(
        map((res: { property: PropertyArray; message: string }) => {
          return res;
        })
      );
  }

  deleteProperty(propertyid: number): Observable<BackendInterface> {
    return this.http
      .delete<BackendInterface>(`${this.baseUrl}/properties/${propertyid}`)
      .pipe(
        map((res: BackendInterface) => {
          return res;
        })
      );
  }

  addProperty(property: Property): Observable<BackendInterface> {
    return this.http
      .post<BackendInterface>(`${this.baseUrl}/properties`, property)
      .pipe(
        map((res: BackendInterface) => {
          return res;
        })
      );
  }
  updateProperty(
    propertyid: number,
    property: Property
  ): Observable<BackendInterface> {
    return this.http
      .put<BackendInterface>(
        `${this.baseUrl}/properties/${propertyid}`,
        property
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getTenants(): Observable<TenantArray[]> {
    return this.http.get<TenantArray[]>(`${this.baseUrl}/tenants`).pipe(
      map((res: TenantArray[]) => {
        return res;
      })
    );
  }

  getOneTenant(tenantid: number): Observable<TenantArray[] | BackendInterface> {
    return this.http
      .get<TenantArray[]>(`${this.baseUrl}/tenants/${tenantid}`)
      .pipe(
        map((res: TenantArray[] | BackendInterface) => {
          return res;
        })
      );
  }

  deleteTenant(tenantid: number): Observable<BackendInterface> {
    return this.http
      .delete<BackendInterface>(`${this.baseUrl}/tenants/${tenantid}`)
      .pipe(
        map((res: BackendInterface) => {
          return res;
        })
      );
  }

  addTenant(tenant: Tenant): Observable<BackendInterface> {
    return this.http
      .post<BackendInterface>(`${this.baseUrl}/tenants`, tenant)
      .pipe(
        map((res: BackendInterface) => {
          return res;
        })
      );
  }

  getMaintenances(): Observable<[]> {
    return this.http.get<[]>(`${this.baseUrl}/maintenances`).pipe(
      map((res: []) => {
        return res;
      })
    );
  }

  getOneMaintenance(maintenanceid: number): Observable<[]> {
    return this.http
      .get<[]>(`${this.baseUrl}/maintenances/${maintenanceid}`)
      .pipe(
        map((res: []) => {
          return res;
        })
      );
  }

  deleteMaintenance(maintenanceid: number): Observable<[]> {
    return this.http
      .delete<[]>(`${this.baseUrl}/maintenances/${maintenanceid}`)
      .pipe(
        map((res: []) => {
          return res;
        })
      );
  }

  addMaintenance(maintenance: Maintenance) {
    return this.http.post(`${this.baseUrl}/maintenances`, maintenance).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
