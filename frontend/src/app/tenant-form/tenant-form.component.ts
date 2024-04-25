import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Tenant } from '../interfaces/tenants';
import { BackendService } from '../backend.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tenant-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './tenant-form.component.html',
  styleUrl: './tenant-form.component.scss',
})
// export class TenantFormComponent {}
export class TenantFormComponent implements OnInit {
  visible: boolean = false;

  dateMaxValidator(control: FormControl): { [s: string]: boolean } | null {
    if (control.value) {
      const date: Date = new Date(control.value);
      const maxDate = new Date('01/01/2500');
      if (date > maxDate) {
        return { invalidDate: true };
      }
    }
    return null;
  }
  dateMinValidator(control: FormControl): { [s: string]: boolean } | null {
    if (control.value) {
      const date: Date = new Date(control.value);
      const minDate = new Date('01/01/1800');
      if (date < minDate) {
        return { invalidDate: true };
      }
    }
    return null;
  }

  tenantForm = this.formBuilder.group({
    name: ['', Validators.required],
    contact_info: ['', Validators.required],
    lease_term_start: [
      new Date(''),
      [Validators.required, this.dateMinValidator, this.dateMaxValidator],
    ],
    lease_term_end: [
      new Date(''),
      [Validators.required, this.dateMinValidator, this.dateMaxValidator],
    ],
    rental_payment_status: ['', Validators.required],
    propertyid: [0, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {}

  showForm() {
    this.visible = !this.visible;
  }

  addTenant() {
    const newTenant: Tenant = this.tenantForm.value as Tenant;
    this.backendService.addTenant(newTenant).subscribe((tenant) => {
      console.log(tenant);
      window.location.reload();
    });
  }
}
