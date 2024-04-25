import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackendService } from '../backend.service';
import { Maintenance } from '../interfaces/maintenances';
import { NgFor, NgIf } from '@angular/common';
import { MaintenanceFormComponent } from '../maintenance-form/maintenance-form.component';
import { DateFormatPipe } from '../date-format.pipe';

@Component({
  selector: 'app-maintenances',
  standalone: true,
  imports: [
    RouterOutlet,
    NgFor,
    NgIf,
    MaintenanceFormComponent,
    DateFormatPipe,
  ],
  templateUrl: './maintenances.component.html',
  styleUrl: './maintenances.component.scss',
  providers: [BackendService],
})
export class MaintenancesComponent implements OnInit {
  maintenances: [] = [];

  openedDeleteMessage = false;
  isLoading: boolean = false;

  constructor(private backendService: BackendService) {}

  showDeleteMessage() {
    this.openedDeleteMessage = !this.openedDeleteMessage;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.backendService.getMaintenances().subscribe((res: []) => {
      this.maintenances = res;
      this.isLoading = false;
    });
  }

  deleteMaintenance(maintenanceid: number) {
    this.backendService.deleteMaintenance(maintenanceid).subscribe(
      (maintenance) => {
        this.ngOnInit();
      },
      (error) => {
        console.log(error);
      }
    );
    this.showDeleteMessage();
  }

  addMaintenance(maintenance: Maintenance) {
    this.backendService.addMaintenance(maintenance).subscribe((maintenance) => {
      console.log(maintenance);
      this.ngOnInit();
    });
  }
  editMaintenance(maintenanceid: number) {}
}
