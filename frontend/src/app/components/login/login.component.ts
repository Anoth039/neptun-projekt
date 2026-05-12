import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0"><i class="bi bi-box-arrow-in-right me-2"></i>Bejelentkezés</h4>
          </div>
          <div class="card-body">
            <div class="alert alert-danger" *ngIf="hiba">{{ hiba }}</div>
            <div class="mb-3">
              <label class="form-label">Felhasználónév</label>
              <input class="form-control" [(ngModel)]="felhasznalonev" name="felhasznalonev" />
            </div>
            <div class="mb-3">
              <label class="form-label">Jelszó</label>
              <input class="form-control" type="password" [(ngModel)]="jelszo" name="jelszo" />
            </div>
            <button class="btn btn-primary w-100" (click)="login()">Bejelentkezés</button>
            <p class="mt-3 text-center">
              Még nincs fiókod? <a routerLink="/register">Regisztrálj!</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  felhasznalonev = '';
  jelszo = '';
  hiba = '';

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  login(): void {
    this.hiba = '';
    this.auth.login({ felhasznalonev: this.felhasznalonev, jelszo: this.jelszo }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.hiba = err.error?.message || 'Bejelentkezési hiba.';
        this.cdr.detectChanges();
      },
    });
  }
}
