import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card shadow">
          <div class="card-header bg-success text-white">
            <h4 class="mb-0"><i class="bi bi-person-plus me-2"></i>Regisztráció</h4>
          </div>
          <div class="card-body">
            <div class="alert alert-danger" *ngIf="hiba">{{ hiba }}</div>
            <div class="alert alert-success" *ngIf="siker">{{ siker }}</div>
            <div class="mb-3">
              <label class="form-label">Felhasználónév</label>
              <input class="form-control" [(ngModel)]="felhasznalonev" name="felhasznalonev" />
            </div>
            <div class="mb-3">
              <label class="form-label">Jelszó</label>
              <input class="form-control" type="password" [(ngModel)]="jelszo" name="jelszo" />
            </div>
            <button class="btn btn-success w-100" (click)="register()">Regisztráció</button>
            <p class="mt-3 text-center">
              Már van fiókod? <a routerLink="/login">Bejelentkezés</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  felhasznalonev = '';
  jelszo = '';
  hiba = '';
  siker = '';

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  register(): void {
    this.hiba = '';
    this.siker = '';
    this.auth.register({ felhasznalonev: this.felhasznalonev, jelszo: this.jelszo }).subscribe({
      next: () => {
        this.siker = 'Sikeres regisztráció! Átirányítás...';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.hiba = err.error?.message || 'Regisztrációs hiba.';
        this.cdr.detectChanges();
      },
    });
  }
}
