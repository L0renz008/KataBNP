import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Maintenance } from '../interfaces/maintenances';
import { BackendService } from '../backend.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './maintenance-form.component.html',
  styleUrl: './maintenance-form.component.scss',
})
export class MaintenanceFormComponent implements OnInit {
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

  maintenanceForm = this.formBuilder.group({
    description: ['', Validators.required],
    status: ['', Validators.required],
    scheduled_date: [
      new Date(''),
      [Validators.required, this.dateMaxValidator, this.dateMinValidator],
    ],
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

  addMaintenance() {
    const newMaintenance: Maintenance = this.maintenanceForm
      .value as Maintenance;
    this.backendService
      .addMaintenance(newMaintenance)
      .subscribe((maintenance) => {
        window.location.reload();
      });
  }
}
