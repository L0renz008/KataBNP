import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Property, PropertyArray } from '../interfaces/properties';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { PropertyFormComponent } from './../property-form/property-form.component';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DateFormatPipe } from '../date-format.pipe';
@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgClass,
    PropertyFormComponent,
    RouterOutlet,
    DateFormatPipe,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
  providers: [BackendService],
})
export class PropertiesComponent implements OnInit {
  properties: PropertyArray[] = [];

  // openedForm = false;
  openedDeleteMessage = false;
  isLoading: boolean = false;

  constructor(private backendService: BackendService) {}

  showDeleteMessage() {
    this.openedDeleteMessage = !this.openedDeleteMessage;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.backendService.getProperties().subscribe((res) => {
      this.properties = res;
      this.isLoading = false;
    });
  }

  deleteProperty(propertyid: number) {
    this.backendService.deleteProperty(propertyid).subscribe(
      (property) => {
        alert(property.message);
        this.openedDeleteMessage = false;
        this.ngOnInit();
      },
      (error) => {
        console.log(error);
        alert(error.error.message);
        this.openedDeleteMessage = false;
      }
    );
  }

  addProperty(property: Property) {
    this.backendService.addProperty(property).subscribe((property) => {
      console.log(property);
      this.ngOnInit();
    });
  }

  formatDate(date: string): string {
    const dateSplit = date.split(' ');
    return `${dateSplit[1]} ${dateSplit[2]} ${dateSplit[3]}`;
  }

  // loadProperties(): void {
  //   this.backendService.getProperties().subscribe(
  //     (data) => {
  //       this.properties = data;
  //     },
  //     (error) => {
  //       console.error('Failed to load properties:', error);
  //     }
  //   );
  // }
}
