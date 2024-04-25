import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { Property, PropertyArray } from '../interfaces/properties';
import { DateFormatPipe } from '../date-format.pipe';
import { BackendInterface } from '../backend.service';
import { NgClass, NgIf } from '@angular/common';
import {
  FormControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [DateFormatPipe, NgClass, NgIf, ReactiveFormsModule],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
})
export class PropertyDetailsComponent {
  property: PropertyArray = [0, '', null, null, '', 0];
  isLoading: boolean = false;
  message: string = '';
  isEditing: boolean = false;
  editingForm: FormGroup;
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

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private formBuilder: FormBuilder
  ) {
    this.editingForm = this.formBuilder.group({
      address: [this.property[1], Validators.required],
      property_type: [this.property[2], Validators.required],
      status: [this.property[3], Validators.required],
      purchase_date: [
        this.property[4],
        [Validators.required, this.dateMaxValidator, , this.dateMinValidator],
      ],
      price: [this.property[5], [Validators.required, Validators.min(1)]],
    });
  }

  isBackendInterface(item: any): item is BackendInterface {
    return item;
  }
  switchEditingMode() {
    this.editingForm.patchValue({
      address: this.property[1],
      property_type: this.property[2],
      status: this.property[3],
      purchase_date: this.property[4],
      price: this.property[5],
    });
    this.isEditing = !this.isEditing;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      const propertyId = parseInt(params.get('propertyid') as string, 10);
      this.backendService.getOneProperty(propertyId).subscribe(
        (res) => {
          this.property = res.property;

          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          alert(error.error.message);
          this.isLoading = false;
        }
      );
    });
  }

  updateProperty(propertyid: number) {
    const updatedProperty: Property = this.editingForm.value as Property;
    this.backendService
      .updateProperty(propertyid, updatedProperty)
      .subscribe((property) => {
        console.log(property);
        this.ngOnInit();
      });
    this.isEditing = false;
  }
}
