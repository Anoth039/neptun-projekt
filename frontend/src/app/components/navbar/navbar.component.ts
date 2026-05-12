import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" routerLink="/">
          <i class="bi bi-mortarboard-fill me-2"></i>Neptun+
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/oktatok" routerLinkActive="active">
                <i class="bi bi-person-badge me-1"></i>Oktatók
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/hallgatok" routerLinkActive="active">
                <i class="bi bi-people me-1"></i>Hallgatók
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/tantargyak" routerLinkActive="active">
                <i class="bi bi-book me-1"></i>Tantárgyak
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/kurzusok" routerLinkActive="active">
                <i class="bi bi-calendar3 me-1"></i>Kurzusok
              </a>
            </li>
            <li class="nav-item" *ngIf="bejelentkezve">
              <a class="nav-link" routerLink="/beiratkozasok" routerLinkActive="active">
                <i class="bi bi-pencil-square me-1"></i>Beiratkozások
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/statisztikak" routerLinkActive="active">
                <i class="bi bi-bar-chart me-1"></i>Statisztikák
              </a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" *ngIf="!bejelentkezve">
              <a class="nav-link" routerLink="/login">
                <i class="bi bi-box-arrow-in-right me-1"></i>Bejelentkezés
              </a>
            </li>
            <li class="nav-item" *ngIf="!bejelentkezve">
              <a class="nav-link" routerLink="/register">
                <i class="bi bi-person-plus me-1"></i>Regisztráció
              </a>
            </li>
            <li class="nav-item" *ngIf="bejelentkezve">
              <span class="nav-link text-light">
                <i class="bi bi-person-circle me-1"></i>{{ felhasznalonev }}
              </span>
            </li>
            <li class="nav-item d-flex align-items-center" *ngIf="bejelentkezve">
              <button class="btn btn-outline-light btn-sm ms-2" (click)="logout()">
                <i class="bi bi-box-arrow-right me-1"></i>Kilépés
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent implements OnInit {
  bejelentkezve = false;
  felhasznalonev: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.bejelentkezve.subscribe((v) => {
      this.bejelentkezve = v;
      this.felhasznalonev = this.auth.felhasznalonev;
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
