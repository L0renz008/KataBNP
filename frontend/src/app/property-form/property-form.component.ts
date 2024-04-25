import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Property } from '../interfaces/properties';
import { BackendService } from '../backend.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './property-form.component.html',
  styleUrl: './property-form.component.scss',
})
export class PropertyFormComponent implements OnInit {
  visible: boolean = false;

  isLoading: boolean = false;

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

  propertyForm = this.formBuilder.group({
    address: ['', Validators.required],
    property_type: ['', Validators.required],
    status: ['', Validators.required],
    purchase_date: [
      new Date(''),
      [Validators.required, this.dateMaxValidator, , this.dateMinValidator],
    ],
    price: [0, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {}

  showForm() {
    this.visible = !this.visible;
  }
  addProperty() {
    this.isLoading = true;
    const newProperty: Property = this.propertyForm.value as Property;
    this.backendService.addProperty(newProperty).subscribe((property) => {
      console.log(property);
      this.isLoading = false;
      window.location.reload();
    });
  }
}
