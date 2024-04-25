import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PropertiesComponent } from './properties/properties.component';
import { TenantsComponent } from './tenants/tenants.component';

import { HttpClientModule } from '@angular/common/http';
import { BackendService } from './backend.service';
import { Property } from './interfaces/properties';
import { NgFor } from '@angular/common';

import { Routes } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    PropertiesComponent,
    TenantsComponent,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [BackendService],
})
export class AppComponent {
  title = 'Kata BNP Paribas';

  constructor() {}
}
