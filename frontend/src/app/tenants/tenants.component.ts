import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackendService } from '../backend.service';
import { Tenant, TenantArray } from '../interfaces/tenants';
import { NgFor, NgIf } from '@angular/common';
import { TenantFormComponent } from '../tenant-form/tenant-form.component';
import { DateFormatPipe } from '../date-format.pipe';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [RouterOutlet, NgFor, TenantFormComponent, DateFormatPipe, NgIf],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss',
  providers: [BackendService],
})
export class TenantsComponent implements OnInit {
  tenants: TenantArray[] = [];

  openedDeleteMessage = false;
  isLoading = false;

  constructor(private backendService: BackendService) {}

  showDeleteMessage() {
    this.openedDeleteMessage = !this.openedDeleteMessage;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.backendService.getTenants().subscribe((res) => {
      this.tenants = res;
      this.isLoading = false;
    });
  }

  deleteTenant(tenantid: number) {
    this.backendService.deleteTenant(tenantid).subscribe(
      (tenant) => {
        console.log(tenant);
        alert(tenant.message);
        this.ngOnInit();
      },
      (error) => {
        console.log(error);
      }
    );
    this.showDeleteMessage();
  }

  editTenant(tenantid: number) {
    console.log(tenantid);
  }
  addTenant(tenant: Tenant) {
    this.backendService.addTenant(tenant).subscribe((tenant) => {
      console.log(tenant);
      this.ngOnInit();
    });
  }
}
